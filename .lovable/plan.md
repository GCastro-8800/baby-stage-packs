
## Objetivo

Cerrar el último agujero de seguridad detectado (los crons aún se pueden disparar con la anon key pública) y completar el ciclo de vida del cliente con un email de bienvenida cuando crea cuenta.

---

## Bloque A — Endurecer autenticación de los crons

**Problema actual:** los 3 jobs de pg_cron envían `Authorization: Bearer <ANON_KEY>` y el código de los endpoints acepta ese header como válido. Como la anon key viaja en el cliente, cualquiera puede disparar los crons y forzar envíos de email (no duplicados gracias a la idempotencia, pero sí abuso de cuota Resend / coste).

**Cambios:**

1. **Migración SQL** que actualiza los 3 jobs existentes con `cron.alter_job` (o `cron.unschedule` + `cron.schedule`) para que envíen `X-Cron-Secret: <CRON_SECRET>` en vez del Bearer anon. La `CRON_SECRET` ya está en los secretos de Cloud, así que esto se hace leyéndola desde Vault (siguiendo el mismo patrón que ya usa `process-email-queue`). 
   - Jobs afectados: `check-expiring-subscriptions-daily`, `process-expired-subscriptions-daily`, `send-pickup-reminders-daily`.

2. **Endpoints**: quitar el bloque de fallback con anon key en `authorizeCronRequest` de las 3 funciones. Solo se acepta `X-Cron-Secret` correcto. Mantener intacta la rama `resendFor` de `process-expired-subscriptions` (esa sigue siendo Bearer JWT de admin, que es lo correcto).

   Funciones tocadas:
   - `supabase/functions/check-expiring-subscriptions/index.ts`
   - `supabase/functions/process-expired-subscriptions/index.ts`
   - `supabase/functions/send-pickup-reminders/index.ts`

3. **Verificación**: ejecutar manualmente los 3 endpoints con `curl_edge_functions` enviando `X-Cron-Secret` correcto e incorrecto para confirmar 200 / 401.

---

## Bloque B — Email de bienvenida tras signup

**Cambios:**

1. **Plantilla nueva** `supabase/functions/_shared/transactional-email-templates/welcome.tsx`:
   - Tono cálido en castellano, mismas reglas de terminología (servicio, kit, Momento; nada de “suscripción/pack/etapa”).
   - Tipografías Fraunces / DM Sans, paleta light blue + coral sobre crema.
   - Props opcionales: `customerName`, `configuratorUrl`. CTA al configurador.
   - Registrar en `_shared/transactional-email-templates/registry.ts`.

2. **Disparador**: ampliar el trigger `handle_new_user` en la BD para llamar a la edge function `send-transactional-email` vía `pg_net.http_post` con:
   - `templateName: "welcome"`
   - `recipientEmail: NEW.email`
   - `idempotencyKey: \`welcome-${NEW.id}\``
   - `templateData: { customerName: NEW.raw_user_meta_data->>'full_name' }`
   
   Esto cubre tanto signup por email como OAuth Google (ambos disparan `auth.users` insert).

3. **Filtro anti-duplicado**: si por cualquier motivo el usuario hace login antes de existir el profile (caso raro), la idempotencia por `welcome-${user_id}` evita doble envío. Además el sistema ya filtra por `suppressed_emails` automáticamente.

---

## Bloque C — Cierre

1. Re-ejecutar el escáner de seguridad para confirmar que sigue en 0 hallazgos.
2. Actualizar `@security-memory` añadiendo:
   - “Crons solo aceptan X-Cron-Secret. Anon key como auth de cron está prohibida.”
3. Actualizar memoria del proyecto:
   - Nueva entrada `mem://features/welcome-email` con la regla de bienvenida tras signup.

---

## Detalles técnicos relevantes

- La `CRON_SECRET` se lee con `vault.read_secret('cron_secret')` dentro del cuerpo SQL del cron, igual que se hace hoy con `email_queue_service_role_key`. Si ese secreto no está en Vault todavía (solo está como env var de las edge functions), la migración primero hará `vault.create_secret(<valor>, 'cron_secret')`. El valor lo aporto en la migración leyéndolo del entorno que ya tiene Lovable Cloud.
- El trigger `handle_new_user` ya hace dos inserts (`profiles`, `user_roles`); se le añade un tercer paso `pg_net.http_post`. Si la llamada falla, no debe romper el signup → se envuelve en `BEGIN ... EXCEPTION WHEN OTHERS THEN NULL; END;`.
- Ningún cambio toca el flujo Stripe ni el webhook Make, que ya validamos como correctos.

## Riesgos

- Si la migración del cron se aplica mal, los recordatorios dejarían de salir un día. Mitigación: la migración es idempotente y se puede revertir en segundos volviendo al schedule anterior.
- El email de bienvenida usa el trigger DB, así que si Resend/Lovable Email cae, el signup sigue funcionando (gracias al try/catch en el trigger).

¿Lo lanzo?
