
## Objetivo
Arreglar la sección de logos para que:
1) **Todos los logos se vean del mismo tamaño** (misma “caja” visual, alineados y consistentes).
2) El **marquee sea 100% continuo y suave**, sin “saltos” cuando el loop vuelve a empezar.

---

## Diagnóstico (qué está causando los saltos)
Ahora mismo el contenedor animado es un `div` flex “normal” (bloque) que por defecto tiende a medir **ancho del contenedor (100%)**, no el ancho real de todo el contenido duplicado.  
Como la animación usa `translateX(-50%)`, ese **50% puede estar calculándose sobre el ancho equivocado**, y al reiniciar el ciclo se nota el “salto”.

---

## Cambios propuestos

### A) Marquee realmente infinito (sin saltos)
**Archivo:** `src/components/BrandLogosSection.tsx`

1. Hacer que la “pista” animada mida **el ancho real del contenido**:
   - Cambiar el contenedor animado a `inline-flex` + `w-max` (o `w-max` explícito), para que su ancho sea “max-content”.
   - Añadir `will-change-transform` para suavidad.

2. Mantener el patrón correcto de loop:
   - Renderizar **dos copias idénticas** (A + A).
   - Animar de `0` a `-50%` (que equivale exactamente a “mover una copia completa”).

3. Evitar “huecos” en pantallas anchas (con solo 4 marcas puede quedarse corto):
   - En vez de animar solo `brands`, crear una secuencia más larga repitiendo marcas (por ejemplo 8–12 items):
     - `const sequence = Array.from({ length: 8 }, (_, i) => brands[i % brands.length]);`
   - Luego renderizar `sequence` dos veces (A + A).  
   Esto hace que siempre haya suficientes logos ocupando ancho y el loop sea convincente.

**Estructura final sugerida (concepto):**
- `overflow-hidden` (viewport)
  - pista animada: `inline-flex w-max animate-marquee will-change-transform`
    - grupo A: `flex shrink-0` (map sequence)
    - grupo A duplicado: `flex shrink-0` (map sequence, `aria-hidden="true"`)

---

### B) Todos los logos con el mismo tamaño (consistencia visual)
**Archivo:** `src/components/BrandLogosSection.tsx`

1. En vez de dejar cada logo con `w-auto`, envolverlos en una **caja fija**:
   - Wrapper con tamaño fijo, por ejemplo:
     - `w-28 md:w-36` y `h-12 md:h-14` (ajustaremos si lo ves mejor más grande/pequeño)
   - Dentro, el `<img>` con:
     - `w-full h-full object-contain`
   Así cada marca ocupa la misma “tarjeta” y se percibe homogéneo.

2. Mantener el efecto premium:
   - `grayscale` + `hover:grayscale-0`
   - transición suave

3. (Opcional si algún PNG viene con mucho padding/aire)
   - Añadir un factor de ajuste por marca:
     - `brands = [{ name, logo, scale?: 1.05 }]`
   - Aplicar `style={{ transform: \`scale(${brand.scale ?? 1})\` }}` al `<img>`.
   Esto es un “plan B” si alguna imagen concreta (por cómo está exportada) sigue viéndose más pequeña aunque la caja sea fija.

---

### C) Micro-mejoras de suavidad (opcional)
**Archivo:** `tailwind.config.ts`

- Cambiar el keyframe a `translate3d` para forzar composición por GPU:
  - `from: { transform: "translate3d(0,0,0)" }`
  - `to: { transform: "translate3d(-50%,0,0)" }`

- Añadir accesibilidad:
  - En la pista animada: `motion-reduce:animate-none`

La duración **se mantiene en 7s** como quieres.

---

## Criterios de aceptación (cómo sabremos que quedó bien)
1. Los 4 logos se ven **con el mismo tamaño de caja** (altura/ancho consistentes).
2. La banda se mueve y al “reiniciar” el loop:
   - **no se nota ningún salto**
   - **no aparece espacio en blanco**
3. Probado en:
   - móvil (390px)
   - tablet (768px)
   - desktop (1366px / 1536px)

---

## Plan de implementación (pasos)
1. Editar `BrandLogosSection.tsx`:
   - Crear `sequence` repetido
   - Reestructurar markup a pista `inline-flex w-max` con dos grupos idénticos
   - Aplicar caja fija a cada logo (wrapper + img `object-contain`)
2. (Opcional) Ajustar `tailwind.config.ts` a `translate3d` si aún se percibe micro-stutter.
3. Verificación visual en preview en varios anchos, comprobando que el loop es perfecto.

---

## Riesgos / notas
- Si algún logo PNG tiene mucho “padding transparente” dentro del archivo, la caja fija mejora mucho, pero puede que aún se perciba ligeramente distinto. En ese caso aplicamos el ajuste `scale` por marca (sin tocar los archivos de imagen).
