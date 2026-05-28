# Fix #7 — CAPTCHA (Cloudflare Turnstile) en endpoints públicos

Es el último HIGH pendiente del review. Toca frontend + backend + un secret nuevo, por eso se hace en su propio turno.

## Problema

Los endpoints públicos no tienen protección antiabuso más allá del rate limit por IP:
- `admin-login` → vulnerable a brute-force de contraseñas.
- `chat` → bots pueden quemar tokens del LLM (coste real).
- `send-confirmation-email` (lead capture) → bots pueden generar spam y emails masivos vía Resend.

El rate limit persistente (Fix #3) ayuda pero no detiene un atacante con IPs rotatorias.

## Solución: Cloudflare Turnstile

Turnstile es gratuito, sin fricción visible (invisible/managed mode), GDPR-friendly y no requiere cuenta de Cloudflare de pago. Mejor opción que hCaptcha/reCAPTCHA para Europa.

Flujo:
1. El widget en el cliente genera un `token` (corto, ~5 min de validez).
2. El cliente envía el `token` junto con la request al edge function.
3. El edge function valida el token contra `https://challenges.cloudflare.com/turnstile/v0/siteverify` con el secret server-side.
4. Si la validación falla → 403; si pasa → continúa el flujo normal (rate limit + lógica).

## Cambios

### 1. Secrets
- Pedir al usuario **`TURNSTILE_SECRET_KEY`** (server-side) vía `add_secret`.
- El **site key** (público) va en `.env` como `VITE_TURNSTILE_SITE_KEY` (lo añade el usuario manualmente en Lovable Cloud → Variables, o lo hardcodeo si lo prefiere — preguntar abajo).

### 2. Helper compartido `supabase/functions/_shared/turnstile.ts`
- `verifyTurnstile(token: string, ip: string): Promise<{ success: boolean; error?: string }>`.
- POST a `siteverify` con `secret`, `response`, `remoteip`.
- Devuelve `success` + códigos de error de Cloudflare.

### 3. Componente frontend `src/components/TurnstileWidget.tsx`
- Wrapper sobre `@marsidev/react-turnstile` (librería ligera, mantenida, ~3KB).
- Props: `onVerify(token)`, `onError`, `onExpire`.
- Modo `managed` (invisible salvo si Cloudflare detecta sospecha).
- Tema adaptado al diseño (light, con tokens semánticos).

### 4. Integración en los 3 puntos de entrada

**a) `src/pages/AdminLogin.tsx`**
- Renderizar `<TurnstileWidget>` debajo del form.
- Guardar `turnstileToken` en estado; bloquear submit si está vacío.
- Enviar `turnstileToken` en el body al edge function.

**b) `supabase/functions/admin-login/index.ts`**
- Antes del rate limit y bcrypt: `verifyTurnstile(body.turnstileToken, ip)`. Si falla → 403.

**c) `src/components/ChatBot.tsx`** (o donde se inicialice el chat)
- Renderizar Turnstile **una sola vez** al abrir el chat (no por mensaje, para no romper UX).
- Guardar token en estado del componente; renovar cuando expire (`onExpire`).
- Pasar `turnstileToken` en cada `sendMessage` al edge function.

**d) `supabase/functions/chat/index.ts`**
- Validar `turnstileToken` antes del rate limit. Si falla → 403.

**e) `src/hooks/useLeadCapture.ts` + componentes que lo usan (`EmailCaptureModal`, `ExitIntentModal`, `Hero`, `PricingSection`, etc.)**
- Añadir Turnstile en cada form que llame `submitLead`.
- Pasar token en el body de `send-confirmation-email`.

**f) `supabase/functions/send-confirmation-email/index.ts`**
- Validar token antes del rate limit. Si falla → 403.

### 5. Dependencias
- `bun add @marsidev/react-turnstile`

### 6. Manejo de errores en UI
- Si la verificación falla en backend (403 con `error: "captcha_failed"`), mostrar toast: "Verificación de seguridad fallida. Recarga la página e inténtalo de nuevo."

## Riesgos / consideraciones

- **UX**: Turnstile en modo managed es invisible el 99% del tiempo → no debería afectar conversión. Si Cloudflare marca sospecha, aparece un challenge de ~2s.
- **Lead capture**: añadir el widget en TODOS los puntos de captura (son ~5) puede ser laborioso. Alternativa: envolver el widget en `useLeadCapture` y exponerlo como componente del propio hook para no duplicar.
- **Tests locales**: Cloudflare ofrece site keys de testing (`1x00000000000000000000AA` siempre pasa) — usarlas si el usuario quiere probar sin configurar Turnstile real.

## Pregunta antes de implementar

¿El usuario quiere:
- **(A)** Implementar Turnstile en los 3 endpoints (admin-login, chat, lead capture) — recomendado.
- **(B)** Solo en `admin-login` (que es el más crítico por brute-force) y dejar los otros con el rate limit actual.
- **(C)** No implementar Turnstile y marcar #7 como "aceptado" en el review.

Una vez confirme A/B/C, pido el `TURNSTILE_SECRET_KEY` con `add_secret` y empiezo.
