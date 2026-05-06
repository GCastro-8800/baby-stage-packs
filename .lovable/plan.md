# Auditoría Premium — bebloo.es

## 1. Diagnóstico Implacable

**Veredicto: PASA con reservas.** El sitio comunica calidez y confianza, pero hoy se lee como "DTC amigable" más que como **premium**. Hay varias señales que rebajan la percepción de marca de lujo familiar:

### Señales "cheap" detectadas

- **Imagen hero rota semánticamente.** Una mujer con cárdigan rojo frente a un muro de carteles "FIND YOUR RHYTHM TOUR / FREEDOM" no comunica *equipamiento premium para bebé*. El subconsciente lee "stock photo / lifestyle genérico". Es el mayor sabotaje del Halo Effect.
- **Saturación de color cálido.** Coral CTA + coral en estrellas + coral en badge "verificado" + coral en botón flotante + verde WhatsApp + azul "Empezar". Cuatro acentos compitiendo = ruido visual = percepción mid-market.
- **Dos CTAs flotantes simultáneos** (WhatsApp verde + chatbot coral) en esquinas opuestas. Los marketplaces baratos hacen esto; Hermès, Aesop o Bugaboo no.
- **Badge "Todo incluido"** flotando sobre la imagen es genérico de plantilla SaaS, no premium.
- **Headline funcional, no aspiracional.** "Alquiler de equipamiento premium para tu bebé" describe la categoría; no vende un sentimiento. Lo premium nombra el deseo, no el SKU.
- **Jerarquía tipográfica plana** en hero: H1, subhead, 3 bullets, CTA, micro-line. Cinco bloques compitiendo dentro del primer pliegue.
- **Banner de cookies** ocupa ~25% del viewport derecho y se queda fijo durante todo el scroll, tapando contenido (ver capturas). Mata la fluidez cognitiva.
- **Microinteracciones inexistentes.** Sin hover refinado en imagen, sin reveal al scroll, sin transiciones entre secciones. El sitio es estático → se siente "barato".
- **Footer plano** (azul oscuro liso, tipografía sin tensión) corta el momento "end" del Peak-End Rule en seco.

---

## 2. Plan de Transformación

### A. Hero Engineering (Halo Effect)

1. **Sustituir la imagen.** Foto editorial: detalle de un cochecito Bugaboo/Cybex **en uso real**, manos de madre, fondo neutro/desenfocado. O una madre+bebé en interior cálido con un objeto premium claramente identificable. Fotografía con grano sutil, no stock.
2. **Reescribir el H1 en clave aspiracional:**
   - Actual: "Alquiler de equipamiento premium para tu bebé"
   - Propuesto: **"Lo mejor para tu bebé, sin acumularlo en casa."** (subhead técnico abajo: "Equipamiento premium en alquiler. Cambia, devuelve, sin permanencia.")
3. **Reducir bullets de 3 a 0** dentro del hero. Los 3 beneficios pasan a una franja inmediatamente debajo (tipo "el código premium": menos densidad por pliegue).
4. **Un único CTA principal** ("Empieza tu selección") + link secundario discreto en texto ("Ver cómo funciona →"). Quitar la línea de micro-validación pegada al CTA — moverla como overlay sutil sobre la imagen.
5. **Quitar el badge flotante "Todo incluido"** — sustituirlo por una marca discreta (logo de marca premium colaboradora, p.ej. "Curado con Bugaboo, Stokke, Cybex") en la franja inferior del hero.

### B. Cognitive Decluttering

- **Unificar los flotantes.** Dejar **solo WhatsApp** o **solo Chatbot** (recomendación: WhatsApp, monocromo en color marca azul oscuro, no verde Meta). Eliminar uno reduce 50% del ruido en esquinas.
- **Banner de cookies:** convertir en **barra inferior delgada** (no card flotante a la derecha). Se acepta y desaparece. Hoy compite con el CTA principal.
- **Header:** quitar el icono carrito si no hay carrito activo. "Acceder" + "Empezar" son redundantes visualmente — dejar solo "Empezar" (primario) y "Acceder" como link de texto sin caja.
- **Sección testimonios:** 3 cards visibles + flechas no aporta. Pasar a **un solo testimonio grande tipo editorial** con foto, comilla tipográfica grande, paginación discreta debajo.
- **Coral solo en CTA principal.** Estrellas → ámbar tenue. Badges "verificado" → gris/azul oscuro. Reducir el coral al 5% de la pantalla, no al 25%.

