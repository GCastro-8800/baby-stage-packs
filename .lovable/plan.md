

## Plan: Cambiar facturación de mensual a pago adelantado por compromiso

### Problema actual
El checkout de Stripe crea una **suscripción mensual** (`mode: "subscription"`, `recurring: { interval: "month" }`). Si alguien elige 12 meses, paga 48€/mes cada mes durante 12 meses. Esto no tiene sentido para el negocio: el cliente podría cancelar tras el primer mes pagando solo 48€ en vez de 576€.

### Solución
Cambiar a **pago único adelantado** (`mode: "payment"`) donde el cliente paga el importe total del compromiso de una sola vez.

Ejemplo con la selección actual:
- Bugaboo Fox 3 (12 meses): 48€ × 12 = **576€**
- Babyzen YOYO3 (3 meses): 52€ × 3 = **156€**
- Bugaboo Donkey 3 (3 meses): 86€ × 3 = **258€**
- **Total cobrado: 990€** (pago único)

### Cambios técnicos

**1. `supabase/functions/stripe-checkout/index.ts`**
- Cambiar `mode` de `"subscription"` a `"payment"`
- Eliminar `recurring` de `price_data`
- Calcular `unit_amount` como `pricePerMonth × months × 100` (total del compromiso, no mensual)
- Actualizar el nombre del producto para reflejar el total (ej. "Bugaboo Fox 3 — 12 meses · 576€")

**2. `supabase/functions/stripe-webhook/index.ts`**
- Adaptar el handler de `checkout.session.completed` para funcionar con pagos únicos en vez de suscripciones
- Eliminar los handlers de `customer.subscription.deleted` / `paused` (ya no aplican)
- Seguir creando registros en `subscriptions` y `shipments` para tracking interno

**3. `supabase/functions/check-subscription/index.ts`**
- Actualizar para verificar pagos completados en vez de suscripciones activas de Stripe
- O basarse directamente en la tabla `subscriptions` de la base de datos

**4. UI — Sidebar y Checkout Dialog**
- Mostrar precio total del compromiso además del desglose mensual (ej. "48€/mes × 12 = 576€")
- En el diálogo de checkout, mostrar el total a cobrar claramente

### Pregunta de negocio importante
Antes de implementar, necesito confirmar: ¿quieres cobrar **siempre todo el compromiso de golpe**, o prefieres otra opción como cobrar en cuotas (ej. 12 meses = 4 pagos trimestrales)?

