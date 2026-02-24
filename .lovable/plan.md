
# Catalogo de productos - Pagina completa

## Resumen

Reemplazar el placeholder de `/catalogo` con una pagina de catalogo real tipo e-commerce. Muestra todos los productos del `PRODUCT_CATALOG` en un grid visual con filtros por categoria, organizados por etapa.

---

## Cambios

### 1. `src/pages/Catalog.tsx` - Reescritura completa

**Header de pagina:**
- Titulo "Todos los productos" + subtitulo "Explora nuestro catalogo de equipamiento premium para bebes"
- Banner CTA sutil: "No sabes por donde empezar? Te ayudamos a elegir" con enlace a `/configurador`

**Filtros:**
- Fila de chips/botones para filtrar por categoria: Todos, Movilidad, Descanso, Porteo y confort, Alimentacion, Basicos y extras
- Estado local `activeCategory` (null = todos)

**Grid de productos:**
- Organizados en 2 secciones: "Etapa 0-4 meses" y "Etapa 4-8 meses"
- Productos con `stage: "ambas"` aparecen en la seccion 0-4
- Grid responsive: 1 columna en movil, 2 en tablet, 3 en desktop
- Cada producto usa una card con:
  - `ProductImagePlaceholder` (componente existente) en formato cuadrado arriba
  - Nombre del producto (font-semibold)
  - Marca como badge sutil
  - Precio/mes destacado
  - Descripcion corta (1-2 lineas, line-clamp)
  - shortReason como chip
  - Boton "Anadir a mi seleccion" que navega a `/mi-seleccion` con el producto pre-seleccionado en el state

**Footer de pagina:**
- Texto "Quieres una recomendacion personalizada?" + boton al configurador

### 2. Nuevo componente: `src/components/catalog/CatalogProductCard.tsx`
- Card vertical tipo e-commerce
- Usa `ProductImagePlaceholder` (ya existente) para la imagen
- Layout: imagen arriba (aspect-square), info abajo
- Nombre, marca (badge), precio/mes, descripcion (line-clamp-2), shortReason
- Boton discreto "Ver mas" o click en toda la card para navegar a `/mi-seleccion`

---

## Detalles tecnicos

- Usa `PRODUCT_CATALOG`, `CATEGORY_LABELS`, `ProductCategory` del catalogo existente
- Usa `ProductImagePlaceholder` existente con `size="md"` y aspecto cuadrado
- Filtrado con `useState<ProductCategory | null>(null)`
- Productos filtrados con `getProductsByCategory()` o catalogo completo
- Agrupacion por etapa usando `getProductsByStage()`
- No requiere cambios en la base de datos ni en otros archivos
