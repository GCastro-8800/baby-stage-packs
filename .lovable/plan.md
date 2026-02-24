
# Mejoras: botones funcionales, 4 etapas, y flujo catalogo-seleccion coherente

## Resumen

Tres problemas a resolver:

1. **Botones Calendly/WhatsApp**: El numero de WhatsApp en el checkout es falso (34600000000). Hay que cambiarlo al real (34638706467). Calendly ya apunta a la URL correcta.
2. **4 etapas en vez de 2**: Ampliar de 2 etapas (0-4, 4-8) a 4 etapas (0-4, 4-8, 8-12, 12-24 meses). Esto requiere nuevos tipos, nuevos productos para las etapas 8-12 y 12-24, y actualizar la logica de agrupacion en catalogo y seleccion.
3. **Flujo catalogo -> seleccion**: Actualmente, el boton "Anadir a mi seleccion" en el catalogo navega a `/mi-seleccion` perdiendo el estado previo. Hay que implementar un carrito compartido que persista entre paginas, o permitir anadir productos directamente desde el catalogo con un toast de confirmacion y un mini-carrito visible.

---

## Cambios detallados

### 1. WhatsApp real en CheckoutOptionsDialog

**`src/components/configurator/CheckoutOptionsDialog.tsx`**:
- Cambiar `34600000000` por `34638706467` (el numero real ya usado en `WhatsAppButton.tsx`)

### 2. Ampliar a 4 etapas

**`src/data/productCatalog.ts`**:
- Cambiar el tipo `ProductStage` a `"0-4" | "4-8" | "8-12" | "12-24" | "ambas"`
- Anadir etapas `"8-12"` y `"12-24"` a `STAGE_LABELS`
- Anadir nuevos productos para las etapas 8-12 y 12-24:
  - **8-12 meses (exploradores)**: Parque de actividades (tipo extras), andador de empuje, valla de seguridad
  - **12-24 meses (caminantes)**: Triciclo evolutivo, cama Montessori, torre de aprendizaje
- Actualizar algunos productos existentes que aplican a las nuevas etapas (ej: mochilas portabebe que sirven hasta 12-24, tronas que van de 4-24)

**`src/pages/Selection.tsx`**:
- Ampliar las constantes de categorias por etapa para incluir las 4 etapas
- Renderizar las 4 secciones de etapa

**`src/pages/Catalog.tsx`**:
- Actualizar `groupByStage` para manejar las 4 etapas
- Renderizar las 4 secciones

### 3. Flujo coherente catalogo <-> seleccion

El problema actual: al pulsar "Anadir a mi seleccion" en `/catalogo`, navegas a `/mi-seleccion` y se pierde cualquier seleccion previa (el estado solo vive en memoria de la pagina Selection).

**Solucion**: Usar `localStorage` para persistir la seleccion entre paginas.

**`src/hooks/useSelection.ts`**:
- Al inicializar, leer productos guardados de `localStorage` (key: `bebloo_selection`)
- Cada vez que cambian `selectedProducts` o `durations`, guardar en `localStorage`
- Si llega con `initialProducts` (del cuestionario), estos tienen prioridad y sobrescriben el localStorage
- Funcion de merge: si llega un `preselectedProduct` desde el catalogo, se anade a los existentes

**`src/pages/Selection.tsx`**:
- Leer `location.state.preselectedProduct` y pasarlo a `useSelection` para que lo anade
- Los productos previos se mantienen gracias al localStorage

**`src/components/catalog/CatalogProductCard.tsx`**:
- Cambiar la navegacion: en vez de navegar a `/mi-seleccion`, guardar el producto directamente en localStorage y mostrar un toast de confirmacion
- Anadir un boton/enlace "Ver mi seleccion (X productos)" como toast action
- Importar toast de sonner

**`src/pages/Catalog.tsx`**:
- Anadir un mini-badge flotante o banner superior que muestre cuantos productos hay en la seleccion
- Con enlace a `/mi-seleccion`

---

## Archivos a modificar

1. `src/components/configurator/CheckoutOptionsDialog.tsx` - Numero WhatsApp real
2. `src/data/productCatalog.ts` - 4 etapas + nuevos productos
3. `src/hooks/useSelection.ts` - Persistencia en localStorage
4. `src/pages/Selection.tsx` - 4 secciones de etapa + merge de preseleccion
5. `src/pages/Catalog.tsx` - 4 etapas + indicador de seleccion
6. `src/components/catalog/CatalogProductCard.tsx` - Anadir al carrito sin navegar + toast

## Archivos sin cambios
- `src/lib/constants.ts` - Las duraciones y descuentos no cambian
- `src/components/configurator/CheckoutOptionsDialog.tsx` - Solo cambia el numero
