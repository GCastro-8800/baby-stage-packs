

## Simplificar y mejorar el flujo de detalle del plan

### Problema actual

El flujo tiene demasiados pasos y la experiencia visual no esta a la altura de un servicio premium. Problemas concretos:

1. El boton "Continuar" simplemente revela contenido debajo, sin sensacion de avance
2. La seccion de contacto aparece pegada al equipamiento sin transicion clara
3. El mensaje post-registro ("Te avisaremos") es generico y poco informativo
4. El email se pide sin contexto suficiente dentro del formulario
5. Demasiados elementos visuales compitiendo por atencion

### Solucion propuesta

Convertir la pagina en un flujo de dos vistas claras dentro de la misma ruta, donde "Continuar" hace scroll-to-top y cambia la vista completa, dando sensacion de pagina nueva sin cambiar la URL.

### Cambios concretos

**1. Flujo de dos vistas en PlanDetail.tsx**

Introducir un estado `step` (1 o 2) que controla que vista se muestra:

```text
Step 1: Cabecera del plan + Equipamiento + Boton "Continuar"
Step 2: Cabecera resumida + Opciones de contacto (pantalla completa)
```

Cuando el usuario pulsa "Continuar", se cambia a step 2 y se hace `window.scrollTo(0, 0)` para dar sensacion de pagina nueva. Un boton "Volver al equipamiento" permite regresar al step 1.

**2. Mejora visual del EquipmentSection**

- Reducir el grid a 2 columnas maximo en desktop (las tarjetas estaban demasiado comprimidas en 3 columnas)
- Anadir un toque de color sutil cuando un checkbox esta marcado (borde de la tarjeta cambia)
- Mejorar el espaciado interno de cada tarjeta

**3. Rediseno del ContactSection como vista completa**

En lugar de tres tarjetas iguales en grid, reorganizar como:

- Cabecera con resumen del plan elegido y selecciones (si las hay)
- Dos opciones principales lado a lado: WhatsApp y Calendly
- Seccion separada debajo: "Comprueba disponibilidad en tu zona"
  - Mostrar "Ahora mismo operamos en Madrid capital y alrededores"
  - Codigo postal como campo principal
  - Email con copy claro: "Dejanos tu email para avisarte cuando lleguemos a tu zona"
  - Tras enviar: mensaje mejorado con la ciudad detectada o al menos "Zona [codigo postal] registrada. Te avisaremos cuando Bebloo este disponible en tu area."

**4. Mejora del estado post-envio**

Cambiar el simple "Te avisaremos" por:

```text
"Zona [28XXX] registrada"
"Te avisaremos cuando Bebloo este disponible en tu area de Madrid."
"Mientras tanto, puedes hablar con nosotros por WhatsApp o reservar una llamada."
```

Y mostrar los botones de WhatsApp/Calendly tambien en el estado post-envio.

### Detalle tecnico

**Archivos modificados:**

- `src/pages/PlanDetail.tsx` — Cambiar de `showContact` boolean a `step` numerico (1/2). En step 2, renderizar solo ContactSection a pantalla completa con scroll-to-top. Anadir boton "Volver" en step 2. Pasar las selecciones como resumen al ContactSection.

- `src/components/plan/EquipmentSection.tsx` — Cambiar grid a `sm:grid-cols-2` maximo. Anadir clase condicional al borde de la tarjeta cuando tiene algun item seleccionado. Mejorar espaciado.

- `src/components/plan/ContactSection.tsx` — Redisenar completamente:
  - Layout vertical en vez de grid 3 columnas
  - Seccion superior: WhatsApp y Calendly como opciones principales (2 columnas)
  - Seccion inferior separada: formulario de disponibilidad con contexto de Madrid
  - Estado post-envio mejorado con codigo postal reflejado y opciones de contacto alternativas
  - Anadir texto explicativo "Operamos en Madrid capital y alrededores"

**Sin cambios en:**
- Base de datos
- Rutas
- Datos de equipamiento
- Analytics (los eventos existentes cubren todo)
