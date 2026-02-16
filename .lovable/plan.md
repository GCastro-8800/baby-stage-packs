
# Simplificar modelo de precios: precio individual = precio en pack x 3

## Resumen

Eliminar el campo `coste_real_mes` de todos los productos y cambiar la formula de `precio_individual` a simplemente `precio_en_pack * 3`. Esto aplica a los packs Start, Comfort y Total Peace.

## Que cambia para el usuario

Nada visual cambia en la interfaz. El usuario sigue viendo:
- Precio en pack (lo que paga si tiene el pack completo)
- Precio sin pack (ahora siempre es exactamente el triple)
- La logica de deseleccion sigue igual

## Cambios tecnicos

### 1. Datos: `src/data/packStages.ts`

Eliminar `coste_real_mes` de todos los productos y actualizar `precio_individual` para que sea `precio_en_pack * 3`.

**Pack Start (4 productos):**

| Producto | precio_en_pack | precio_individual (nuevo) |
|----------|---------------|--------------------------|
| Chicco Next2Me | 31.58 | 94.74 |
| Cambiador portatil | 16.38 | 49.14 |
| Monitor audio | 15.51 | 46.53 |
| Chicco Lite Way | 15.63 | 46.89 |

**Pack Comfort (8 productos):**

| Producto | precio_en_pack | precio_individual (nuevo) |
|----------|---------------|--------------------------|
| Cuna (3 opciones) | 50.70 | 152.10 |
| Monitor | 13.70 | 41.10 |
| Cambiador (3 opciones) | 11.32 | 33.96 |
| Carrito (5 opciones) | 29.49 | 88.47 |
| Hamaca (4 opciones) | 14.83 | 44.49 |
| Mochila (4 opciones) | 15.34 | 46.02 |
| Trona (2 opciones) | 17.12 | 51.36 |
| Alfombra (3 opciones) | 16.51 | 49.53 |

**Pack Total Peace (8 productos):** Se actualizan con la misma formula (x3). Los valores de precio_en_pack se mantienen.

### 2. Tipo: `src/data/planEquipment.ts`

Eliminar `coste_real_mes` de la interfaz `EquipmentOption` (ya es opcional, pero lo quitamos para limpiar).

### 3. Sin cambios en UI

Los componentes `PackStageProducts.tsx`, `DeselectionModal.tsx`, `StickyPriceFooter.tsx` y `PriceSummary.tsx` ya usan solo `precio_en_pack` y `precio_individual`, por lo que no necesitan modificaciones.

## Verificacion

- Start: 31.58 + 16.38 + 15.51 + 15.63 = 79.10 (pack) vs 94.74 + 49.14 + 46.53 + 46.89 = 237.30 (individual)
- Comfort: suma precio_en_pack = 169.01 vs suma individual = 507.03
- Ratio siempre exacto: x3
