\# bebloo — design-guidelines.md

\> Base filosófica: diseñamos \*\*sentimientos\*\*, no pantallas. Empezar por “energía”, pensar en escenas, y practicar “kindness in design” (microinteracciones, perdón, defaults generosos). :contentReference\[oaicite:0\]{index=0}

\---

\#\# Emotional tone

\*\*Tesis emocional (1 frase)\*\*    
Se siente como una mañana suave en casa con tu bebé dormido en brazos: cálido, ordenado y silenciosamente profesional.

\#\#\# Palabras ancla  
\- Calmado  
\- Cálido  
\- Experto  
\- Reconfortante  
\- Sin juicio  
\- “Ya está resuelto”

\#\#\# Anti-tono (cosas prohibidas)  
\- Urgencia (“última oportunidad”, “compra ya”)  
\- Clínico (copy frío, estética hospital)  
\- Catálogo (listas infinitas, filtros y comparadores)  
\- Productividad agresiva (badges rojos, alerts estridentes)

\---

\#\# Brand feel translated into UI heuristics

\#\#\# Regla 1: una emoción por pantalla  
\- Homepage: \*\*calma \+ confianza\*\*  
\- Pack Explorer: \*\*curaduría experta\*\*  
\- Suscripción activa: \*\*control\*\*  
\- Onboarding: \*\*contención\*\*  
\- Testimonios: \*\*pertenencia\*\*

\*\*Ejemplo claro\*\*    
En “Suscripción activa”, el primer bloque siempre responde:    
“¿Qué pasa ahora?” \+ “¿Qué pasa después?” en 2 líneas.

\#\#\# Regla 2: defaults fuertes, opciones suaves  
\- Ofrece 1 recomendación principal.  
\- Si hay alternativa, que sea secundaria y sin presión.

\*\*Ejemplo\*\*    
CTA principal: “Confirmar próximo envío”    
CTA secundaria: “Cambiar fecha”

\---

\#\# Typography

Objetivo: aire, legibilidad, calidez editorial.

\#\#\# Jerarquía tipográfica (recomendada)  
\- \*\*H1\*\*  
  \- 40–44px / 1.15 line-height  
  \- Weight 600  
  \- Serif suave (ej: Canela) \*\*o\*\* sans redondeada premium  
\- \*\*H2\*\*  
  \- 28–32px / 1.2  
  \- Weight 600  
\- \*\*H3\*\*  
  \- 20–22px / 1.3  
  \- Weight 600  
\- \*\*H4\*\*  
  \- 16–18px / 1.35  
  \- Weight 600  
\- \*\*Body\*\*  
  \- 16–18px / 1.55–1.65  
  \- Weight 400–450  
\- \*\*Caption\*\*  
  \- 12–13px / 1.4  
  \- Weight 400  
  \- Gris cálido

\#\#\# Reglas de ritmo  
\- Todo bloque de texto respira:  
  \- 24–40px entre secciones grandes (desktop)  
  \- 16–24px (mobile)  
\- Párrafos cortos (máx 2–3 líneas).  
\- Preferir bullets a párrafos largos.

\---

\#\# Color system

Meta: calma, piel, manteca. Contraste AA+ sin agresividad.

