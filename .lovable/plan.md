

# Auditoría completa del sitio bebloo

---

## 1. Contenido y estructura

### Bien
- Landing con estructura sólida: Hero, Logos, Cómo funciona, Misión, Comparativa, CTA, FAQ, Testimonios, Footer
- FAQ actualizada al modelo de selección individual
- Páginas legales presentes: /privacidad, /condiciones, /quienes-somos
- Info de contacto en Footer (email, teléfono, Instagram)

### Problemas encontrados

**P1 — Terminología inconsistente: "suscripción" aparece en 15+ archivos públicos**
Aunque las FAQ se actualizaron, el término prohibido "suscripción" sigue en:
- `Footer.tsx` (línea 15): "Suscripción de equipamiento premium"
- `PricingSection.tsx` (línea 56): "suscripciones de 12 meses"
- `CheckoutOptionsDialog.tsx` (línea 115): "finalizar tu suscripción"
- `CheckoutSuccess.tsx` (línea 46): "¡Suscripción confirmada!"
- `TermsOfService.tsx`: menciona "suscripción" y "pack" por todo el documento
- `PrivacyPolicy.tsx`: "suscripción" en múltiples sitios
- `AboutUs.tsx` (título SEO): "Suscripción para Bebés"
- `Hero.tsx` (línea 73): "Cambio de etapa gratis" — usa "etapa", que es aceptable pero podría confundir
- `WelcomeTutorial.tsx`, `NoSubscriptionCard.tsx`, `SubscriptionCard.tsx` en dashboard

**P2 — TermsOfService.tsx y PrivacyPolicy.tsx desactualizados**
Usan terminología antigua ("pack", "etapas de crecimiento", "suscripción mensual") que no refleja el modelo actual de selección individual con duración por producto.

**P3 — No hay sección de Precios en la landing (eliminada o no renderizada)**
`Index.tsx` no importa ni renderiza `PricingSection`. El enlace "Precios" en el Footer apunta a `#precios` pero esa sección no existe en la página.

---

## 2. UX y navegación

### Bien
- Header fijo con transparencia/blur al scroll
- Menú móvil con Sheet
- FloatingCTA móvil que aparece al pasar el hero
- ChatBot con drawer móvil y panel desktop
- WhatsApp flotante bien posicionado (bottom-24 móvil, bottom-6 desktop)

### Problemas

**P4 — Enlace "Precios" del Footer no funciona**
Apunta a `#precios` que no existe en Index.tsx.

**P5 — Imágenes sin alt descriptivo**
`ProductImagePlaceholder.tsx` usa `alt=""` en las imágenes de producto — afecta accesibilidad y SEO.

**P6 — Carrusel de testimonios sin controles en móvil**
Los botones Previous/Next tienen `hidden md:flex`, así que en móvil no hay forma visible de navegar (solo swipe, sin indicador).

---

## 3. Diseño visual

### Bien
- Paleta coherente (azul claro + coral para CTAs)
- Tipografía dual bien implementada (Fraunces para títulos, DM Sans para cuerpo)
- Jerarquía visual clara con badges, iconos y spacing
- Secciones con fondos alternados (warm, mint, step, card)

### Problemas

**P7 — Footer vacío en el nombre de marca**
`Footer.tsx` línea 14: el `<h3>` está vacío — no muestra el logo ni el nombre "bebloo".

---

## 4. Conversión y engagement

### Bien
- CTA coral destacado en Hero, sección intermedia y FloatingCTA
- Micro-validaciones bajo el CTA del Hero
- ChatBot y WhatsApp como canales de contacto
- EmailCaptureModal funcional

### Problemas

**P8 — La sección `#precios` no se renderiza**
La landing salta de Comparación a un CTA genérico y luego a FAQ. No hay sección de precios visible que ancle la propuesta de valor económica.

---

## 5. SEO básico

### Bien
- `<html lang="es">` correcto
- Meta title y description presentes
- OG tags configurados

### Problemas

**P9 — OG image apunta a lovable.dev placeholder**
`index.html` usa `https://lovable.dev/opengraph-image-p98pqg.png` — debería ser una imagen propia de bebloo.

**P10 — No hay etiquetas `alt` en logos de marcas del carrusel**
Tienen `alt={brand.name}` — esto está correcto realmente.

**P11 — Falta structured data (JSON-LD)**
No hay FAQ schema, Organization schema ni LocalBusiness schema que podrían mejorar visibilidad en Google.

---

## 6. Funcionalidad y bugs

**P12 — `PricingSection` importado pero no renderizado en Index**
El componente existe y el Footer enlaza a `#precios`, pero Index.tsx no lo incluye.

**P13 — Páginas legacy con redirects (`PackDetail`, `PackStageProducts`)**
Estas páginas siguen existiendo con contenido obsoleto (mencionan "suscripción", "pack"). Aunque redirigen desde las rutas principales, el código muerto añade confusión.

---

## Plan de corrección (priorizado)

### Alta prioridad
1. **Añadir PricingSection a Index.tsx** — o eliminar el enlace `#precios` del Footer si no aplica
2. **Limpiar "suscripción" de componentes públicos** — Footer, PricingSection, CheckoutOptionsDialog, CheckoutSuccess, Hero micro-copy
3. **Corregir Footer: mostrar logo/nombre** en el `<h3>` vacío
4. **Actualizar TermsOfService.tsx** al modelo actual (selección individual, sin "pack" ni "suscripción")
5. **Actualizar PrivacyPolicy.tsx** al modelo actual

### Media prioridad
6. **Añadir OG image propia** en index.html (requiere imagen real de bebloo)
7. **Añadir alt descriptivos** en ProductImagePlaceholder (usar nombre del producto)
8. **Añadir indicador de swipe** al carrusel de testimonios en móvil (dots o instrucción visual)
9. **Actualizar AboutUs.tsx** — limpiar meta title que dice "Suscripción"

### Baja prioridad
10. **Añadir JSON-LD** para FAQ y Organization
11. **Eliminar código legacy** de PackDetail, PackStageProducts si ya no se usan
12. **Limpiar terminología en dashboard** (NoSubscriptionCard, SubscriptionCard, WelcomeTutorial)

---

### Archivos a modificar

| Archivo | Cambio |
|---|---|
| `src/pages/Index.tsx` | Añadir PricingSection o eliminar referencia |
| `src/components/Footer.tsx` | Corregir h3 vacío, cambiar "Suscripción" |
| `src/components/PricingSection.tsx` | Eliminar "suscripciones" |
| `src/components/configurator/CheckoutOptionsDialog.tsx` | Cambiar "suscripción" por "selección" |
| `src/pages/CheckoutSuccess.tsx` | Cambiar "Suscripción confirmada" |
| `src/pages/TermsOfService.tsx` | Reescribir al modelo actual |
| `src/pages/PrivacyPolicy.tsx` | Reescribir al modelo actual |
| `src/pages/AboutUs.tsx` | Corregir meta title |
| `src/components/configurator/ProductImagePlaceholder.tsx` | Añadir alt descriptivo |
| `src/components/TestimonialsSection.tsx` | Añadir dots móvil |
| `index.html` | OG image propia |

