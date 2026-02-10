

## Preview modal para productos del equipamiento

### Objetivo

Permitir que el usuario vea una imagen y descripcion breve de cada producto antes de seleccionarlo, resolviendo el problema de que no todos conocen marcas como Bugaboo o Stokke.

### Cambios propuestos

**1. Ampliar los datos de producto en `src/data/planEquipment.ts`**

Anadir dos campos nuevos a `EquipmentOption`:
- `image`: URL de imagen del producto (ya existe el campo en la interfaz pero no se usa)
- `description`: descripcion corta de una linea (nuevo campo)

Rellenar estos datos para todos los productos del catalogo. Las imagenes seran URLs publicas de los fabricantes o placeholders iniciales.

**2. Crear componente `src/components/plan/ProductPreviewDialog.tsx`**

Un Dialog (usando el componente Dialog existente de shadcn) que muestra:
- Imagen del producto a tamano medio
- Nombre: marca + modelo
- Descripcion breve (1-2 lineas)
- Boton para cerrar

Se abre al pulsar un icono o enlace "Ver" junto al nombre del producto.

**3. Integrar en `src/components/plan/EquipmentSection.tsx`**

Anadir un boton sutil (icono de ojo o texto "Ver") en cada fila de producto que abre el dialog de preview. El checkbox sigue funcionando igual al hacer clic en la fila; el boton de preview es un elemento separado que no activa el toggle.

### Detalle tecnico

**Archivos a modificar:**

- `src/data/planEquipment.ts` -- Anadir campo `description` a la interfaz `EquipmentOption`. Rellenar `image` y `description` para cada producto.

- `src/components/plan/ProductPreviewDialog.tsx` (nuevo) -- Dialog con imagen, nombre y descripcion. Recibe `EquipmentOption | null` y un `open` boolean.

- `src/components/plan/EquipmentSection.tsx` -- Anadir estado local para el producto seleccionado en preview. Anadir boton de preview en cada fila (icono `Eye` o `Info` de Lucide) que hace `e.stopPropagation()` para no activar el checkbox. Renderizar el `ProductPreviewDialog`.

**Sin cambios en:** base de datos, rutas, analytics, ni otros componentes.
