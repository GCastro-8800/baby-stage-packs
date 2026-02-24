
# Checkout mejorado: duracion por producto + pantalla de cierre con 3 opciones

## Resumen

Tres cambios principales:

1. **Duracion por producto**: Cada producto en el carrito puede tener su propia duracion (3, 6, 9, 12, 24 meses). A mas meses, menor precio/mes. El precio total se recalcula en tiempo real.
2. **Pantalla de cierre**: Al pulsar "Contratar"/"Continuar", en vez de ir directo a WhatsApp, se abre un dialog/modal con 3 opciones: Calendly (hablar con asesora), WhatsApp (con el mensaje detallado ya existente), y Pago online.
3. **Gestion rapida del carrito**: En el sidebar y en la barra movil, poder ajustar duracion y quitar productos mas rapido.

---

## Detalles tecnicos

### 1. Duraciones y descuentos por producto

**`src/lib/constants.ts`** - Actualizar opciones de duracion:
- Anadir opciones: 3, 6, 9, 12, 24 meses
- Descuentos progresivos: 3m (5%), 6m (10%), 9m (15%), 12m (20%), 24m (30%)

**`src/hooks/useSelection.ts`** - Anadir estado de duracion por producto:
- Nuevo estado: `durations: Map<string, number>` (productId -> meses)
- Duracion por defecto: 6 meses
- Funcion `setDuration(productId, months)` para cambiar
- `getDuration(productId)` para leer
- `getDiscountedPrice(product)` que aplica el descuento segun duracion
- `totalPrice` recalculado con descuentos individuales
- Cuando se quita un producto, limpiar su duracion

**`src/components/configurator/ProductCardSelected.tsx`** - Selector de duracion inline:
- Debajo del precio, anadir una fila de chips pequenos (3, 6, 9, 12, 24 meses)
- Chip activo en color primario, los demas en gris
- Mostrar precio original tachado + precio con descuento cuando hay descuento
- Al cambiar duracion, llamar a `setDuration`

**`src/components/configurator/SelectionSidebar.tsx`** - Mostrar duracion en la lista:
- Cada producto muestra: nombre, duracion seleccionada (ej: "6 meses"), precio con descuento
- Selector de duracion compacto (dropdown o mini-chips) por producto para cambio rapido
- Precio total recalculado con todos los descuentos

**`src/components/configurator/StickyMobileBar.tsx`** - Sin cambios grandes, solo muestra el total con descuentos aplicados

### 2. Pantalla de cierre (CheckoutOptionsDialog)

**Nuevo componente: `src/components/configurator/CheckoutOptionsDialog.tsx`**
- Dialog/modal que aparece al pulsar "Contratar ahora"
- Tres opciones presentadas como cards grandes:
  1. **Hablar con una asesora** - Icono de calendario - Abre Calendly con datos pre-rellenados (nombre, email, productos seleccionados como nota)
  2. **Contratar por WhatsApp** - Icono de WhatsApp - Abre el mismo mensaje actual con la lista de productos, duraciones y precios
  3. **Pagar online** - Icono de tarjeta - Por ahora muestra "Proximamente" o navega a flujo de Stripe si esta configurado
- Props: open, onOpenChange, products (con duraciones y precios), totalPrice
- El mensaje de WhatsApp incluye la duracion de cada producto: "Bugaboo Fox 5 - 6 meses (99EUR/mes -> 89EUR/mes)"

### 3. Gestion rapida del carrito

**`src/components/configurator/SelectionSidebar.tsx`** - Mejoras:
- Boton X siempre visible (no solo en hover) para quitar rapido
- Cada producto tiene un mini-selector de duracion (chips inline pequenos)
- Precio con descuento visible al lado de cada producto

---

## Archivos a crear
1. `src/components/configurator/CheckoutOptionsDialog.tsx`

## Archivos a modificar
1. `src/lib/constants.ts` - Nuevas opciones de duracion (9 y 24 meses)
2. `src/hooks/useSelection.ts` - Estado de duracion por producto + precios con descuento
3. `src/components/configurator/ProductCardSelected.tsx` - Selector de duracion inline
4. `src/components/configurator/SelectionSidebar.tsx` - Duracion por producto + X visible
5. `src/components/configurator/StickyMobileBar.tsx` - Total con descuentos
6. `src/pages/Selection.tsx` - Integrar CheckoutOptionsDialog en vez de ir directo a WhatsApp
