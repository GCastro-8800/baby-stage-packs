

## Objetivo
Mejorar la experiencia visual en desktop para que se vea tan bien como en móvil, manteniendo la estética premium de bebloo.

---

## Problemas identificados

### 1. MissionSection - Imagen con espacios vacíos
- **Problema**: Al usar `object-contain` con `aspect-[3/4]`, la imagen se ve pequeña dentro de un contenedor grande en desktop, dejando espacios vacíos visibles.
- **Causa**: El cambio anterior priorizó mostrar la imagen completa, pero sacrificó la estética en pantallas grandes.

### 2. Hero - Balance mejorable
- **Problema**: La imagen y el contenido están bien estructurados, pero en pantallas muy grandes podrían aprovechar mejor el espacio.

### 3. Espaciado y presencia visual
- **Problema**: Algunas secciones se sienten un poco comprimidas en desktop.

---

## Solución propuesta

### Archivo: `src/components/MissionSection.tsx`

**Estrategia**: Usar un enfoque responsivo que muestre la imagen completa en móvil pero la recorte elegantemente en desktop.

| Propiedad | Móvil | Desktop |
|-----------|-------|---------|
| Aspect ratio | 3:4 (vertical) | 4:5 (más cuadrado) |
| Object fit | contain | cover |
| Object position | center | center top |

```text
┌─────────────────────────────────────────────────────────────────┐
│                      DESKTOP (lg+)                              │
├─────────────────────────────┬───────────────────────────────────┤
│                             │                                   │
│  Badge: Nuestra misión      │   ┌─────────────────────────────┐ │
│                             │   │                             │ │
│  Título grande              │   │     Imagen con cover        │ │
│                             │   │     aspect-[4/5]            │ │
│  Párrafos de texto          │   │     Llena el espacio        │ │
│                             │   │     sin huecos              │ │
│  Stats: 50+ | 100% | 0      │   │                             │ │
│                             │   └─────────────────────────────┘ │
└─────────────────────────────┴───────────────────────────────────┘
```

**Cambios específicos**:
1. Container de imagen: `aspect-[3/4] lg:aspect-[4/5]`
2. Imagen: `object-contain lg:object-cover lg:object-top`
3. Esto mantiene la imagen completa en móvil y la recorta elegantemente en desktop

### Archivo: `src/components/Hero.tsx`

**Mejoras para desktop**:
1. Aumentar el gap entre columnas en desktop: `lg:gap-16`
2. Ajustar el max-width de la imagen para mejor proporción: `lg:max-w-xl`
3. Añadir más padding vertical en desktop

**Cambios específicos**:
- Línea 27: `gap-8 lg:gap-12` → `gap-8 lg:gap-16`
- Línea 82: `max-w-md lg:max-w-lg` → `max-w-md lg:max-w-xl`

---

## Resumen de cambios

| Archivo | Cambio | Resultado |
|---------|--------|-----------|
| `MissionSection.tsx` | Aspect ratio y object-fit responsivos | Imagen sin huecos en desktop, completa en móvil |
| `Hero.tsx` | Más espacio entre columnas y imagen más grande | Mejor balance y presencia en desktop |

---

## Detalles técnicos

```tsx
// MissionSection.tsx - Container de imagen
<div className="aspect-[3/4] lg:aspect-[4/5] rounded-3xl overflow-hidden bg-secondary shadow-lg">
  <img
    src={missionImage}
    alt="Madre con su bebé en portabebé"
    className="w-full h-full object-contain lg:object-cover lg:object-top"
  />
</div>

// Hero.tsx - Grid y container de imagen
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
  ...
  <div className="relative w-full max-w-md lg:max-w-xl">
```

