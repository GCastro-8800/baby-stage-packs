import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getCorsHeaders } from "../_shared/cors.ts";
import { checkRateLimit, getClientIp } from "../_shared/rateLimit.ts";

const RATE_LIMIT = 10;
const RATE_WINDOW_SECONDS = 60 * 60; // 1 hour

const SYSTEM_PROMPT = `Eres el asistente virtual de bebloo, una suscripción por etapas para padres primerizos con bebés de 0 a 12 meses.

Tu personalidad:
- Cálido, cercano y tranquilizador
- Hablas siempre en español
- Respuestas breves y claras, sin tecnicismos
- Nunca presionas para vender, solo informas con calma
- Usas un tono como si fueras una amiga que ya pasó por lo mismo

Información sobre los planes de bebloo:

1. **Plan Start** — 59 €/mes
   - Lo esencial para empezar sin agobios
   - Productos básicos seleccionados por expertos
   - Envío mensual adaptado a la etapa del bebé

2. **Plan Comfort** — 129 €/mes  
   - Todo lo del Start + productos premium
   - Mayor variedad y cantidad
   - Productos de marcas reconocidas (Bugaboo, Cybex, Stokke…)

3. **Plan Total Peace** — 149 €/mes
   - La experiencia completa sin pensar en nada
   - Todo lo del Comfort + extras exclusivos
   - Atención prioritaria y asesoría personalizada

Filosofía de bebloo:
- "Menos cajas, más calma"
- Eliminamos decisiones innecesarias del primer año
- Todo llega a tiempo, todo está pensado por expertos
- Los padres solo tienen que disfrutar de su bebé

Reglas importantes:
- Si no sabes algo específico sobre un envío o producto concreto del usuario, NO inventes. Deriva a soporte.
- Para consultas específicas o soporte personalizado, sugiere:
  - WhatsApp: +34 638706467
  - Agendar una llamada: https://calendly.com/martincabanaspaola/30min
- No inventes precios, productos ni políticas que no estén aquí
- Si preguntan por temas médicos o de salud del bebé, aclara que no eres profesional sanitario y recomienda consultar con su pediatra`;

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // IP-based rate limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
               req.headers.get("cf-connecting-ip") ||
               "unknown";
    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ error: "Demasiadas solicitudes. Intenta de nuevo más tarde." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { messages } = body;

    // Validate messages array
    if (!messages || !Array.isArray(messages) || messages.length === 0 || messages.length > 50) {
      return new Response(
        JSON.stringify({ error: "Formato de mensajes inválido" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate each message
    for (const msg of messages) {
      if (
        !msg ||
        typeof msg.role !== "string" ||
        !["user", "assistant"].includes(msg.role) ||
        typeof msg.content !== "string" ||
        msg.content.length === 0 ||
        msg.content.length > 4000
      ) {
        return new Response(
          JSON.stringify({ error: "Formato de mensaje inválido" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "El asistente no está disponible en este momento" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Demasiadas solicitudes. Intenta de nuevo en unos segundos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "El asistente no está disponible temporalmente." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Error al conectar con el asistente" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: "Error al conectar con el asistente" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
