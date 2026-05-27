
# Fase 2 — Dashboard editorial

Transformar `/app` de "panel funcional shadcn" a un espacio cálido y editorial coherente con la landing (crema, Cormorant, hairlines, sin cajas pesadas). Mantenemos toda la lógica de negocio intacta — solo cambia presentación, jerarquía y copy.

Toda la terminología respeta las reglas: **Momento, kit, selección, servicio** (nunca etapa/pack/plan/suscripción).

---

## 1. Header del dashboard

`AppDashboard.tsx` — alinear con la landing:
- Fondo crema (`bg-background`), borde inferior hairline (`border-foreground/10`), sin sombra ni blur pesado.
- Logo a la izquierda, a la derecha: enlace "Sobre nosotras" + ícono ajustes + cerrar sesión en menú compacto.

## 2. Nueva jerarquía visual (4 zonas)

Reescritura del `<main>` de `AppDashboard.tsx` en 4 bloques editoriales separados por aire (no por cards):

**Zona 1 — Saludo + Momento actual**
- Hero suave: eyebrow ("Tu espacio"), H1 serif "Hola, [nombre]" en Cormorant grande, párrafo con el Momento del bebé en lenguaje humano ("Tu bebé está en su Momento de 3-6 meses · 14 semanas en casa").
- Sustituye `WelcomeHeader` + `BabyAgeCard` + `StageCard` actuales.

**Zona 2 — Tu kit ahora**
- Nuevo componente `CurrentKitSection.tsx`: lista editorial de las piezas activas (nombre, marca, "en casa desde [fecha]"), separadas por hairlines, sin cards.
- Si no hay servicio activo: estado vacío editorial con CTA al configurador (reemplaza `NoSubscriptionCard`).

**Zona 3 — Próximo cambio**
- Refactor de `ShipmentCard.tsx`: sin card, layout editorial con fecha grande serif a la izquierda + descripción a la derecha.
- Microcopy cálido nuevo:
  - `pending` → "Preparando tu próximo Momento"
  - `shipped` → "En camino a casa"
  - `delivered` → "Entregado el [fecha]"
  - Recogidas → "Recogemos [pieza] el [fecha]"

**Zona 4 — Tu Maternity Nurse (permanente)**
- Nuevo `PaolaWidget.tsx`: bloque fijo con retrato pequeño de Paola, frase corta ("¿Dudas con el sueño, lactancia o qué necesitas comprar? Habla conmigo, es gratis.") y CTA a su Calendly (URL ya en memoria).
- Aparece siempre, haya servicio o no.

## 3. Timeline del bebé

Nuevo `BabyTimeline.tsx` (reemplaza `StageMilestones` + parte de `StageCard`):
- Línea horizontal con los 5 Momentos (Recién nacido · 0-3m · 3-6m · 6-12m · 12m+).
- Marcador coral en el Momento actual, hairlines entre Momentos.
- Bajo cada Momento, número pequeño de piezas activas en ese tramo (cuando aplique).
- En mobile: vertical con la misma lógica.

## 4. Microcopy editorial transversal

Reescritura de strings en:
- `EmotionalTip.tsx` — tono más íntimo, menos "tip".
- `WeeklyRecommendation.tsx` — "Esta semana te sugerimos…" en lugar de etiquetas.
- `PhoneCaptureBanner.tsx` — copy más cálido, menos transaccional.
- Card de "¿Necesitas ayuda?" actual → reemplazada por el widget de Paola (más personal que WhatsApp soporte).

## 5. Polish visual transversal en dashboard

- Quitar `Card` de shadcn donde no aporta — usar `<section>` + hairlines.
- Tipografía: `font-serif` (Cormorant) para todos los titulares de zona, `font-sans` para cuerpo.
- Padding generoso: `py-12 md:py-20` entre zonas.
- Fondos siempre crema, nunca blanco puro.
- Animación de entrada: `staggerContainer` + `lineReveal` (mismo sistema que la landing).

---

## Detalles técnicos

**Archivos a crear:**
- `src/components/dashboard/CurrentKitSection.tsx`
- `src/components/dashboard/PaolaWidget.tsx`
- `src/components/dashboard/BabyTimeline.tsx`

**Archivos a modificar:**
- `src/pages/AppDashboard.tsx` — reestructuración completa del layout y header.
- `src/components/dashboard/WelcomeHeader.tsx` — versión editorial serif.
- `src/components/dashboard/ShipmentCard.tsx` — refactor visual + microcopy.
- `src/components/dashboard/NoSubscriptionCard.tsx` → renombrar a estado vacío inline en `CurrentKitSection`.
- `src/components/dashboard/EmotionalTip.tsx` — reescritura de copy y visual sin card.
- `src/components/dashboard/WeeklyRecommendation.tsx` — reescritura de copy y visual sin card.
- `src/components/dashboard/PhoneCaptureBanner.tsx` — copy más cálido.

**Archivos a deprecar (eliminar del render, no del repo todavía):**
- `BabyAgeCard.tsx`, `StageCard.tsx`, `StageMilestones.tsx` — funcionalidad absorbida por zona 1 + `BabyTimeline`.

**Lo que NO se toca:**
- `useBabyStage`, `useSubscription`, `useChildren`, `useAuth` — toda la lógica de datos intacta.
- Tutorial de bienvenida (`WelcomeTutorial`), feedback de envíos, settings, admin.
- Tokens de color, motion system, edge functions, schema BD.

**Motion/tipografía:** mismo sistema que la landing (`motion.ts`, Lenis, `font-serif` para H1/H2).

---

## Lo que necesitará tu input para go-live

1. **Foto de Paola** para el widget permanente (placeholder editorial mientras tanto).
2. Validar el copy del widget de Paola y de los estados de envío.
3. Confirmar que los 5 Momentos del timeline son los correctos (Recién nacido · 0-3m · 3-6m · 6-12m · 12m+) o si quieres otra segmentación.

Puedes lanzarlo con placeholders y refinar después — la estructura editorial aguanta.
