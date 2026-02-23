

# Cambio de modelo: De packs fijos a productos individuales

## Resumen

Transformar completamente el modelo de negocio de la web: pasar de 3 packs fijos (Start, Comfort, Total Peace) a un modelo de productos individuales con recomendacion personalizada basada en un cuestionario. El precio final es la suma de los productos elegidos por el usuario.

---

## Fase 1: Datos - Nuevo catalogo de productos

### Archivo nuevo: `src/data/productCatalog.ts`

Crear el catalogo unificado de productos individuales con la estructura:

```typescript
interface Product {
  id: string;               // e.g. "bugaboo-fox-5"
  name: string;             // "Bugaboo Fox 5"
  brand: string;
  category: "movilidad" | "descanso" | "porteo" | "alimentacion" | "extras";
  stage: "0-4" | "4-8" | "ambas";
  pricePerMonth: number;    // precio individual €/mes
  description: string;
  shortReason?: string;     // "Ultraligero (6kg)"
  image?: string;
}
```

16 productos segun el pricing proporcionado:
- Movilidad: Bugaboo Fox 5 (99), Bugaboo Dragonfly (99), Joolz Aer 2 (79), Babyzen YOYO3 (69)
- Descanso: Stokke Sleepi (75), Chicco Next2Me (29)
- Porteo: Hamaca Nuna LEAF (49), Hamaca BabyBjorn (19), Mochila Ergobaby (22), Mochila BabyBjorn (15)
- Alimentacion: Trona Bugaboo Giraffe (39), Trona Stokke Tripp Trapp (34)
- Extras: Monitor premium (17), Monitor basico (9), Alfombra Toddlekind (25), Cambiador (9)

### Archivo nuevo: `src/data/recommendationEngine.ts`

Logica de recomendacion basada en respuestas del cuestionario:

```typescript
interface QuestionnaireAnswers {
  dueDate: string | "already-born";
  housing: "small-apartment" | "spacious" | "no-elevator";
  concerns: string[];    // multi-select
  existingEquipment: "nothing" | "some" | "specific";
}

function getRecommendation(answers: QuestionnaireAnswers): Product[]
```

Reglas:
- Sin ascensor / apto pequeno -> Joolz Aer 2
- Presupuesto ajustado -> Babyzen YOYO3 + Chicco Next2Me
- Quiero lo mejor -> Bugaboo Fox 5 + Stokke Sleepi
- Empiezo de cero -> 4-5 productos basicos
- Tengo cosas -> 2-3 esenciales
- Siempre incluir en etapa 0-4: 1 carrito + 1 cuna + 1 porteo + 1 monitor
- Mostrar pero NO seleccionar etapa 4-8: trona + alfombra

---

## Fase 2: Paginas nuevas

### Pagina: `/configurador` - `src/pages/Configurator.tsx`

Cuestionario de 4 preguntas (una por pantalla en movil). Al completar, navega a la pagina de seleccion pasando las respuestas y la recomendacion via state.

Preguntas:
1. Cuando nace tu bebe (fecha / "ya nacio")
2. Donde vives (3 opciones radio)
3. Que te preocupa mas (multi-select, 4 opciones)
4. Ya tienes equipamiento (3 opciones)

Componentes internos:
- `QuestionnaireStep` - renderiza cada pregunta
- `StepIndicator` - progreso visual (reutilizar el existente de onboarding)

### Pagina: `/mi-seleccion` - `src/pages/Selection.tsx`

Layout principal del nuevo modelo:

**Desktop:** Sidebar sticky izquierdo (resumen + CTA) + contenido scrolleable derecho (productos por etapa)

**Mobile:** Contenido scrolleable + sticky bottom bar con precio total y CTA

Contenido organizado por etapas:
- Etapa 0-4 meses: Movilidad, Descanso, Porteo, Basicos
- Etapa 4-8 meses: Alimentacion, Juego (mostrados pero no seleccionados)

Interacciones:
- Producto seleccionado: card con check verde, boton "Cambiar producto" que abre acordeon con alternativas de la misma categoria
- Producto no seleccionado: card gris con boton "+ Anadir"
- Quitar producto: desde la card o desde el sidebar (X)
- Precio total se recalcula en tiempo real

Componentes nuevos:
- `src/components/configurator/SelectionSidebar.tsx` - sidebar sticky con resumen
- `src/components/configurator/ProductCardSelected.tsx` - card de producto seleccionado
- `src/components/configurator/ProductCardSuggested.tsx` - card de producto sugerido (no seleccionado)
- `src/components/configurator/StickyMobileBar.tsx` - barra inferior movil
- `src/components/configurator/CategorySection.tsx` - seccion por categoria con acordeon de alternativas

### Pagina: `/catalogo` - `src/pages/Catalog.tsx`

Alternativa para usuarios que no quieren cuestionario. Grid de todos los productos con filtros por categoria y rango de precio. Cada producto tiene boton para anadir a seleccion.

