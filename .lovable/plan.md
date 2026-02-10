
## Registro obligatorio en el flujo de plan + email con seleccion de productos

### Objetivo

Cuando un usuario pulsa "Continuar" en la pagina de equipamiento, si no tiene cuenta se le obliga a crearla o iniciar sesion antes de avanzar. Una vez autenticado, se le envia un email automatico con los productos que ha seleccionado. Ademas, se redisena la seccion de contacto (Step 2) eliminando el divisor "o bien" y reorganizando las 3 opciones de contacto al mismo nivel.

### Cambios propuestos

**1. Interceptar "Continuar" con comprobacion de autenticacion**

En `PlanDetail.tsx`, al pulsar "Continuar":
- Si el usuario NO esta autenticado: redirigir a `/auth` pasando como estado la ruta de retorno (`/plan/:planId`) y las selecciones actuales (via `location.state`)
- Si el usuario SI esta autenticado: avanzar al Step 2 como ahora

En `Auth.tsx`, tras login/signup exitoso:
- Si viene de un plan (detectado via `location.state`), redirigir de vuelta a `/plan/:planId` restaurando las selecciones
- El onboarding se saltaria en este flujo (o se pospone), ya que el objetivo inmediato es completar la seleccion de productos

**2. Guardar selecciones en el estado de navegacion**

Al redirigir a `/auth`, pasar las selecciones en `location.state`:
```text
{ from: "/plan/comfort", selections: { "Carrito::Bugaboo Fox 5": true, ... } }
```

Al volver de `/auth`, `PlanDetail.tsx` lee `location.state` y restaura las selecciones, avanzando directamente al Step 2.

**3. Enviar email con productos seleccionados**

Crear o ampliar la edge function para enviar un email al usuario recien registrado/autenticado con:
- Confirmacion de que su cuenta esta creada
- Lista de los productos que ha preseleccionado
- Mensaje invitando a continuar el proceso

Esto se dispara automaticamente al llegar al Step 2 con usuario autenticado.

**4. Redisenar ContactSection (Step 2)**

Eliminar el divisor "o bien" y la seccion separada de "Comprobar disponibilidad". Reorganizar en 3 opciones al mismo nivel visual:

1. **WhatsApp** - Habla directamente con nosotros (como esta ahora)
2. **Reserva una llamada** - Calendly (como esta ahora)  
3. **Dejanos tu email** - Nuevo: formulario simple (solo codigo postal) que guarda un lead vinculado al usuario autenticado y envia el email de confirmacion con los productos

Las 3 opciones aparecen como tarjetas iguales en un grid de 3 columnas (o apiladas en movil).

### Detalle tecnico

**Archivos a modificar:**

- `src/pages/PlanDetail.tsx` -- Importar `useAuth`. En `handleContinue`, comprobar si `user` existe; si no, `navigate("/auth", { state: { from: location.pathname, selections } })`. Al montar, si hay `location.state.selections`, restaurarlas y avanzar a step 2.

- `src/pages/Auth.tsx` -- Ajustar la redireccion post-login: si `from` apunta a `/plan/:planId`, redirigir alli con `state.selections` preservadas en vez de ir a `/app`. Saltar el onboarding en este caso (el usuario puede completarlo mas tarde).

- `src/components/plan/ContactSection.tsx` -- Eliminar el bloque "o bien" (lineas 131-136) y la seccion de "Comprobar disponibilidad". Reemplazar con un grid de 3 tarjetas iguales: WhatsApp, Calendly, y "Dejanos tus datos" (formulario con codigo postal que guarda lead vinculado al user_id).

- `supabase/functions/send-confirmation-email/index.ts` -- Ampliar para aceptar un parametro opcional `selectedProducts: string[]` y renderizarlos en el cuerpo del email como lista HTML.

- **Migracion de base de datos** -- Anadir columna `user_id uuid references auth.users(id)` (nullable) a la tabla `leads` para vincular leads con usuarios registrados. Anadir columna `selected_products text[]` (nullable) para guardar la lista de productos seleccionados.

**Sin cambios en:** onboarding flow, dashboard, landing page, ni componentes UI base.
