

## Quiz Recomendador de Planes - Version mejorada

### Resumen

Se creara un nuevo componente `PlanRecommenderDialog.tsx` con un quiz de 4 preguntas diagnosticas que analiza el perfil del usuario y recomienda el plan mas adecuado (Start, Comfort o Total Peace). El resultado incluye CTAs contextuales segun si el usuario tiene un perfil ansioso o no, con integracion directa a Calendly.

### Componente nuevo: `src/components/dashboard/PlanRecommenderDialog.tsx`

**Estructura del quiz (4 pasos + resultado):**

- Paso 1: "Que te preocupa MAS ahora mismo sobre el equipamiento del bebe?" (4 opciones)
- Paso 2: "Como te sientes con la idea de comprar todo nuevo?" (4 opciones)
- Paso 3: "Si pudieras delegar UNA SOLA COSA del primer ano, cual seria?" (4 opciones)
- Paso 4: "Cuanto espacio de almacenaje tienes disponible para equipamiento bebe?" (3 opciones)
- Paso 5: Pantalla de resultado

**Logica de puntuacion:**

Cada respuesta suma puntos a uno de los tres planes:

| Pregunta | Opcion | Puntos |
|----------|--------|--------|
| P1 - "No se que necesito" | Start +2 |
| P1 - "Me agobia acumular" | Comfort +2 |
| P1 - "Miedo seguridad" | Total Peace +2, marca perfil ansioso |
| P1 - "No tengo tiempo" | Comfort +1, Total Peace +1 |
| P2 - "Gasto inicial" | Start +2 |
| P2 - "Obsoleto en meses" | Comfort +2 |
| P2 - "Espacio" | Total Peace +1, Comfort +1 |
| P2 - "Odio gestionar reventa" | Comfort +1, Total Peace +1 |
| P3 - "Elegir que comprar" | Start +1, Comfort +1 |
| P3 - "Limpiar/desinfectar" | Comfort +2 |
| P3 - "Gestionar cambios" | Comfort +1, Total Peace +1 |
| P3 - "Deshacerme de lo usado" | Total Peace +2 |
| P4 - "Menos de 2m2" | Total Peace +2 |
| P4 - "2-4m2" | Comfort +1 |
| P4 - "Mas de 4m2" | Start +1 |

En caso de empate, se recomienda Comfort.

**Pantalla de resultado:**

- Titulo del plan + precio
- Frase personalizada segun plan recomendado (copys proporcionadas)
- CTA principal: si perfil ansioso, boton "Hablar 15min con Patricia" abriendo Calendly; si no, "Ver detalles de BEBLOO [Plan]" navegando a `/plan/[id]`
- CTA secundario: la opcion contraria al principal
- Link terciario: "No estas segura? Ver todos los planes" hacia `/#precios`

**Integracion Calendly:**

El boton de Calendly abrira la URL existente (`https://calendly.com/martincabanaspaola/30min`) con parametros pre-rellenados si el usuario esta autenticado: `name`, `email`, y en el campo de notas: "Lead desde Quiz - Perfil: [Plan] - Alta ansiedad: Si/No".

### Modificacion: `src/components/dashboard/StageCard.tsx`

- Importar el nuevo `PlanRecommenderDialog`
- Anadir estado `open` para controlar el dialog
- Cambiar el `onClick` del boton "Ver pack recomendado" para abrir el dialog en vez de navegar a `/#precios`
- Pasar la `situation` como prop al dialog para contexto

### Detalle tecnico

- El componente usa `Dialog` de shadcn/ui con RadioGroup para las opciones
- Estado interno: `step` (0-4), `answers` (array de indices), `isAnxious` (boolean)
- La puntuacion se calcula al llegar al paso 5 sumando los puntos de cada respuesta
- Todo es client-side, sin llamadas a base de datos ni edge functions
- El boton de Calendly construye la URL con query params: `?name=...&email=...&a1=Lead+desde+Quiz...`

### Sin cambios en

Base de datos, edge functions, auth, ContactSection, ni otros componentes del dashboard.
