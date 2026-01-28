\# bebloo — masterplan.md

\#\# 30-second elevator pitch

\*\*bebloo\*\* es una suscripción física por etapas para padres primerizos.    
Cada mes reciben un pack esencial, ya pensado por expertos, justo cuando lo necesitan.    
La app no vende productos: \*\*vende tranquilidad\*\*.    
Todo llega a tiempo. Todo está bajo control. Tú solo disfrutas a tu bebé.

\---

\#\# Problem & mission

\#\#\# El problema  
\- El primer año de un bebé es \*\*emocional y logísticamente abrumador\*\*.  
\- Demasiadas opciones, consejos contradictorios y decisiones constantes.  
\- Padres cansados, con poco tiempo y alto miedo a “equivocarse”.

\#\#\# La misión  
\- \*\*Eliminar decisiones innecesarias\*\* en el primer año.  
\- Convertir logística compleja en una experiencia silenciosa y confiable.  
\- Acompañar sin juzgar, sin urgencia y sin sobreventa.

\---

\#\# Target audience

\#\#\# Usuario principal  
\- Padres y madres primerizos.  
\- Bebés entre \*\*0 y 12 meses\*\* (foco fuerte en 0–6 meses).

\#\#\# Perfil  
\- Urbanos.  
\- Poder adquisitivo medio-alto.  
\- Valoran:  
  \- Calidad e higiene.  
  \- Curaduría experta.  
  \- Conveniencia emocional \> precio.

\#\#\# Estado emocional  
\- Fatiga.  
\- Duda.  
\- Necesidad de sentir: \*“esto ya está resuelto”\*.

\---

\#\# Core features

\#\#\# 1\. Suscripción física por etapas (core del negocio)  
\- Packs definidos por rangos de edad (0–3m, 3–6m, etc.).  
\- Contenido:  
  \- Productos esenciales.  
  \- Cantidades adecuadas.  
  \- Selección experta, no exhaustiva.  
\- Promesa clara: \*\*no falta nada importante, no sobra nada inútil\*\*.

\#\#\# 2\. App como acompañante  
\- Explica \*por qué\* viene cada cosa.  
\- Anticipa lo que sigue.  
\- Da control sin generar decisiones innecesarias.

\#\#\# 3\. Pack Explorer  
\- Navegación por etapas.  
\- Cada pack muestra:  
  \- Qué incluye.  
  \- Para qué sirve.  
  \- Qué problema evita.  
\- Sensación buscada: \*“alguien responsable ya pensó en esto”\*.

\#\#\# 4\. Suscripción activa  
\- Estado siempre visible:  
  \- Pack actual.  
  \- Próximo envío.  
  \- Fecha clara.  
\- Acciones simples:  
  \- Ajustar entrega.  
  \- Dar feedback.  
  \- Pausar o reprogramar.  
\- Cero fricción, cero ansiedad.

\#\#\# 5\. Onboarding sensible  
\- Preguntas humanas, no formularios fríos.  
\- Ejemplos:  
  \- “¿Cuándo llega tu bebé?”  
  \- “¿Qué es lo que más te preocupa ahora?”  
\- Cierre emocional:  
  \- “Nos encargamos. Tú encárgate de disfrutarlo.”

\#\#\# 6\. Testimonios / mini-diarios  
\- Historias reales de otros padres.  
\- Enfoque emocional, no promocional.  
\- Diseño tipo notas personales.

\---

\#\# High-level tech stack

\#\#\# Frontend  
\- Vite \+ React \+ TypeScript  
\- shadcn/ui \+ Tailwind CSS

\#\#\# Backend & Storage  
\- Lovable Cloud

\#\#\# Auth  
\- Email/password.  
\- Google OAuth opcional.

\*\*Por qué encaja:\*\*    
El stack prioriza \*\*velocidad, estabilidad y diseño emocional\*\*, no experimentación técnica.

\---

\#\# Conceptual data model (ERD en palabras)

\- \*\*User\*\*  
  \- Email  
  \- Rol (padre/madre)  
  \- Fecha estimada de nacimiento  
\- \*\*Subscription\*\*  
  \- Estado (activa, pausada)  
  \- Etapa actual  
  \- Próximo envío  
\- \*\*Pack\*\*  
  \- Etapa  
  \- Lista de items  
  \- Descripción emocional  
\- \*\*Shipment\*\*  
  \- Fecha  
  \- Estado  
\- \*\*Feedback\*\*  
  \- Texto corto  
  \- Relación con pack o envío

Todo es \*\*simple, legible y trazable\*\*.

\---

\#\# UI design principles

\- No urgencia.  
\- No overload visual.  
\- Todo respira.  
\- Una emoción dominante: \*\*confianza sin esfuerzo\*\*.

Principio base:    
\> Si algo genera duda, se simplifica o se elimina.

\---

\#\# Security & compliance notes

\- Datos mínimos.  
\- Nada sensible sin necesidad.  
\- Comunicación clara sobre privacidad.  
\- Confianza también es \*no preguntar de más\*.

\---

\#\# Phased roadmap

\#\#\# MVP  
\- Suscripción física por etapas.  
\- Onboarding básico.  
\- Gestión simple de envíos.  
\- Pack Explorer.

\#\#\# V1  
\- Feedback dentro de la app.  
\- Ajustes de entrega.  
\- Testimonios visibles.

\#\#\# V2  
\- AI Concierge.  
\- Personalización más fina por contexto.  
\- Contenido emocional contextual (mensajes, tips).

\---

\#\# Risks & mitigations

\#\#\# Riesgo: sobre-complejidad  
\- \*\*Mitigación:\*\* menos opciones, mejores defaults.

\#\#\# Riesgo: parecer solo “e-commerce”  
\- \*\*Mitigación:\*\* storytelling \+ acompañamiento continuo.

\#\#\# Riesgo: logística imperfecta  
\- \*\*Mitigación:\*\* comunicación transparente y anticipación.

\---

\#\# Future expansion ideas

\- Packs especiales (viajes, regresos al trabajo).  
\- Segundo hijo (modo experiencia previa).  
\- Contenido emocional por hitos.  
\- Alianzas con marcas premium de cuidado infantil.

