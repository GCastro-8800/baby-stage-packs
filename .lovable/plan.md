

## Corregir margenes de la segunda imagen (seccion Mision)

### Problema
La imagen de la seccion "Nuestra mision" (madre con portabebes) tiene espacios grises y blancos alrededor porque:
- En movil se usa `object-contain`, lo que deja huecos visibles dentro del contenedor
- El fondo `bg-secondary` (gris claro) se ve en esos huecos
- La relacion de aspecto del contenedor no se ajusta bien al contenido de la imagen

### Solucion
Modificar `src/components/MissionSection.tsx`:

1. Cambiar `object-contain` a `object-cover` en todas las resoluciones para que la imagen llene completamente el contenedor sin dejar espacios
2. Ajustar la relacion de aspecto a `aspect-[4/5]` tanto en movil como en desktop para un contenedor mas proporcionado
3. Eliminar el fondo `bg-secondary` del contenedor de la imagen, ya que con `object-cover` no habra huecos visibles

### Archivo a modificar
| Archivo | Cambio |
|---------|--------|
| `src/components/MissionSection.tsx` | Linea 51: cambiar `aspect-[3/4] lg:aspect-[4/5]` a `aspect-[4/5]`; eliminar `bg-secondary`. Linea 55: cambiar `object-contain lg:object-cover lg:object-top` a `object-cover object-top` |
