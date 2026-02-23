
# Iteracion 2: Pagina de seleccion curada `/mi-seleccion`

## Resumen

Reemplazar el placeholder actual de `/mi-seleccion` con la pagina completa e interactiva de seleccion personalizada. El usuario ve sus productos recomendados organizados por etapa, puede cambiar, quitar o anadir productos, y ve el precio total en tiempo real.

---

## Archivos nuevos (5 componentes)

### 1. `src/components/configurator/SelectionSidebar.tsx`
- Panel sticky (solo desktop) con:
  - Titulo "Tu seleccion" + contador de productos
  - Lista de productos con nombre, precio y boton X para quitar
  - Precio total en formato grande (ej: "139EUR/mes")
  - Boton CTA "Contratar ahora"
  - Bloque "Incluye siempre": Limpieza UV-C, Entrega en casa, Cambios gratis, Soporte experto

### 2. `src/components/configurator/ProductCardSelected.tsx`
- Card para producto preseleccionado por la recomendacion
- Check verde, nombre, marca, precio/mes, shortReason
- Boton "Cambiar producto" que abre/cierra un Collapsible con alternativas de la misma categoria
- Alternativas muestran: nombre, precio, diferencia de precio, shortReason
- Al seleccionar alternativa: llama a `swapProduct`, cierra el collapsible
- Opcion "No necesito esto" para quitar el producto

### 3. `src/components/configurator/ProductCardSuggested.tsx`
- Card para producto NO seleccionado (etapa 4-8 meses)
- Estilo mas tenue (borde gris punteado, sin check)
- Nombre, precio, shortReason
- Boton "+ Anadir a mi seleccion" -> llama a `addProduct`
- Si ya esta seleccionado, cambia a estilo seleccionado con boton "Quitar"

### 4. `src/components/configurator/CategorySection.tsx`
- Wrapper que agrupa una categoria (ej: "Movilidad")
- Icono de categoria + titulo
- Renderiza ProductCardSelected si hay producto seleccionado de esa categoria, o ProductCardSuggested si no

### 5. `src/components/configurator/StickyMobileBar.tsx`
- Barra fija en la parte inferior (solo movil, useIsMobile)
- Muestra: numero de productos, precio total, boton "Contratar"
- Solo visible si hay al menos 1 producto seleccionado

---

## Archivo modificado

### 6. `src/pages/Selection.tsx` (reescritura completa)
- Recibe answers y recommended IDs del state de navegacion (desde Configurator)
- Reconstruye los productos recomendados usando getProductById
- Obtiene sugerencias de etapa 4-8 con getStageSuggestions()
- Inicializa useSelection con los productos recomendados
- Muestra buildSituationSummary(answers) como subtitulo
- Layout desktop: grid 2 columnas (sidebar 1/3 + contenido 2/3)
- Layout movil: contenido full-width + StickyMobileBar abajo
- Contenido organizado en 2 bloques:
  - "Etapa 0-4 meses": secciones de movilidad, descanso, porteo, extras (solo categorias con producto)
  - "Etapa 4-8 meses": alimentacion, extras-4-8 (como sugerencias)
- Footer con enlace "Ver catalogo completo" -> /catalogo
- Analytics: track recommendation_view al montar

---

## Interacciones detalladas

- **Cambiar**: Collapsible abre lista de alternativas de la misma categoria. Al seleccionar, swapProduct + cierre
- **Quitar**: X en sidebar o "No necesito esto" en card -> removeProduct
- **Anadir sugerido**: boton en card sugerida -> addProduct
- **Precio**: se recalcula en tiempo real en sidebar (desktop) y barra inferior (movil)
- **Checkout**: por ahora abre WhatsApp con mensaje que incluye lista de productos seleccionados

---

## Detalles tecnicos

- Usa useIsMobile() existente para responsive
- Usa useSelection() existente para estado (addProduct, removeProduct, swapProduct, totalPrice, productList)
- Usa Collapsible de radix-ui (ya instalado) para acordeon de alternativas
- Usa PRODUCT_CATALOG, CATEGORY_LABELS, getProductById, getProductsByCategory del catalogo existente
- Usa buildSituationSummary y getStageSuggestions de recommendationEngine existente
