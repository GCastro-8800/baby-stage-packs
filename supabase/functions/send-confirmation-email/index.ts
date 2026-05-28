import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders } from "../_shared/cors.ts";
import { checkRateLimit, getClientIp } from "../_shared/rateLimit.ts";

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/resend';

// Persistent rate limit: max 5 requests per 10 minutes per IP
const RATE_LIMIT_WINDOW_SECONDS = 10 * 60;
const MAX_REQUESTS_PER_WINDOW = 5;

const VALID_PLANS = ["Esencial", "Confort", "Tranquilidad Total"] as const;
type ValidPlan = typeof VALID_PLANS[number];

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 255;
}
function isValidPlan(plan: string): plan is ValidPlan {
  return VALID_PLANS.includes(plan as ValidPlan);
}
function isValidPostalCode(pc: string | undefined): boolean {
  if (!pc) return true;
  return /^\d{5}$/.test(pc);
}
function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m] || m));
}

interface EmailRequest {
  email: string;
  plan: string;
  postalCode?: string;
  selectedProducts?: string[];
}

const handler = async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const clientIp = getClientIp(req);
  const rl = await checkRateLimit(`send-confirmation-email:${clientIp}`, MAX_REQUESTS_PER_WINDOW, RATE_LIMIT_WINDOW_SECONDS);
  if (rl.limited) {
    return new Response(JSON.stringify({ error: "Too many requests." }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(rl.retryAfter || RATE_LIMIT_WINDOW_SECONDS),
        ...corsHeaders,
      },
    });
  }

  try {
    const body: EmailRequest = await req.json();
    const { email, plan, postalCode, selectedProducts } = body;

    if (!email || !isValidEmail(email)) {
      return new Response(JSON.stringify({ error: "Invalid email" }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }
    if (!plan || !isValidPlan(plan)) {
      return new Response(JSON.stringify({ error: "Invalid plan" }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }
    if (!isValidPostalCode(postalCode)) {
      return new Response(JSON.stringify({ error: "Invalid postal code" }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    // Validate selectedProducts
    const safeProducts: string[] = [];
    if (selectedProducts && Array.isArray(selectedProducts)) {
      for (const p of selectedProducts.slice(0, 20)) {
        if (typeof p === "string" && p.length <= 200) {
          safeProducts.push(escapeHtml(p));
        }
      }
    }

    // Verify lead exists
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('created_at')
      .eq('email', email)
      .eq('plan', plan)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (leadError || !lead) {
      return new Response(JSON.stringify({ error: "Lead not found" }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    const leadCreatedAt = new Date(lead.created_at);
    if (leadCreatedAt < new Date(Date.now() - 5 * 60 * 1000)) {
      return new Response(JSON.stringify({ error: "Lead too old" }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    const safePlan = escapeHtml(plan);
    const safePostalCode = postalCode ? escapeHtml(postalCode) : null;

    const productsHtml = safeProducts.length > 0
      ? `
        <div style="background: #f0f7f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <p style="color: #1a1a1a; font-size: 14px; margin: 0 0 10px 0; font-weight: bold;">
            🛒 Productos que te interesan:
          </p>
          <ul style="color: #4a4a4a; font-size: 14px; margin: 0; padding-left: 20px; line-height: 1.8;">
            ${safeProducts.map((p) => `<li>${p}</li>`).join("")}
          </ul>
        </div>`
      : "";

    const htmlContent = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #ffffff;">
        <h1 style="color: #1a1a1a; font-size: 28px; margin-bottom: 20px; font-weight: normal;">
          ¡Hola! Ya estás dentro 💚
        </h1>
        <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
          Gracias por tu interés en <strong>bebloo</strong>. Has elegido el pack 
          <strong>${safePlan}</strong> — excelente elección.
        </p>
        ${productsHtml}
        <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
          ${safePostalCode ? `Hemos anotado tu código postal (${safePostalCode}) para avisarte en cuanto lleguemos.` : 'Te escribiremos en cuanto estemos disponibles en tu área.'}
        </p>
        <div style="background: #f8f7f5; border-radius: 8px; padding: 20px; margin: 30px 0;">
          <p style="color: #1a1a1a; font-size: 14px; margin: 0; line-height: 1.6;">
            <strong>Mientras tanto:</strong> Respira hondo. Los primeros meses son intensos, 
            pero no tienes que resolverlo todo hoy. Cuando estemos listos, el equipamiento 
            será la menor de tus preocupaciones.
          </p>
        </div>
        <p style="color: #888888; font-size: 14px; line-height: 1.5;">
          Con cariño,<br/>
          El equipo de bebloo
        </p>
        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;" />
        <p style="color: #aaaaaa; font-size: 12px; text-align: center;">
          Este email fue enviado porque te registraste en bebloo.com
        </p>
      </div>
    `;

    // Send via Resend connector gateway
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY_1');

    if (!LOVABLE_API_KEY || !RESEND_API_KEY) {
      console.error('Missing LOVABLE_API_KEY or RESEND_API_KEY');
      return new Response(JSON.stringify({ error: "Server configuration error" }), {
        status: 500, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const resendResponse = await fetch(`${GATEWAY_URL}/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: 'bebloo <noreply@bebloo.es>',
        to: [email],
        subject: '¡Estás en la lista de bebloo! 🍼',
        html: htmlContent,
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error('Resend API error:', resendData);
      throw new Error(`Resend API error [${resendResponse.status}]: ${JSON.stringify(resendData)}`);
    }

    return new Response(JSON.stringify({ success: true, data: resendData }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-confirmation-email:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500, headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
