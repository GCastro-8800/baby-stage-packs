

## Cambiar el favicon a bebloo

### Cambios

1. **Copiar el logo de bebloo** al directorio `public/` como `favicon.png`
   - Fuente: `src/assets/logo-bebloo.png` (ya existe en el proyecto)

2. **Actualizar `index.html`** para referenciar el nuevo favicon:
   - Reemplazar la referencia actual (`/favicon.ico`) por `/favicon.png`

### Archivos afectados
| Archivo | Cambio |
|---------|--------|
| `public/favicon.png` | Nuevo archivo (copia de `src/assets/logo-bebloo.png`) |
| `index.html` | Cambiar referencia de favicon a `/favicon.png` |

