# Rebranding visual: editorial & lujo minimalista

Objetivo: alejar la landing del look "SaaS tech" y acercarla a una marca editorial de lujo — fondo crema, serif elegante en titulares, ausencia de cajas/bordes/sombras, mucho aire y animaciones lentas y fluidas.

Alcance: **solo la landing pública** (`/`). El resto de la app (dashboard, configurador, admin) se mantiene como está para no romper densidad funcional.

---

## 1. Paleta — fondo crema/marfil

En `src/index.css`, ajustar tokens del tema claro:

- `--background`: `0 0% 99%` → **`36 33% 97%`** (≈ `#FBF9F6`)
- `--card`: alinear al mismo crema (sin contraste visible con el fondo, para que las "cards" desaparezcan visualmente)
- `--secondary` / `--muted`: subir un punto de calidez para mantener jerarquía sin grises fríos
- `--border`: bajar opacidad/contraste — bordes casi invisibles, solo como hairline cuando sean imprescindibles
- Mantener el coral (`--accent`) y el azul polvo (`--primary`) — son parte de la identidad de bebloo

`--hero-gradient` y `--section-warm` se recalculan sobre el nuevo crema para que no haya saltos entre secciones.

## 2. Tipografía — serif editorial en titulares

- Reemplazar el import de Google Fonts: quitar **Fraunces**, añadir **Cormorant Garamond** (300/400/500) manteniendo **DM Sans** para body.
- En `tailwind.config.ts`: `fontFamily.serif` → `['Cormorant Garamond', 'Georgia', 'serif']`.
- En `src/index.css` base: los `h1–h6` ya heredan `serif`; ajustar:
  - `font-weight: 400` (Cormorant pide algo más de peso que Fraunces para mantener presencia)
  - `letter-spacing: -0.01em` (Cormorant es más estrecha, no necesita tanto tracking negativo)
  - `line-height: 1.1` h1, `1.15` h2
- Revisar tamaños de los `clamp()` en `Hero.tsx` y `ManifestoBand.tsx` — Cormorant rinde más pequeña visualmente, subir ~10%.

## 3. Quitar cajas, bordes y sombras

Componentes de la landing afectados (todos en `src/components/`):
- `Hero.tsx` — quitar `shadow-quiet` y el `rounded-md` agresivo de la imagen → `rounded-sm` o sin radio, sin sombra
- `BrandLogosSection`, `HowItWorksSection`, `MissionSection`, `ComparisonSection`, `PricingSection`, `FAQSection`, `TestimonialsSection` — auditar y eliminar:
  - `border`, `border-border`, `shadow-*`
  - fondos `bg-card` / `bg-secondary` que crean "tarjetas"
  - reemplazar separadores por hairlines (`border-t border-border/30`) o por puro espacio vertical
- Aumentar padding vertical de secciones: `py-24 md:py-36` mínimo (ya lo usa `ManifestoBand`, extender al resto)
- Aumentar `gap` en grids y `space-y` en listas para más aire

## 4. Animaciones — más lentas y fluidas

- En `src/lib/motion.ts`: subir las duraciones base (0.6→1.0, 0.8→1.4) y mantener `easeOutExpo` (`[0.16, 1, 0.3, 1]`)
- `useSmoothScroll` (Lenis): `duration: 1.6` y `lerp: 0.08` para scroll más "mantequilloso"
- En `src/index.css`:
  - `.reveal` transition: `0.8s` → `1.4s`
  - `.cta-tension` hover transition: `300ms` → `500ms`, suavizar el `translateY` (-1px → -2px con más tiempo)
  - `.magnetic` transition: `240ms` → `420ms`
  - Shimmer del CTA: ralentizar de `9s` a `14s` y bajar opacidad del brillo
- Hover de botones (`button.tsx` variants): añadir `transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]` al base

## 5. QA visual

- Revisar `/` en viewport mobile (363px, el que está viendo el usuario ahora) y desktop
- Verificar contraste AA del texto sobre el nuevo crema
- Confirmar que `prefers-reduced-motion` sigue desactivando todo correctamente

---

## Detalles técnicos

**Archivos a tocar:**
- `src/index.css` (tokens, tipografía base, transiciones de utilidades)
- `tailwind.config.ts` (fontFamily.serif)
- `src/lib/motion.ts` (duraciones)
- `src/hooks/useSmoothScroll.ts` (Lenis params)
- `src/components/Hero.tsx`, `ManifestoBand.tsx`, `BrandLogosSection.tsx`, `HowItWorksSection.tsx`, `MissionSection.tsx`, `ComparisonSection.tsx`, `PricingSection.tsx`, `FAQSection.tsx`, `TestimonialsSection.tsx`, `Footer.tsx` (quitar bordes/sombras/cajas, aumentar aire)

**Lo que NO se toca:**
- Lógica de negocio, configurador, dashboard, admin, edge functions
- Identidad de marca (coral CTA y azul polvo siguen siendo los acentos)
- Memoria de proyecto (Fraunces estaba registrada como elección previa — la sustituimos por Cormorant en la memoria de diseño tras aplicar)

¿Procedo con la implementación?
