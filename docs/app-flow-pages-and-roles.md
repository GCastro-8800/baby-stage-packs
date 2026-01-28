\# bebloo — app-flow-pages-and-roles.md

\#\# Site map (top-level pages)

\#\#\# Public  
\- \`/\` — Homepage  
\- \`/packs\` — Pack Explorer  
\- \`/stories\` — Historias de otros padres  
\- \`/login\` — Acceso  
\- \`/signup\` — Crear cuenta

\#\#\# Onboarding  
\- \`/onboarding\` — Flujo sensible de bienvenida

\#\#\# App (usuario autenticado)  
\- \`/app\` — Overview / Estado general  
\- \`/app/subscription\` — Tu suscripción activa  
\- \`/app/packs\` — Packs (consulta y explicación)  
\- \`/app/stories\` — Historias (versión completa)  
\- \`/app/account\` — Cuenta y preferencias

\#\#\# Interno / Ops (no público)  
\- \`/admin\` — Panel operativo mínimo

\---

\#\# Purpose of each page (one line)

\- \*\*Homepage\*\*    
  Transmitir calma inmediata y explicar el valor en 30 segundos.

\- \*\*Pack Explorer\*\*    
  Mostrar curaduría por etapas y generar confianza en la selección experta.

\- \*\*Historias\*\*    
  Inspirar pertenencia emocional sin presión comercial.

\- \*\*Login / Signup\*\*    
  Acceso simple, sin fricción ni urgencia.

\- \*\*Onboarding\*\*    
  Contener, personalizar y preparar el primer envío.

\- \*\*App Overview\*\*    
  Confirmar que “todo está bajo control”.

\- \*\*Suscripción activa\*\*    
  Dar visibilidad clara del presente y el próximo paso.

\- \*\*Packs (app)\*\*    
  Explicar qué tiene el usuario y por qué es adecuado ahora.

\- \*\*Cuenta\*\*    
  Ajustes básicos, sin ruido ni configuraciones innecesarias.

\- \*\*Admin\*\*    
  Operar envíos y suscripciones con el mínimo esfuerzo humano.

\---

\#\# User roles and access levels

\#\#\# 1\. Padre / Madre (usuario principal)  
\*\*Acceso\*\*  
\- Homepage, Packs, Historias (público).  
\- Onboarding.  
\- Área app completa.

\*\*Permisos\*\*  
\- Ver y gestionar su suscripción.  
\- Cambiar fechas de envío.  
\- Pausar o reactivar.  
\- Enviar feedback.  
\- Editar datos básicos de cuenta.

\*\*Restricciones\*\*  
\- No ve comparativas complejas.  
\- No gestiona múltiples planes simultáneos.  
\- No toma decisiones logísticas profundas (bebloo decide por default).

\---

\#\#\# 2\. Ops / Admin (interno)  
\*\*Acceso\*\*  
\- Panel admin.

\*\*Permisos\*\*  
\- Ver usuarios y suscripciones.  
\- Ver próximos envíos.  
\- Cambiar estado de envío.  
\- Registrar incidencias.  
\- Ajustar manualmente envíos si es necesario.

\*\*Restricciones\*\*  
\- No edita contenido emocional desde el admin (copy centralizado).  
\- No cambia lógica de etapas desde producción.

\---

\#\# Primary user journeys (max 3 steps each)

\#\#\# Journey 1 — Nuevo usuario (descubrimiento → calma)  
1\. Entra a \*\*Homepage\*\* → entiende qué es bebloo.  
2\. Explora \*\*Pack Explorer\*\* → siente “esto tiene sentido”.  
3\. CTA: “Explora tu primer pack” → inicia onboarding.

\*\*Emoción objetivo:\*\* alivio inicial.

\---

\#\#\# Journey 2 — Onboarding → primer envío  
1\. Responde onboarding sensible (4–6 preguntas).  
2\. Confirma etapa inicial y dirección.  
3\. Ve mensaje final: “Tu primer pack está listo”.

\*\*Emoción objetivo:\*\* contención \+ confianza.

\---

\#\#\# Journey 3 — Usuario activo (control sin esfuerzo)  
1\. Entra a \*\*Suscripción activa\*\*.  
2\. Ve pack actual \+ próximo envío.  
3\. Opcional: cambia fecha o deja feedback (1–2 taps).

\*\*Emoción objetivo:\*\* control silencioso.

\---

\#\#\# Journey 4 — Duda emocional (sin pánico)  
1\. Usuario entra a \*\*Suscripción activa\*\*.  
2\. Lee explicación del pack o estado del envío.  
3\. (V2) Consulta AI Concierge con pregunta contextual.

\*\*Emoción objetivo:\*\* tranquilidad reafirmada.

\---

\#\#\# Journey 5 — Inspiración sin presión  
1\. Usuario entra a \*\*Historias\*\*.  
2\. Lee mini-diario de padres en su misma etapa.  
3\. CTA suave: “Ver el pack de esta etapa”.

\*\*Emoción objetivo:\*\* pertenencia.

\---

\#\# Navigation logic (mental model)

\- El usuario \*\*no navega para decidir\*\*, navega para \*\*confirmar\*\*.  
\- Cada sección responde una pregunta clara:  
  \- Homepage → “¿Esto es para mí?”  
  \- Packs → “¿Qué incluye y por qué?”  
  \- Suscripción → “¿Qué pasa ahora?”  
  \- Historias → “No estoy solo/a”.

\---

\#\# Flow integrity rules (no romper la promesa)

\- Nunca más de \*\*una acción primaria por pantalla\*\*.  
\- Siempre mostrar:  
  \- estado actual  
  \- próximo paso  
\- Evitar bifurcaciones del tipo “elige entre 5”.  
\- Si algo puede ser default, \*\*no preguntarlo\*\*.  
\- Si algo genera ansiedad, \*\*explicarlo antes de permitir cambiarlo\*\*.

\---

\#\# Final note

Si el usuario duerme poco, está cansado o emocionalmente vulnerable,    
\*\*bebloo debe sentirse como el lugar más seguro de su día digital\*\*.

Cada flujo, página y rol existe para sostener una sola verdad:

\> \*“Esto ya está resuelto. No tienes que pensar más.”\*

