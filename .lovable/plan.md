

# Mejora estetica y posicionamiento de la burbuja del chatbot

## Cambios propuestos

### 1. Mover la burbuja a la esquina inferior derecha
- Posicion mas convencional y esperada por los usuarios (bottom-right)
- En movil: `fixed bottom-20 right-4` (por encima del FloatingCTA)
- En desktop: `fixed bottom-6 right-6`
- El panel del chat tambien se abrira desde la derecha en desktop

### 2. Mejorar la estetica de la burbuja
- Usar el color **accent (coral)** en lugar del primary (azul claro) para que destaque mas sobre el fondo
- Agregar una sombra mas pronunciada con color coral (`shadow-[0_4px_14px_-3px_hsl(var(--accent)/0.4)]`)
- Animacion de entrada sutil (scale-in) al cargar la pagina
- Efecto de pulso suave para llamar la atencion inicialmente
- Bordes mas redondeados y tamaño ligeramente mayor en desktop (h-14 w-14)

### 3. Mejorar la estetica del panel abierto
- Header con gradiente sutil usando los colores de marca
- Bordes mas suaves y sombra premium
- Animacion de entrada al abrir (scale-in desde la esquina)

## Archivo a modificar

| Accion | Archivo |
|--------|---------|
| Modificar | `src/components/ChatBot.tsx` |

## Seccion tecnica

### Posicionamiento final
- Desktop burbuja: `fixed bottom-6 right-6`
- Desktop panel: `fixed bottom-6 right-6` (alineado con la burbuja)
- Movil burbuja: `fixed bottom-20 right-4` (encima del FloatingCTA que ocupa bottom-0)
- Movil drawer: sin cambios (sigue siendo Vaul desde abajo)

### Colores
- Burbuja: `bg-accent text-accent-foreground` (coral, mas visible que el azul)
- Sombra: coral con opacidad para efecto premium
- Panel: mantiene `bg-background` con header mejorado

