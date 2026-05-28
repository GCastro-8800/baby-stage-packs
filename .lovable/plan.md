## Contexto

Has rotado `CRON_SECRET` en Lovable Cloud. Las **edge functions** (`check-expiring-subscriptions`, `process-expired-subscriptions`, `send-pickup-reminders`, `send-cart-recovery-emails`) ya leen el secret en tiempo real desde el entorno, así que automáticamente usan el valor nuevo — no hay que tocar su código.

El problema: los **cron jobs de Postgres** que invocan esas funciones no leen el secret del entorno. Leen una **copia** guardada en `vault.secrets` con el nombre `cron_secret` (creada en abril). Esa copia sigue teniendo el valor viejo, por lo que las llamadas programadas empezarán a fallar con 401 hasta que la actualicemos.

## Plan

1. **Tú me pasas el nuevo valor de `CRON_SECRET`** (el mismo que acabas de poner en Lovable Cloud → Connectors → Secrets). Pégalo en el chat cuando aprobemos esto.
2. Ejecuto una migración que llama a `vault.update_secret(...)` para reemplazar el valor guardado en `vault.secrets` (entrada `cron_secret`).
3. Verifico que el cambio se aplicó leyendo `vault.decrypted_secrets` (sólo para confirmar que `updated_at` cambió, no se mostrará el valor).
4. Disparo manualmente una de las cron functions con el nuevo header para confirmar respuesta `200 ok` en lugar de `401 Unauthorized`.

## Notas técnicas

- No se cambia el código de las edge functions: ya hacen `Deno.env.get("CRON_SECRET")` y comparan con `timingSafeEqual`.
- No se modifican los `cron.job` schedules: siguen leyendo `vault.decrypted_secrets WHERE name = 'cron_secret'`. Sólo se actualiza el contenido de ese registro.
- El valor que me pases se usará una sola vez para la migración y no quedará en texto plano en el histórico (lo enviaré a través de `vault.update_secret`, que cifra).
- Las otras 16 secrets del proyecto no se tocan.

## Riesgos

- Si el valor que pegues no coincide exactamente con el que está en Lovable Cloud, los crons devolverán 401 hasta corregirlo.
- Mientras tanto (entre rotación y este paso), los crons del día siguiente fallarían — por eso conviene hacerlo ya.
