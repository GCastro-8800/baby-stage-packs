# Próximo paso: Fix #4 — Consolidar `useSubscription` en una RPC

Ya completados: #1 (useToast leak), #2 (refactor datos packs/plan), #3 (rate limiting persistente).

Quedan 2 HIGH del review: **#4 consolidar queries** y **#7 CAPTCHA**. Propongo atacar #4 ahora (bajo riesgo, mejora real de performance) y dejar #7 para un turno aparte (alcance grande: UX + frontend + backend + secret nuevo de Turnstile).

## Problema

`src/hooks/useSubscription.ts` hace **3 queries separadas** en cascada cada vez que carga el dashboard:
1. `subscriptions` (1 fila)
2. `shipments` (lista del usuario)
3. `feedback` (lista del usuario)

Son 3 round-trips secuenciales contra la DB. Para un usuario con dashboard activo se traduce en latencia visible y carga innecesaria de la API.

## Solución

Crear una RPC `get_user_subscription_overview()` (SECURITY DEFINER, sin parámetros, usa `auth.uid()` internamente) que devuelva un único JSON con los 3 datasets:

```json
{
  "subscription": { ... } | null,
  "shipments": [ ... ],
  "feedback": [ ... ]
}
```

Refactor del hook para:
- Una sola `useQuery` que llama a la RPC.
- Mantener la misma interfaz pública (`subscription`, `shipments`, `nextShipment`, `lastDelivered`, `feedback`, `submitFeedback`) para no tocar componentes consumidores.
- `submitFeedback` sigue invalidando la query consolidada `["subscription-overview", user?.id]`.

## Cambios

### 1. Migración SQL
- Crear función `public.get_user_subscription_overview()`:
  - `SECURITY DEFINER`, `STABLE`, `SET search_path = public`.
  - Usa `auth.uid()`; si es NULL → devuelve `null`/arrays vacíos.
  - Misma lógica que las 3 queries actuales (subscription con filtro de status + order + limit 1; shipments orden desc; feedback completo).
  - `REVOKE EXECUTE ... FROM PUBLIC, anon`; `GRANT EXECUTE ... TO authenticated`.

### 2. `src/hooks/useSubscription.ts`
- Reemplazar las 3 `useQuery` por 1 `useQuery` que llama `supabase.rpc("get_user_subscription_overview")`.
- Parsear el JSON al tipo existente; mantener el cast de `items` a `ShipmentItem[]`.
- Mantener `nextShipment` / `lastDelivered` con `useMemo` igual que ahora.
- `submitFeedback.onSuccess` → invalidar `["subscription-overview", user?.id]`.

### Riesgo
Bajo. La interfaz pública del hook no cambia → no toca componentes. La RPC respeta RLS porque filtra por `auth.uid()`.

## Después de #4
Quedaría solo **#7 CAPTCHA (Turnstile)** de la lista HIGH. Lo discutimos en su propio turno porque toca frontend, backend, UX y requiere un secret nuevo.
