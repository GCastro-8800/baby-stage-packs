
# Sección de Logos de Marcas Partner

## Resumen
Crear una nueva sección elegante con logos de marcas premium de equipamiento infantil (Bugaboo, Stokke, Cybex, Babyzen) que aparecerá entre el Hero y "Cómo Funciona". Esta sección genera confianza social al mostrar que bebloo trabaja con las mejores marcas del mercado.

---

## Diseño Visual

```text
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│               Trabajamos con las mejores marcas                 │
│                                                                 │
│     ┌────────┐   ┌────────┐   ┌────────┐   ┌────────┐          │
│     │BUGABOO │   │ STOKKE │   │ CYBEX  │   │BABYZEN │          │
│     └────────┘   └────────┘   └────────┘   └────────┘          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Características
- Fondo sutil para separación visual del Hero
- Logos en escala de grises/opacity para elegancia (no compiten con la marca bebloo)
- Responsive: 4 columnas en desktop, 2x2 en móvil
- Animación hover sutil en cada logo

---

## Cambios a Realizar

### 1. Crear `BrandLogosSection.tsx`
Nuevo componente con:
- Texto introductorio sutil: "Trabajamos con las mejores marcas" o "Marcas de confianza"
- Grid de 4 logos con nombres de las marcas (usaremos texto estilizado ya que no tenemos los logos reales)
- Fondo `bg-secondary/30` para sutil separación
- Logos con opacity 60% que aumenta a 100% en hover
- Padding compacto para no ocupar mucho espacio vertical

### 2. Actualizar `Index.tsx`
- Importar `BrandLogosSection`
- Colocarlo entre `<Hero />` y `<HowItWorksSection />`

---

## Detalles Tecnicos

### Estructura del componente
```tsx
// Array de marcas
const brands = [
  { name: "Bugaboo", tagline: "Holanda" },
  { name: "Stokke", tagline: "Noruega" },
  { name: "Cybex", tagline: "Alemania" },
  { name: "Babyzen", tagline: "Francia" },
];
```

### Estilos clave
- Container: `py-8 md:py-12 bg-secondary/30`
- Grid: `grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8`
- Cada logo: card minimalista con nombre en tipografía elegante
- Hover: `opacity-60 hover:opacity-100 transition-opacity`

### Tipografía
- Título de sección: `text-sm uppercase tracking-wide text-muted-foreground`
- Nombres de marca: `text-xl font-semibold` en serif (Fraunces) para elegancia
- Subtítulo (país de origen): `text-xs text-muted-foreground`

---

## Por qué este diseño

1. **Credibilidad instantánea**: Los padres conocen estas marcas premium
2. **No compite con bebloo**: Logos sutiles en escala de grises
3. **Mínimo espacio vertical**: Section compacta que no interrumpe el flujo
4. **Elegancia europea**: Mencionar el país de origen refuerza la calidad
