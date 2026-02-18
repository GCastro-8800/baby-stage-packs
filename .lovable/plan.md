

# Diferenciar la pagina Quienes Somos de la landing

## Problema

La pagina AboutUs reutiliza las mismas imagenes que la landing principal:
- `mother-stroller.png` se usa en el Hero de la landing Y en el Hero de AboutUs
- `mother-carrier.png` se usa en la MissionSection de la landing Y en la seccion "La Idea" de AboutUs

Esto hace que al navegar entre paginas se sienta repetitivo y poco profesional.

## Solucion

Reorganizar las imagenes para que cada pagina tenga su identidad visual propia, usando las imagenes disponibles que NO aparecen en la landing.

### Cambios de imagenes en AboutUs

| Seccion | Antes | Despues |
|---------|-------|---------|
| Hero (seccion 1) | `mother-stroller.png` (duplicada del Hero landing) | `hero-family-stroller.jpg` (imagen disponible, no usada en ningun lado) |
| Somos Bebloo (seccion 2) | `twins-happy.jpg` (ok, unica) | Sin cambio |
| La Idea (seccion 3) | `mother-carrier.png` (duplicada de MissionSection landing) | `mission-family.jpg` (mover aqui) |
| Nuestra Vision (seccion 4) | `mission-family.jpg` | `twins-happy.jpg` (intercambiar con seccion 2) |

Resultado final:
- **Seccion 1 Hero**: `hero-family-stroller.jpg` (imagen fresca, nunca usada)
- **Seccion 2 Somos Bebloo**: `mission-family.jpg` (familia, encaja con la historia personal)
- **Seccion 3 La Idea**: `mother-carrier.png` se mantiene aqui ya que es la unica seccion donde encaja tematicamente, y al estar mas abajo en la pagina no se siente tan repetitiva respecto a la landing
- **Seccion 4 Nuestra Vision**: `twins-happy.jpg` (gemelos felices, encaja con vision de futuro)

## Detalles tecnicos

### Archivo: `src/pages/AboutUs.tsx`

Cambios en las importaciones (lineas 19-22):
- Reemplazar `heroImg` de `mother-stroller.png` por `hero-family-stroller.jpg`
- Intercambiar las asignaciones de `twinsImg` y `missionImg` en las secciones

Cambios en las secciones:
- Seccion 1 (Hero, linea 133): usar la nueva imagen `hero-family-stroller.jpg`
- Seccion 2 (Somos Bebloo, linea 148): usar `mission-family.jpg` en vez de `twins-happy.jpg`
- Seccion 4 (Nuestra Vision, linea 188): usar `twins-happy.jpg` en vez de `mission-family.jpg`

No hay cambios en otros archivos ni dependencias nuevas.
