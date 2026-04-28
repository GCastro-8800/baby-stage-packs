

## Plan: Migración Stripe Test → Live (Parte F + G)

### Pre-requisitos que debes hacer tú en Stripe (fuera de Lovable)

**1. Activa tu cuenta Stripe Live**
- Dashboard de Stripe → toggle arriba a la izquierda "Test mode" → OFF
- Si aún no está activada: completa el formulario de activación (datos fiscales, IBAN, verificación de identidad). Suele tardar unos minutos.

**2. Copia la Secret Key Live**
- Stripe Live → Developers → API keys → "Secret key" → Reveal → copiar `sk_live_...`

**3. Crea el webhook Live**
- Stripe Live → Developers → Webhooks → Add endpoint
- URL: `https://okxfhhbqxsxtdlneliax.supabase.co/functions/v1/stripe-webhook`
- Evento a escuchar: `checkout.session.completed`
- Crear → copiar el `whsec_...` que aparece (solo se muestra una vez)

**4. Activa el Customer Portal en Live** (necesario para `customer-portal`)
- Stripe Live → Settings → Billing → Customer portal → Activate

### Lo que haré yo en Lovable (tras tu confirmación)

**F.1 Actualizar `STRIPE_SECRET_KEY`**
- Modal seguro vía `update_stripe_secret_key` → pegas `sk_live_...`

**F.2 Actualizar `STRIPE_WEBHOOK_SECRET`**
- Modal seguro vía `add_secret` (sobrescribe el de test) → pegas `whsec_...` live

**F.3 Verificar código**
- Confirmar que `stripe-checkout`, `stripe-webhook`, `check-subscription` y `customer-portal` no tienen ningún literal de test hardcodeado (los Price IDs se generan al vuelo con `price_data`, así que no hay nada que cambiar)
- Confirmar que la URL de éxito (`/checkout/success`) y cancel (`/mi-seleccion`) son correctas en producción

### G — Test end-to-end en Live (juntos)

Con tu tarjeta personal y un producto barato (1 mes ≈ 25-50 €):

1. **Checkout real** desde `/mi-seleccion` → "Pagar con tarjeta" → completar pago en Stripe Live
2. **Verificar webhook** en Stripe Live → Webhooks → ver evento `checkout.session.completed` con status 200
3. **Verificar BD**: nueva fila en `subscriptions` con `status='active'`, `end_date` correcto (hoy + meses contratados), `pickup_status='pending'`
4. **Verificar email**: te llega el email de confirmación de pedido (Resend)
5. **Test del ciclo de fin** (opcional pero recomendado):
   - SQL manual para acortar `end_date` a hoy → ejecutar `process-expired-subscriptions` manualmente → verificar que cambia a `expired` y se envía email de recogida con link `/recogida/...?token=...`
   - Abrir el link → programar franja → verificar email de confirmación
6. **Reembolso** desde Stripe Dashboard (ojo: la comisión Stripe ~1.5 % no se devuelve)

### Riesgos y notas

- **Cliente real en limbo**: una vez en live, cualquier persona que entre puede pagar de verdad. Te recomiendo hacer el test e2e en los próximos minutos tras el cambio para detectar fallos antes de promocionar.
- **Suscripciones de test ya creadas en BD**: las que tienes ahora siguen funcionando en frontend pero apuntan a customers de Stripe Test. Si quieres, podemos marcarlas como `status='cancelled'` para limpiar. Dímelo.
- **Customer Portal en Live**: si no lo activas, el botón "Gestionar suscripción" fallará para clientes live (aunque ahora apenas se usa porque el modelo es pago único).
- **Rollback**: si algo sale mal, basta con volver a poner las claves de test (las guardas a mano antes de cambiar) y todo vuelve atrás. Las subscriptions live ya creadas se quedan en BD.

### Confirma para arrancar

Responde:
- **"tengo `sk_live_...` y `whsec_...` listos, dale"** → lanzo los 2 modales seguros uno tras otro
- **"aún no, primero activo Stripe Live"** → espero a que me digas
- **"hazlo y limpia también las subs de test"** → mismo flow + UPDATE para cancelar las subs de prueba existentes

