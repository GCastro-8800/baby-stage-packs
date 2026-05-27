# Fase 3 — Pulir el resto del dashboard

Objetivo: que **toda** la zona /app respire el mismo lenguaje editorial (cream, serif, hairlines, copy cálido) que ya tienen WelcomeHeader, ShipmentCard, BabyTimeline y PaolaWidget. Eliminar los últimos vestigios de "card SaaS" (bordes redondeados gruesos, bg primary/5, badges de colores, emojis tipo ✨, etiquetas "Estado de tu equipamiento").

Solo UI / copy. Sin cambios de datos, hooks ni rutas.

## Componentes a refinar

### 1. `SubscriptionCard.tsx` — "Tu servicio"
Es el componente con peor coherencia actual: `Card` con `border-primary/20 bg-primary/5`, `Sparkles` icon, badges con `bg-emerald-100`, emoji ✨, banners en `bg-amber-50` y `bg-emerald-50`.

Refactor:
- Quitar `Card/CardHeader/CardContent`. Pasar a `<section className="space-y-6">` integrado en el flujo, sin caja.
- Cabecera editorial: eyebrow `TU SERVICIO`, h3 serif con el nombre del servicio (`BEBLOO Start/Comfort/Total Peace`), una línea muted con la etapa actual ("Ahora: Descubriendo · 3–6 meses").
- Estado: en lugar de Badge de color, una línea hairline con `Activo` / `Pausado` / `Finalizado` en muted, sin pill.
- Banners (pickup confirmada, expirado, ending soon): convertir cada uno en un bloque sin card, separado por `border-t border-foreground/10 pt-6`, con copy más cálido:
  - "Tu recogida está confirmada para el **18 de junio**, ventana 10–13h."
  - "Tu Momento actual termina el **18 de junio**. Quedan 12 días — si quieres seguir, podemos preparar el siguiente."
  - "Tu Momento ha terminado. Cuando quieras, programamos la recogida o preparamos el siguiente."
- Eliminar línea con emoji ✨ "Todo bajo control". Sustituir por copy serif sutil opcional o nada.
- Botones: usar `variant="ghost"` con borde inferior hairline (`border-b border-foreground/40`) en estilo "Añadir" del PhoneCaptureBanner, no botones outline genéricos. CTA principal de renovación = botón sólido normal, único en la zona.
- Respetar terminología: nunca "suscripción", siempre "servicio" / "Momento".

### 2. `NoSubscriptionCard.tsx`
Hoy es un `Card` con `Calendar` icon y "Estado de tu equipamiento".

Refactor:
- Quitar Card. Sustituir por bloque editorial vacío:
  - Eyebrow `TU SERVICIO`
  - h3 serif: "Aún no hay un Momento en marcha."
  - Párrafo muted: "Cuando tú decidas, te ayudamos a montar el primero. Sin prisa."
  - CTA hairline "Ver selecciones" → `/configurador` (no "Explorar catálogo", que sigue siendo válido pero "selección" encaja mejor con la terminología).

### 3. `PhoneCaptureBanner.tsx`
Ya está bastante bien (serif, hairlines). Pequeños ajustes:
- Verificar que el spacing pegue con el ritmo `py-8 md:py-12` del resto del dashboard (hoy `py-5`).
- Considerar mover el botón "Cerrar" más sutil (text-xs muted).
- Copy ya es correcto, no tocar.

### 4. `ShipmentCard.tsx`
Ya en lenguaje editorial. Solo dos micro-ajustes:
- `STATUS_LABEL.delivered` actualmente dice "Entregado" pero el `headline` cuando no es `isNext` ya muestra "Entregado a tu hogar". Coherente, mantener.
- Cuando `items.length === 0` y es `isNext`, mostrar copy más cálido: "Aún estamos eligiendo las piezas perfectas." en vez de "El contenido se confirmará pronto." (opcional).

### 5. `AppDashboard.tsx`
- El bloque que envuelve `SubscriptionCard` hoy tiene `border-t border-foreground/10` + `py-8 md:py-12`. Tras quitar la card interna, ese wrapper ya da el ritmo correcto, no hace falta tocarlo.
- Asegurar que también `NoSubscriptionCard` se renderiza dentro del mismo wrapper editorial (hoy `AppDashboard` solo renderiza `SubscriptionCard` si `subscription` existe — habría que añadir el caso `!subscription` con `NoSubscriptionCard` para que ese estado tenga presencia editorial en la zona 3).

## Fuera de alcance

- Foto real de Paola y validación de los 6 nombres del timeline → quedan como tareas separadas (necesitan asset y tu aprobación).
- Settings, Selection, CheckoutSuccess → fase posterior.
- Lógica de Stripe portal, recogida, renovación → no se toca.

## Verificación

1. /app con servicio activo → "Tu servicio" se ve sin caja, integrado al flujo editorial, sin badges de color.
2. /app sin servicio → aparece bloque editorial "Aún no hay un Momento en marcha" en la zona 3.
3. /app con servicio expirado pendiente de recogida → el banner aparece como bloque hairline, no como card amarilla/roja.
4. Mobile (390px) → la jerarquía serif sigue legible y el CTA de renovación no se rompe.
