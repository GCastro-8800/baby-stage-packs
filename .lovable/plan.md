## Objetivo

Convertir más visitas en compras. Hoy mucha gente entra al configurador, deja su email (a veces) y se va sin pagar. No hacemos nada con esa información. El plan ataca **dos frentes a la vez**: rescatar a los que se van, y empujar suavemente a los que están a un paso de pagar.

---

## Bloque 1 — Rescate por email del visitante que se fue

**Qué pasa hoy:**
Si alguien entra al configurador y deja su email en el modal pero no termina la compra, ese email se queda guardado en la lista de "leads" y ahí muere. No recibe nada después.

**Qué vamos a hacer:**
Un email automático **24 horas después** de dejar el email, si esa persona aún no ha comprado. Tono cálido, cero presión. Algo como:

> "Hola, vimos que estuviste mirando tu kit en Bebloo. ¿Tienes alguna duda? Estamos por aquí. Y si quieres, retomamos donde lo dejaste."

Con un botón grande para volver al configurador con la selección que ya había hecho (que ya guardamos en `selected_products` en la tabla de leads).

Si tampoco abre/compra, **un segundo email a los 4 días**, todavía más humano:

> "Sabemos que el primer año de tu bebé es un torbellino. Si en algún momento te apetece que te ayudemos a no pensar en la logística, aquí estamos."

Después, silencio. Nada de spam.

**Cómo decidimos cuándo parar:** si la persona ya compró (existe una suscripción suya), no se envía nada. Si se dio de baja en algún email anterior, tampoco.

---

## Bloque 2 — Capturar más emails (no solo a los que pulsan "Reservar")

**Qué pasa hoy:**
Solo capturamos email cuando el usuario llega al final del configurador y abre el modal. Si se va antes, no tenemos nada para rescatarle.

**Qué vamos a hacer:**
Un **modal de salida** discreto que aparece **una sola vez por sesión** cuando el usuario hace gesto de cerrar la pestaña o vuelve atrás en el navegador, y solo si lleva más de 30 segundos en la página y aún no ha dejado su email. Mensaje:

> "¿Te quedas con la duda? Te enviamos por email un resumen de tu selección y unos consejos de padres expertos. Sin compromiso."

Captura solo email (un campo, nada más). Esto alimenta el rescate del Bloque 1.

---

## Bloque 3 — Reducir miedo en el momento del pago

**Qué pasa hoy:**
El botón "Reservar" lleva al checkout pero el usuario no ve garantías visibles. Hay miedo de "y si me arrepiento", "y si no me funciona el carrito".

**Qué vamos a hacer:**
Justo encima del botón final añadir tres "tranquilizadores" muy visibles:

- **Devolución gratis los primeros 14 días** si algo no encaja
- **Cambia el material cuando quieras** durante tu servicio
- **Atención personal por WhatsApp** (link directo)

Esto es solo diseño + copy, no toca lógica de pago.

---

## Bloque 4 — Medir si funciona

Sin esto no sabemos si lo que hicimos sirve. Añadir al panel de admin una pequeña sección con:

- Cuántos leads se capturaron este mes
- Cuántos terminaron comprando (tasa de conversión)
- Cuántos abrieron los emails de rescate
- Cuántos volvieron al configurador desde un email de rescate

---

## Detalles técnicos

- **Plantillas nuevas:** `_shared/transactional-email-templates/cart-recovery-day-1.tsx` y `cart-recovery-day-4.tsx`. Registradas en `registry.ts`. Spanish, terminología `servicio/kit/Momento`, paleta de marca.
- **Tabla nueva o columnas en `leads`:** añadir `recovery_email_1_sent_at`, `recovery_email_2_sent_at`, `converted_at` (cuándo se convirtió en suscripción). Permite filtrar y reportar.
- **Cron diario nuevo** `send-cart-recovery-emails`: al estilo de los crons existentes, autorizado solo con `X-Cron-Secret`. Lógica:
  - Buscar leads con `created_at` entre 24h–28h, sin `recovery_email_1_sent_at`, sin suscripción asociada al `user_id` o email, no en `suppressed_emails`.
  - Idem para 96h–100h con segundo email.
  - Marcar `recovery_email_*_sent_at` para no repetir.
- **Cron schedule:** `pg_cron` con el header `X-Cron-Secret` desde Vault, idéntico al patrón ya implementado.
- **Modal de salida:** componente nuevo `ExitIntentModal` montado en `Configurator.tsx`. Detecta `mouseleave` del documento hacia arriba (desktop) y `popstate` (mobile back). Estado en `sessionStorage` para no repetir.
- **Tranquilizadores:** componente `TrustBadges` en `src/components/configurator/`, se monta en `StickyMobileBar` y en el sidebar de selección.
- **Conversión:** marcamos `converted_at` en `leads` desde el webhook de Stripe (`stripe-webhook/index.ts`) cuando se crea la suscripción, haciendo match por email.
- **Panel admin:** nueva pestaña `LeadsTab` ya existe, le añadimos métricas agregadas (count, conversion %, opens) en una tarjeta arriba.

## Fuera de alcance

- No tocamos Make.com (descartado).
- No cambiamos el flujo de pago de Stripe.
- No mandamos SMS/WhatsApp de rescate ahora (solo email). Si funciona, lo añadimos en una segunda fase.

## Riesgos

- **Que el email de rescate se perciba como spam.** Mitigación: tono cuidado, solo 2 emails máx, link de baja claro, respeta `suppressed_emails`.
- **Modal de salida molesto.** Mitigación: una sola vez por sesión, después de 30s, no aparece si ya hay email capturado.

¿Lo lanzo así o quieres que cambie algo (quitar bloque, ajustar tono, etc.)?
