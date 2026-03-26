

## Plan: Implementar mejoras de consultoría web — Quick Wins priorizados

Excelente análisis. Voy a mapear cada recomendación a cambios concretos, priorizados por impacto.

---

### Fase 1 — Prioridad Alta (Impacto inmediato)

**1. Contraste de textos (Accesibilidad WCAG AA)**
- `src/index.css`: Oscurecer `--muted-foreground` de `hsl(205 20% 45%)` a ~`hsl(205 20% 38%)` para cumplir ratio 4.5:1
- Revisar textos grises en HowItWorksSection, FAQ y testimonios

**2. JSON-LD de FAQ (SEO)**
- `src/components/FAQSection.tsx`: Añadir un `<script type="application/ld+json">` con el schema FAQPage de Google, generado dinámicamente desde el array `faqs`
- Esto hace que las preguntas aparezcan directamente en resultados de Google

**3. Optimización de imágenes**
- Añadir `loading="lazy"` a todas las imágenes debajo del hero (BrandLogos, testimonios, catálogo)
- Añadir atributos `alt` descriptivos y orientados a SEO (ej. "Cochecito Bugaboo Fox en alquiler para bebés")

**4. H1 SEO-friendly**
- `src/components/Hero.tsx`: Cambiar el `<h1>` de "Equipamiento para tu bebé. Curado por expertos." a algo más transaccional como "Alquiler de equipamiento premium para tu bebé" manteniendo el tono de marca

---

### Fase 2 — Prioridad Media

**5. Compactar Hero para mostrar logos sin scroll**
- Reducir padding vertical del hero en desktop (`lg:min-h-[85vh]` → `lg:min-h-[75vh]`)
- Reducir `gap-6 lg:gap-12` del grid para que los logos de marca sean visibles al cargar

**6. Ahorro real en ComparisonSection**
- `src/components/ComparisonSection.tsx`: Añadir un dato destacado tipo badge: "Ahorra hasta un 60% frente a la compra directa" como subtítulo o badge visual

**7. Mejorar alt texts de todas las imágenes**
- Auditar y actualizar textos alt en Hero, catálogo y tarjetas de producto con descripciones orientadas a SEO

---

### Fase 3 — Prioridad Baja (Optimización continua)

**8. Microinteracciones**
- Verificar hover states en FAQ accordion y carrusel de testimonios
- Añadir `transition-colors` donde falte

**9. Navegación por teclado**
- Verificar focus visible en CTAs y links del header
- Asegurar que el selector de duración sea navegable con Tab

---

### Archivos afectados
- `src/index.css` — contraste
- `src/components/FAQSection.tsx` — JSON-LD
- `src/components/Hero.tsx` — H1 SEO + compactar
- `src/components/ComparisonSection.tsx` — dato de ahorro
- `src/components/BrandLogosSection.tsx` — lazy loading
- `src/components/TestimonialsSection.tsx` — lazy loading, alt texts

### Lo que NO cambia
- El CTA "Descubre qué necesitas" se mantiene por ahora (el A/B testing requiere herramientas externas tipo Posthog)
- No se cambia el modelo de negocio en la UI (ya se aclaró en la iteración anterior)

