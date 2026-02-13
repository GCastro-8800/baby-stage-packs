

# Chatbot con Google Gemini (API key propia)

## Objetivo
Integrar un chatbot flotante en la web de bebloo usando tu API key de Google Gemini. Los costos del chatbot seran independientes de los creditos de Lovable.

## Pasos

### 1. Configurar el secret
- Guardar tu `GEMINI_API_KEY` como secret del backend

### 2. Crear backend function `chat`
- Llama a la API de Gemini (`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent`)
- System prompt personalizado con el tono de bebloo: calido, en espanol, sin presion
- Incluye info de los 3 planes (Start 59 EUR, Comfort 129 EUR, Total Peace 149 EUR)
- Cuando no sepa algo, deriva a WhatsApp o Calendly
- Streaming en tiempo real
- Manejo de errores (429 rate limit, 401 auth)

### 3. Crear componente `ChatBot.tsx`
- Boton flotante (burbuja) en esquina inferior izquierda (para no chocar con el CTA existente)
- En movil: drawer desde abajo (usando Vaul, ya instalado)
- En desktop: panel fijo anclado a la esquina (380px x 500px)
- Mensajes con soporte markdown basico
- Streaming token a token en tiempo real
- Indicador de "escribiendo..."
- Mensaje de bienvenida automatico

### 4. Crear hook `useChat.ts`
- Manejo de estado de mensajes (useState, sin persistencia en base de datos)
- Parseo del stream de Gemini linea a linea
- Actualizacion del ultimo mensaje del asistente token a token

### 5. Montar en la landing
- Agregar el componente en `Index.tsx`
- Registrar la funcion en la configuracion del backend

## Archivos

| Accion | Archivo |
|--------|---------|
| Crear | `supabase/functions/chat/index.ts` |
| Crear | `src/components/ChatBot.tsx` |
| Crear | `src/hooks/useChat.ts` |
| Modificar | `src/pages/Index.tsx` |
| Modificar | `supabase/config.toml` |

## Modelo
Se usara `gemini-2.0-flash` por defecto: rapido, barato, y mas que suficiente para un chatbot de soporte. Puedes cambiarlo despues si quieres (por ejemplo a gemini-2.5-flash o gemini-2.5-pro).

## Costo estimado
Con gemini-2.0-flash, Google ofrece un tier gratuito generoso (15 RPM, 1M tokens/min gratis). Para uso moderado, el costo seria practicamente cero. Si crece el trafico, los precios son muy competitivos (~$0.075/1M input tokens).

## Seccion tecnica

### API de Gemini
Se usara la API REST de Gemini con streaming (`streamGenerateContent`). La edge function recibe los mensajes del cliente, los formatea al formato de Gemini (con `contents` y `systemInstruction`), y retransmite el stream al frontend como SSE.

### System Prompt
El prompt del sistema incluira:
- Informacion sobre los 3 planes (Start 59 EUR, Comfort 129 EUR, Total Peace 149 EUR) y que incluye cada uno
- Filosofia de bebloo: tranquilidad, acompanamiento, cero presion
- Instrucciones de tono: calido, breve, sin tecnicismos, en espanol
- Cuando no sepa algo, derivar a WhatsApp o Calendly
- No inventar informacion sobre productos o envios especificos del usuario

### Streaming
La edge function convierte el stream de Gemini (formato JSON chunked) a SSE estandar que el frontend parsea token a token.

### Posicionamiento visual
- Boton flotante: `fixed bottom-6 left-6` (no choca con el FloatingCTA centrado en bottom-0)
- Panel desktop: 380px ancho, ~500px alto, anclado a la esquina inferior izquierda
- Panel movil: drawer de Vaul ocupando casi toda la pantalla

### Sin persistencia
La conversacion vive en memoria (useState). Se pierde al recargar la pagina. Intencional para mantener simplicidad. Se puede añadir persistencia en una fase futura.

### Dependencia adicional
Se instalara `react-markdown` para renderizar las respuestas del bot con formato.

