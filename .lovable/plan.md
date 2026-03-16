
# Panel de gestion de cesta en movil

## Problema

En desktop existe el `SelectionSidebar` a la derecha que muestra todos los productos seleccionados con controles para eliminar, cambiar duracion y ver precios. En movil, este sidebar esta oculto y solo se muestra una barra fija inferior (`StickyMobileBar`) con el numero de productos, precio total y boton de contratar. No hay forma de ver ni gestionar los productos seleccionados en movil.

## Solucion

Convertir la barra movil inferior en un punto de acceso al carrito completo, usando un **Sheet** (drawer inferior) que muestre el mismo contenido que el sidebar de desktop.

## Cambios

### 1. `src/components/configurator/StickyMobileBar.tsx`

- Anadir un boton "Ver cesta" o hacer que la zona de texto (count + precio) sea clicable
- Al pulsar, abrir un Sheet (drawer) con el listado completo de productos
- Dentro del Sheet mostrar:
  - Lista de productos con nombre, marca, precio
  - Selectores de duracion por producto (chips de 3/6/9/12 meses)
  - Boton de eliminar por producto
  - Total mensual con ahorro
  - Nota de "Compromiso minimo: 3 meses"
  - Boton "Contratar ahora"
- Reutilizar la logica del `SelectionSidebar` adaptada al formato Sheet

### 2. `src/pages/Selection.tsx`

- Pasar las props necesarias al `StickyMobileBar`: `products`, `onRemove`, `getDuration`, `setDuration`, `getDiscountedPrice` (las mismas que recibe el sidebar)

## Detalle tecnico

El componente `StickyMobileBar` pasara de recibir solo `count`, `totalPrice` y `onCheckout` a recibir tambien la lista de productos y las funciones de gestion. Internamente usara el componente `Sheet` de shadcn/ui para el drawer. El contenido del drawer sera esencialmente el mismo markup que `SelectionSidebar` pero dentro de un `SheetContent` con scroll.

## Archivos a modificar

1. `src/components/configurator/StickyMobileBar.tsx` - Anadir Sheet con gestion completa de cesta
2. `src/pages/Selection.tsx` - Pasar props adicionales al StickyMobileBar
