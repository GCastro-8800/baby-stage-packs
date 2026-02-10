import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "resend";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Rate limiting
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(clientIp: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(clientIp);
  if (!entry || (now - entry.windowStart) > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(clientIp, { count: 1, windowStart: now });
    return false;
  }
  if (entry.count >= MAX_REQUESTS_PER_WINDOW) return true;
  entry.count++;
  return false;
}

let requestCount = 0;
function cleanupRateLimitMap() {
  requestCount++;
  if (requestCount % 100 === 0) {
    const now = Date.now();
    for (const [ip, entry] of rateLimitMap.entries()) {
      if ((now - entry.windowStart) > RATE_LIMIT_WINDOW_MS) rateLimitMap.delete(ip);
    }
  }
}

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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("cf-connecting-ip") || "unknown";
  cleanupRateLimitMap();

  if (isRateLimited(clientIp)) {
    return new Response(JSON.stringify({ error: "Too many requests." }), {
      status: 429,
      headers: { "Content-Type": "application/json", "Retry-After": "600", ...corsHeaders },
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

    const { data, error } = await resend.emails.send({
      from: "bebloo <onboarding@resend.dev>",
      to: [email],
      subject: "¡Estás en la lista de bebloo! 🍼",
      html: `
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
      `,
    });

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, data }), {
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
