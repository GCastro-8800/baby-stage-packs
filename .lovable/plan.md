# Sistema de Precios Dinamico con Deseleccion

## Resumen

Reemplazar los datos de productos ficticios con los productos reales del Excel, actualizar los precios de packs (79, 169, 199), y construir un sistema completo de precios dinamicos donde deseleccionar productos sube el precio dramaticamente, con modal de confirmacion, footer sticky, desglose expandible y toda la logica visual verde/naranja. Y que aparezcan los precios individuales por producto y que cambia tambien en función de los que selecciones. 

## Cambios en datos

### 1. packStages.ts — Reescribir con productos reales

Reemplazar completamente los productos con los del Excel. Cada producto tendra `coste_real_mes` y `precio_individual`. La distribucion por etapas segun el Excel:

**Pack Start (79 euros/mes)**

- Etapa 0: Chicco Next2Me (54.77), Cambiador portatil (32.40)
- Etapa 1: Chicco Lite Way (37.08), Hamaca Fisher Price (39.15)
- Etapa 2: Trona Chicco basica (41.92)
- Variantes elegibles: Joolz Aer 2 (61.25), YOYO3 (56.97), Boba Wrap (38.12)

**Pack Comfort (169 euros/mes)**

- Etapa 0: Stokke Sleepi Mini (96.68), Leander Matty (42.92)
- Etapa 1: Bugaboo Fox 5 (85.62), BabyBjorn Bliss (47.92), Ergobaby Omni (43.60)
- Etapa 2: Stokke Tripp Trapp (56.10), Alfombra Toddlekind (49.17)
- Variantes elegibles: Bugaboo Dragonfly (81.25), Bugaboo Giraffe trona (50.55), Bugaboo Giraffe hamaca (50.55), Boba Wrap (38.12), Totter & Tumble (46.25)

**Pack Total Peace (199 euros/mes)**

- Etapa 0: Stokke Sleepi Mini (96.68), Leander Matty (42.92), Monitor Angelcare (52.50)
- Etapa 1: Bugaboo Donkey 5 (90.00), Nuna LEAF Grow (79.18), BabyBjorn One Air (43.60)
- Etapa 2: Stokke Tripp Trapp (56.10), Alfombra Toddlekind (49.17)

### 2. planEquipment.ts — Actualizar tipo

Agregar `coste_real_mes` al tipo `EquipmentOption`. Agregar campo `isElegible` booleano para distinguir productos fijos (con checkbox) de variantes elegibles (con radio button).

### 3. PricingSection.tsx — Actualizar precios

Cambiar los precios de los planes: Start 79, Comfort 169, Total Peace 199.

## Nuevos componentes

### 4. DeselectionModal.tsx — Modal de confirmacion

Componente Dialog que se muestra al intentar desmarcar un producto. Muestra:

- Nombre del producto
- Precio pack completo vs precio sin ese producto
- Diferencia en euros
- Boton verde "Mantener producto" (accion principal)
- Boton gris "Quitar de todas formas"

### 5. StickyPriceFooter.tsx — Footer sticky

Barra fija en la parte inferior de la pantalla con:

- Precio actual (verde si pack completo, naranja si individual)
- Texto contextual ("Pack completo - Mejor oferta" vs "+XX euros mas caro")
- Boton CTA (verde "Continuar" vs naranja "Continuar de todas formas")
- Seccion expandible "Ver desglose de precios" usando Collapsible
- Lista de productos con "Incluido" o "XX euros/mes (individual)"

### 6. LowProductWarning.tsx — Banner de advertencia

Banner amarillo que aparece cuando quedan 1-2 productos seleccionados, mostrando el coste por producto vs el coste por producto en pack completo.

## Pagina principal modificada

### 7. PackStageProducts.tsx — Reescritura mayor

Cambios principales:

