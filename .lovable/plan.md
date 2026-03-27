

## Estado actual y siguiente paso

### Completado
1. ✅ Flujo de pago único adelantado con Stripe
2. ✅ SEO y meta tags (Open Graph, Twitter Cards, react-helmet-async)
3. ✅ Quick Wins de consultoría (contraste WCAG, JSON-LD FAQ, Hero compactado, badge de ahorro)

### Pendiente (por orden de impacto)

**→ Siguiente: Email de confirmación post-pago** — Prioridad alta
- Configurar la infraestructura de emails de la app
- Crear template de confirmación de pedido con desglose de productos, duraciones y total pagado
- Disparar el envío desde el webhook de Stripe tras pago exitoso
- El usuario recibe un email profesional con todo el detalle de su contratación

**Después:**
- Página `/historias` — mini-diarios de padres con tarjetas tipo Moleskine, filtro por etapa
- Página `/como-funciona` — timeline visual detallado, ejemplos de packs
- Pulido mobile y performance — responsive audit, lazy loading, WebP

### Cambios técnicos para el email post-pago

**1. Infraestructura de email**
- Configurar dominio de email y setup de infraestructura via herramientas internas
- Scaffold de email transaccional (Edge Functions de envío, supresión, unsubscribe)

**2. Template `order-confirmation.tsx`**
- React Email component en `_shared/transactional-email-templates/`
- Contenido: saludo, tabla con productos contratados (nombre, duración, precio unitario, subtotal), total pagado, mensaje de bienvenida
- Estilo alineado con la marca bebloo (colores, tipografía, tono emocional)

**3. Trigger desde webhook de Stripe**
- En `stripe-webhook/index.ts`, tras crear la suscripción y envíos en BD, invocar `send-transactional-email` con template `order-confirmation`
- Pasar `templateData` con el desglose de productos y total
- Usar `idempotencyKey` basado en el session ID de Stripe

**4. Página de unsubscribe**
- Crear página en la ruta disponible (ej. `/unsubscribe`) con diseño consistente con bebloo

### Archivos afectados
- `supabase/functions/_shared/transactional-email-templates/order-confirmation.tsx` — nuevo
- `supabase/functions/_shared/transactional-email-templates/registry.ts` — actualizar
- `supabase/functions/stripe-webhook/index.ts` — añadir trigger de email
- Nueva página de unsubscribe en `src/pages/`
- `src/App.tsx` — ruta de unsubscribe

