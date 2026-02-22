

# Añadir opciones de duración de alquiler: 3, 6 y 12 meses

## Resumen

Agregar un selector de duración en la sección de precios (landing) y en la página de configuración del pack. Los descuentos aplicados seran:

- **Mensual** (actual): precio base, sin compromiso
- **3 meses**: 5% de descuento sobre el precio mensual
- **6 meses**: 10% de descuento sobre el precio mensual
- **12 meses**: 20% de descuento sobre el precio mensual

El selector sera un toggle horizontal (1 mes / 3 meses / 6 meses / 12 meses) que aparecera tanto en la landing como en la pagina de detalle del pack, y el precio se actualizara dinamicamente.

## Cambios por archivo

### 1. Constantes de duracion (`src/lib/constants.ts`)

Agregar las opciones de duracion y sus multiplicadores de descuento:

```typescript
export const DURATION_OPTIONS = [
  { months: 1, label: "Mensual", discount: 0 },
  { months: 3, label: "3 meses", discount: 0.05 },
  { months: 6, label: "6 meses", discount: 0.10 },
  { months: 12, label: "12 meses", discount: 0.20 },
] as const;
```

### 2. Componente selector de duracion (nuevo: `src/components/DurationSelector.tsx`)

Un componente reutilizable con botones/tabs horizontales que muestra las 4 opciones. Resalta visualmente el descuento (ej: "-20%") junto a cada opcion.

### 3. Seccion de precios (`src/components/PricingSection.tsx`)

- Agregar estado `selectedDuration` (por defecto 1 mes).
- Renderizar el `DurationSelector` encima de las tarjetas de precio.
- Multiplicar el precio de cada plan por `(1 - discount)` segun la duracion seleccionada.
- Actualizar el texto de duracion para mostrar "€X/mes durante Y meses" cuando no es mensual.

### 4. Pagina de detalle del pack (`src/pages/PackDetail.tsx`)

- Agregar estado `selectedDuration`.
- Renderizar el `DurationSelector` debajo del titulo del pack.
- Pasar el factor de descuento al hook `usePackSelections` o calcular el precio ajustado directamente.
- Pasar la duracion al `StickyPriceFooter` para que muestre el precio con descuento.

### 5. Footer de precio (`src/components/packs/StickyPriceFooter.tsx`)

- Recibir prop opcional `durationMonths` y `durationDiscount`.
- Mostrar el precio ajustado y, cuando la duracion es mayor a 1 mes, mostrar el total del periodo (ej: "€X/mes x 6 meses = €Y total").
- Actualizar el desglose para reflejar los precios con descuento.

### 6. Hook de selecciones (`src/hooks/usePackSelections.ts`)

- Modificar `calculateTotalPrice` y `calculatePackCompletePrice` para aceptar un parametro opcional `discountFactor` (default 0) que se aplica al resultado final.

### 7. Pagina de checkout (`src/pages/PackCheckout.tsx`)

- Leer la duracion desde `location.state`.
- Mostrar la duracion seleccionada y el precio ajustado en el resumen.
- Pasar la informacion de duracion al backend (stripe-checkout).

### 8. Edge function (`supabase/functions/stripe-checkout/index.ts`)

- Recibir `durationMonths` en el body.
- Incluir la duracion en los metadatos de la sesion de Stripe para que se procese correctamente.

## Flujo del usuario

1. En la landing, ve las tarjetas de precio con un selector de duracion arriba.
2. Selecciona "6 meses" y ve los precios actualizados con el 10% de descuento.
3. Hace clic en "Seleccionar Comfort" y va a la pagina de configuracion.
4. En la configuracion, el selector de duracion mantiene la seleccion (6 meses).
5. El footer muestra el precio mensual con descuento y el total del periodo.
6. Al continuar al checkout, ve el resumen con la duracion y el precio final.

