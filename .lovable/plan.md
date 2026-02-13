

# Fase 2: Suscripcion con pago via Stripe

Actualmente, cuando un usuario selecciona un plan y su equipamiento, llega a una pagina de contacto (WhatsApp, Calendly, email). Para que puedan suscribirse directamente, integraremos Stripe Checkout con pagos recurrentes mensuales.

## Flujo del usuario

```text
/plan/:planId (selecciona equipamiento)
  -> Click "Suscribirme" (requiere login)
  -> Se crea una sesion de Stripe Checkout (suscripcion mensual)
  -> Usuario paga en Stripe
  -> Stripe envia webhook
  -> Backend crea suscripcion + primer envio automaticamente
  -> Usuario vuelve a /app y ve su suscripcion activa
```

## Que se va a hacer

### 1. Habilitar Stripe
- Conectar la integracion nativa de Stripe en Lovable con tu clave secreta

### 2. Crear productos y precios en Stripe
- Tres precios recurrentes mensuales:
  - BEBLOO Start: 59 EUR/mes
  - BEBLOO Comfort: 129 EUR/mes
  - BEBLOO Total Peace: 149 EUR/mes

### 3. Backend function: crear sesion de Checkout
- Recibe: planId, equipamiento seleccionado, userId
- Crea (o recupera) un cliente de Stripe asociado al usuario
- Genera una sesion de Stripe Checkout en modo suscripcion
- Devuelve la URL de pago

### 4. Backend function: webhook de Stripe
- Escucha el evento `checkout.session.completed`
- Verifica la firma del webhook para seguridad
- Crea automaticamente una fila en `subscriptions` y un primer `shipment` programado
- Escucha `customer.subscription.deleted` para cancelar suscripciones

### 5. Actualizar la pagina del plan (paso 2)
- Reemplazar la seccion de contacto actual por dos opciones:
  - Boton principal "Suscribirme" que inicia el pago con Stripe
  - Seccion secundaria "Prefiero hablar primero" con las opciones de contacto actuales (WhatsApp, Calendly, email)
- Esto mantiene ambos caminos: pago directo y contacto humano

### 6. Pagina de exito post-pago
- Crear una pagina `/checkout/success` que confirme la suscripcion y redirija al dashboard

## Archivos a crear o modificar

| Accion | Archivo |
|--------|---------|
| Crear | Backend function `stripe-checkout` |
| Crear | Backend function `stripe-webhook` |
| Crear | `src/pages/CheckoutSuccess.tsx` |
| Modificar | `src/pages/PlanDetail.tsx` - paso 2 ahora ofrece pago |
| Modificar | `src/components/plan/ContactSection.tsx` - reorganizar como opcion secundaria |
| Modificar | `src/App.tsx` - nueva ruta /checkout/success |

## Seccion tecnica

### Stripe Checkout Session
La funcion `stripe-checkout` usara la API de Stripe para crear un `checkout.session` en modo `subscription` con el `price_id` correspondiente al plan. Los productos seleccionados se guardaran como metadata en la sesion para que el webhook pueda crear el envio con los items correctos.

### Webhook
La funcion `stripe-webhook` verificara la firma (`stripe-signature` header) usando el webhook secret. Al recibir `checkout.session.completed`, insertara en `subscriptions` (plan, etapa prenatal por defecto, estado activo) y en `shipments` (primer envio programado a 7 dias) usando el service role key para bypass de RLS.

### Mapeo Stripe-Usuario
Se guardara el `stripe_customer_id` en la tabla `profiles` (nueva columna) para vincular el cliente de Stripe con el usuario de la app. Esto requiere una migracion sencilla.

### Seguridad
- El webhook verifica la firma de Stripe antes de procesar cualquier evento
- Las inserciones en la base de datos se hacen con service role (solo desde el backend)
- El usuario debe estar autenticado para crear una sesion de checkout

