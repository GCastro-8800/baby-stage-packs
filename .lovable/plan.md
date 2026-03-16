

## Plan: Añadir las 7 imágenes de producto faltantes

### Cambios

**1. Copiar 7 imágenes a `src/assets/products/`**

| Archivo subido | Destino |
|---|---|
| `Foto_Bugaboo_Fox_3_1.png` | `src/assets/products/bugaboo-fox-3.png` |
| `Foto_Joolz_Aer_2_1.png` | `src/assets/products/joolz-aer-2.png` |
| `Foto_Stokke_Sleepi_Mini_1.png` | `src/assets/products/stokke-sleepi-mini.png` |
| `Moises_Mimbre_1.png` | `src/assets/products/moises-mimbre.png` |
| `Stokke_Tripp_Trapp_1.png` | `src/assets/products/stokke-tripp-trapp.png` |
| `Foto_Bugaboo_Giraffe_hamaca_1.png` | `src/assets/products/bugaboo-giraffe-hamaca.png` |
| `Nuna_LEAF_Grow_1.png` | `src/assets/products/nuna-leaf-grow.png` |

**2. `src/data/productCatalog.ts`** -- Añadir 7 imports y asignar `image` a los productos correspondientes

- `bugaboo-fox-3` -> `imgFox3`
- `joolz-aer-2` -> `imgJoolzAer2`
- `stokke-sleepi-mini` -> `imgSleepiMini`
- `moises-mimbre` -> `imgMoisesMimbre`
- `trona-stokke-tripp-trapp` -> `imgTrippTrapp`
- `bugaboo-giraffe-hamaca` -> `imgGiraffeHamaca`
- `nuna-leaf-grow` -> `imgNunaLeaf`

Con esto, los 17 productos del catálogo tendrán imagen real.

