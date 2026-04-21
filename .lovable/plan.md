

## Reemplazar imagen de la sección "Nuestra misión"

Sustituir la segunda imagen de la home (madre con portabebé en `MissionSection`) por la foto del bebé en cochecito YOYO que has subido.

### Cambios

1. **Copiar la imagen subida** al proyecto:
   - Origen: `user-uploads://Enfant_dans_une_poussette_YOYO_en_terrasse.png`
   - Destino: `src/assets/baby-yoyo-stroller.png`

2. **Editar `src/components/MissionSection.tsx`**:
   - Cambiar el import: `mother-carrier.png` → `baby-yoyo-stroller.png`
   - Renombrar la variable: `missionImage` → `babyStrollerImage` (para coherencia)
   - Actualizar el `alt` de la `<img>` a algo descriptivo y SEO-friendly en español: `"Bebé en cochecito YOYO de Babyzen — equipamiento premium en alquiler con bebloo"`
   - Mantener el contenedor `aspect-[4/5] rounded-3xl` y el `object-cover` para que la foto vertical encaje sin recortes raros (ajustaremos `object-position` a `center` en lugar de `top`, ya que el sujeto está centrado verticalmente).

### Lo que NO se toca

- Imagen del Hero (`mother-stroller.png`).
- Texto, badges ni métricas de la sección Misión.
- Layout, tipografía ni colores.
- El archivo antiguo `mother-carrier.png` se queda en `src/assets/` por si se reutiliza en el futuro (no lo borramos para evitar romper otros usos accidentales — verificable rápidamente, pero seguro mantenerlo).

### Verificación post-cambio

- Home → scrollear hasta la sección "Nuestra misión" → debe aparecer la foto del bebé en YOYO.
- Comprobar que en mobile (vertical) y desktop (lado derecho del grid) la imagen se ve completa y bien encuadrada.

