

# Iteracion 3+4: Eliminar packs y actualizar toda la home

## Resumen

Actualizar la pagina principal, header, hero, how-it-works, floating CTA y rutas para que todo apunte al nuevo modelo de productos individuales. Eliminar las referencias a packs y la seccion de pricing antigua.

---

## Cambios en archivos existentes

### 1. `src/pages/Index.tsx`
- Eliminar imports de `PricingSection`, `SurveySection`, `EmailCaptureModal`, `DurationSelector`
- Eliminar el componente `PricingSection` del render
- Eliminar `SurveySection` y `EmailCaptureModal`
- Eliminar estado `isModalOpen`, `selectedPlan`, `pricingRef`, `scrollToPricing`
- Anadir una seccion simplificada tipo CTA que invite al configurador (un bloque con titulo + boton "Descubre que necesitas")
- Hero ya no recibe `onSeePricing`, recibe navegacion al configurador

### 2. `src/components/Hero.tsx`
- Cambiar titulo: "Equipamiento para tu bebe. Curado por expertos."
- Cambiar subtitulo: "Sin decisiones equivocadas. Sin espacio ocupado. Sin estres de reventa."
- CTA principal: "Descubre que necesitas" -> `navigate("/configurador")`
- Eliminar prop `onSeePricing` y usar `useNavigate` directamente
- Quitar texto "Desde 59/mes" y "Descubre los packs"
- Actualizar micro-validacion inferior

### 3. `src/components/Header.tsx`
- Cambiar navLink "Precios" (href: "#precios") por "Productos" (href: "/catalogo", isRoute: true)
- CTA "Empezar" -> navega a `/configurador` en vez de scroll a precios

### 4. `src/components/HowItWorksSection.tsx`
- Paso 1: "Elige tu pack" -> "Cuentanos tu situacion" / "Responde 4 preguntas sobre tu situacion"
- Paso 3: "te enviamos el pack de la siguiente etapa" -> "te enviamos lo que necesita en su nueva etapa"

### 5. `src/components/FloatingCTA.tsx`
- Texto: "Ver planes desde 79/mes" -> "Descubre que necesitas"
- Accion: navegar a `/configurador` en vez de scroll a precios
- Ya no depende de seccion "#precios" para visibilidad (siempre visible en scroll, o usar hero como referencia)

### 6. `src/App.tsx`
- Rutas de packs (`/packs/:packId`, `/packs/:packId/checkout`, `/packs/:packId/etapa/:stageId`) -> redirect a `/configurador`
- Anadir ruta `/catalogo` (placeholder por ahora, igual que Selection)

### 7. `src/components/dashboard/PlanRecommenderDialog.tsx`
- Cambiar CTA para redirigir a `/configurador` en vez de a packs

---

## Archivos que NO se eliminan aun

Los componentes de packs (`PricingSection`, `DurationSelector`, `PackDetail`, etc.) se mantienen en el repositorio pero quedan sin uso. Se pueden eliminar en una fase posterior de limpieza para no romper nada.

---

## Resultado esperado

- La home muestra el nuevo copy sin mencion a packs
- Todos los CTAs llevan al configurador (`/configurador`)
- El header tiene "Productos" en vez de "Precios"
- Las rutas antiguas de packs redirigen al configurador
- El floating CTA en movil lleva al configurador
