
# Gestion operativa: Admin manual + Suscripcion con pago

## Fase 1: Admin puede crear suscripciones y envios manualmente

Esta es la parte mas inmediata y te permite operar ya con los primeros clientes.

### Cambios en el panel admin

**Tab Suscripciones - Boton "Nueva suscripcion"**
- Dialog/formulario con:
  - Selector de usuario (dropdown con los perfiles registrados)
  - Selector de plan (Start / Comfort / Total Peace)
  - Etapa actual del bebe (prenatal, 0-3m, 3-6m, etc.)
  - Fecha del proximo envio
- Al guardar, se inserta directamente en la tabla `subscriptions`

**Tab Envios - Boton "Nuevo envio"**
- Dialog/formulario con:
  - Selector de suscripcion activa (muestra usuario + plan)
  - Etapa del envio
  - Fecha programada
  - Items del envio (agregar productos del catalogo existente en `planEquipment.ts`)
- Al guardar, se inserta en la tabla `shipments`

**Tab Suscripciones - Acciones por fila**
- Boton para pausar/reactivar/cancelar suscripcion
- Editar fecha de proximo envio

### Archivos a crear/modificar

| Accion | Archivo |
|--------|---------|
| Crear | `src/components/admin/CreateSubscriptionDialog.tsx` |
| Crear | `src/components/admin/CreateShipmentDialog.tsx` |
| Modificar | `src/components/admin/SubscriptionsTab.tsx` - agregar boton + acciones |
| Modificar | `src/components/admin/ShipmentsTab.tsx` - agregar boton |

No se necesitan cambios en la base de datos: las tablas `subscriptions` y `shipments` ya existen con las columnas necesarias, y las politicas RLS ya permiten a los admins hacer INSERT/UPDATE/DELETE.

---

## Fase 2: Flujo de pago con Stripe para usuarios

Permite que los usuarios se suscriban directamente desde la app.

### Flujo del usuario

```text
Usuario en /plan/:planId
  -> Selecciona equipamiento
  -> Click "Suscribirme"
  -> Se redirige a Stripe Checkout (suscripcion mensual)
  -> Stripe procesa el pago
  -> Webhook de Stripe notifica al backend
  -> Backend crea la suscripcion + primer envio automaticamente
  -> Usuario ve su suscripcion activa en /app
```

### Implementacion tecnica

1. **Habilitar Stripe** - Conectar la integracion de Stripe con tu clave secreta
2. **Crear productos/precios en Stripe** - Un precio recurrente por cada plan (Start 59EUR/mes, Comfort 129EUR/mes, Total Peace 149EUR/mes)
3. **Edge function para crear sesion de Checkout** - Recibe el plan seleccionado y el equipamiento elegido, crea una sesion de Stripe Checkout
4. **Webhook de Stripe** - Escucha eventos `checkout.session.completed` y `customer.subscription.deleted` para crear/cancelar suscripciones automaticamente en la base de datos
5. **Actualizar la pagina del plan** - Cambiar el boton de contacto por un boton de pago que inicia el flujo de Stripe

### Archivos a crear/modificar

| Accion | Archivo |
|--------|---------|
| Crear | Edge function para Stripe Checkout |
| Crear | Edge function webhook de Stripe |
| Modificar | `src/pages/PlanDetail.tsx` - boton de pago |
| Migrar | Tabla para mapear Stripe customer ID con user ID (opcional) |

---

## Orden recomendado

Sugiero empezar por la **Fase 1** (admin manual) porque:
- Es mas rapida de implementar (no requiere integracion externa)
- Te permite operar inmediatamente con los primeros clientes
- Puedes validar el flujo completo antes de automatizarlo

La Fase 2 (Stripe) se puede agregar despues cuando estes listo para escalar.

## Seccion tecnica

### Fase 1 - Detalles

Los dialogs de creacion usaran los componentes existentes de shadcn/ui (Dialog, Select, Input, Calendar). Las mutaciones se haran directamente con el cliente de la base de datos, aprovechando que las politicas RLS ya otorgan permisos completos a los administradores (`has_role(auth.uid(), 'admin')`).

Para el selector de usuarios, se consultara la tabla `profiles` filtrando usuarios que no tengan ya una suscripcion activa.

Para los items del envio, se reutilizara el catalogo de `src/data/planEquipment.ts` para que el admin seleccione los productos correctos segun el plan.

### Fase 2 - Detalles

Stripe se integrara usando la herramienta nativa de Lovable. Se crearan precios recurrentes mensuales para cada plan. El webhook verificara la firma de Stripe antes de procesar eventos, y usara el service role para insertar suscripciones y envios en la base de datos.