### C. The Delight Layer (Peak-End)

- **Hero image reveal:** la foto entra con un parallax sutil + máscara que se abre al cargar (300–600ms, easing `cubic-bezier(0.16,1,0.3,1)`).
- **CTA primario:** además de la elevación actual, añadir un *shimmer* sutilísimo cada 8–12s en idle (como Stripe).
- **Scroll reveal:** secciones aparecen con `opacity 0→1` + `translateY(16px→0)` al entrar al viewport (IntersectionObserver, sin librerías). Stagger 80ms entre hijos.
- **Cursor sobre cards de producto/testimonio:** transform `scale(1.01)` + `box-shadow` suave en 200ms. Hoy son inertes.
- **Number ticker** en métricas (si las añades: "+N familias", "X meses promedio").
- **Footer "end" peak:** terminar con una franja crema con frase serif grande tipo manifiesto ("Menos cosas. Más calma.") antes del footer técnico. El usuario sale con una emoción, no con enlaces legales.
- **Loading state al pulsar "Empezar":** transición de página con fade 200ms en vez de corte duro.

### D. The Premium Spec Sheet ("confidently quiet")

**Tipografía** (mantener Fraunces + DM Sans, refinar uso):
- H1 hero: Fraunces, weight **400** (no 600), tracking `-0.02em`, line-height **1.05**, tamaño desktop `clamp(48px, 6vw, 80px)`. Hoy está en 600 + apretado = se ve "marketing", no "editorial".
- Subhead: DM Sans 400, tamaño 18–20px, line-height 1.5, color `hsl(205 20% 45%)` (más aire).
- Body general: 16px / 1.65 line-height. Aumentar.
- Micro-copy: 13px, letter-spacing `0.02em`, uppercase para etiquetas de sección ("01 — CÓMO FUNCIONA").

**Paleta refinada (neutralizar saturación):**
```
--background:       0 0% 99%        (casi blanco, no puro)
--foreground:       205 30% 15%     (más profundo, casi tinta)
--muted-foreground: 205 12% 45%     (gris azulado discreto)
--primary (azul):   205 60% 88%     (más desaturado, "polvo")
--accent (coral):   8 75% 65%       (coral apagado, no neón) — SOLO CTA
--surface-warm:     30 30% 97%      (crema editorial para franjas)
--border:           205 15% 92%     (apenas visible)
```
Coral pasa de `0 89% 72%` a un coral terroso. Las estrellas y "verificado" pierden el coral.

**Espaciado (regla del aire):**
- Padding vertical de secciones: `clamp(80px, 10vw, 160px)` (hoy ~64–96px; insuficiente para premium).
- Container max-width: bajar a **1120px** (hoy 1200) y aumentar gutter lateral.
- Espacio entre H1 y subhead: 24px. Entre subhead y CTA: 40px (hoy todo apretado).
- Bordes: `--radius` de 12px → **8px** en cards/inputs (radios grandes = friendly/SaaS; radios pequeños = editorial/premium). CTA puede mantener `rounded-full`.

**Imagen y media:**
- Todas las fotos con tratamiento consistente: ratio 4/5 vertical, leve grain (1–2%), sin sombras dramáticas.
- Sustituir SVG placeholders por foto real en cards de producto (audit pendiente en `/productos`).

**Sombras:**
- Eliminar `shadow-xl` en hero (hoy demasiado fuerte). Usar `0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -12px rgba(0,0,0,0.08)`. Sombra premium = casi imperceptible pero presente.

---

## 3. Roadmap de Implementación (si lo apruebas)

Lo dividiría en 3 PRs incrementales:

1. **PR1 — Tokens & tipografía** (cambios en `index.css` + `tailwind.config.ts` + ajustes Hero copy/imagen). Impacto visual inmediato, riesgo bajo.
2. **PR2 — Decluttering** (unificar flotantes, rediseñar banner de cookies como barra inferior, simplificar header, rediseñar sección testimonios).
3. **PR3 — Delight layer** (scroll reveals con IntersectionObserver, hover states, shimmer CTA, franja manifiesto pre-footer).

¿Quieres que arranque por el **PR1** (tokens + hero), que es donde se gana 70% de la percepción premium con 30% del esfuerzo? ¿O prefieres que ataque primero el banner de cookies + flotantes (decluttering inmediato)?