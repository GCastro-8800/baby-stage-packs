## Estado real de los 3 issues "críticos" del codebase review

Después de auditar el código actual, **2 de los 3 críticos ya están resueltos** (el review de marzo está desactualizado):

### ✅ Issue #2 — CORS wildcard — RESUELTO
`supabase/functions/_shared/cors.ts` ya implementa whitelist de orígenes (`bebloo.es`, `bebloo.lovable.app`, etc.) con validación de header `Origin`. Las funciones que importan este shared module están protegidas. No hay nada que hacer aquí.

### ✅ Issue #3 — Idempotencia de Stripe webhook — RESUELTO
La tabla `processed_stripe_events` existe y `stripe-webhook/index.ts` (líneas 86–102) hace check + insert del `event.id` antes de procesar. Reenvíos de Stripe devuelven `{ duplicate: true }` sin duplicar suscripciones ni envíos.

### ⚠️ Issue #1 — Stage enum mismatch — PARCIALMENTE RESUELTO

Lo que está bien:
- Existe `toDbStage()` / `fromDbStage()` en `src/types/baby.ts` que traduce entre los valores de la app (`6-9m`, `9-12m`, `12m+`) y los de DB (`6-12m`, `12-18m`, `18-24m`).
- Ya no hay corrupción silenciosa: persistir un stage no falla.

Lo que sigue siendo un problema (pérdida de información):
- `6-9m` y `9-12m` ambos mapean a `6-12m` en DB → al volver a leer, no sabemos si era 6-9 o 9-12.
- `12m+` mapea a `12-18m` → perdemos el caso `18-24m` (un bebé de 20 meses queda etiquetado como 12-18).
- El enum de DB tiene `18-24m` pero la app nunca lo usa ni lo expone.

## Plan

**Único cambio propuesto**: alinear los dos enums para eliminar la lossy translation. La opción más limpia es **adoptar los valores de DB también en la app** (`6-12m`, `12-18m`, `18-24m` en lugar de `6-9m`, `9-12m`, `12m+`), porque:
- Coincide mejor con el catálogo (Momentos del kit ya están agrupados por tramos largos).
- El enum DB tiene más granularidad en 12m+ (12-18 y 18-24 separados).
- Elimina las funciones de conversión y el riesgo de inconsistencia.

### Pasos

1. **Auditar uso de los strings de stage** en frontend para listar todos los archivos a tocar (`packStages.ts`, `packsByStage.ts`, `planEquipment.ts`, `recommendationEngine.ts`, `useBabyStage.ts`, componentes de configurador, copys, etc.).
2. **Reemplazar valores** `6-9m` → `6-12m`, `9-12m` → `6-12m` (consolidación), `12m+` → `12-18m` y añadir soporte explícito a `18-24m`.
3. **Actualizar copys visibles**: cualquier "6-9 meses" / "9-12 meses" pasa a "6-12 meses"; "+12 meses" se desdobla en "12-18 meses" y "18-24 meses".
4. **Eliminar** `toDbStage` / `fromDbStage` y el alias `AppStage`/`DbStage`; dejar un único `Stage` que coincide con el enum de DB.
5. **Verificar** que `useBabyStage` (calcula stage actual a partir de fecha de nacimiento) usa los nuevos tramos correctamente.
6. **Comprobar** que los datos existentes en `subscriptions.current_stage` y `shipments.stage` siguen siendo válidos (ya están en formato DB, así que no hay migración de datos necesaria).

## Notas técnicas

- No requiere migración SQL: el enum de DB ya tiene los valores correctos.
- No hay datos que reescribir; sólo código frontend.
- Es un refactor mediano — toca ~10-15 archivos pero todos cambios mecánicos de string.
- Riesgo bajo: si me dejo un valor viejo, TypeScript lo detecta al compilar.

## Después de esto

Una vez cerrado este crítico, el siguiente bloque natural sería **HIGH issues** del review (memory leak de `useToast`, consolidar datos de equipamiento duplicados, rate limiting persistente). Eso lo planificamos como siguiente iteración.
