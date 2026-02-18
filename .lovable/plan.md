
# Dos mejoras en la pagina de packs

## 1. Eliminar el boton "Ver planes desde X euros/mes" del fondo de PackDetail

En la pagina `/packs/comfort` hay un bloque CTA al final con el texto "Ya lo tienes claro? Contrata el pack completo y ahorra." y un boton grande. Se eliminara todo ese bloque (lineas 71-87 de `src/pages/PackDetail.tsx`).

## 2. Corregir la interaccion hover entre el icono de vista previa (ojo) y el radio button

En `src/pages/PackStageProducts.tsx`, el boton del ojo y el RadioGroupItem estan muy juntos dentro de un `<label>`, lo que provoca que al pasar el raton entre ambos, a veces el clic en el ojo activa el radio (porque el `<label>` propaga el evento), o el hover se "pierde" visualmente.

### Solucion
- Aumentar el area tactil del boton del ojo (de `p-1` a `p-2`) para que sea mas facil de pulsar sin tocar el radio
- Aumentar la separacion entre ambos elementos (de `gap-2` a `gap-3`)
- Aplicar la misma mejora en la seccion de productos fijos (fixed), donde el boton del ojo tambien esta cerca del checkbox

### Detalles tecnicos

**Archivo `src/pages/PackDetail.tsx`**:
- Eliminar las lineas 71-87 (el bloque `{/* CTA */}` con el boton "Ver planes desde...")

**Archivo `src/pages/PackStageProducts.tsx`**:
- En la seccion de productos "choice" (linea 349): cambiar `gap-2` a `gap-3`
- En el boton del ojo de "choice" (linea 353): cambiar `p-1` a `p-2`
- En el boton del ojo de "fixed" (linea 280): cambiar `p-1` a `p-2`
