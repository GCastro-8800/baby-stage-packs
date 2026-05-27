# Fase 3c — Lenguaje editorial en Selección y Confirmación

Aplico el mismo lenguaje editorial (sin SaaS cards, hairlines, serif, aire) a `/mi-seleccion` y `/checkout/success`. Sin tocar lógica de negocio (hooks, precios, Stripe, recomendador).

## 1) `src/pages/Selection.tsx`
- Header de página: eyebrow "Tu selección" + h1 serif más grande (`text-3xl md:text-4xl`).
- Banner contextual (Sparkles): quitar `bg-primary/10 border border-primary/20 rounded-xl`. Convertir en línea con `border-t border-b border-foreground/10 py-3`, sin icono cuadrado.
- Link "Repetir cuestionario" / "Hacer cuestionario" como `border-b border-foreground/40` hairline button.
- Aumentar aire vertical entre secciones (`space-y-16`).

## 2) `src/components/configurator/CategorySection.tsx`
- Cabecera categoría: quitar cuadrado con icono. Eyebrow uppercase tracking + título serif. Hairline `border-b border-foreground/10`.

## 3) `src/components/configurator/ProductCardSelected.tsx`
- Quitar `rounded-xl border bg-card shadow-sm`. Usar `<article>` con `border-b border-foreground/10 py-5`.
- Nombre en `font-display text-lg`. Marca como eyebrow muted.
- Precio: quitar caja `bg-accent/10 rounded-lg`. Texto plano serif.
- Duration chips: hairline pill (`border border-foreground/20`, activo `bg-foreground text-background`).
- Bloque "Por qué te lo recomendamos": quitar `bg-primary/5 border rounded-lg`, usar nota inline con borde izquierdo hairline.
- Botones "Cambiar" / quitar: ghost con underline hairline.
- Alternativas: filas con `border-b border-foreground/10`, sin tarjetas internas.

## 4) `src/components/configurator/ProductCardSuggested.tsx`
- Quitar `rounded-xl border` (incluido dashed). Usar fila con `border-b border-foreground/10 py-5`, opacidad sutil cuando no seleccionado.
- Mismo tratamiento de precio/marca que Selected.
- Botón "Añadir a mi selección" como hairline link.

## 5) `src/components/configurator/SelectionSidebar.tsx`
- Sticky aside: quitar `rounded-2xl bg-card shadow-md`. Caja sutil `border-t border-b border-foreground/15 py-6` o panel `bg-card/40` muy ligero sin sombra.
- Título "Tu selección" serif, contador como eyebrow muted (sin pill).
- Items: filas con divisor hairline; chips duración como hairline.
- "Pago único" serif grande, nota muted.
- CTA "Contratar ahora" se mantiene como botón sólido (única acción primaria).
- Card "Incluye siempre": quitar `rounded-2xl bg-card shadow-sm`. Sección con eyebrow + lista con bullets `·` y texto muted, sin cuadrados de iconos.

## 6) `src/components/configurator/StickyMobileBar.tsx`
- Barra inferior: quitar shadow grande, usar `border-t border-foreground/15 bg-background`.
- Total serif. CTA sólido se mantiene.
- Sheet interior: mismo tratamiento (hairlines en lugar de borders pesados, chips hairline, sin pill de contador).

## 7) `src/components/configurator/CheckoutOptionsDialog.tsx`
- Dialog header: ya usa font-serif, ok.
- Breakdown: quitar `bg-muted/50 rounded-lg`. Lista con `border-t border-foreground/10` por fila.
- Opciones: quitar `rounded-xl border bg-card`. Filas grandes con `border-b border-foreground/10 py-5`, sin cuadrado de icono coloreado (icono inline pequeño con muted), CTA "→" como hairline link.

## 8) `src/pages/CheckoutSuccess.tsx`
- Quitar círculo `bg-primary/10` con icono grande. Sustituir por un check sutil (icono inline) o eyebrow "Confirmado".
- Título serif más grande, copy cálido.
- CTA "Ir a mi panel" como hairline button (no `cta-tension`), redirección con texto muted pequeño.
- Layout con más aire (`max-w-md space-y-10`).

## Fuera de alcance
- Lógica de `useSelection`, recomendador, Stripe, navegación, queries.
- `ProductDetailDialog`, `ExitIntentModal`, `TrustBadges` (se mantienen tal cual; sólo el contenedor de sidebar cambia).
- Header global y Footer.

## Verificación
- `/mi-seleccion` desktop 1280: tres etapas con aire, sin cards, sidebar editorial, CTA primario visible.
- `/mi-seleccion` mobile 390: barra inferior limpia, sheet con hairlines, chips duración legibles.
- Flujo: añadir/quitar producto, cambiar duración, abrir alternativas → sigue funcionando.
- `/checkout/success`: minimal, sin caja redonda grande, redirección a 5s sigue.
- Sin regresiones de tipo en consola.
