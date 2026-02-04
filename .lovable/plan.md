

# CTA Flotante Móvil para bebloo

## Resumen
Crear un botón CTA fijo en la parte inferior de la pantalla que solo se muestre en dispositivos móviles. El botón llevará a la sección de precios y se ocultará cuando el usuario ya esté en esa sección para evitar redundancia.

---

## Diseño Visual

### Móvil (< 768px)
```text
┌─────────────────────────────────────┐
│                                     │
│         [Contenido normal]          │
│                                     │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│     [ 🏷️ Ver planes desde €89 ]    │  ← Botón fijo
└─────────────────────────────────────┘
```

### Desktop (>= 768px)
El botón no se muestra - ya existe el CTA en el header.

---

## Cambios a Realizar

### 1. Crear `FloatingCTA.tsx`
Nuevo componente con:
- **Posición fija** en la parte inferior (`fixed bottom-0`)
- **Solo visible en móvil** usando el hook `useIsMobile`
- **Estilo CTA coral** usando la clase `cta-tension` existente
- **Padding inferior** para el contenedor principal (evitar que tape contenido)
- **Sombra hacia arriba** para separación visual del contenido
- **Auto-ocultamiento** cuando el usuario hace scroll hasta la sección de precios (opcional, para evitar redundancia)

### 2. Actualizar `Index.tsx`
- Importar y renderizar `<FloatingCTA />` 
- Añadir padding-bottom al contenedor para compensar la altura del botón flotante en móvil

### 3. Ajustar `Footer.tsx`
- Añadir padding-bottom extra en móvil para que el footer no quede tapado por el CTA flotante

---

## Detalles Tecnicos

### Componente FloatingCTA
- Usa `useIsMobile()` para mostrar solo en pantallas < 768px
- Usa `useAnalytics()` para trackear clicks
- Scroll suave usando `scrollIntoView({ behavior: "smooth" })`
- Clases: `fixed bottom-0 left-0 right-0 z-40 p-4 bg-background/95 backdrop-blur-sm border-t border-border md:hidden`

### Lógica de visibilidad inteligente
- El CTA se oculta automáticamente cuando el usuario hace scroll hasta la sección de precios (usando Intersection Observer)
- Esto evita mostrar dos CTAs redundantes (el del botón flotante y los de los planes)

### Texto del botón
- "Ver planes desde €89/mes" - incluye precio para generar urgencia
- Icono de flecha hacia abajo (`ArrowDown`)

