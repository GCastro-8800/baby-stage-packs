## Problema

1. `stripe-checkout` no incluye `shipping_address_collection` ni `phone_number_collection` → operaciones no recibe ni dirección ni teléfono confirmado.
2. El webhook no persiste esos datos cuando lleguen → aunque Stripe los recoja, no aparecen en el panel admin.
3. `PhoneCaptureBanner` es opcional y descartable → muchos usuarios pagarán sin teléfono.

## Solución (1 sola vuelta)

### A. Recoger datos en Stripe Checkout (bloqueante)

En `supabase/functions/stripe-checkout/index.ts`, añadir a `stripe.checkout.sessions.create`:

- `shipping_address_collection: { allowed_countries: ["ES"] }` — solo España, obligatorio.
- `phone_number_collection: { enabled: true }` — Stripe pide y valida el teléfono.
- `billing_address_collection: "auto"` — para facturación correcta.
- `locale: "es"` — UI de Stripe en español.
- `custom_text` opcional con nota: "Necesitamos tu dirección y teléfono para coordinar la entrega del kit."

Ventaja: Stripe gestiona la validación, no tenemos que construir UI propia. Sin dirección/teléfono, el usuario no puede pagar.

### B. Persistir dirección y teléfono al recibir el webhook

En `supabase/functions/stripe-webhook/index.ts`, dentro de `checkout.session.completed`:

1. Leer `session.shipping_details` (nombre, dirección completa) y `session.customer_details.phone`.
2. Guardar:
   - `profiles.phone` (si está vacío) ← `customer_details.phone`.
   - **Nueva columna** `subscriptions.shipping_address` (jsonb) con dirección estructurada (line1, line2, city, postal_code, state, country, recipient_name).
3. Migración SQL: `ALTER TABLE subscriptions ADD COLUMN shipping_address jsonb;`

### C. Mostrar dirección en el panel admin

En `src/components/admin/SubscriptionsTab.tsx` y/o `ShipmentsTab.tsx`, añadir una columna/sección con la dirección formateada del envío. Permite a operaciones copiar dirección + teléfono de un vistazo.

### D. Backfill suave del teléfono en dashboard

`PhoneCaptureBanner` ya queda como respaldo para clientes anteriores. No bloqueamos el dashboard porque el teléfono nuevo ya viene de Stripe.

## Archivos afectados

- `supabase/functions/stripe-checkout/index.ts` — añadir collection params.
- `supabase/functions/stripe-webhook/index.ts` — persistir `shipping_details` y `customer_details.phone`.
- Migración: `subscriptions.shipping_address jsonb`.
- `src/components/admin/SubscriptionsTab.tsx` — mostrar dirección.
- (Opcional) `src/components/admin/ShipmentsTab.tsx` — mostrar dirección por envío.

## Lo que NO hacemos en esta vuelta

- No tocamos `PackCheckout.tsx` (flujo legacy, mismo edge function).
- No bloqueamos el dashboard si falta teléfono — lo recoge Stripe en compras nuevas.
- No añadimos validación custom de código postal — Stripe ya lo hace.

## Validación post-deploy

Compra de prueba en live (1€ con un product ID existente, modo test si prefieres) → verificar:
- Stripe Checkout pide dirección ES + teléfono.
- `subscriptions.shipping_address` contiene la dirección.
- `profiles.phone` se actualiza si estaba vacío.
- Admin → Suscripciones muestra la dirección.