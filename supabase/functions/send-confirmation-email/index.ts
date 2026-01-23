import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email: string;
  plan: string;
  postalCode?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, plan, postalCode }: EmailRequest = await req.json();
    
    console.log(`Sending confirmation email to ${email} for plan ${plan}`);

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
            <strong>${plan}</strong> — excelente elección.
          </p>
          
          <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
            Estamos abriendo el servicio poco a poco en nuevas zonas. 
            ${postalCode ? `Hemos anotado tu código postal (${postalCode}) para avisarte en cuanto lleguemos.` : 'Te escribiremos en cuanto estemos disponibles en tu área.'}
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

    if (error) {
      console.error("Resend error:", error);
      throw error;
    }

    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-confirmation-email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