- **Productos fijos**: Cada uno con checkbox "Incluir en mi suscripcion", marcado por defecto. Al desmarcar se abre el DeselectionModal
- **Productos elegibles (variantes)**: Radio buttons en lugar de checkboxes. Siempre debe haber uno seleccionado. No se pueden deseleccionar
- **Textos dinamicos**: Verde "Incluido en pack" cuando pack completo, naranja "XX euros/mes" cuando hay deselecciones
- **Precio individual visible**: Cada producto muestra su precio individual cuando no es pack completo
- **Minimo 1 producto**: No permitir desmarcar el ultimo producto
- **Footer sticky**: Reemplaza el PriceSummary actual con StickyPriceFooter
- **Quitar FloatingCTA**: El StickyPriceFooter lo reemplaza

Estado gestionado:

- `selectedKeys`: Set de productos fijos seleccionados (checkboxes)
- `variantChoices`: Map de categoria a opcion elegida (radio buttons)
- `pendingDeselect`: producto pendiente de confirmar deseleccion (para el modal)

Calculo de precio:

- Si todos los fijos estan seleccionados: precio = packPrice
- Si falta alguno: precio = suma de precio_individual de cada producto seleccionado (fijos + variante elegida de cada categoria elegible)

## Analytics

### 8. useAnalytics.ts — Nuevos eventos

Agregar al whitelist:

- `product_deselect_attempt`: cuando intenta desmarcar
- `product_deselect_confirmed`: cuando confirma en modal
- `product_deselect_cancelled`: cuando cancela en modal

## Seccion tecnica

### Estructura de datos por categoria

Cada categoria en `packStages` tendra un nuevo campo `type`:

- `"fixed"`: Producto unico con checkbox. Se puede deseleccionar
- `"choice"`: Multiples opciones con radio buttons. No se puede deseleccionar, solo cambiar entre opciones

```text
{
  category: "Cuna",
  type: "fixed",   // checkbox
  options: [{ brand: "Chicco", model: "Next2Me", coste_real_mes: 15.91, precio_individual: 54.77 }]
}

{
  category: "Carrito",
  type: "choice",  // radio buttons
  options: [
    { brand: "Chicco", model: "Lite Way", coste_real_mes: 8.83, precio_individual: 37.08 },
    { brand: "Joolz", model: "Aer 2", coste_real_mes: 18.50, precio_individual: 61.25 }
  ]
}
```

### Logica de calculo de precio

```text
function calculatePrice(pack, selectedFixedKeys, variantChoices):
  allFixedSelected = every fixed category has its product selected
  
  if allFixedSelected:
    basePrice = pack.price  // 79, 169, or 199
    // Add upgrade cost if premium variant chosen
    for each choice category:
      chosen = variantChoices[category]
      if chosen has upgrade cost:
        basePrice += upgrade cost
    return { price: basePrice, isPackComplete: true }
  
  else:
    total = 0
    for each selected fixed product:
      total += product.precio_individual
    for each choice category:
      chosen = variantChoices[category]
      total += chosen.precio_individual
    return { price: total, isPackComplete: false }
```

### Archivos a crear


| Archivo                                      | Descripcion                         |
| -------------------------------------------- | ----------------------------------- |
| `src/components/packs/DeselectionModal.tsx`  | Modal de confirmacion al desmarcar  |
| `src/components/packs/StickyPriceFooter.tsx` | Footer sticky con precio y desglose |
| `src/components/packs/LowProductWarning.tsx` | Banner si quedan 1-2 productos      |


### Archivos a modificar


| Archivo                                 | Cambio                                                                    |
| --------------------------------------- | ------------------------------------------------------------------------- |
| `src/data/packStages.ts`                | Reescribir con productos reales, precios reales, campo type por categoria |
| `src/data/planEquipment.ts`             | Agregar coste_real_mes al tipo EquipmentOption                            |
| `src/pages/PackStageProducts.tsx`       | Reescribir con logica de fijos/elegibles, modal, footer sticky            |
| `src/components/packs/PriceSummary.tsx` | Puede eliminarse (reemplazado por StickyPriceFooter)                      |
| `src/components/PricingSection.tsx`     | Actualizar precios a 79, 169, 199                                         |
| `src/pages/PackDetail.tsx`              | Actualizar precio mostrado                                                |
| `src/hooks/useAnalytics.ts`             | Agregar nuevos tipos de evento                                            |
