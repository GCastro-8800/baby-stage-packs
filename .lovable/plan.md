

## Reemplazar imagen del Joolz Aer 2 (y cualquier otra que venga en el ZIP)

El ZIP `wetransfer_joolz-aer2-png_2026-04-21_1633.zip` contiene, según su nombre y cabecera detectada, la imagen **Joolz Aer 2**. WeTransfer nombra el ZIP a partir del archivo principal, así que es muy probable que solo venga ese PNG. Aun así, al pasar a modo edición lo descomprimiré y trataré **todos** los archivos que aparezcan.

### Estrategia de matching (para cada PNG del ZIP)

Por cada imagen extraída comparo el nombre normalizado (minúsculas, sin acentos, espacios → `-`) contra el catálogo en `src/data/productCatalog.ts`:

| Nombre del archivo (ej.) | Producto destino | Asset reemplazado |
|---|---|---|
| `Joolz aer2.png` | `joolz-aer-2` | `src/assets/products/joolz-aer-2.png` |
| `Bugaboo Fox 3.png` | `bugaboo-fox-3` | `src/assets/products/bugaboo-fox-3.png` |
| `BabyBjorn Bliss.png` | `babybjorn-bliss` | `src/assets/products/babybjorn-bliss.png` |
| …y así con cada uno | … | … |

- Si un nombre **coincide** con un asset existente → lo **sobrescribo** (mismo path → no toco código, el import sigue funcionando).
- Si un nombre **no coincide** con ningún producto → lo trato como **producto nuevo**:
  1. Lo guardo en `src/assets/products/<slug>.png`.
  2. Añado un nuevo objeto al `PRODUCT_CATALOG` con `id`, `name`, `brand`, `category` (la mejor inferida; si es ambigua te pregunto), `stage` (`ambas` por defecto si no es claro), `prices` siguiendo la matriz fija del proyecto, `description` y `image`.
- Si vienen **dos archivos para el mismo producto** (duplicados) → te aviso al final con la lista y uso el primero por orden alfabético.

### Lo que voy a entregar tras la ejecución

- ZIP descomprimido en `/tmp/joolz/`.
- Listado real de archivos contenidos.
- Tabla final con: `archivo → producto → acción (reemplazado / nuevo / duplicado / sin match)`.
- Si hay productos nuevos: el diff exacto añadido a `productCatalog.ts` con precios siguiendo la convención existente (te confirmaré la categoría/stage si tengo dudas antes de añadirlo).

### Lo que NO se toca

- Imports y código TypeScript de productos cuyo asset solo se sobrescribe (mismo path).
- Otras imágenes del catálogo no incluidas en el ZIP.
- `productCatalog.ts` solo se modifica si aparecen productos nuevos.
- Componentes que consumen el catálogo (`CatalogProductCard`, `Configurator`, packs, etc.).

### Verificación post-cambio

- `/catalogo` → la card del Joolz Aer 2 (y cualquier otro reemplazado) muestra la nueva imagen.
- Sección "Misión" sigue mostrando la foto YOYO anterior (no relacionada con este cambio).
- Vite reprocesa los PNG automáticamente al guardar; si el navegador cachea, hard reload.

