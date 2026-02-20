
# Arreglar el logo del footer

## Problema

El logo PNG usa colores y degradados que no se convierten bien a blanco con filtros CSS (`brightness-0 invert`). El resultado es un logo pequeno y de baja calidad visual que no transmite la marca correctamente.

## Solucion

Reemplazar la imagen del logo por el nombre de la marca escrito con la tipografia de marca (Fraunces, la misma usada en los titulos). Esto garantiza que se vea nitido y profesional sobre el fondo oscuro, sin depender de filtros CSS.

El resultado sera el texto "bebloo" en blanco, con la tipografia serif de la marca, a un tamano similar al logo actual.

## Seccion tecnica

### Archivo a modificar

- `src/components/Footer.tsx` (linea 12): Reemplazar la etiqueta `<img>` por un elemento `<h3>` o `<span>` con el texto "bebloo", usando la fuente Fraunces (ya aplicada automaticamente a headings por el CSS global), en color blanco (`text-background`), tamano grande (`text-2xl`), y sin el import del logo si ya no se usa en el archivo.

**Antes:**
```tsx
import logo from "@/assets/logo-bebloo.png";
// ...
<img src={logo} alt="bebloo" className="h-10 mb-4 brightness-0 invert" />
```

**Despues:**
```tsx
// Sin import de logo
<h3 className="text-2xl text-background mb-4 tracking-tight">bebloo</h3>
```

Es un cambio minimo de 2 lineas (quitar import + reemplazar img).
