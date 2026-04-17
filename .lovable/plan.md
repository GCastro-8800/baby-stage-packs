
The user wants 4 UX improvements. Let me explore the current state to plan accurately.

Key findings from context:
- `useSelection` already persists to localStorage ('bebloo_selection') ✓ for #1 (anon persistence works)
- But: when user signs in, selection stays in localStorage only — no DB sync
- Header doesn't show a cart badge currently (need to verify)
- Onboarding flow asks situation/date — overlaps with questionnaire of /configurador
- `recommendationEngine.ts` returns `Product[]` with NO reasoning/justification
- After questionnaire → /mi-seleccion shows products but no "why this product" text

Plan structure: focused, scoped, achievable in one pass.

---

## Plan: Mejoras UX — Persistencia, no-repetición, recomendaciones justificadas

### 1. Carrito persistente y accesible globalmente

**Badge de carrito en Header (desktop + móvil)**
- Añadir icono `ShoppingBag` con contador en `Header.tsx`, visible en todas las páginas.
- Al hacer clic: abre un `Sheet` lateral con la selección actual (reutilizar lógica de `SelectionSidebar`), con botones "Ver selección completa" → `/mi-seleccion` y "Ir al checkout".
- Contador se alimenta del mismo `localStorage` (`bebloo_selection`) → leer con un nuevo hook ligero `useSelectionCount` que escucha el evento `storage` + un custom event `bebloo:selection-changed` que `useSelection` emitirá al cambiar.

**Sincronización local ↔ cuenta al iniciar sesión**
- Crear tabla `user_selections` (user_id, product_ids[], durations jsonb, updated_at) con RLS estándar (auth.uid() = user_id).
- Nuevo hook `useSelectionSync`: en `useAuth` cuando `user` pasa de null → definido:
  - Si hay selección en localStorage y NO hay registro en DB → subir localStorage a DB.
  - Si hay registro en DB y localStorage vacío → bajar a localStorage.
  - Si hay ambos → fusionar (unión de productos, prioridad a localStorage para duraciones más recientes).
- En cambios posteriores autenticados: `useSelection` hace upsert debounced (500ms) a `user_selections`.

### 2. Evitar preguntas repetitivas

**Detectar overlap onboarding ↔ configurador**
- Onboarding pregunta: situación (expecting/born) + fecha. Configurador pregunta: dueDate, vivienda, preocupaciones, equipamiento.
- Cambios:
  - Si el usuario completó onboarding (`profiles.onboarding_completed = true`) y su `children` tiene `situation` + `due_date`/`birth_date`, el cuestionario `/configurador` debe **prerellenar y saltar** el `DateStep`/situación → arrancar directamente en housing.
  - Guardar respuestas del cuestionario en localStorage (`bebloo_questionnaire`) y, si está autenticado, en una nueva columna `profiles.questionnaire_answers jsonb`. Al volver a `/configurador`, mostrar resumen "Última respuesta: X" con CTAs "Usar las mismas" / "Volver a empezar".
  - Lo mismo para `OnboardingFlow`: si `bebloo_questionnaire` tiene `dueDate`, prerellenar `DateStep` y `SituationStep`.

### 3. Recomendaciones justificadas

**Refactor `recommendationEngine.ts`**
- Cambiar `getRecommendation` para devolver `RecommendationResult[]`:
  ```ts
  interface RecommendationResult {
    product: Product;
    reasons: string[];        // ej: ["Ligero y plegable", "Ideal para sin ascensor"]
    matchedAnswers: string[]; // ej: ["housing:no-elevator", "concerns:tight-budget"]
  }
  ```
- Cada rama del engine añade su justificación inline (ej. carrito ligero por "no-elevator" → reasons: "Plegable de 6kg, perfecto para subir escaleras").

**UI en `/mi-seleccion`**
- Cuando viene del cuestionario (`hasState`), debajo del banner de "Selección basada en tu cuestionario" mostrar para cada producto recomendado un pequeño card explicativo:
  > "Hemos elegido **Joolz Aer 2** porque vives sin ascensor (pesa solo 6kg) y buscas calidad sin pasarte de presupuesto."
- Implementar como prop opcional `recommendation?: RecommendationResult` en `ProductCardSelected`, renderizando un `<div className="bg-primary/5 text-xs">` con icono `Info`.

### 4. Acceso directo a productos

- Tarjetas del catálogo (`CatalogProductCard`): añadir botón secundario "Añadir directo" además de "Ver detalle" — añade al carrito sin abrir diálogo (toast de confirmación).
- En recomendaciones del cuestionario: ya muestra productos, pero añadir botón "Ver ficha completa" debajo de la justificación que abre `ProductDetailDialog` directamente (ya soportado por `onPreview`).
- En el Sheet del carrito en Header: cada producto enlaza directamente a su ficha al hacer clic.

---

### Archivos a tocar

**Nuevos:**
- `src/hooks/useSelectionSync.ts`
- `src/hooks/useSelectionCount.ts`
- `src/components/CartSheet.tsx`
- `supabase/migrations/...` — tabla `user_selections` + columna `profiles.questionnaire_answers`

**Modificados:**
- `src/components/Header.tsx` — botón carrito + Sheet
- `src/hooks/useSelection.ts` — emitir custom event + integrar sync
- `src/hooks/useAuth.tsx` — disparar sync al login
- `src/data/recommendationEngine.ts` — devolver justificaciones
- `src/pages/Selection.tsx` — pasar recommendation a cards
- `src/components/configurator/ProductCardSelected.tsx` — render reasons
- `src/pages/Configurator.tsx` (cuestionario) — saltar pasos ya respondidos + persistencia
- `src/components/onboarding/OnboardingFlow.tsx` — prerellenar desde questionnaire
- `src/components/catalog/CatalogProductCard.tsx` — botón "Añadir directo"

### Cambios de DB (migración)

```sql
CREATE TABLE public.user_selections (
  user_id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  product_ids text[] NOT NULL DEFAULT '{}',
  durations jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.user_selections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own selection" ON public.user_selections
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.profiles ADD COLUMN questionnaire_answers jsonb;
```

### Fuera de alcance (post-launch)
- Compartir selección con otra persona (link compartible)
- Histórico de selecciones anteriores

