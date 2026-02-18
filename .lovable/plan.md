

# Diferenciar visualmente la pagina Quienes Somos de la landing

## Problema

Ambas paginas usan el mismo patron visual exacto:
- Grid 2 columnas con imagen `aspect-[4/5]` redondeada
- Misma tipografia serif para titulos
- Mismo espaciado y separador coral
- El usuario siente que no cambio de pagina

## Solucion: Estilo editorial diferenciado para AboutUs

Mientras la landing usa un estilo "comercial" (badges, checkmarks, CTAs, floating cards), la pagina de Quienes Somos adoptara un estilo mas **editorial/revista** con estos cambios:

### Cambios visuales clave

1. **Hero full-width** en vez de zigzag
   - Imagen de fondo a pantalla completa con overlay oscuro
   - Texto centrado encima de la imagen (estilo editorial/magazine)
   - Esto rompe inmediatamente la sensacion de "misma pagina"

2. **Imagenes con aspect-ratio diferente**
   - Cambiar de `aspect-[4/5]` (vertical, igual que landing) a `aspect-[3/4]` con `rounded-3xl` mas pronunciado
   - Anadir un borde sutil decorativo alrededor de las imagenes

3. **Titulos con numeracion editorial**
   - En vez del separador coral generico, anadir numeros grandes decorativos (01, 02, 03) al lado de cada titulo de seccion
   - Tipografia mas ligera (font-light en vez de font-semibold para subtitulos)

4. **Fondo general diferente**
   - La landing alterna entre blanco y warm beige
   - AboutUs usara un fondo base ligeramente diferente: todas las secciones en blanco, con las estadisticas y CTA como unicas secciones con fondo

5. **Blockquotes mas prominentes**
   - Las citas existentes tendran un estilo pull-quote mas grande y centrado

## Detalles tecnicos

### Archivo: `src/pages/AboutUs.tsx` (reescritura)

**Hero (seccion 1)**: Reemplazar el ZigzagSection por una seccion full-width:
- Imagen de fondo con `bg-cover bg-center` y overlay gradient
- Texto centrado con `text-white` sobre la imagen
- Altura `min-h-[70vh]` para impacto visual
- Badge y H1 centrados

**Secciones zigzag (2, 3, 4)**: Modificar el componente ZigzagSection:
- Imagenes: `aspect-[3/4] rounded-3xl` con `ring-1 ring-border/20 ring-offset-4 ring-offset-background`
- Eliminar el fondo alterno `bg="hsl(var(--section-warm))"` de las secciones intermedias (dejar fondo blanco)
- Anadir numero decorativo grande (01, 02, 03) antes de cada titulo:
  - `text-6xl font-serif text-accent/20 font-bold` como numero de fondo
- Aumentar gap entre secciones

**Estadisticas (seccion 5)**: Sin cambios grandes, mantener

**Principios (seccion 6)**: Cambiar de tarjetas verticales a un layout horizontal:
- En vez de 4 cards en grid, usar una lista horizontal con iconos inline
- Estilo mas limpio, menos "landing page"

**CTA Final (seccion 7)**: Mantener similar pero sin el fondo warm
