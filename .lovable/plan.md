

## Plan: Añadir vista de especificaciones desde la página de selección

### Objetivo
Permitir que los usuarios hagan clic en el nombre o imagen de cualquier producto en `/mi-seleccion` para ver el dialog de detalle con especificaciones completas (reutilizando `ProductDetailDialog` del catálogo).

### Cambios

**1. `src/components/configurator/ProductCardSelected.tsx`**
- Añadir prop `onPreview: (product: Product) => void`
- Hacer que la imagen y el nombre del producto sean clicables (cursor pointer, hover effect) y llamen a `onPreview(product)`

**2. `src/components/configurator/ProductCardSuggested.tsx`**
- Añadir prop `onPreview: (product: Product) => void`
- Hacer que la imagen y el nombre del producto sean clicables

**3. `src/components/configurator/CategorySection.tsx`**
- Pasar `onPreview` a `ProductCardSelected` y `ProductCardSuggested`
- Añadir prop `onPreview` en la interfaz

**4. `src/pages/Selection.tsx`**
- Importar `ProductDetailDialog` del catálogo
- Añadir estado `previewProduct` y `previewOpen`
- Pasar `onPreview` a cada `CategorySection`
- Renderizar `ProductDetailDialog` con el producto seleccionado
- El botón "Añadir" del dialog funciona con `addProduct`, el de "En tu selección" navega a la misma página (o simplemente cierra el dialog)

### Resultado
Los usuarios pueden tocar cualquier producto en la página de selección para ver imagen ampliada, descripción completa y tabla de especificaciones técnicas, sin salir de la página.

