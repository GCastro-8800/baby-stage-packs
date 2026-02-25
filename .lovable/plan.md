
# Actualizar catalogo de productos: solo los 17 productos finales

## Resumen

Reemplazar todo el catalogo actual con exactamente los 17 productos que habeis definido. Esto implica:
- Renombrar productos existentes (Fox 5 -> Fox 3, YOYO3 -> YOYO2, etc.)
- Anadir nuevos (Bugaboo Donkey 3, BabyBjorn Harmony)
- Eliminar todos los que no estan en la lista (Chicco Lite Way, monitores, alfombra, parque, andador, valla, torre, cama Montessori, etc.)
- Actualizar categorias para reflejar la nueva estructura: carrito, cuna, trona, hamaca, porteo, cambiador

## Productos finales (17)

| Producto | Categoria | ID |
|---|---|---|
| Bugaboo Fox 3 | movilidad | bugaboo-fox-3 |
| Bugaboo Donkey 3 | movilidad | bugaboo-donkey-3 |
| Bugaboo Dragonfly | movilidad | bugaboo-dragonfly |
| Joolz Aer 2 | movilidad | joolz-aer-2 |
| Babyzen YOYO2 | movilidad | babyzen-yoyo2 |
| Stokke Sleepi Mini | descanso | stokke-sleepi-mini |
| Moises mimbre | descanso | moises-mimbre |
| Stokke Tripp Trapp | alimentacion | trona-stokke-tripp-trapp |
| Bugaboo Giraffe (trona) | alimentacion | trona-bugaboo-giraffe |
| BabyBjorn Bliss/Balance | porteo | babybjorn-bliss |
| Bugaboo Giraffe (hamaca) | porteo | bugaboo-giraffe-hamaca |
| Nuna LEAF Grow | porteo | nuna-leaf-grow |
| BabyBjorn Balance Soft | porteo | babybjorn-balance-soft |
| BabyBjorn Harmony | porteo | babybjorn-harmony |
| Ergobaby Omni | porteo | ergobaby-omni |
| Boba Wrap | porteo | boba-wrap |
| Cambiador mimbre | extras | cambiador |

## Productos a ELIMINAR

- Chicco Lite Way, Triciclo Evolutivo Liki, Chicco Next2Me, Cama Montessori, Nuna LEAF (la no-Grow), BabyBjorn Air, BabyBjorn One, Monitor premium, Monitor basico, Alfombra Toddlekind, Parque de actividades, Andador de empuje, Valla de seguridad, Torre de aprendizaje

## Cambios tecnicos

### `src/data/productCatalog.ts`
- Reescribir `PRODUCT_CATALOG` con exactamente los 17 productos
- Renombrar: Fox 5 -> Fox 3, YOYO3 -> YOYO2, Sleepi -> Sleepi Mini, Tripp Trapp Oak -> Tripp Trapp
- Anadir: Bugaboo Donkey 3 (nuevo carrito premium) y BabyBjorn Harmony (nueva hamaca)
- Cambiador pasa de marca "Leander" a "mimbre" (sin marca especifica)
- Mantener categorias existentes (movilidad, descanso, porteo, alimentacion, extras) - el cambiador queda en extras

### `src/data/recommendationEngine.ts`
- Actualizar IDs referenciados: `bugaboo-fox-5` -> `bugaboo-fox-3`, `babyzen-yoyo3` -> `babyzen-yoyo2`, `stokke-sleepi` -> `stokke-sleepi-mini`
- Eliminar referencias a productos borrados: `chicco-next2me`, `hamaca-nuna-leaf`, `babybjorn-air`, `monitor-premium`, `monitor-basico`
- Reemplazar con alternativas existentes: chicco-next2me -> moises-mimbre, hamaca-nuna-leaf -> nuna-leaf-grow, babybjorn-air -> ergobaby-omni
- Eliminar seccion de monitor (ya no existe)

### Otros archivos
- Verificar que `Selection.tsx` y `Catalog.tsx` no tengan IDs hardcodeados de productos eliminados
- El localStorage de seleccion del usuario podria tener productos viejos; el hook `useSelection` ya filtra por `getProductById` que devolveria undefined
