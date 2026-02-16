
# Corregir validacion de deseleccion: usar conteo global

## Problema

En `PackStageProducts.tsx` linea 110, la validacion usa `localSelectedCount` (solo cuenta productos de la etapa actual). Si el usuario tiene productos seleccionados en otras etapas pero solo 1 en la etapa actual, no puede quitarlo aunque globalmente tenga suficientes. Esto afecta a todos los packs (Start, Comfort, Total Peace).

## Cambio

**Archivo:** `src/pages/PackStageProducts.tsx`

- Linea 110: cambiar `localSelectedCount <= 1` por `globalCounts.selectedCount <= 1`
- Eliminar la variable `localSelectedCount` (linea 73) ya que no se usa en otro lugar

Solo es un cambio de una linea de logica. La variable `globalCounts` ya existe y cuenta los productos seleccionados en todas las etapas del pack.
