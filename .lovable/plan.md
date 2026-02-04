
# Header de Navegación Fija para bebloo

## Resumen
Crear un componente de navegación sticky que permanezca visible al hacer scroll, con logo, enlaces a secciones y un CTA prominente. En móvil, se transformará en un menú hamburguesa desplegable.

---

## Diseño Visual

### Desktop
```text
┌─────────────────────────────────────────────────────────────────┐
│ [Logo]     Cómo funciona   Precios   FAQ          [Empezar →]  │
└─────────────────────────────────────────────────────────────────┘
```

### Móvil
```text
┌─────────────────────────────────────┐
│ [Logo]                        [≡]  │
└─────────────────────────────────────┘
         ↓ Al pulsar ≡ ↓
┌─────────────────────────────────────┐
│  × Cerrar                          │
│                                     │
│  Cómo funciona                     │
│  Precios                           │
│  FAQ                               │
│                                     │
│  [────── Empezar ──────]           │
└─────────────────────────────────────┘
```

---

## Cambios a Realizar

### 1. Crear `Header.tsx`
Nuevo componente con:
- **Posición fija** (`fixed top-0`) con fondo blur
- **Logo bebloo** (ya existe en `src/assets/logo-bebloo.png`)
- **Links de navegación** que hacen scroll suave a:
  - "Cómo funciona" → sección HowItWorks
  - "Precios" → sección Pricing  
  - "FAQ" → sección FAQ
- **Botón CTA "Empezar"** que lleva a Pricing
- **Menú hamburguesa en móvil** usando `Sheet` de shadcn/ui
- **Efecto de fondo** que aparece tras hacer scroll

### 2. Añadir IDs a las secciones
Para que la navegación por anclas funcione:
- `HowItWorksSection.tsx` → `id="como-funciona"`
- `PricingSection.tsx` → `id="precios"` 
- `FAQSection.tsx` → `id="faq"`

### 3. Actualizar `Index.tsx`
- Importar y renderizar `<Header />` antes del Hero
- Añadir `padding-top` al contenedor para compensar el header fijo

### 4. Ajustar `Hero.tsx`
- Quitar el logo del Hero (ahora está en el header)
- Ajustar spacing superior

---

## Detalles Técnicos

### Componentes utilizados
- `Sheet` + `SheetContent` de shadcn/ui para menú móvil
- `Button` existente para CTAs
- `useIsMobile` hook para responsive
- Lucide icons: `Menu`, `X`

### Comportamiento del header
- Fondo transparente al inicio
- Fondo con blur (`bg-background/80 backdrop-blur`) al hacer scroll
- Transición suave entre estados
- `z-50` para estar por encima de todo el contenido

### Scroll suave
- Usando `scrollIntoView({ behavior: "smooth" })`
- `scroll-mt-20` en secciones para compensar altura del header fijo

### Analytics
- Track de clicks en navegación usando el hook `useAnalytics` existente
