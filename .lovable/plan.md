
# Rediseño Visual Estilo StrollMe para bebloo

## Objetivo
Transformar la landing page actual de bebloo para que adopte la estética moderna, amigable y visual de StrollMe, manteniendo los colores de marca (azul claro #A7D9FF + coral #F77F77), el tono de voz sereno y el modelo de negocio de suscripción de equipamiento para bebés.

---

## Cambios Visuales Principales

### 1. Hero Rediseñado
**Inspiración**: Layout de dos columnas con texto a la izquierda e imagen a la derecha

- Layout horizontal (texto + imagen) en desktop
- Viñetas con checkmarks debajo del titular principal
- Badge de validación social "50+ familias ya confían en nosotros"
- Estrellas de valoración con contador
- Fondo con gradiente suave usando el azul claro de marca

### 2. Nueva Sección "Cómo Funciona"
**Inspiración**: Tarjetas numeradas 1-2-3 con fondo amarillo/destacado

- 3 pasos visuales: "Elige tu pack" → "Úsalo" → "Lo recogemos"
- Tarjetas con números circulares y fondo en color primario
- Iconos ilustrativos para cada paso
- Fondo de sección en color destacado (primario claro)

### 3. Nueva Sección "Misión" 
**Inspiración**: Bloque grande con texto + imagen lifestyle

- Dos columnas: contenido de misión a la izquierda, imagen a la derecha
- Badge "NUESTRA MISIÓN" encima del título
- Título grande serif: "Usar no debería significar comprar"
- Párrafo explicativo sobre economía circular

### 4. Comparativa "Alquilar vs Comprar"
**Inspiración**: Dos columnas lado a lado mostrando ventajas vs desventajas

- Tarjeta izquierda: beneficios de alquilar (checkmarks verdes)
- Tarjeta derecha: problemas de comprar (texto tachado o gris)
- Fondo con gradiente verde/menta suave
- Ilustración de mano con bebé arriba

### 5. Sección FAQ con Acordeón
**Inspiración**: Lista de preguntas expandibles

- Preguntas frecuentes sobre el servicio
- Acordeón interactivo con iconos +/-
- Fondo neutro/blanco
- Botón "Ver todas las FAQ" opcional

### 6. Sección de Testimonios/Reseñas
**Inspiración**: Carrusel horizontal de testimonios con estrellas

- Tarjetas con nombre, estrellas, y cita
- Badge "Comprador verificado"
- Scroll horizontal en móvil

### 7. Mejoras al Footer
- Links de navegación organizados en columnas
- Iconos de redes sociales
- Información legal básica

---

## Cambios en Componentes Existentes

### Hero.tsx
- Cambiar de layout centrado a dos columnas
- Añadir viñetas de beneficios con checkmarks
- Añadir imagen placeholder a la derecha
- Badge de confianza con estrellas

### ProblemSection.tsx
- Renombrar/rediseñar como sección de comparativa "Alquilar vs Comprar"
- Dos columnas: ventajas de alquilar vs. problemas de comprar

### SolutionSection.tsx  
- Transformar en sección "Cómo Funciona" con 3 pasos numerados
- Tarjetas horizontales con fondo primario

### PricingSection.tsx
- Mantener estructura actual pero refinar estilos
- Bordes más suaves y espaciado más generoso

---

## Nuevos Componentes a Crear

1. **MissionSection.tsx** - Bloque de misión con imagen
2. **HowItWorksSection.tsx** - 3 pasos visuales (reemplazo de SolutionSection)
3. **ComparisonSection.tsx** - Alquilar vs Comprar (reemplazo de ProblemSection)
4. **FAQSection.tsx** - Acordeón de preguntas frecuentes
5. **TestimonialsSection.tsx** - Carrusel de testimonios

---

## Actualización de Colores/CSS

### Nuevos tokens CSS a añadir:
- `--section-warm`: Fondo cálido tipo crema (#FDF8F3)
- `--section-mint`: Fondo verde menta (#E8F5F0)  
- `--step-bg`: Fondo para tarjetas de pasos (amarillo suave adaptado al azul bebloo)

### Ajustes de estilo:
- Border-radius más grandes (2xl) en tarjetas principales
- Sombras más suaves y sutiles
- Tipografía serif más prominente en titulares

---

## Estructura Final de la Página

```text
1. Hero (dos columnas + imagen)
2. Cómo Funciona (3 pasos)
3. Misión (texto + imagen)
4. Comparativa Alquilar vs Comprar
5. Pricing (planes actuales mejorados)
6. FAQ (acordeón)
7. Testimonios (carrusel)
8. Footer (mejorado)
```

---

## Detalles Técnicos

### Imágenes
- Se usarán imágenes placeholder de Unsplash para lifestyle (familia, bebé, equipamiento)
- Las imágenes son solo de referencia y pueden ser reemplazadas por fotos propias

### Componentes UI utilizados
- Accordion de shadcn/ui para FAQ
- Cards existentes con estilos refinados
- Carousel para testimonios (embla-carousel ya instalado)

### Animaciones
- Fade-up al hacer scroll (ya existe)
- Hover suaves en tarjetas
- Transiciones de acordeón
