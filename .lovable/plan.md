

## Plan completo: cierre de ciclo de servicio + canales múltiples + recogida + migración a Stripe Live

### Resumen del flujo end-to-end (lo que vivirá el cliente)

```text
Día -14: email + WhatsApp + SMS + banner dashboard → "Tu servicio termina el [fecha]. Renueva si quieres seguir."
Día -7:  email + WhatsApp + SMS + banner dashboard → recordatorio
Día -1:  email + WhatsApp + SMS + banner dashboard → última oportunidad
Día 0  (fin servicio): status pasa a "expired" → email + WhatsApp + SMS:
        "Tu servicio ha terminado. Pasaremos a recoger los productos.
         Elige cuándo te viene bien → [link]. O renueva → [link]."
Día +1: dashboard muestra solo 2 CTAs: "Programar recogida" / "Volver a contratar"
Si elige recogida → mini-flow web para escoger franja → email confirmación con día/hora
Si no responde en 7 días → email + WhatsApp recordatorio para programar recogida
```

### Parte A — Infra de comunicaciones multi-canal

**A.1 Conector Twilio** (yo lo lanzo, tú apruebas el modal):
- WhatsApp Business API vía Twilio + SMS en el mismo conector
- Si la aprobación de WhatsApp Business de Meta tarda (2-3 semanas), arrancamos con SMS + email + dashboard, y enchufamos WhatsApp en cuanto esté aprobado sin tocar código (mismo conector)
- Activar SMS Pumping Protection y Geo Permissions (solo España) en Twilio antes de producción

**A.2 Edge function `send-multichannel-notification`** (nueva)
- Input: `{ userId, templateKey, data }`
- Lee `profiles.phone` (campo nuevo, ver A.3) y email
- Para cada canal habilitado: encola email vía `send-transactional-email` + dispara WhatsApp y SMS vía Twilio gateway
- Respeta suppressions: no envía a emails/teléfonos suppressed
- Logs en tabla nueva `multichannel_notification_log`

**A.3 Migración de BD**
- `profiles`: añadir `phone TEXT` (E.164) + `phone_verified BOOLEAN DEFAULT false` + `notification_preferences JSONB DEFAULT '{"email":true,"whatsapp":true,"sms":true}'`
- `subscriptions`: añadir `end_date DATE` + `pickup_status TEXT DEFAULT 'pending'` (pending/scheduled/completed/cancelled) + `pickup_scheduled_date DATE` + `pickup_window TEXT`
- Nueva tabla `multichannel_notification_log` (channel, template_key, status, error, created_at)
- Backfill de `end_date` para subscriptions existentes desde `created_at` + duración inferida de `shipments.items`
- Índice `(status, end_date)` para que el cron sea barato

**A.4 UI captura de teléfono**
- En `Onboarding` (último paso) y en `Settings` → campo teléfono con validación E.164 (+34...)
- Toggles de preferencias de canal (email / whatsapp / sms) — siempre al menos email obligatorio
- Para usuarios existentes: banner en dashboard "Añade tu teléfono para no perderte avisos importantes"

### Parte B — Lógica de fin de servicio

**B.1 Edge function `check-expiring-subscriptions`** (nueva, cron diario 09:00)
- Query: `subscriptions WHERE status='active' AND end_date BETWEEN now() AND now()+15 days`
- Para cada una, según días restantes (14/7/1) → invocar `send-multichannel-notification` con templateKey `service-ending-{14|7|1}`
- Idempotency key: `expire-{subscription_id}-{days}` para no duplicar avisos

**B.2 Edge function `process-expired-subscriptions`** (nueva, cron diario 10:00)
- Query: `subscriptions WHERE status='active' AND end_date <= now()`
- `UPDATE status='expired'` + `pickup_status='pending'`
- Invocar `send-multichannel-notification` con templateKey `service-ended-pickup`
- Idempotency key: `expired-{subscription_id}`

**B.3 Webhook `stripe-webhook` actualizado**
- Al crear subscription, guardar `end_date = created_at + maxMonths`

**B.4 Cron jobs vía pg_cron** (uso de `insert` tool para no exponer anon key en migración compartible)
- `check-expiring-subscriptions` → diario 09:00
- `process-expired-subscriptions` → diario 10:00
- `send-pickup-reminders` → diario 11:00 (si `pickup_status='pending'` >7 días desde fin)

### Parte C — Templates de comunicación

**C.1 Email transaccional** (nuevos en `_shared/transactional-email-templates/`):
- `service-ending-soon.tsx` — props: `{daysLeft, endDate, renewUrl, products}`. Subject dinámico
- `service-ended-pickup.tsx` — props: `{pickupSchedulerUrl, renewUrl, products}`
- `pickup-reminder.tsx` — props: `{pickupSchedulerUrl}`
- `pickup-confirmed.tsx` — props: `{pickupDate, pickupWindow}`
- Registrar los 4 en `registry.ts`
- Estilo coherente con templates existentes (Fraunces + DM Sans, paleta light blue/coral)

**C.2 Templates WhatsApp Business** (en código, plantillas pre-aprobadas en Meta — proceso aparte de 1-2 semanas):
- `service_ending_v1` — *"Hola {1}, tu servicio bebloo termina el {2}. Renueva en 1 click → {3}"*
- `service_ended_pickup_v1` — *"Tu servicio ha terminado. Programa la recogida o renueva → {1}"*
- `pickup_confirmed_v1` — *"Recogida confirmada el {1}. Te esperamos."*

