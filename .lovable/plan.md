

## Fix: Dialog de producto con imagen demasiado grande y contenido solapado

### Problema
La imagen usa `aspect-square` dentro del dialog, ocupando casi toda la pantalla. El texto, badges y tabla de specs se solapan visualmente con la imagen porque no hay separación clara.

### Solución

**`src/components/catalog/ProductDetailDialog.tsx`**

1. Cambiar `aspect-square` a `aspect-[4/3]` en el contenedor de imagen para reducir la altura
2. Añadir `object-contain` a la imagen para que no se recorte
3. Reestructurar el padding: `p-0` en DialogContent, padding manual en header (`p-6 pb-0`) y contenido inferior (`px-4 pb-6`)
4. Añadir margen horizontal (`mx-4`) y bordes redondeados (`rounded-xl`) al contenedor de imagen para separarlo del borde del dialog
5. Fondo más sutil en la imagen (`bg-muted/20`)

Resultado: imagen proporcionada que no domina el dialog, con separación visual clara entre imagen, descripción y tabla de specs.

