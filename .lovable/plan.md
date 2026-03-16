

## Fix: Imágenes de producto demasiado pequeñas en el catálogo

### Problema
En `CatalogProductCard`, el contenedor de imagen es `aspect-square` (ocupa todo el ancho de la tarjeta), pero `ProductImagePlaceholder` aplica tamaños fijos internos (`w-20 h-20 md:w-24 md:h-24`) antes del `className` override. Tailwind no garantiza que `w-full h-full` sobreescriba esas clases fijas, así que la imagen queda pequeña y centrada en un espacio grande vacío.

### Solución

**`src/components/configurator/ProductImagePlaceholder.tsx`**
- Cuando se pasa `className` que contiene `w-full` o `h-full`, NO aplicar las `sizeClasses` fijas — dejar que el className externo controle el tamaño
- Forma más limpia: añadir un tamaño `"full"` que no aplique restricciones de ancho/alto fijas

```text
size="sm"  → w-16 h-16
size="md"  → w-20 h-20 md:w-24 md:h-24
size="full" → (sin restricción, usa className del padre)
```

Esto corrige el catálogo sin romper los demás usos (sidebar del configurador, selección) que usan `sm` o `md`.

**`src/components/catalog/CatalogProductCard.tsx`**
- Cambiar `size="md"` a `size="full"` para que la imagen ocupe todo el `aspect-square`

### Archivos a modificar
| Archivo | Cambio |
|---|---|
| `src/components/configurator/ProductImagePlaceholder.tsx` | Añadir `size="full"` que no aplica clases de tamaño fijas |
| `src/components/catalog/CatalogProductCard.tsx` | Usar `size="full"` |

