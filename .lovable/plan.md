## Cierre de warnings de seguridad

Tras la pasada anterior (CORS por dominio, autenticación por `X-Cron-Secret`, eliminación del fallback `"fallback-pickup-secret"`, REVOKE en funciones SECURITY DEFINER, RLS de `pickup_tokens` y bucket `email-assets`), el escáner aún muestra warnings porque no se ha re-ejecutado (`up_to_date: false`). Cierro los pendientes así:

### 1. Cambio de código (1 migración SQL)

Endurecer `public.user_roles` reemplazando las PERMISSIVE-`false` (frágiles, se evaporan si alguien añade otra PERMISSIVE) por **RESTRICTIVE**, que sí denegan de forma absoluta:

- DROP de `Block anon role inserts`, `Block direct role inserts`, `Block role updates`, `Block role deletions`.
- CREATE POLICY ... AS RESTRICTIVE para INSERT/UPDATE/DELETE con `USING (false)` / `WITH CHECK (false)` aplicadas a `anon` y `authenticated`.
- Mantener la SELECT existente `Users can view own roles`.
- La asignación de roles se sigue haciendo solo vía trigger `handle_new_user` (SECURITY DEFINER) y desde service_role en edge functions, que no se ven afectados por RLS.

### 2. Gestión de findings en el escáner

**Marcar como fixed** (ya se arregló en la pasada anterior; el escáner está desactualizado):
- `agent_security / unauth_cron_endpoints` — Las 3 funciones cron ahora exigen `X-Cron-Secret` o bearer del anon key vía `authorizeCronRequest`.
- `agent_security / hmac_fallback_secret` — Se eliminó la cadena `"fallback-pickup-secret"` en `schedule-pickup` y `process-expired-subscriptions`; ahora fallan duro si no hay secret.
- `supabase / SUPA_anon_security_definer_function_executable` y `SUPA_authenticated_security_definer_function_executable` — REVOKE EXECUTE sobre `has_role`, `enqueue_email`, `delete_email`, `read_email_batch`, `move_to_dlq`, `get_inactive_customers` para `anon` y `authenticated`.
- `supabase / SUPA_public_bucket_allows_listing` — Política de listado en `email-assets` restringida; solo se sirven assets públicos concretos (logo) por path.
- `supabase_lov / user_roles_insert_block_bypass` — Se cierra con la migración del paso 1.

**Ignorar** (no aplicable al diseño):
- `supabase_lov / pickup_tokens_no_user_self_read` — El token de recogida se entrega al usuario por email mediante una URL firmada con HMAC; el usuario nunca lee la tabla `pickup_tokens` desde el cliente. Solo admins y service_role la consultan. Añadir SELECT por `auth.uid() = user_id` ampliaría innecesariamente la superficie sin aportar funcionalidad.

### 3. Actualizar memoria de seguridad

Añadir una nota a `@security-memory` explicando:
- `user_roles` usa políticas RESTRICTIVE para INSERT/UPDATE/DELETE; no añadir PERMISSIVE que permitan estas operaciones.
- `pickup_tokens` se accede solo por service_role + URL firmada al usuario; no abrir SELECT al usuario final.
- Las funciones cron internas requieren `X-Cron-Secret` (o bearer anon key); cualquier nueva función cron debe pasar por `authorizeCronRequest`.

### Archivos afectados

- `supabase/migrations/<timestamp>_user_roles_restrictive.sql` (nuevo)
- Llamadas a `security--manage_security_finding` (mark_as_fixed × 6, ignore × 1)
- Llamada a `security--update_memory`

No se tocan edge functions ni código frontend en esta pasada.
