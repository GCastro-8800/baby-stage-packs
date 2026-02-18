

# Mejoras de Estilo, UX y Diseno para "Quienes Somos"

## Problemas detectados

Tras revisar la pagina actual, identifico estas areas de mejora:

1. **Hero demasiado vacio**: mucho espacio en blanco entre el titulo y "Lo que descubrimos". Falta un elemento visual que ancle la seccion (un badge, una linea decorativa, o una cifra destacada).

2. **Tarjetas "Lo que descubrimos" planas**: los iconos son poco visibles (color primary-foreground sobre primary/20 apenas contrasta). Las tarjetas se sienten genericas y no comunican urgencia emocional.

3. **Seccion "Nuestra historia" desbalanceada**: el bloque "+400 carritos restaurados" se siente desconectado visualmente. El cuadrado con fondo primary/10 es demasiado sutil y no aprovecha el espacio.

4. **Seccion "Por que somos diferentes" sin jerarquia**: es un bloque de texto largo sin ningun elemento que rompa la monotonia. El texto se alinea a la izquierda en desktop pero centrado en mobile, creando inconsistencia.

5. **Tarjetas de principios sin variedad visual**: las 4 tarjetas son identicas en estructura. Falta diferenciacion o un patron visual que guie la lectura.

6. **Seccion "El equipo" generica**: los avatares son circulos con una letra inicial, lo cual se siente placeholder. Las tarjetas son pequenas y poco memorables.

7. **Seccion "Compromiso con Madrid" corta y perdida**: queda flotando entre secciones mas grandes.

8. **CTA final funcional pero frio**: le falta calidez emocional. "Listo para dejar de decidir?" es bueno como copy pero el contexto visual no lo refuerza.

9. **Falta de ritmo visual**: las secciones alternan entre fondo blanco y colores, pero sin un patron claro. Algunas transiciones son abruptas.

## Que vera el usuario tras los cambios

Una pagina con mejor ritmo visual, jerarquia mas clara, y mayor calidez emocional. Mas "editorial premium" y menos "landing generica".

## Cambios propuestos

### 1. Hero mejorado
- Agregar un badge/pill encima del titulo: "Nuestra historia" en un chip con estilo sutil (como el "50+ familias" del hero principal)
- Reducir el padding inferior para que "Lo que descubrimos" sea visible sin hacer scroll completo
- Agregar una linea decorativa o separador sutil debajo del subtitulo

### 2. Tarjetas "Lo que descubrimos" con mas impacto
- Numerar las tarjetas con un numero grande y semitransparente ("01", "02", "03") en font-serif para dar ritmo editorial
- Cambiar los iconos de color primary-foreground a accent (coral) para mayor contraste y atencion
- Agregar un borde izquierdo de color accent a cada tarjeta en vez de borde completo
- Aumentar el tamano del texto dentro de las tarjetas

### 3. "Nuestra historia" con mejor composicion
- Convertir el bloque "+400" en un stack vertical con multiples cifras: "+400 carritos restaurados", "+4 anos de experiencia", "Cientos de familias"
- Usar un fondo con borde redondeado mas definido y padding generoso
- Agregar una cita destacada (blockquote) dentro de la historia para romper el muro de texto: la frase "Un ciclo absurdo, costoso y agotador" como pull-quote

### 4. "Por que somos diferentes" con frase destacada
- Convertir "Esa experiencia es nuestra ventaja" en un bloque tipografico grande (font-serif, tamano mayor, centrado) separado del parrafo
- Agregar un separador decorativo (linea fina con un pequeno elemento central) antes de la frase

### 5. Principios con iconos mas grandes y hover sutil
- Aumentar el tamano de los iconos contenedores (de w-10 h-10 a w-14 h-14)
- Agregar transicion hover en las tarjetas: leve sombra y translate-y
- Poner un numero o indice sutil en cada tarjeta

### 6. Seccion equipo mas personal
- Hacer las tarjetas mas grandes con mas padding
- Agregar una frase personal/cita debajo de la descripcion en italica
- Usar un circulo de avatar mas grande (w-20 h-20)
- Agregar un detalle visual como un icono de comillas para la cita

### 7. Fusionar "Compromiso con Madrid" con la CTA
- Integrar el compromiso con Madrid como texto introductorio antes del CTA final
- Esto evita una seccion corta que se siente incompleta y da contexto emocional al CTA

### 8. CTA final con mas calidez
- Agregar un subtitulo debajo de "Listo para dejar de decidir?": "Solo necesitas dar el primer paso. Nosotros nos encargamos del resto."
- Usar fondo section-warm (crema) en vez de step-bg (azul) para calidez

## Cambios tecnicos

### Archivo: `src/pages/AboutUs.tsx`
Todos los cambios son en este unico archivo:

- **Hero**: agregar badge pill, reducir pb, agregar separador decorativo
- **Descubrimientos**: reemplazar Card por diseno con borde izquierdo, agregar numeracion, cambiar color iconos a accent
- **Historia**: agregar pull-quote con estilo blockquote, convertir bloque derecho en stack de cifras multiples
- **Diferenciador**: separar la frase final como bloque tipografico grande
- **Principios**: aumentar tamano iconos, agregar hover con `group` + transform
- **Equipo**: tarjetas mas grandes, avatares mayores, agregar cita en italica
- **Fusionar Madrid + CTA**: combinar las secciones 7 y 8 en una sola con texto de Madrid como intro y CTA debajo
- **Agregar hover transitions** en CSS para las tarjetas interactivas

No se necesitan nuevos archivos, componentes, ni dependencias. Todo son ajustes de estilo y estructura dentro del componente existente.

## Orden de implementacion
1. Todos los cambios se aplican en un solo paso editando `src/pages/AboutUs.tsx`
2. No hay dependencias externas ni cambios en rutas

