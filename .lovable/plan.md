
## Objetivo
Aumentar el tamaño del logo de bebloo en el header tanto en móvil como en desktop para mejorar la visibilidad de la marca.

---

## Estado actual
El logo tiene las siguientes clases de altura:
- **Móvil**: `h-8` (32px)
- **Desktop**: `h-10` (40px)
- **Menú móvil (Sheet)**: `h-8` (32px)

---

## Cambios propuestos

### Archivo: `src/components/Header.tsx`

1. **Logo principal en el header** (línea 72):
   - Cambiar de `h-8 md:h-10` a `h-10 md:h-12`
   - Móvil: pasa de 32px → 40px
   - Desktop: pasa de 40px → 48px

2. **Logo en el menú móvil (Sheet)** (línea 111):
   - Cambiar de `h-8` a `h-10`
   - Pasa de 32px → 40px

---

## Resultado esperado
| Ubicación | Antes | Después |
|-----------|-------|---------|
| Header móvil | 32px | 40px |
| Header desktop | 40px | 48px |
| Menú Sheet | 32px | 40px |

El logo se verá más prominente y acorde con la identidad visual premium de bebloo.
