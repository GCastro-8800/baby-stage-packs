
# Conectar el boton "Continuar" de la ultima etapa con la pantalla de checkout

## Problema

Cuando el usuario termina la ultima etapa de un pack y pulsa "Continuar", el codigo navega a `/plan/${pack.id}`. Pero la ruta `/plan/:planId` esta redirigida a `/packs/:packId` (el `PlanRedirect` en App.tsx), asi que el usuario vuelve a la pagina de seleccion de etapas en vez de llegar a la pantalla de checkout con Stripe, WhatsApp y Calendly.

La pantalla de checkout (`PlanDetail.tsx`) existe y funciona bien, pero no es accesible porque la ruta esta interceptada por el redirect.

## Solucion

Restaurar la ruta `/plan/:planId` para que muestre `PlanDetail` directamente (como antes), y pasar las selecciones del pack al componente para que el resumen y el checkout reflejen lo que el usuario eligio.

## Cambios tecnicos

### 1. `src/App.tsx`
- Eliminar el componente `PlanRedirect` y su ruta `/plan/:planId`
- Restaurar la ruta `/plan/:planId` apuntando a `<PlanDetail />`
- Mantener la ruta `/packs/:packId` como esta

### 2. `src/pages/PackStageProducts.tsx` (linea 175)
- En `handleContinue`, cuando no hay mas etapas, navegar a `/plan/${pack.id}` pasando las selecciones globales del pack en el state:
  ```
  navigate(`/plan/${pack.id}`, {
    state: { selections: getSelectedItemsForCheckout(pack) }
  });
  ```
- Crear una funcion auxiliar que convierta las selecciones globales del hook en el formato `Record<string, boolean>` que espera `PlanDetail`

### 3. `src/hooks/usePackSelections.ts`
- Exponer una funcion `getSelectedItemsList(pack)` que devuelva un array de strings con los items seleccionados (formato `"categoria::modelo"`) de todas las etapas, para pasarlos al checkout

### 4. `src/pages/PlanDetail.tsx`
- Sin cambios significativos: ya acepta `selections` via location state y muestra el `CheckoutStep` con la lista de productos seleccionados
