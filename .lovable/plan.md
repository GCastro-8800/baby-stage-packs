## Rotar secretos: separar `PICKUP_TOKEN_SECRET` y `CRON_SECRET`

### Por qué

Hoy las edge functions usan `STRIPE_WEBHOOK_SECRET` como apaño para dos cosas que no son Stripe:
- Firmar los enlaces HMAC de recogida que mandamos por email.
- Validar el header `X-Cron-Secret` de las funciones programadas (cron diario de expiraciones, recordatorios, etc.).

Esto funciona pero mezcla responsabilidades: si algún día Stripe rota su webhook secret, se rompe el cron y las firmas; y al revés, si filtramos el secreto de cron, comprometemos la verificación de Stripe. Lo correcto es una llave por propósito.

### Qué hago yo

1. **Generar las dos cadenas aleatorias** (64 caracteres hex cada una) y dártelas en chat para que las pegues como secretos en Lovable Cloud:
   - `PICKUP_TOKEN_SECRET`
   - `CRON_SECRET`

2. **Actualizar 4 edge functions** para leer el secreto correcto en cada caso, eliminando el fallback a `STRIPE_WEBHOOK_SECRET`:
   - `schedule-pickup` → `PICKUP_TOKEN_SECRET` para verificar firma del enlace.
   - `process-expired-subscriptions` → `PICKUP_TOKEN_SECRET` para firmar enlaces nuevos + `CRON_SECRET` para validar header.
   - `check-expiring-subscriptions` → `CRON_SECRET`.
   - `send-pickup-reminders` → `CRON_SECRET` + `PICKUP_TOKEN_SECRET` para regenerar firma si hace falta.

3. **Ajustar el helper `authorizeCronRequest`** para que exija `CRON_SECRET` (sigue aceptando bearer del service role como vía de escape para llamadas internas).

4. **Re-ejecutar el escáner** al final para confirmar 0 hallazgos.

5. **Actualizar `@security-memory`** para documentar que cada secreto tiene un único propósito y que no se debe reintroducir el fallback a Stripe.

### Qué necesitas hacer tú

Una sola cosa, cuando termine:
- Ir a **Cloud → Secrets**, pulsar "Add secret" dos veces y pegar los dos valores que te daré. Nombres exactos: `PICKUP_TOKEN_SECRET` y `CRON_SECRET`.

Yo no puedo crearlos por ti porque la herramienta de añadir secretos requiere tu confirmación explícita por seguridad — pero te lanzaré la solicitud directamente desde el chat y solo tendrás que pegar el valor.

### Archivos afectados

- `supabase/functions/schedule-pickup/index.ts`
- `supabase/functions/process-expired-subscriptions/index.ts`
- `supabase/functions/check-expiring-subscriptions/index.ts`
- `supabase/functions/send-pickup-reminders/index.ts`
- (posible) helper compartido de cron auth
- `@security-memory`

No se tocan tablas, RLS, ni código frontend.

### Riesgo

Bajo. Si por error me equivoco con un nombre de secreto, la función fallará de forma controlada (devuelve 500 con log) y se arregla cambiando una línea. No hay riesgo de exposición de datos.
