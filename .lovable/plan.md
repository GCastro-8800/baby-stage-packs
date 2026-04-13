

## Plan: Crear tabla de idempotencia Stripe y configurar secretos

### 1. Migración SQL — Crear `processed_stripe_events`
Ejecutar la migración con la tabla para deduplicación de webhooks de Stripe:
- Tabla con `event_id` (UNIQUE), `event_type`, `processed_at`
- Índice en `processed_at`
- RLS habilitado
- Política RLS: solo `service_role` puede leer/escribir (el webhook usa service role key)

### 2. Verificar secretos
- **STRIPE_WEBHOOK_SECRET**: Ya configurado (confirmado).
- **ALLOWED_ORIGINS**: Necesita añadirse como nuevo secreto con el valor `https://bebloo.lovable.app,https://bebloo.es,https://www.bebloo.es,https://id-preview--3183c00a-6e34-40b4-a6cc-ef3825e02f1f.lovable.app`

### Detalles técnicos
- Se usará la herramienta de migración para crear la tabla
- Se usará `add_secret` para configurar `ALLOWED_ORIGINS`
- Se añadirá una política RLS restrictiva (service_role only) para proteger los registros de eventos procesados

