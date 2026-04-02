

## Plan: Email de confirmación post-pago + página de unsubscribe

El dominio `notify.bebloo.es` está configurado (pendiente DNS, pero eso no bloquea el scaffolding ni el deploy). La infraestructura de email (colas pgmq, cron, tablas) ya existe. Falta scaffoldear las Edge Functions transaccionales, crear el template y conectar el webhook.

---

### Paso 1 — Scaffold de email transaccional
- Ejecutar la herramienta de scaffold transaccional para crear las Edge Functions (`send-transactional-email`, `handle-email-unsubscribe`, `handle-email-suppression`) y la estructura base de templates.

### Paso 2 — Template `order-confirmation.tsx`
- Crear en `_shared/transactional-email-templates/`
- Contenido en español con branding bebloo (colores `#A7D9FF`, coral `#F77F77`, fuente DM Sans):
  - Saludo personalizado ("¡Gracias, {nombre}!")
  - Tabla con desglose: nombre del producto, duración (meses), precio/mes, subtotal
  - Total pagado destacado
  - Mensaje de bienvenida y próximos pasos
- Registrar en `registry.ts`

### Paso 3 — Trigger desde stripe-webhook
- En `stripe-webhook/index.ts`, tras crear la suscripción y el envío en BD:
  - Obtener el email del usuario desde `profiles` (usando `serviceClient`)
  - Invocar `send-transactional-email` con:
    - `templateName: 'order-confirmation'`
    - `recipientEmail` del perfil
    - `idempotencyKey: order-confirm-${session.id}`
    - `templateData` con productos, duraciones, precios y total (extraídos de los metadatos de Stripe + catálogo de precios del checkout)

### Paso 4 — Página `/unsubscribe`
- Crear `src/pages/Unsubscribe.tsx` con diseño bebloo
- Lee el token de la URL, valida via GET al Edge Function, muestra botón de confirmación o estados de error
- Añadir ruta en `App.tsx`

### Paso 5 — Deploy
- Desplegar `send-transactional-email`, `handle-email-unsubscribe`, `handle-email-suppression`, y `stripe-webhook`

### Archivos afectados
- `supabase/functions/_shared/transactional-email-templates/order-confirmation.tsx` — nuevo
- `supabase/functions/_shared/transactional-email-templates/registry.ts` — actualizar
- `supabase/functions/stripe-webhook/index.ts` — añadir trigger de email
- `src/pages/Unsubscribe.tsx` — nuevo
- `src/App.tsx` — añadir ruta `/unsubscribe`

### Nota
Los emails empezarán a enviarse automáticamente una vez se complete la verificación DNS del dominio `notify.bebloo.es`. Mientras tanto, quedarán encolados.

