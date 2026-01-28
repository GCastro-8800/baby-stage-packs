\# bebloo — implementation-plan.md

\#\# Build sequence (mindless micro-tasks)

\#\#\# Phase 0 — Project setup (Day 1–2)  
\- Create repo \+ project shell (Vite \+ React \+ TS).  
\- Install \+ configure Tailwind \+ shadcn/ui.  
\- Add global styles:  
  \- Base typography scale  
  \- Container widths  
  \- Spacing tokens (8pt grid)  
\- Create routes (empty pages):  
  \- \`/\` Homepage  
  \- \`/packs\` Pack Explorer  
  \- \`/onboarding\`  
  \- \`/app\` (shell)  
  \- \`/app/subscription\` Suscripción activa  
  \- \`/stories\` Testimonios

\*\*Definition of done\*\*  
\- App corre, navega, y el “tono” ya se siente calmado.

\---

\#\#\# Phase 1 — Data foundations (Day 2–4)  
\- Definir entidades (conceptual):  
  \- User, Subscription, Pack, Shipment, Feedback, Story  
\- Crear seed data “fake” (JSON/fixtures) para UI:  
  \- 4 etapas (0–3m, 3–6m, 6–9m, 9–12m)  
  \- 1 pack por etapa con 6–10 items  
  \- 3 testimonios cortos  
\- Definir estados de suscripción:  
  \- \`active\`, \`paused\`, \`scheduled\_change\`, \`canceled\`  
\- Definir estados de envío:  
  \- \`scheduled\`, \`packed\`, \`shipped\`, \`delivered\`, \`exception\`

\*\*Definition of done\*\*  
\- La UI puede renderizar todo sin backend real.

\---

\#\#\# Phase 2 — App Shell (Day 4–6)  
\- Construir layout base:  
  \- Header calmado (logo \+ 2–4 links máximos)  
  \- Footer mínimo (confianza \> enlaces)  
\- Crear “App Shell” para área logueada:  
  \- Navegación simple: Suscripción / Packs / Historias / Cuenta  
\- Crear componentes base reutilizables:  
  \- \`Card\` suave (bordes redondeados, sombras sutiles)  
  \- \`Button\` (primario/secondary/ghost)  
  \- \`Tag\` (etapas, estados)  
  \- \`TimelineStep\` (próximos envíos)  
  \- \`EmptyState\` (cálido, sin juicio)

\*\*Definition of done\*\*  
\- Las pantallas ya comparten una estructura coherente y tranquila.

\---

\#\#\# Phase 3 — Homepage (Day 6–9)  
\- Hero editorial:  
  \- Imagen emocional  
  \- CTA 1: “Explora tu primer pack”  
  \- CTA 2: “Descubre cómo funciona”  
\- Sección 1: Problema (sin alarmismo)  
\- Sección 2: Cómo funciona (3 pasos max)  
\- Sección 3: Beneficios emocionales (claros, concretos)  
\- Añadir prueba social mínima (2 quotes)  
\- Añadir “micro-seguridad”:  
  \- higiene/calidad/conveniencia sin claims médicos

\*\*Definition of done\*\*  
\- Un usuario entiende el producto en 30 segundos sin esfuerzo.

\---

\#\#\# Phase 4 — Pack Explorer (Day 9–13)  
\- UI por etapas:  
  \- Tabs o timeline vertical (según mejor calma visual)  
\- Para cada pack:  
  \- Foto emocional  
  \- “Por qué este pack” (3 bullets)  
  \- Lista de items (colapsable)  
  \- Beneficios emocionales (1–2 líneas)  
\- Acción principal:  
  \- “Elegir este pack” (solo si aplica) o “Empezar con 0–3m”  
\- Añadir “detail drawer”:  
  \- Abre suave, cierra fácil  
  \- Explica sin abrumar

\*\*Definition of done\*\*  
\- Se siente curaduría experta, no catálogo.

\---

\#\#\# Phase 5 — Onboarding sensible (Day 13–17)  
\- Flujo de 4–6 preguntas máximo:  
  \- Fecha de nacimiento / llegada  
  \- Etapa actual (si aplica)  
  \- 1 preocupación principal (selección \+ texto opcional)  
  \- Preferencias logísticas básicas (dirección después)  
\- Microcopy de contención:  
  \- “No hay respuestas perfectas.”  
  \- “Puedes cambiar esto cuando quieras.”  
\- Cierre:  
  \- Confirmación cálida \+ siguiente paso claro (“Tu primer pack está listo.”)  
\- Persistir respuestas en storage/backend.

\*\*Definition of done\*\*  
\- Onboarding se siente como bienvenida, no formulario.

\---

\#\#\# Phase 6 — Auth (Day 16–19) (paralelo)  
\- Implementar email/password.  
\- Google OAuth (opcional) como mejora posterior si complica tiempos.  
\- Reglas de ruta:  
  \- Onboarding accesible sin login (si conviene) o login suave después.  
\- Manejo de errores:  
  \- Mensajes útiles, sin culpa (“Revisemos el email juntos.”)

\*\*Definition of done\*\*  
\- Login no interrumpe el “ritmo calmado” del producto.

\---

\#\#\# Phase 7 — Suscripción activa (core app) (Day 19–26)  
\- Bloque “Estado actual”:  
  \- Etapa / pack actual  
  \- “Todo bajo control” (microcopy)  
\- Bloque “Próximo envío”:  
  \- Fecha clara  
  \- Estado (programado / preparado / enviado)  
  \- CTA: “Cambiar fecha” (no “editar”)  
\- Bloque “Lo que tienes ahora”:  
  \- Items del pack actual (colapsable)  
\- Feedback rápido:  
  \- 1–2 taps (“Me sirvió” / “No me encajó”)  
  \- Campo opcional corto  
\- Acciones suaves:  
  \- Pausar  
  \- Reprogramar  
  \- Ayuda (enlace a AI Concierge en V2)

\*\*Definition of done\*\*  
\- La pantalla transmite control inmediato sin decisiones pesadas.

\---

\#\#\# Phase 8 — Testimonios / mini-diarios (Day 26–29)  
\- Grid de tarjetas tipo Moleskine:  
  \- 1 foto \+ 1 quote \+ 1 contexto (edad del bebé)  
\- Filtro muy simple:  
  \- “0–3m”, “3–6m”… (opcional)  
\- CTA sutil hacia packs:  
  \- “Ver el pack de esta etapa”

\*\*Definition of done\*\*  
\- Se siente pertenencia, no marketing.

\---

\#\#\# Phase 9 — Backend real \+ operaciones mínimas (Day 22–32) (paralelo)  
\- Conectar Lovable Cloud:  
  \- Usuarios  
  \- Suscripción  
  \- Packs  
  \- Envíos  
  \- Feedback  
\- Definir reglas:  
  \- Si cambia fecha → actualizar Shipment “scheduled”  
  \- Si pausa → congelar próximos envíos  
\- Crear admin mínimo (aunque sea interno):  
  \- Ver suscripciones  
  \- Ver próximos envíos  
  \- Marcar estado de envío

\*\*Definition of done\*\*  
\- El sistema soporta una operación real, aunque sea manual al inicio.

\---

\#\#\# Phase 10 — QA emocional \+ accesibilidad (Day 30–35)  
\- Checklist emocional por pantalla:  
  \- ¿Calma desde el primer scroll?  
  \- ¿Hay urgencia oculta?  
  \- ¿Algún copy suena clínico o vendedor?  
\- Accesibilidad:  
  \- Focus visible y suave  
  \- Navegación por teclado  
  \- Contrastes AA+  
  \- Labels ARIA en navegación, packs, CTAs  
\- Performance:  
  \- Imágenes optimizadas  
  \- Skeletons suaves (no “loading…” agresivo)

\*\*Definition of done\*\*  
\- “Se siente bebloo” en cada interacción.

\---

\#\# Timeline with checkpoints (suggested)

\#\#\# Week 1  
\- Setup \+ data seed \+ app shell  
\- Homepage v1

\*\*Checkpoint\*\*  
\- Demo navegable con tono visual ya correcto.

\#\#\# Week 2  
\- Pack Explorer completo (con seed)  
\- Onboarding v1

\*\*Checkpoint\*\*  
\- Un usuario entiende etapas \+ “alguien eligió por mí”.

\#\#\# Week 3  
\- Auth \+ Suscripción activa (v1)  
\- Testimonios v1

\*\*Checkpoint\*\*  
\- Flujo completo: landing → onboarding → app → control de envío.

\#\#\# Week 4–5  
\- Backend real \+ admin mínimo  
\- QA emocional \+ accesibilidad  
\- Pulido microinteracciones

\*\*Checkpoint\*\*  
\- MVP listo para pilotos (10–30 familias).

\---

\#\# Team roles & recommended rituals

\#\#\# Roles mínimos  
\- Product/UX (1)  
  \- Custodio de “calma” y decisiones  
  \- Copy \+ flujos  
\- Frontend (1)  
  \- Sistema UI \+ pantallas  
\- Backend/Ops (1)  
  \- Modelos \+ envíos \+ admin mínimo  
\- Ops/Logística (0.5–1)  
  \- Preparación de packs \+ estados reales

\#\#\# Rituales (ligeros, pero constantes)  
\- Daily 10 min (solo bloqueos).

