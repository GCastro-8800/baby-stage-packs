

# Persistir selecciones y precios entre etapas

## Problema

Cuando el usuario deselecciona productos en la Etapa 0 y avanza a la Etapa 1, las selecciones se pierden porque el estado se reinicia con el `useEffect` en linea 47. El precio vuelve al valor del pack completo como si nada hubiera cambiado.

## Solucion

Guardar las selecciones de cada etapa en un estado global (por packId) que persista al navegar entre etapas. El precio total del footer debe ser la suma acumulada de todas las etapas, no solo la actual.

## Cambios tecnicos

### 1. Crear hook `usePackSelections` (nuevo archivo: `src/hooks/usePackSelections.ts`)

Un hook con estado global (usando un modulo-level Map o React context) que almacena por cada pack:

```
{
  [stageId]: {
    selectedFixed: Set<string>,
    selectedChoice: Set<string>,
    variantChoices: Record<string, number>
  }
}
```

Funciones expuestas:
- `getStageSelections(stageId)` - obtener selecciones de una etapa
- `setStageSelections(stageId, selections)` - guardar selecciones de una etapa
- `isStageFullySelected(stageId)` - si todos los productos de esa etapa estan seleccionados
- `calculateTotalPrice(pack)` - precio total sumando todas las etapas
- `isPackComplete(pack)` - true solo si TODAS las etapas tienen TODOS los productos seleccionados
- `getGlobalProductBreakdown(pack)` - desglose de productos de todas las etapas

El estado se inicializa con todos los productos seleccionados (por defecto) la primera vez que se visita cada etapa.

### 2. Modificar `PackStageProducts.tsx`

- Importar y usar `usePackSelections` en lugar del estado local
- Eliminar el `useEffect` que resetea estado en cambio de `stageId` (lineas 47-55)
- Los estados `selectedFixed`, `selectedChoice`, `variantChoices` se leen/escriben a traves del hook
- Al hacer toggle o cambiar variante, se actualiza el hook que persiste los datos

### 3. Modificar `StickyPriceFooter` - mostrar precio global

El footer ahora recibira:
- `currentPrice`: precio total acumulado de TODAS las etapas (no solo la actual)
- `isPackComplete`: true solo si todas las etapas tienen todo seleccionado
- `products`: desglose de productos de TODAS las etapas
- `selectedCount` y `totalCount`: conteos globales

Esto permite que el usuario vea en todo momento el impacto real de sus decisiones en el precio final.

### 4. Precio de la etapa actual vs precio global

En la seccion de navegacion de cada etapa, se mostrara tambien un resumen del precio de esa etapa especifica para dar contexto. El footer siempre muestra el total global.

## Flujo del usuario

1. Entra a Etapa 0 - todo seleccionado, precio = pack completo (79 euros)
2. Deselecciona "Monitor" - precio sube a precio individual de los 2 restantes + etapa 1 (todo seleccionado)
3. Avanza a Etapa 1 - las selecciones de Etapa 0 se mantienen, el footer sigue mostrando el precio correcto
4. Si vuelve a Etapa 0 - ve sus selecciones anteriores intactas

## Consideracion sobre "pack completo"

El pack se considera completo solo cuando TODAS las etapas tienen TODOS sus productos seleccionados. Si falta un solo producto en cualquier etapa, todos los productos de todas las etapas pasan a precio individual (x3).

