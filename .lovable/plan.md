

## Plan: Actualizar FAQs al modelo actual

Las FAQs actuales usan términos prohibidos ("suscripción", "etapa") y no reflejan el modelo de selección individual con duración personalizada por producto. Hay que alinearlas con la terminología y el flujo real.

### Cambios en `src/components/FAQSection.tsx`

Reescribir el array `faqs` con preguntas que reflejen:
- **Modelo de selección individual**: el usuario elige productos uno a uno del catálogo y selecciona la duración de cada uno
- **Terminología correcta**: usar "selección", "servicio", "equipamiento" — nunca "pack", "plan" ni "suscripción"
- **Sostenibilidad**: mencionar la motivación de alargar la vida útil del equipamiento
- Mantener las preguntas sobre limpieza, marcas, zonas de entrega y cancelación, pero con respuestas actualizadas

FAQs propuestas:
1. **¿Cómo funciona el servicio?** — Eliges productos, duración por producto, te lo entregamos y recogemos.
2. **¿Cómo funciona la limpieza?** — Proceso profesional hipoalergénico + inspección de seguridad.
3. **¿Puedo cancelar o devolver en cualquier momento?** — Sin permanencia, recogida sin coste.
4. **¿Qué marcas utilizáis?** — Bugaboo, Stokke, BabyBjörn, Babyzen, Cybex…
5. **¿En qué zonas hacéis entrega?** — Madrid y área metropolitana.
6. **¿Por qué alquilar en vez de comprar?** — Sostenibilidad, ahorro, equipamiento premium sin compromiso a largo plazo.

