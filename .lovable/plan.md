

## Plan: Reemplazar imágenes de productos

Mapeo de las 4 imágenes subidas a los archivos existentes:

| Imagen subida | Reemplaza a | Producto |
|---|---|---|
| `babybjorn_bliss-balance.png` | `src/assets/products/babybjorn-bliss.png` | BabyBjörn Bliss/Balance |
| `Bugaboo_dragonfly.png` | `src/assets/products/bugaboo-dragonfly.png` | Bugaboo Dragonfly |
| `bugaboo_fox_5.png` | `src/assets/products/bugaboo-fox-3.png` | Bugaboo Fox 3 |
| `bugaboo_giraffe.png` | `src/assets/products/trona-bugaboo-giraffe.png` | Bugaboo Giraffe (trona) |

### Implementacion

Copiar cada imagen subida sobre el archivo existente en `src/assets/products/`, manteniendo el mismo nombre de archivo para que los imports en `productCatalog.ts` sigan funcionando sin cambios de codigo.

