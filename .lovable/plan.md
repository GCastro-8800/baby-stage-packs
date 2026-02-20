

# Arreglar el logo del footer

## Problema

El logo se ve con colores marrones/naranjas sobre el fondo oscuro porque solo tiene la clase `invert`, que invierte los colores pero no los convierte a blanco.

## Solucion

Restaurar la clase `brightness-0` junto con `invert` en la etiqueta `<img>` del logo en `src/components/Footer.tsx` (linea 12).

- `brightness-0` convierte toda la imagen a negro
- `invert` luego la convierte a blanco puro

**Antes:** `className="h-10 mb-4 invert"`
**Despues:** `className="h-10 mb-4 brightness-0 invert"`

## Seccion tecnica

### Archivo a modificar
- `src/components/Footer.tsx` (linea 12): cambiar `invert` por `brightness-0 invert`

Es un cambio de una sola linea.