---

## Fase 3: Modificaciones a paginas existentes

### `src/pages/Index.tsx`
- Eliminar PricingSection (los 3 packs)
- Reemplazar por una seccion simplificada que invite al configurador
- Mantener: Hero, BrandLogos, HowItWorks, Mission, Comparison, FAQ, Testimonials, Footer

### `src/components/Hero.tsx`
- Cambiar titulo: "Equipamiento para tu bebe. Curado por expertos."
- Cambiar subtitulo: "Sin decisiones equivocadas. Sin espacio ocupado. Sin estres de reventa."
- CTA principal: "Descubre que necesitas" -> navega a `/configurador`
- Eliminar referencia a "packs" y "Desde 59/mes"

### `src/components/HowItWorksSection.tsx`
- Paso 1: "Elige tu pack" -> "Cuentanos tu situacion"
- Paso 3: eliminar referencia a "pack de la siguiente etapa"

### `src/components/Header.tsx`
- Cambiar nav link "Precios" por "Productos" (-> `/catalogo`)
- CTA "Empezar" -> navega a `/configurador`

### `src/components/FloatingCTA.tsx`
- Cambiar texto y accion: "Descubre que necesitas" -> navega a `/configurador`

### `src/components/dashboard/PlanRecommenderDialog.tsx`
- Adaptar para redirigir al configurador en vez de a packs

### `src/App.tsx`
- Anadir rutas: `/configurador`, `/mi-seleccion`, `/catalogo`
- Mantener rutas de packs temporalmente (redirect a configurador)

---

## Fase 4: Estado y hook

### `src/hooks/useSelection.ts`

Nuevo hook para gestionar la seleccion de productos:

```typescript
interface SelectionState {
  selectedProducts: Map<string, Product>;  // productId -> Product
  questionnaireAnswers?: QuestionnaireAnswers;
  totalPrice: number;  // calculado
}

// Funciones: addProduct, removeProduct, swapProduct, clearAll, getTotalPrice
```

Almacenamiento en memoria (igual que usePackSelections actual). El estado persiste mientras navegas entre configurador, seleccion y catalogo.

---

## Fase 5: Checkout actualizado

### `src/pages/SelectionCheckout.tsx` (o reutilizar PackCheckout adaptado)

- Mostrar lista de productos seleccionados con precio individual
- Total = suma de precios
- Misma estructura de pago (Stripe / WhatsApp / Calendly)
- Pasar array de product IDs al backend

---

## Fase 6: Limpieza (despues de validar)

Archivos a deprecar/eliminar eventualmente:
- `src/components/PricingSection.tsx`
- `src/components/DurationSelector.tsx`
- `src/data/planEquipment.ts` (reemplazado por productCatalog)
- `src/data/packStages.ts`
- `src/data/packsByStage.ts`
- `src/hooks/usePackSelections.ts`
- `src/components/packs/*` (todos los componentes de packs)
- `src/pages/PackDetail.tsx`
- `src/pages/PackStageProducts.tsx`
- `src/pages/PackStageRedirect.tsx`
- `src/pages/PackCheckout.tsx`
- `src/components/EmailCaptureModal.tsx`
- `src/components/SurveySection.tsx` (si ya no aplica)

---

## Fase 7: Analytics

Eventos a trackear:
- `configurator_start` - usuario entra al cuestionario
- `configurator_complete` - completa las 4 preguntas
- `recommendation_view` - ve su seleccion curada
- `product_swap` - cambia un producto por otro
- `product_add` - anade un producto sugerido
- `product_remove` - quita un producto
- `selection_checkout` - va al checkout
- `catalog_view` - entra al catalogo

---

## Orden de implementacion sugerido

Dado el tamano del cambio, sugiero dividirlo en 3-4 iteraciones:

**Iteracion 1:** Datos + Configurador (cuestionario)
- productCatalog.ts, recommendationEngine.ts
- Pagina /configurador con las 4 preguntas
- Ruta en App.tsx

**Iteracion 2:** Pagina de seleccion curada
- /mi-seleccion con sidebar + productos por etapa
- useSelection hook
- Interacciones: cambiar, anadir, quitar

**Iteracion 3:** Catalogo + Checkout + Adaptacion home
- /catalogo con grid y filtros
- Checkout adaptado
- Actualizar Hero, Header, HowItWorks, FloatingCTA

**Iteracion 4:** Limpieza
- Eliminar packs, PricingSection, archivos obsoletos
- Actualizar copy en toda la web

---

## Copy y messaging

Terminologia a usar:
- "Tu seleccion" (no "pack")
- "Equipamiento curado" (no "sistema")
- "Lo que necesitas" (no "alquiler")
- "Recomendacion personalizada"

Tono: experto pero cercano, tranquilizador, "te guiamos" no "te vendemos"

