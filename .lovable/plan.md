

# Cambiar chatbot a OpenAI con API key propia

## Que cambia
La edge function `chat` dejara de llamar a la API de Gemini y pasara a usar la API de OpenAI directamente con tu API key personal.

## Pasos

### 1. Guardar tu OPENAI_API_KEY como secret
- Se te pedira que introduzcas tu API key de OpenAI

### 2. Actualizar `supabase/functions/chat/index.ts`
- Reemplazar la llamada a Gemini por `https://api.openai.com/v1/chat/completions`
- Usar `OPENAI_API_KEY` en lugar de `GEMINI_API_KEY`
- Modelo: `gpt-4o-mini` (rapido, barato, ideal para soporte)
- Formato OpenAI nativo: `messages` array con `role`/`content`, `stream: true`
- Ya no necesitamos convertir formatos — OpenAI devuelve SSE estandar con `choices[0].delta.content`
- Mantener el mismo system prompt con toda la info de bebloo
- Manejar errores 429 (rate limit) y 401 (auth)

### 3. Sin cambios en frontend
- `useChat.ts` y `ChatBot.tsx` no cambian — ya parsean formato OpenAI compatible

## Archivo

| Accion | Archivo |
|--------|---------|
| Modificar | `supabase/functions/chat/index.ts` |

## Costo estimado
Con `gpt-4o-mini`: ~$0.15/1M input tokens, ~$0.60/1M output tokens. Para un chatbot de soporte con uso moderado, el costo sera muy bajo (centimos al mes).

## Seccion tecnica

### Antes (Gemini directo)
- URL: `generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent`
- Auth: `GEMINI_API_KEY` como query param
- Formato: Gemini nativo convertido manualmente a SSE OpenAI-compatible

### Despues (OpenAI directo)
- URL: `https://api.openai.com/v1/chat/completions`
- Auth: `Bearer OPENAI_API_KEY`
- Modelo: `gpt-4o-mini`
- Formato: OpenAI nativo (`messages`, `stream: true`)
- SSE pasado directo al cliente sin conversion
- Codigo mas simple y limpio

