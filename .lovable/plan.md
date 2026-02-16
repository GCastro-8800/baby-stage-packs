
# Actualizar Pack BEBLOO Comfort — 8 categorias, precios reales

## Resumen

Reemplazar los productos actuales del Pack Comfort con las 8 categorias correctas, cada una con sus opciones de marca/modelo y los precios unificados por categoria. El precio del pack sigue siendo 169 euros/mes.

## Estructura resultante

### Etapa 0 — Preparacion (3 categorias)

| Categoria | Tipo | Opciones | coste_real_mes | precio_en_pack | precio_individual |
|-----------|------|----------|---------------|----------------|-------------------|
| Cuna | choice | Chicco Next2Me, Stokke Sleepi V3, Moises de mimbre | 45.17 | 50.70 | 127.92 |
| Monitor | fixed | Monitor con camara premium | 12.21 | 13.70 | 45.52 |
| Cambiador | choice | Cambiador cesto mimbre, Zara Home, Leander Matty | 10.08 | 11.32 | 40.21 |

### Etapa 1 — Primeros meses (3 categorias)

| Categoria | Tipo | Opciones | coste_real_mes | precio_en_pack | precio_individual |
|-----------|------|----------|---------------|----------------|-------------------|
| Carrito | choice | Bugaboo Fox 5, Bugaboo Donkey 5, Bugaboo Dragonfly, Joolz Aer 2, Babyzen Yoyo 3 | 26.28 | 29.49 | 80.69 |
| Hamaca | choice | BabyBjorn Bliss, BabyBjorn Balance Soft, Bugaboo Giraffe, Nuna LEAF Grow | 13.21 | 14.83 | 48.02 |
| Mochila portabebe | choice | BabyBjorn One, BabyBjorn One Air, Ergobaby Omni, Boba Wrap | 13.67 | 15.34 | 49.17 |

### Etapa 2 — Crecimiento (2 categorias)

| Categoria | Tipo | Opciones | coste_real_mes | precio_en_pack | precio_individual |
|-----------|------|----------|---------------|----------------|-------------------|
| Trona | choice | Stokke Tripp Trapp, Bugaboo Giraffe | 15.25 | 17.12 | 53.12 |
| Alfombra de juego | choice | Toddlekind, Skip Hop Playspot Geo, Totter and Tumble | 14.71 | 16.51 | 51.77 |

## Verificacion de totales

- Suma precio_en_pack: 50.70 + 13.70 + 11.32 + 29.49 + 14.83 + 15.34 + 17.12 + 16.51 = **169.01** (1 centimo de redondeo, se usaran los valores exactos proporcionados)
- Suma coste_real_mes: 45.17 + 12.21 + 10.08 + 26.28 + 13.21 + 13.67 + 15.25 + 14.71 = **150.58**
- Margen con pack completo: 169 - 150.58 = **18.42 euros** (10.9%)

## Punto clave sobre opciones

Todas las opciones dentro de una categoria comparten los MISMOS tres precios (coste_real_mes, precio_en_pack, precio_individual). El usuario ve siempre el mismo precio sin importar que opcion elija. La diferencia de coste real entre opciones afecta solo al margen interno.

## Seccion tecnica

### Archivo a modificar

`src/data/packStages.ts` — Se reemplaza la seccion `comfort.stages` (lineas 77-156) con la nueva estructura de 3 etapas y 8 categorias de productos.

Cada opcion dentro de una categoria tendra los mismos valores de `coste_real_mes`, `precio_en_pack` y `precio_individual`, ya que el precio es por categoria, no por opcion especifica.

### Tipos de categoria

- **choice**: el usuario puede elegir entre varias marcas/modelos (7 categorias)
- **fixed**: solo hay una opcion disponible (1 categoria: Monitor)

### Sin cambios en otros archivos

La logica existente en `PackStageProducts.tsx`, `PriceSummary.tsx`, `DeselectionModal.tsx` y `StickyPriceFooter.tsx` ya soporta categorias choice/fixed con multiples opciones y el calculo de precios individuales vs pack.