\#\#\# Paleta base (propuesta)  
\- \*\*Primary\*\*  
  \- \`\#E6DCD0\` (beige cálido tipo piel de bebé)  
\- \*\*Accent\*\*  
  \- \`\#D4A5A5\` (rosa terroso tenue)  
\- \*\*Background\*\*  
  \- \`\#FCFAF7\` (blanco manteca)  
\- \*\*Text\*\*  
  \- Principal: \`\#1F1F1F\`  
  \- Secundario (gris cálido): \`\#5C5853\`  
\- \*\*Border / Divider\*\*  
  \- \`\#EAE3DA\`

\#\#\# Semánticos (sin “alarma”)  
\- \*\*Success\*\*  
  \- \`\#A4D4AE\`  
\- \*\*Warning\*\*  
  \- \`\#F5C6AA\`  
\- \*\*Info\*\*  
  \- \`\#BFD7EA\`  
\- \*\*Error (suave, no rojo puro)\*\*  
  \- \`\#E7A3A3\`

\#\#\# Reglas de contraste y uso  
\- Texto principal siempre con contraste AA+.  
\- Los semánticos nunca ocupan fondos masivos; se usan en:  
  \- chips  
  \- iconos  
  \- banners sutiles  
\- Evitar rojos saturados y negros puros extensos.

\---

\#\# Spacing & layout

\#\#\# Sistema  
\- \*\*8pt grid\*\* para todo.  
\- Bordes redondeados consistentes:  
  \- Cards: 16–20px radius  
  \- Buttons: 999px (pill) o 14–16px si “soft-rect”

\#\#\# Layout  
\- Mobile first:  
  \- Columna simple  
  \- CTA principal siempre visible sin “cazarlo”  
\- Desktop:  
  \- 2 columnas suaves solo donde reduzca scroll y no aumente decisión  
  \- Máximo 72ch para texto de lectura (editorial)

\#\#\# Component density  
\- Baja densidad. Nunca “apretado”.  
\- Si hay muchas opciones, convertir en:  
  \- “recomendación \+ ver detalles”

\---

\#\# Motion & interaction

Meta: gentileza \+ seguridad. Nada de show-off.

\#\#\# Timing  
\- Microinteracciones: \*\*150–200ms\*\*  
\- Transiciones de pantalla / drawers: \*\*220–300ms\*\*  
\- Easing: \`ease-in-out\` (o equivalente suave)

\#\#\# Interacciones recomendadas (escenas, no screens)  
\- Hover en botones: leve expansión \+ sombra mínima (no “pop”).  
\- Cards de pack: entrada con \*\*fade \+ slide\*\* desde abajo muy leve.  
\- Drawer de detalle: sube suave, cierra con gesto claro.  
\- Skeletons: discretos, sin shimmer agresivo.

\#\#\# “Kindness patterns” (obligatorios)  
\- Confirmaciones suaves:  
  \- “Listo. Tu próximo envío está bajo control.”  
\- “Second chance”:  
  \- Después de pausar/cambiar fecha: opción “Deshacer” 8–10s.  
\- Errores sin juicio:  
  \- “Parece que algo falló. Probemos otra vez cuando estés lista/o.”

\---

\#\# Voice & tone (microcopy)

\#\#\# Personalidad de copy  
\- Tranquilizadora.  
\- Humana.  
\- Experta sin imponerse.  
\- Cero sobreventa.

\#\#\# Reglas  
\- Frases cortas.  
\- Sin signos de exclamación repetidos.  
\- Evitar “optimiza”, “maximiza”, “conviértete”.  
\- Preferir: “te acompañamos”, “está resuelto”, “puedes cambiarlo cuando quieras”.

\#\#\# Microcopy examples

\*\*Onboarding\*\*  
\- “Vamos paso a paso.”  
\- “No hay respuestas perfectas.”  
\- “Nos encargamos. Tú encárgate de disfrutarlo.”

\*\*Success\*\*  
\- “Listo. Todo queda programado.”  
\- “Perfecto. Lo dejamos preparado para ti.”

\*\*Error\*\*  
\- “No pudimos guardar esto todavía.”  
\- “No es tu culpa. Probemos de nuevo.”  
\- CTA: “Intentar otra vez” / Secondary: “Volver”

\---

\#\# System consistency

\#\#\# Metáfora recurrente  
\*\*Acompañante silencioso\*\*: presencia cálida, sin interrumpir.

\#\#\# Component patterns (shadcn/ui friendly)  
\- Cards suaves con títulos editoriales.  
\- CTAs tipo “pill”.  
\- Badges discretos (sin rojos duros).  
\- Inputs con borde suave, sin cajas duras.  
\- Banners: fondo manteca \+ icono sutil \+ 1 frase.

\#\#\# Reglas de navegación  
\- 4 items máximo.  
\- Nombres humanos:  
  \- “Suscripción”  
  \- “Packs”  
  \- “Historias”  
  \- “Cuenta”

\---

\#\# Accessibility

\#\#\# Estructura semántica  
\- Un solo H1 por página.  
\- Landmarks:  
  \- \`header\`, \`main\`, \`nav\`, \`footer\`  
\- Cards y packs: roles correctos, headings internos consistentes.

\#\#\# Keyboard  
\- Tab order lógico.  
\- Focus visible pero suave:  
  \- Outline 2px, color calmado, alto contraste.

\#\#\# ARIA (ejemplos)  
\- Botón cambiar fecha: \`aria-label="Cambiar fecha de entrega"\`  
\- Drawer pack: \`aria-labelledby\` apuntando al título del pack.  
\- Estado envío: texto \+ icono (no solo color).

\#\#\# Contraste  
\- AA+ en todos los textos.  
\- Evitar texto claro sobre accent rosa si no cumple.

\---

\#\# Emotional audit checklist

\- ¿Esta pantalla reduce decisiones o las aumenta?  
\- ¿La primera lectura transmite “ya está resuelto”?  
\- ¿Los errores guían sin juzgar?  
\- ¿Los estados se sienten “bajo control” sin urgencia?  
\- ¿Motion y copy refuerzan calma (no distraen)?

\---

\#\# Technical QA checklist

\- Tipografía respeta jerarquía (H1–Body–Caption).  
\- Spacing sigue 8pt grid.  
\- Contraste AA+ validado.  
\- Estados interactivos claros (hover/focus/active/disabled).  
\- Motion entre 150–300ms (salvo transiciones especiales justificadas).  
\- Componentes shadcn/ui alineados al sistema (radius, padding, tone).

\---

\#\# Adaptive system memory

Si existe un diseño previo en tu suite de productos:  
\- Mantener paleta manteca \+ beige como “base de marca”.  
\- Reutilizar cards tipo Moleskine en historias.  
\- Sostener el patrón “1 CTA principal \+ 1 secundaria suave”.

\---

\#\# Design snapshot  
