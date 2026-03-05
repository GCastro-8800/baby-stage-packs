

# Integración de Stripe para pago online

## Situación actual

- Stripe está habilitado y la clave secreta configurada.
- La función `stripe-checkout` existente usa IDs de precio placeholder para planes fijos (start/comfort/total-peace), que ya no reflejan el modelo real.
- El modelo real es: cada usuario selecciona productos individuales, cada uno con su propia duración (1/3/6/12/24 meses), y el precio mensual varía según la duración.
- 17 productos × 5 duraciones = 85 combinaciones de precio.

## Plan de implementación

### 1. Crear productos y precios en Stripe

Crear 17 productos en Stripe (uno por producto del catálogo) y 85 precios recurrentes mensuales usando las herramientas de Stripe disponibles. Cada precio será un cargo mensual recurrente con el importe fijo correspondiente a la duración comprometida.

Ejemplo: "Bugaboo Fox 3" tendrá 5 precios: 70€/mes (1m), 67€/mes (3m), 60€/mes (6m), 48€/mes (12m), 34€/mes (24m).

### 2. Mapear IDs de precio en el catálogo

Añadir un campo `stripePrices: Record<number, string>` a la interfaz `Product` en `productCatalog.ts` para mapear cada duración a su `price_id` de Stripe.

### 3. Reescribir la función `stripe-checkout`

Reemplazar la función actual con una nueva que:
- Reciba la lista de productos seleccionados con sus duraciones.
- Construya los `line_items` usando los `price_id` reales del catálogo.
- Use el SDK de Stripe (no fetch manual).
- Cree o reutilice un customer de Stripe.
- Devuelva la URL de checkout.

### 4. Activar la opción "Pagar online" en el diálogo de checkout

En `CheckoutOptionsDialog.tsx`, habilitar el botón de pago online (actualmente deshabilitado con `disabled: true`) y conectarlo a la función de checkout.

### 5. Página de éxito post-pago

La página `CheckoutSuccess.tsx` ya existe. Verificar que funciona correctamente con el nuevo flujo.

## Archivos a modificar

1. `src/data/productCatalog.ts` — Añadir `stripePrices` con los IDs reales
2. `supabase/functions/stripe-checkout/index.ts` — Reescribir con SDK de Stripe y line items dinámicos
3. `src/components/configurator/CheckoutOptionsDialog.tsx` — Habilitar pago online
4. `supabase/config.toml` — Verificar configuración de la función

## Archivos nuevos

5. `supabase/functions/stripe-checkout/deno.json` — Dependencias de Stripe

## Notas

- Se crearán los 17 productos y 85 precios en Stripe en lote usando las herramientas disponibles.
- No se usan webhooks por ahora (se puede añadir después si se necesita activar suscripciones automáticamente en la base de datos).
- La autenticación ya está implementada en el proyecto.

