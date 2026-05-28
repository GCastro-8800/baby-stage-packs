# Próximo paso: Issues HIGH del codebase review

Los 3 críticos ya están resueltos (CORS whitelist, idempotencia Stripe webhook, stage enum alineado con DB). Ahora propongo atacar los 5 issues **HIGH** en este orden, priorizando los de mayor impacto y menor riesgo:

## 1. Memory leak en `useToast` (Issue #8)
**Archivo:** `src/hooks/use-toast.ts`
**Problema:** `state` está en el array de dependencias del `useEffect`, lo que añade/quita listeners en cada cambio de estado y acumula listeners obsoletos.
**Fix:** Eliminar `state` del array (usar `[]`) — patrón estándar de shadcn.
**Riesgo:** muy bajo. Cambio puntual de 1 línea.

## 2. Unificar datos de equipos (Issue #5)
**Archivos:** `src/data/packStages.ts`, `src/data/planEquipment.ts`, `src/data/productCatalog.ts`
**Problema:** Datos de productos duplicados en 3 sitios con precios conflictivos, sin fuente única de verdad.
**Fix:** 
- Usar `productCatalog.ts` como única fuente de verdad (ya alineado con el Excel oficial).
- Refactorizar `packStages.ts` y `planEquipment.ts` para que **referencien** productos por ID en lugar de duplicar `nombre`/`precio`/`imagen`.
- Crear helper `getProduct(id)` para resolver datos.
**Riesgo:** medio. Toca componentes que consumen estos datos; verificar configurador y dashboard.

## 3. Rate limiting persistente (Issue #4)
**Archivos:** `supabase/functions/chat/index.ts`, `supabase/functions/send-confirmation-email/index.ts`
**Problema:** Rate limit en memoria se pierde al hacer cold start.
**Fix:** Crear tabla `rate_limit_buckets (key text, window_start timestamptz, count int)` con TTL via cron, o usar `rate_limits` table compartida. Función helper en `_shared/rateLimit.ts`.
**Riesgo:** medio. Requiere migración SQL + refactor de 2 edge functions.

## 4. Consolidar queries de `useSubscription` (Issue #6)
**Archivo:** `src/hooks/useSubscription.ts`
**Problema:** 3 queries separadas (subscription, shipments, feedback) que podrían ser 1 RPC.
**Fix:** Crear función `get_user_subscription_overview(_user_id uuid)` que devuelva JSON con los 3 datasets. Refactor del hook para llamar a la RPC.
**Riesgo:** bajo-medio. Requiere RPC + ajuste del hook.

## 5. CAPTCHA en endpoints públicos (Issue #7)
**Endpoints:** `admin-login`, `chat`, captura de leads.
**Fix:** Integrar Cloudflare Turnstile (gratis, sin tracking) en los formularios públicos + validación en edge functions.
**Riesgo:** alto en alcance (UX + frontend + backend + secret nuevo). Mejor dejarlo al final o discutirlo aparte.

---

## Recomendación

Abordar **#1 + #2** en este turno (cambios de frontend acotados, sin migraciones), y dejar **#3, #4, #5** para iteraciones siguientes una vez verificado que #1 y #2 no rompen nada.

¿Quieres que avance con #1 y #2, o prefieres otro orden / atacar solo uno?