**C.3 SMS** (texto plano <160 chars, no requiere aprobación previa)
- Mismas variantes con link corto

### Parte D — Mini-flow de elección de recogida

**D.1 Página nueva `/recogida/:subscriptionId?token=...`**
- Token firmado HMAC en email/WA/SMS para acceso sin login (válido 30 días)
- Calendario con franjas disponibles próximas 4 semanas (lun-vie 10-13h / 16-19h) — configurable en constante por ahora
- Selector → POST a edge function `schedule-pickup` que valida token, guarda `pickup_scheduled_date` + `pickup_window` + `pickup_status='scheduled'`, y dispara `pickup-confirmed` por todos los canales

**D.2 Edge function `schedule-pickup`** (nueva)
- Valida token HMAC + subscription expirada + slot disponible
- Update + notificación de confirmación
- Notificación interna al admin (email a tu cuenta) con la cita programada

**D.3 Vista admin nueva `Recogidas` en `/admin`**
- Tab nuevo en `Admin.tsx` con calendario de recogidas programadas
- Filtros por estado (pendiente/programada/completada)
- Botón "Marcar como recogida" → `pickup_status='completed'`

### Parte E — UI dashboard del cliente

**E.1 `SubscriptionCard.tsx`**
- Si `end_date` <30 días → banner ámbar "Tu servicio termina el [fecha] · Renovar"
- Si `status='expired'` y `pickup_status='pending'` → banner coral grande "Programa la recogida o renueva"
- Si `pickup_status='scheduled'` → banner verde "Recogida programada el [fecha] · [franja]"

**E.2 Selector de duración (Configurator)**
- Junto a "67 €/mes" añadir línea "= 201 € hoy (compromiso 3 meses)"
- Badge "Pago único — sin renovación automática · te avisaremos antes del fin"

**E.3 `CheckoutOptionsDialog.tsx`**
- Botón: `Pagar 201 € · compromiso 3 meses`
- Subtítulo: *"Pago único. Cuando termine tu compromiso te avisaremos por email, WhatsApp y SMS para que decidas si renovar o programar la recogida."*

### Parte F — Migración Stripe Test → Live

**F.1 Pre-requisitos del usuario** (fuera de Lovable):
1. Stripe Live → Webhooks → Add endpoint:
   - URL: `https://okxfhhbqxsxtdlneliax.supabase.co/functions/v1/stripe-webhook`
   - Evento: `checkout.session.completed`
   - Copiar `whsec_...`
2. Stripe Live → Developers → API keys → copiar `sk_live_...`
3. Stripe Live → Settings → Billing → Customer portal → Activate

**F.2 Yo en Lovable** (tras tu confirmación):
1. `update_stripe_secret_key` → modal seguro para `sk_live_...`
2. `add_secret` sobre `STRIPE_WEBHOOK_SECRET` → modal seguro para `whsec_...` live
3. Verificación de código (sin cambios esperados)

### Parte G — Test end-to-end en Live

Con tarjeta personal, producto 1 mes (~25-50 €):
- Checkout → pago en Stripe Live
- Webhook 200 OK → `subscriptions` con `end_date` correcto
- Email confirmación llega
- Manualmente acortar `end_date` en BD → verificar que `check-expiring-subscriptions` envía email + WA + SMS
- Forzar `end_date` pasada → verificar `process-expired-subscriptions` cambia estado y manda aviso de recogida
- Programar recogida desde el link → verificar confirmación
- Reembolso desde Stripe (comisión ~1.5 % no vuelve)

### Parte H — Memoria

Actualizar:
- `mem://features/stripe-checkout-mode` → live + ciclo completo de fin de servicio
- Nueva `mem://features/service-lifecycle` → flujo de fin de servicio, canales, recogida
- Nueva `mem://technical/twilio-channels` → uso de Twilio para WhatsApp + SMS

### Orden de ejecución

1. **F + G** (migrar Stripe a live) — primero, porque es lo que más urge y es independiente
2. **A.1 + A.3 + A.4** (Twilio + BD + captura de teléfono)
3. **B + C** (lógica de fin + templates de email; SMS funciona ya, WhatsApp queda en cola hasta aprobación Meta)
4. **D + E** (flow de recogida + UI dashboard)
5. **G** (re-test end-to-end con todo el ciclo)
6. **H** (memoria)

Si la aprobación de WhatsApp Business de Meta tarda, los pasos 2-5 funcionan sin WhatsApp (email + SMS + dashboard cubren el aviso). WhatsApp se enchufa después sin tocar lógica de negocio, solo añadiendo el canal en `send-multichannel-notification`.

### Decisiones tomadas (basadas en tus respuestas)

- Canales: email + WhatsApp Business (Twilio) + SMS (Twilio) + dashboard
- Recogida: el cliente elige franja vía mini-flow web
- Modelo Stripe: se mantiene `payment` upfront (no se migra a `subscription` recurrente)

### Confirma para arrancar

Responde:
- **"adelante con todo"** → empiezo por F (Stripe live) en cuanto me confirmes que tienes `sk_live_...` y `whsec_...` a mano
- **"solo Stripe live ahora, lo demás luego"** → ejecutamos F+G y dejamos el resto en backlog
- **"primero el ciclo de fin de servicio, luego live"** → invertimos orden (más seguro: ningún cliente real queda en limbo)

