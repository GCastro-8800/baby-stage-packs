

## Plan: Webhook para Make.com — Detección de clientes inactivos (+6 meses)

**Importante sobre el email de reactivación**: Los emails de reactivación ("vuelve a rentar") son emails de marketing/re-engagement, no transaccionales. Por eso es correcto que el envío del email lo maneje Make.com y no el sistema de emails de Lovable. Lo que Lovable proporcionará es el **webhook endpoint** que Make consulta para obtener los clientes inactivos.

---

### Qué se construye

Una Edge Function `make-inactive-customers` que:
1. Recibe una petición GET/POST de Make.com
2. Valida la autenticación via header `x-make-apikey` contra un secreto almacenado (`MAKE_WEBHOOK_SECRET`)
3. Consulta la base de datos para encontrar usuarios cuya última actividad (último envío entregado o última suscripción creada) fue hace más de 6 meses y no tienen una suscripción activa actualmente
4. Devuelve un JSON con la lista de clientes inactivos: `email`, `full_name`, `last_activity_date`, `last_plan_name`

### Query lógica

```text
- JOIN subscriptions + shipments + profiles
- Filtrar: status de suscripción != 'active'
- Agrupar por user_id
- WHERE última fecha de actividad < NOW() - 6 meses
- Excluir emails en suppressed_emails (respeto a opt-out)
```

### Archivos afectados

- `supabase/functions/make-inactive-customers/index.ts` — nuevo
- `supabase/config.toml` — añadir `[functions.make-inactive-customers]` con `verify_jwt = false` (usa API key propia)

### Secreto necesario

- `MAKE_WEBHOOK_SECRET` — una API key que configuras en Make.com y en Lovable para autenticar las peticiones. Te pediré que la configures.

### Flujo en Make.com

```text
1. Cron (cada día) → HTTP Module (GET al webhook)
2. Webhook responde con lista de clientes inactivos
3. Iterator → Email module (envía email de reactivación a cada uno)
```

### Seguridad
- Autenticación por API key en header `x-make-apikey`
- Respeta la lista de supresión de emails (no envía a usuarios que hicieron opt-out)
- No expone datos sensibles (solo email, nombre y fecha)

