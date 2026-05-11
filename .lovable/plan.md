## Bebloo · Awwwards-level prompt + plan de implementación

Adaptación del framework "unicycle as a sculpture" al universo Bebloo. La metáfora cambia: no vendemos un objeto, vendemos **calma + curaduría**. El producto-héroe no es el cochecito: es **el momento** (el bebé creciendo + la casa sin acumular).

### 1) El "prompt Awwwards" reescrito para Bebloo

> Build the **Bebloo** product site — a curated rental service of premium baby gear for families that want the best without accumulating it. **React + Tailwind + Framer Motion** for all motion. Treat the experience as an **editorial object**: every product is a sculpted piece, every section a chapter. Balance and trust visualized through interaction, not gimmicks. The **journey of a child** (prenatal → 0–4m → 4–8m → 8–12m → 12–24m) is explored through scroll: as the page scrolls, the room around the gear quietly evolves. Smooth scroll with **Lenis**. Micro-interactions on every CTA, card, and toggle. Tactile feel: paper-grain background, soft shadows, slow parallax. No stock photography energy — feel like *Cereal Magazine* meets *Hermès*. Fully responsive, **mobile-first** (363px is the canonical viewport). Confidently quiet palette already defined: dusted blue (`205 60% 88%`), terracotta coral accent (`8 65% 64%`) on warm cream. Typography locked: **Fraunces** (serif, weight 400, `-0.02em`) for headings, **DM Sans** for body. References: *Aesop, Cereal, Hermès Baby, Mubi, Stripe*. Awwwards-level — make a parent stop scrolling and *exhale*.

### 2) Cómo aterrizarlo (sin romper lo que ya funciona)

Trabajamos en 4 PRs incrementales. Cada uno entrega valor por sí solo.

```text
PR-A  Smooth scroll + global motion grammar
PR-B  Hero "kinetic still" + scroll-linked storytelling
PR-C  Catálogo como editorial (cards-sculpture)
PR-D  Detalle de producto + transiciones de página
```

#### PR-A · Smooth scroll + grammar
- Añadir **Lenis** (`@studio-freight/lenis`) en `App.tsx`, integrado con el observer de `useReveal` para que `scrollY` alimente Framer Motion.
- Instalar **framer-motion** (revisar si ya está) y crear `src/lib/motion.ts` con tokens reutilizables: `easeOutExpo`, `springSoft`, `staggerChildren = 0.08`.
- Hook `useScrollProgress(ref)` que devuelve 0→1 para parallax/escalado por sección.
- Respeto absoluto a `prefers-reduced-motion` (ya implementado en `useReveal`).

#### PR-B · Hero "kinetic still"
Sobre `Hero.tsx` actual:
- La imagen del cochecito hace **parallax sutil** (translateY -40px en 100vh).
- El H1 entra con **clip-path reveal** por línea (no fade básico): *"Lo mejor para tu bebé,"* + *"sin acumularlo en casa."* en dos tiempos.
- El eyebrow "Equipamiento de bebé · en alquiler" entra con un **rule horizontal** que dibuja antes (50ms) que el texto.
- El CTA `cta-tension` ya tiene shimmer. Añadir un **magnetic hover** (cursor "atrae" el botón ±6px) en desktop.
- Trust strip inferior: cada palabra entra con stagger 0.06s al cruzar viewport.
- Fondo: añadir capa de **grano SVG** (`<feTurbulence>`) al 4% para tactilidad sin peso.

#### PR-C · Catálogo editorial
`Catalog.tsx` y `CatalogProductCard.tsx`:
- Reemplazar grid uniforme por **broken-grid asimétrico** en desktop (1ª y 4ª card a doble alto), grid normal en móvil.
- Cada card es un "objeto en repisa": fondo `--card`, sombra `--shadow-quiet`, hover → la imagen escala 1.04 con `springSoft` y la sombra se alarga.
- Al entrar en viewport, las cards se revelan con stagger 0.08s usando `motion.div`.
- El **buscador** que acabamos de añadir gana un foco con borde animado (gradient blue→coral) y un placeholder que rota cada 4s entre: *"cuna"*, *"mochila portabebé"*, *"hamaca"*.
- Empty state (`ProductRequestCard`) recibe una entrada con `scale 0.96 → 1` + opacity para que se sienta "atendida".

#### PR-D · Detalle de producto + transición de página
- `ProductDetailDialog` actual → convertir en **shared layout transition**: la imagen de la card "vuela" al modal con `layoutId={product.id}`.
- Tabs internos (Detalles · Materiales · Garantía) con underline animado tipo *story-link*.
- Entre rutas (`/`, `/catalogo`, `/configurador`) añadir transición de página: fade + translateY 12px de 320ms con `AnimatePresence` envolviendo `<SentryRoutes>`.

### 3) Capa de "kinetic even when still"
Pequeños detalles que dan vida sin distraer:
- **Header**: el logotipo respira (scale 1 → 1.012 cada 6s, `easeInOut`).
- **Footer**: el manifiesto ("Menos cosas. Más calma.") tiene un letter-spacing que se relaja al entrar.
- **PricingSection**: el precio cambia con `<AnimatedNumber>` (cuenta atrás 800ms) cuando el usuario cambia duración.
- **WhatsApp button**: pulso muy lento (cada 12s) en lugar del actual estático.
- **Cursor** (solo desktop, `pointer:fine`): pequeño punto coral que sigue al cursor con `damping: 25`. Opt-in detrás de flag.

### 4) Lo que **NO** copiamos del prompt unicycle
- Nada de "rotación 3D del producto": un cochecito girando es kitsch, no premium. El movimiento se queda en composición y entrada, no en el objeto.
- Nada de WebGL ni Three.js: rompe el budget de performance móvil (363px es nuestro viewport real).
- Nada de "explorar engineering": Bebloo no vende ingeniería, vende **alivio mental**. La narrativa scroll-driven cuenta el viaje del bebé, no las piezas del producto.

### 5) Riesgos y mitigaciones
| Riesgo | Mitigación |
|---|---|
| Lenis pelea con scroll de modales/sheets | Pausar Lenis en `useEffect` cuando hay `Dialog` abierto |
| Animaciones penalizan LCP móvil | Hero image `fetchpriority="high"`, motion solo on-mount tras `requestIdleCallback` |
| Saturación visual en móvil 363px | Desactivar parallax y broken-grid bajo `md:`; quedarse con stagger reveal |
| Lectores de pantalla / a11y | Toda animación detrás de `prefers-reduced-motion`; nada que dependa solo de movimiento para comunicar |

### 6) Stack añadido
- `@studio-freight/lenis` (~5KB)
- `framer-motion` (verificar si ya está; si no, ~30KB gz)
- 0 imágenes nuevas en PR-A/B; PR-C puede pedir 2-3 fotos editoriales si quieres elevar el catálogo

---

### Pregunta antes de arrancar

¿Por dónde quieres que empiece?

1. **PR-A + PR-B** (smooth scroll + hero kinético) → 1 sesión, máximo "wow" en home con mínimo riesgo.
2. **PR-C** (catálogo editorial) → impacta donde el usuario decide comprar, pero requiere más trabajo de QA en móvil.
3. **Solo el prompt + un POC del hero** para validar la dirección antes de comprometer todo.
