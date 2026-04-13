

## Plan: Eliminar BabyBjörn Balance Soft del catálogo

Eliminar el producto "BabyBjörn Balance Soft" de todos los lugares donde aparece:

### Archivos a modificar

1. **`src/data/productCatalog.ts`** — Eliminar el import de la imagen y el objeto del producto del array `PRODUCT_CATALOG`
2. **`supabase/functions/stripe-checkout/index.ts`** — Eliminar la entrada del mapa de precios
3. **`src/data/packStages.ts`** — Eliminar la opción "Balance Soft" del array `comfortHamacas`

### Limpieza

4. **Eliminar el archivo de imagen** `src/assets/products/babybjorn-balance-soft.png` (ya no se necesita)

No hay referencias en defaults ni en el recommendation engine, por lo que la eliminación es limpia.

