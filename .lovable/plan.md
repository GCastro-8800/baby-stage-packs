## Qué voy a hacer

Yo genero dos cadenas aleatorias seguras (32 bytes hex cada una), las guardo como secretos del backend y arreglo el código para que use esos secretos correctamente. Tú no tienes que copiar ni pegar nada.

## Pasos

### 1. Generar y guardar los secretos
- Generar `PICKUP_TOKEN_SECRET` (64 caracteres hex aleatorios) → guardar como secreto del backend.
- Generar `CRON_SECRET` (64 caracteres hex aleatorios) → guardar como secreto del backend.

Ambos quedan almacenados de forma segura, accesibles solo desde las edge functions. Nadie los ve, ni siquiera tú (ni falta hace).

### 2. Eliminar el fallback inseguro de los pickup tokens
En `supabase/functions/schedule-pickup/index.ts` y `supabase/functions/process-expired-subscriptions/index.ts`:
- Quitar la cadena `"fallback-pickup-secret"` y el fallback a `STRIPE_WEBHOOK_SECRET`.
- Si `PICKUP_TOKEN_SECRET` no está configurado, la función falla con error 500 en lugar de usar un valor público.

### 3. Proteger las 3 funciones cron
Añadir validación de header `X-Cron-Secret` en:
- `supabase/functions/check-expiring-subscriptions/index.ts`
- `supabase/functions/process-expired-subscriptions/index.ts`
- `supabase/functions/send-pickup-reminders/index.ts`

Cualquier petición sin ese header (o con valor incorrecto) recibe HTTP 401. Esto cierra el agujero de "cualquiera en internet puede disparar envíos masivos".

### 4. Actualizar los cron jobs de la base de datos
Los `cron.schedule` actuales hacen `net.http_post` a esas funciones sin enviar el header secreto. Hay que actualizarlos para que incluyan `X-Cron-Secret: <valor>` en sus headers. Esto se hace con un SQL de actualización (no migración, porque contiene el secreto real).

### 5. Verificación post-deploy
- Disparar manualmente cada cron desde el panel admin (o esperar el siguiente tick) y verificar en logs que se ejecutan correctamente.
- Hacer un curl externo sin header para confirmar que devuelve 401.

## Lo que NO toco

- Las otras vulnerabilidades del scan (RLS de `pickup_tokens`, política redundante en `user_roles`, función SECURITY DEFINER pública, listado de bucket público) — son warnings menores, los abordamos en otra vuelta si quieres.
- El `STRIPE_WEBHOOK_SECRET` sigue intacto, solo dejo de reutilizarlo para firmar pickup tokens.

## Resultado

- Pickup tokens firmados con secreto real único, sin fallback público.
- Cron endpoints cerrados al exterior — solo el cron interno de la base de datos puede llamarlos.
- Cero acción manual por tu parte.