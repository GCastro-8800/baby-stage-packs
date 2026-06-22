# Prompt para clonar el chatbot de bebloo en otro proyecto Lovable

Objetivo: generar un prompt listo para pegar en un proyecto Lovable nuevo que reproduzca **el chatbot de bebloo** como protagonista, sobre una landing "demo" que se parezca lo bastante a bebloo.es para que la demostración resulte creíble — pero sin gastar esfuerzo en lógica de negocio (configurador, pricing real, auth, Stripe, etc.).

No hay cambios de código en este proyecto. El entregable es el texto del prompt.

## Estructura del prompt que voy a entregar

1. **Contexto del proyecto** (1 párrafo): qué es bebloo, tono, idioma (español), look & feel editorial/lujo minimalista (crema #FBF9F6, azul claro + coral, Cormorant Garamond + DM Sans).
2. **Foco real**: el chatbot. La landing es solo escenografía.
3. **Especificación del chatbot** (lo más detallado):
   - Botón flotante circular abajo-derecha (desktop) / bottom-[7rem] right-4 (móvil) en color `accent` (coral) con icono `MessageCircle` de lucide-react.
   - Desktop: panel fijo 380×500 px con header "💬 Asistente bebloo", gradiente sutil accent/primary, botón de cerrar.
   - Móvil: `Drawer` shadcn a 85vh con el mismo header.
   - Mensajes en burbujas estilo iMessage (`rounded-2xl` con `rounded-br-md` para user y `rounded-bl-md` para assistant), user en `bg-primary`, assistant en `bg-muted`.
   - Mensaje de bienvenida fijo en markdown.
   - Renderizar respuestas con `react-markdown` y clases prose.
   - Indicador "escribiendo…" con 3 puntos `animate-bounce`.
   - Input: `textarea` autoexpandible 1-3 líneas, enviar con Enter (Shift+Enter = salto), botón circular de envío con `Send`.
   - Streaming SSE token a token desde una Edge Function `chat`.
4. **Backend (Edge Function `chat`)**:
   - Modelo `google/gemini-3-flash-preview` vía Lovable AI Gateway (`https://ai.gateway.lovable.dev/v1/chat/completions`) usando `LOVABLE_API_KEY` (gratis, ya disponible en Lovable Cloud).
   - Rate limit 10 req/h por IP (tabla `rate_limit_buckets` con función `check_rate_limit`).
   - Validación: array de mensajes 1-50, cada uno con `role` user|assistant y `content` 1-4000 chars.
   - Manejo de 429 y 402 con mensajes en español.
   - System prompt completo de bebloo: personalidad cálida, planes Start/Comfort/Total Peace con precios, filosofía "menos cajas, más calma", deriva a WhatsApp +34 638706467 y Calendly para casos no cubiertos, nada de consejos médicos.
5. **Landing "demo" mínima pero realista** (componentes que renderizar, en este orden):
   - `Header` sticky con logo "bebloo" en Cormorant Garamond y links: Cómo funciona, Servicio, Catálogo, FAQ.
   - `Hero`: titular "Equipamiento premium de bebé en alquiler", subtítulo, dos CTAs (primario coral, secundario outline), imagen placeholder de un bebé/cuna a la derecha.
   - Banda de logos de marcas (Bugaboo, Cybex, Stokke, Maxi-Cosi, Chicco) en texto plano si no hay assets.
   - `HowItWorks` 3 pasos con iconos lucide y copy corto.
   - `Pricing` con 3 cards: Start 59€/mes, Comfort 129€/mes, Total Peace 149€/mes (la del medio destacada con badge "Más elegido").
   - `FAQ` accordion shadcn con 4-5 preguntas típicas (devolución, edades, marcas, pausar).
   - `Footer` minimal con copyright y links legales.
   - Botón WhatsApp flotante abajo-derecha (bottom-6) para mostrar la coexistencia con el chatbot (chatbot va en bottom-[7rem] en móvil para no solaparse).
6. **Tokens de diseño y dependencias**:
   - `index.css` con paleta HSL (background 36 33% 97%, primary azul claro ~205 60% 70%, accent coral ~12 75% 65%).
   - `tailwind.config.ts` con las fuentes via `@fontsource/cormorant-garamond` y `@fontsource/dm-sans`.
   - Instalar: `react-markdown`, shadcn components `button drawer scroll-area accordion`, `lucide-react`.
7. **Lo que NO debe construir** (para no perder tiempo): auth, base de datos de productos, configurador, Stripe, dashboard, emails, blog. Solo landing visual + chatbot funcional.

## Cómo lo entregaré

En el siguiente mensaje (cuando aprueben el plan) te paso el prompt como un bloque de texto largo en español, en una sola pieza, listo para copiar-pegar en el composer de un nuevo proyecto Lovable. Incluiré al final una nota recordando que el nuevo proyecto debe tener **Lovable Cloud activado** (para que la edge function y el rate limiting funcionen sin configurar nada).

## Preguntas opcionales (puedo asumir defaults)

- Asumo que quieres **el chatbot tal cual está hoy** (gemini-3-flash, system prompt actual con los 3 planes). Si quieres un system prompt distinto (p. ej. con catálogo de alquiler en vez de planes), dímelo y lo ajusto antes de entregar.
- Asumo que la landing demo **no necesita responsive perfecto** ni assets reales; usaremos placeholders. Si quieres que incluya prompts de generación de imágenes (hero, productos), lo añado.
