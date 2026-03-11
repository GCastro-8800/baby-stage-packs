

## Plan: Limpiar terminología del dashboard

Hay tres problemas en el dashboard que usan terminología prohibida:

### 1. `StageCard.tsx`
- Línea 44: "Etapa actual" → "Momento actual"
- Línea 64: "Ver pack recomendado" → "Ver equipamiento recomendado"

### 2. `PlanRecommenderDialog.tsx`
- Línea 17: tipo `Plan` y toda la lógica de "planes" (Start/Comfort/Total Peace) con precios fijos — esto no refleja el modelo actual donde el precio es la suma de productos individuales
- Línea 235: "Tu plan recomendado" → "Tu selección recomendada"
- Línea 76-95: `PLAN_DATA` con nombres "BEBLOO Start/Comfort/Total Peace" y precios fijos — obsoleto

**Decisión**: El quiz del PlanRecommenderDialog sigue siendo útil como herramienta de descubrimiento, pero el resultado no debería mostrar "planes" con precios fijos. En su lugar, tras completar el quiz, llevar directamente al configurador con un mensaje contextual. Simplificar el resultado para que diga "Te recomendamos empezar con una selección personalizada" y el CTA principal sea "Descubre qué necesitas" (al configurador).

### Cambios concretos

**`src/components/dashboard/StageCard.tsx`**
- "Etapa actual" → "Momento actual"
- "Ver pack recomendado" → "Descubre qué necesitas"

**`src/components/dashboard/PlanRecommenderDialog.tsx`**
- Eliminar `PLAN_DATA` con planes/precios fijos
- Resultado del quiz: mostrar un mensaje personalizado según el perfil (ansioso vs. práctico) sin mencionar plan ni precio fijo
- Mantener los CTAs: "Descubre qué necesitas" (→ configurador) y "Hablar con una asesora" (→ Calendly)
- "Tu plan recomendado" → "Tu recomendación"

