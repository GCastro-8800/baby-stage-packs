
# Fase 1 — Confianza

Objetivo: transformar la landing de "marca anónima de internet" a "servicio premium con personas reales y procesos serios" sin tocar la identidad editorial (crema + Cormorant + minimalismo).

Todo el contenido se escribe en español, sigue las reglas de terminología (Momento, kit, selección, servicio — nunca pack/plan/etapa/suscripción), y respeta el sistema de diseño actual (tokens semánticos HSL, sin cajas/bordes/sombras pesadas).

---

## 1. Página "Sobre nosotras" (`/sobre-nosotras`)

Refactor completo de `src/pages/AboutUs.tsx` con estructura editorial:

- **Hero editorial** — Eyebrow ("Quiénes somos") + H1 serif a dos líneas + párrafo breve.
- **Manifiesto** — 2–3 párrafos cortos sobre por qué existe bebloo (borrador honesto basado en lo que ya hay en `ManifestoBand` y `MissionSection`).
- **Bloque "Las personas detrás"** — Dos retratos en columna (fundadora + Paola) con:
  - Foto en proporción 4/5, sin bordes ni sombras, fondo crema.
  - Nombre · rol · 1 frase de credencial.
  - Placeholders editoriales (silueta crema con inicial serif) marcados con comentario `{/* TODO: reemplazar con foto real */}`.
- **Valores** — Tres pilares con hairlines (Cuidado · Honestidad · Sostenibilidad), una frase cada uno.
- **CTA cierre** — "Habla con nosotras" → Calendly de Paola + email `info@bebloo.es`.

Enlaces:
- Añadir "Sobre nosotras" al `Header.tsx` (desktop nav) y al `Footer.tsx` (columna principal).

## 2. Sección "Cómo cuidamos cada pieza" (en landing)

Nuevo componente `src/components/CareProcessSection.tsx`, insertado en `src/pages/Index.tsx` **entre `MissionSection` y `ComparisonSection`** (justo antes del bloque que compara comprar vs. bebloo — refuerza la narrativa de "no es de segunda mano cualquiera").

Estructura editorial en 4 pasos numerados (01–04) con tipografía serif grande para el número y descripción sans en muted:

1. **Devolución y recepción** — La pieza vuelve a nuestro taller en Madrid.
2. **Inspección manual** — Revisamos cada componente, tornillería y tejido.
3. **Limpieza con estándares hospitalarios** — Vapor a alta temperatura, productos hipoalergénicos, textiles a 60°C.
4. **Control de calidad** — Empaquetado individual para la próxima familia.

Sin cajas, separados con hairlines verticales en desktop / horizontales en mobile. Microcopy al pie: *"Si una pieza no pasa el control, no vuelve a salir."*

**Marcado claro como TODO**: el copy exacto de los 4 pasos debe validarlo la fundadora antes de publicar — borrador conservador, sin inventar certificaciones.

## 3. Testimonios enriquecidos

Refactor de `src/components/TestimonialsSection.tsx`:

- Estructura nueva por testimonio: `{ quote, name, city, moment, avatarUrl? }`.
- Renderizado editorial: cita grande en serif → línea hairline corta → nombre · ciudad · Momento del bebé. Sin tarjetas, sin sombras.
- Si `avatarUrl` está presente, mostrar avatar circular pequeño (40px) a la izquierda; si no, una inicial serif sobre círculo crema.
- Mantener el contenido textual actual (asumiendo que es real) y añadir campos `city` + `moment` con valores genéricos marcados como `TODO: confirmar con clientas`.

## 4. Banda de sellos de confianza

Nuevo componente `src/components/TrustBadgesBand.tsx`, insertado en `Index.tsx` **justo después del `Hero`** (reemplazando o complementando el `BrandLogosSection` actual si solapa).

Cuatro sellos en una fila, separados por hairlines verticales, en tipografía sans uppercase muy fina:

- Limpieza con estándares hospitalarios
- Marcas oficiales (Bugaboo · Stokke · Maxi-Cosi…)
- Envío y recogida incluidos en Madrid
- Pago seguro · Stripe

Sin iconos pesados — máximo un divisor `·` o un punto coral muy pequeño. Responsive: 2x2 en mobile.

## 5. FAQ categorizada

Refactor de `src/components/FAQSection.tsx`:

- Cambiar la estructura de datos de `Array<{q, a}>` a `Array<{category, items: [{q, a}]}>`.
- Cuatro categorías: **Higiene y cuidado** · **Envío y recogida** · **Cambios y devoluciones** · **Pago y facturación**.
- UI: navegación lateral de categorías a la izquierda (sticky en desktop), preguntas a la derecha. En mobile, las categorías son acordeones de primer nivel.
- Mantener el componente `Accordion` de shadcn ya existente con los overrides actuales (hairlines, sin cajas).
- Reasignar las FAQs actuales a categorías + añadir 2–3 huecos por categoría marcados como `TODO: pendiente de confirmar`.

---

## Detalles técnicos

**Archivos a crear:**
- `src/components/CareProcessSection.tsx`
- `src/components/TrustBadgesBand.tsx`

**Archivos a modificar:**
- `src/pages/AboutUs.tsx` — refactor completo.
- `src/pages/Index.tsx` — insertar `TrustBadgesBand` y `CareProcessSection`.
- `src/components/Header.tsx` — enlace "Sobre nosotras".
- `src/components/Footer.tsx` — enlace "Sobre nosotras".
- `src/components/TestimonialsSection.tsx` — nuevo schema + render.
- `src/components/FAQSection.tsx` — categorización + nav lateral.

**Lo que NO se toca:**
- Tokens de color en `index.css` ni `tailwind.config.ts`.
- Lógica de negocio, configurador, dashboard, admin, edge functions.
- Sistema de motion existente (`motion.ts`, Lenis).

**Tipografía/motion:** todos los nuevos bloques usan `font-serif` para titulares, `staggerContainer` + `lineReveal` para apariciones, padding `py-24 md:py-36`, consistente con `PaolaConsultationSection`.

---

## Lo que necesitará tu input para go-live (lo marco con `TODO` en código)

1. Fotos reales de fundadora y Paola.
2. Historia breve de cómo nació bebloo (1–2 párrafos).
3. Validación literal del proceso de higiene (pasos 1–4).
4. Ciudad + Momento del bebé de cada testimonio existente, y fotos si están disponibles.
5. Confirmación de las marcas oficiales a citar en la banda de sellos.

Puedes lanzarlo con los placeholders y reemplazar a medida que tengas el material — la estructura editorial aguanta perfectamente.
