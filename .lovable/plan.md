

# Arreglar el selector de duracion en movil

## Problema

Los badges de descuento (-5%, -10%, -20%) usan posicionamiento absoluto (`absolute -top-2 -right-2`) que los hace flotar fuera de los botones, creando un aspecto desordenado especialmente en movil.

## Solucion

Redisenar el selector para que el descuento aparezca **inline debajo del texto** del label, dentro del mismo boton. Esto elimina el desbordamiento y se ve limpio en cualquier pantalla.

**Antes:** Badge flotante con `absolute -top-2 -right-2`
**Despues:** Texto de descuento inline debajo del label, sin Badge

## Seccion tecnica

### Archivo: `src/components/DurationSelector.tsx`

Cambiar la estructura de cada boton de:
```tsx
<button className="relative ...">
  {opt.label}
  <Badge className="absolute -top-2 -right-2 ...">-5%</Badge>
</button>
```

A:
```tsx
<button className="flex flex-col items-center ...">
  <span>{opt.label}</span>
  {opt.discount > 0 && (
    <span className="text-[10px] font-semibold text-primary">-{opt.discount * 100}%</span>
  )}
</button>
```

- Eliminar el import de `Badge`
- Eliminar `relative` del boton
- Agregar `flex flex-col items-center` al boton
- Aumentar ligeramente el padding para dar espacio al texto de descuento

Es un cambio de un solo archivo.

