

# Actualizar precios del catalogo con datos reales

## Cambio de modelo de precios

El sistema actual usa un `pricePerMonth` unico por producto y aplica descuentos porcentuales (5%, 10%, 15%, 20%, 30%) segun la duracion. Los datos reales muestran precios fijos por producto y duracion, que no siguen un porcentaje uniforme.

Ademas, las duraciones cambian: se anade **1 mes** y se elimina **9 meses**.

## Datos extraidos de la tabla

```text
Producto                    | 1m  | 3m  | 6m  | 12m | 24m
----------------------------|-----|-----|-----|-----|----
Bugaboo Fox 3               | 70  | 67  | 60  | 48  | 34
Bugaboo Donkey 3            | 90  | 86  | 77  | 62  | 43
Bugaboo Dragonfly           | 80  | 76  | 68  | 55  | 38
Joolz Aer 2                 | 75  | 71  | 64  | 51  | 36
Babyzen YOYO2               | 55  | 52  | 47  | 38  | 26
Stokke Sleepi Mini          | 60  | 57  | 51  | 34  | 24
Moises mimbre               | 50  | 48  | 43  | 34  | 24
BabyBjorn Bliss/Balance     | 40  | 38  | 34  | 27  | 19
Bugaboo Giraffe (hamaca)    | 40  | 38  | 34  | 27  | 19
Boba Wrap                   | 25  | 24  | 21  | 17  | 12
Cambiador mimbre            | 35  | 33  | 30  | 24  | 17
Ergobaby Omni               | 40  | 38  | 34  | 27  | 19
BabyBjorn Balance Soft      | 40  | 38  | 34  | 27  | 19
BabyBjorn Harmony           | 45  | 43  | 38  | 31  | 22
Nuna LEAF Grow              | 45  | 43  | 38  | 31  | 22
Stokke Tripp Trapp          | 45  | 43  | 38  | 31  | 22
Bugaboo Giraffe (trona)     | 50  | 48  | 43  | 34  | 24
```

Por favor confirma si estos datos son correctos antes de implementar.

## Cambios tecnicos

### 1. `src/data/productCatalog.ts`
- Anadir campo `prices: Record<number, number>` a la interfaz `Product` con claves `{1, 3, 6, 12, 24}`
- Reemplazar `pricePerMonth` por el precio de 1 mes (se mantiene por compatibilidad) y anadir `prices`
- Actualizar todos los 17 productos con los precios reales

### 2. `src/lib/constants.ts`
- Cambiar `DURATION_OPTIONS`: quitar 9 meses, anadir 1 mes
- Nuevo orden: `[1, 3, 6, 12, 24]`
- Eliminar `discount` de las opciones (ya no se usan porcentajes)
- Cambiar `DEFAULT_DURATION` de 6 a 3 (el minimo)
- Reescribir `getDiscountForMonths` -> no se necesita mas, pero se puede mantener por compatibilidad

### 3. `src/hooks/useSelection.ts`
- Cambiar `getDiscountedPrice` para que lea directamente de `product.prices[months]` en vez de calcular con porcentaje

### 4. Componentes que muestran precio base
- `CatalogProductCard.tsx`: mostrar `product.prices[3]` (precio minimo) en vez de `pricePerMonth`
- `ProductCardSuggested.tsx`: igual
- `SelectionSidebar.tsx`: ya usa `getDiscountedPrice`, solo verificar

### 5. Componentes con chips de duracion
- `SelectionSidebar.tsx` y `StickyMobileBar.tsx`: los chips ya iteran `DURATION_OPTIONS`, se actualizan automaticamente al cambiar las constantes

## Archivos a modificar

1. `src/data/productCatalog.ts` - Precios reales por duracion
2. `src/lib/constants.ts` - Duraciones 1/3/6/12/24 sin porcentajes
3. `src/hooks/useSelection.ts` - Leer precio directo de `prices`
4. `src/components/catalog/CatalogProductCard.tsx` - Mostrar precio desde 3m
5. `src/components/configurator/ProductCardSuggested.tsx` - Idem

