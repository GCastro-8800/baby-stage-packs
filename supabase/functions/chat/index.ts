import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Convert messages to Gemini format
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const geminiBody = {
      contents,
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    };

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`;

    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiBody),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API error:", geminiRes.status, errText);

      if (geminiRes.status === 429) {
        return new Response(
          JSON.stringify({ error: "Demasiadas solicitudes. Intenta de nuevo en unos segundos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Error al conectar con el asistente" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Stream Gemini's SSE response, converting to OpenAI-compatible SSE format
    const reader = geminiRes.body!.getReader();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            let newlineIdx: number;
            while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
              const line = buffer.slice(0, newlineIdx).trim();
              buffer = buffer.slice(newlineIdx + 1);

              if (!line.startsWith("data: ")) continue;
              const jsonStr = line.slice(6);

              try {
                const parsed = JSON.parse(jsonStr);
                const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                  // Convert to OpenAI-compatible SSE format
                  const sseData = JSON.stringify({
                    choices: [{ delta: { content: text } }],
                  });
                  controller.enqueue(encoder.encode(`data: ${sseData}\n\n`));
                }
              } catch {
                // Incomplete JSON, skip
              }
            }
          }
        } catch (e) {
          console.error("Stream error:", e);
        } finally {
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
