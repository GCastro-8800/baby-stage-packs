

# Fase 2: Stripe - Crear todo sin conectar la API todavia

Vamos a preparar toda la infraestructura para que cuando conectes Stripe, todo funcione automaticamente.

## Que se va a hacer

### 1. Migracion de base de datos
- Agregar columna `stripe_customer_id` a la tabla `profiles` para vincular usuarios con clientes de Stripe

### 2. Backend function: `stripe-checkout`
- Recibe `planId`, equipamiento seleccionado, y el token del usuario autenticado
- Crea o recupera un cliente de Stripe usando el email del usuario
- Genera una sesion de Stripe Checkout en modo suscripcion con el precio correspondiente
- Guarda el equipamiento seleccionado como metadata para que el webhook lo use despues
- Devuelve la URL de pago
- Por ahora usara un placeholder para el `STRIPE_SECRET_KEY` (fallara hasta que conectes Stripe)

### 3. Backend function: `stripe-webhook`
- Verifica la firma del webhook (`stripe-signature` header) con `STRIPE_WEBHOOK_SECRET`
- Al recibir `checkout.session.completed`: crea la suscripcion + primer envio programado a 7 dias
- Al recibir `customer.subscription.deleted`: cancela la suscripcion en la base de datos
- Usa el service role para bypass de RLS

### 4. Actualizar pagina del plan (paso 2)
- El paso 2 ahora muestra dos secciones:
  - **Principal**: Boton "Suscribirme" con resumen del plan y precio, que llama a la edge function y redirige a Stripe
  - **Secundaria**: "Prefiero hablar primero" con las opciones de contacto actuales (WhatsApp, Calendly, email)

### 5. Pagina de exito post-pago
- Nueva ruta `/checkout/success` que confirma la suscripcion y redirige al dashboard
- Nueva ruta en `App.tsx`

## Archivos a crear o modificar

| Accion | Archivo |
|--------|---------|
| Crear | `supabase/functions/stripe-checkout/index.ts` |
| Crear | `supabase/functions/stripe-webhook/index.ts` |
| Crear | `src/pages/CheckoutSuccess.tsx` |
| Modificar | `src/pages/PlanDetail.tsx` - paso 2 ofrece pago + contacto |
| Modificar | `src/components/plan/ContactSection.tsx` - se convierte en seccion secundaria |
| Modificar | `src/App.tsx` - nueva ruta `/checkout/success` |
| Migracion | Agregar `stripe_customer_id` a `profiles` |

## Que falta para que funcione en produccion
- Conectar tu clave secreta de Stripe (la pediremos cuando estes listo)
- Configurar el `STRIPE_WEBHOOK_SECRET` en los secrets
- Crear los 3 productos/precios en Stripe y poner sus IDs en la edge function (o crearlos programaticamente)

## Seccion tecnica

### Mapeo de precios
La edge function `stripe-checkout` tendra un mapeo de `planId` a `price_id` de Stripe. Inicialmente usara placeholders (`price_xxx`) que se actualizaran cuando crees los productos en Stripe.

### Flujo de autenticacion
El boton "Suscribirme" verifica si el usuario esta logueado. Si no, redirige a `/auth` con el estado actual (selecciones + ruta de retorno), igual que el flujo existente.

### Webhook seguridad
La funcion `stripe-webhook` se configurara sin verificacion JWT (`verify_jwt = false`) ya que Stripe envia los eventos directamente. La seguridad se garantiza verificando la firma del webhook.

### Metadata en la sesion
El equipamiento seleccionado se pasa como metadata de la sesion de Stripe para que el webhook pueda crear el primer envio con los items correctos.

