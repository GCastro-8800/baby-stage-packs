

# Simplificacion del flujo de compra + Tutorial de bienvenida

## Problema actual

El flujo de compra tiene **4 paginas** con muchas decisiones complicadas:

1. **Landing** (elige plan) -> **PackDetail** (elige etapa) -> **PackStageProducts** (configura productos por etapa, repitiendo para cada etapa) -> **PackCheckout** (paga)

Problemas especificos:
- La pagina PackDetail (etapas) es un paso intermedio que no aporta valor al usuario: solo muestra 2-3 botones para ir a otra pagina
- PackStageProducts obliga al usuario a entender conceptos como "fixed vs choice", "precio en pack vs individual", "pack completo vs incompleto"
- Los modales de deseleccion con comparativas de precios generan ansiedad
- El usuario debe navegar entre etapas manualmente, recordando lo que selecciono en cada una
- Demasiada informacion de precios (3 precios distintos por producto)

## Solucion: Flujo simplificado en 2 pasos

### Paso 1: Eliminar la pagina PackDetail (etapas)

En vez de mostrar las etapas como paginas separadas, **fusionar todo en una sola pagina con tabs/accordion**. El usuario ve todos los productos de todas las etapas en una sola vista.

### Paso 2: Simplificar la seleccion de productos

- **Por defecto, todo viene seleccionado** (ya funciona asi)
- En vez de checkboxes + modales de deseleccion + warnings complejos, mostrar los productos como una **lista limpia con la opcion de cambiar variante** (cuando hay opciones)
- Eliminar la logica de "pack completo vs incompleto" de la UI visible — el precio siempre sera el del pack
- Si el usuario quiere quitar algo, simplemente lo desmarca sin modal de confirmacion
- Simplificar la informacion de precios: mostrar solo el precio del pack por producto

### Nuevo flujo

```text
Landing (elige plan)
    |
    v
Pagina unica de configuracion (/packs/:packId)
    - Tabs horizontales por etapa (Etapa 0, Etapa 1, Etapa 2)
    - Productos mostrados como cards simples
    - Seleccion de variante con selector simple (dropdown o radio visual)
    - Resumen de precio fijo abajo
    - Boton "Suscribirme" directo
    |
    v
Checkout (/packs/:packId/checkout)
    - Sin cambios significativos
```

Esto reduce de **4 paginas** a **2 paginas** (configuracion + checkout).

## Tutorial de bienvenida (post-login)

Un tour guiado que aparece **una sola vez** despues de que el usuario crea cuenta o inicia sesion por primera vez. Se controlara con un campo `has_seen_tutorial` en la tabla `profiles`.

### Implementacion del tutorial

- Componente `WelcomeTutorial` tipo **modal paso a paso** (3-4 slides)
- Se muestra en la pagina `/app` (dashboard) cuando `profile.has_seen_tutorial === false`
- Contenido de los pasos:
  1. "Bienvenido a Bebloo" - explicacion rapida del servicio
  2. "Elige tu plan" - como funciona la seleccion de equipamiento
  3. "Nosotros nos encargamos" - explicacion de entregas y etapas
  4. "Empieza ahora" - CTA para explorar los packs
- Al cerrar o completar, se actualiza `has_seen_tutorial = true` en profiles
- No vuelve a aparecer nunca mas

## Cambios tecnicos detallados

### Base de datos
- Anadir columna `has_seen_tutorial boolean DEFAULT false` a la tabla `profiles`

### Archivos a modificar

**`src/pages/PackDetail.tsx`** — Reescritura completa:
- Eliminar la lista de cards de etapas
- Implementar vista unificada con tabs (`Tabs` de Radix) por etapa
- Dentro de cada tab, mostrar los productos como cards simples
- Incluir selector de variante (radio visual compacto para categorias tipo "choice")
- Checkbox simple para incluir/excluir sin modal de confirmacion
- Footer sticky con precio total y boton "Continuar al pago"

**`src/pages/PackStageProducts.tsx`** — Eliminar o redirigir:
- Esta pagina ya no es necesaria, su logica se integra en PackDetail
- Redirigir `/packs/:packId/etapa/:stageId` a `/packs/:packId`

**`src/hooks/usePackSelections.ts`** — Simplificar:
- Mantener la logica de selecciones pero simplificar los calculos de precio
- Inicializar todas las etapas de golpe en vez de una por una

**`src/components/packs/StickyPriceFooter.tsx`** — Simplificar:
- Eliminar la logica de "pack completo vs incompleto"
- Mostrar precio total simple + boton de continuar

**`src/components/packs/DeselectionModal.tsx`** — Eliminar:
- Ya no se necesita modal de confirmacion para deseleccionar

**`src/components/packs/LowProductWarning.tsx`** — Eliminar:
- Ya no se necesita el warning de pocos productos

**`src/App.tsx`** — Actualizar rutas:
- Eliminar o redirigir la ruta `/packs/:packId/etapa/:stageId`

### Tutorial (archivos nuevos)

**`src/components/dashboard/WelcomeTutorial.tsx`** — Nuevo:
- Modal con 3-4 pasos tipo carousel
- Indicador de progreso (dots)
- Boton "Siguiente" / "Empezar"
- Al completar, llama a Supabase para actualizar `has_seen_tutorial`

**`src/pages/AppDashboard.tsx`** — Modificar:
- Importar y renderizar `WelcomeTutorial` condicionalmente cuando `profile.has_seen_tutorial === false`

