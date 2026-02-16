
# Corregir deseleccion y precios dinamicos en categorias "choice"

## Problema

Las categorias "choice" no se pueden deseleccionar y los precios no cambian dinamicamente. En etapas del Pack Comfort que solo tienen productos "choice" (Etapa 1 y Etapa 2), el usuario no puede quitar ningun producto.

## Solucion

Agregar un estado `selectedChoice` que permita incluir/excluir categorias "choice" de la suscripcion, con la misma logica de modal de advertencia que ya existe para productos "fixed".

## Cambios en `src/pages/PackStageProducts.tsx`

### 1. Nuevo estado `selectedChoice`

Agregar un `Set<string>` que rastrea que categorias choice estan incluidas (todas por defecto).

### 2. Corregir `isPackComplete` (linea 56)

De: `fixedKeys.every(k => selectedFixed.has(k))`
A: `fixedKeys.every(k => selectedFixed.has(k)) && choiceCategories.every(c => selectedChoice.has(c.category))`

### 3. Corregir `selectedCount` (linea 74)

De: `selectedFixed.size + choiceCategories.length`
A: `selectedFixed.size + selectedChoice.size`

### 4. Corregir `calculateIndividualTotal` (lineas 66-69)

Las categorias choice solo suman su precio individual si estan en `selectedChoice`.

### 5. Corregir `productBreakdown` (linea 101)

De: `included: true`
A: `included: selectedChoice.has(cat.category)`

### 6. Reset en cambio de etapa (lineas 44-51)

Agregar `setSelectedChoice(new Set(choiceKeys))` al useEffect.

### 7. Nuevo handler `handleChoiceToggle`

Misma logica que `handleFixedToggle`: al deseleccionar abre modal de advertencia, al re-seleccionar agrega de vuelta.

### 8. Corregir `handleConfirmDeselect` y `handleFixedToggle`

Unificar para que funcionen tanto con categorias fixed como choice. Se agrega un campo `type` al estado `pendingDeselect` para saber de que set eliminar.

### 9. UI: Agregar checkbox a categorias choice

Debajo del RadioGroup de cada categoria choice, agregar un checkbox "Incluir en mi suscripcion". Cuando la categoria esta deseleccionada, el RadioGroup se muestra con opacidad reducida.

## Resultado esperado

- Cada categoria (fixed o choice) tiene un checkbox para incluir/excluir
- Deseleccionar cualquier categoria abre el modal de advertencia con impacto en precio
- El precio del footer se actualiza dinamicamente
- El pack se marca como "completo" solo cuando TODAS las categorias estan seleccionadas
