

## Estado actual de bebloo y próximos pasos

### Lo que ya está construido
- **Homepage** completa (hero, cómo funciona, precios, FAQ, testimonios, comparación, marcas)
- **Configurador** (`/configurador`) con selección de productos por categoría
- **Mi Selección** (`/mi-seleccion`) con sidebar, gestión de duración, checkout a Stripe
- **Catálogo** (`/catalogo`) con fichas de producto detalladas
- **Auth** (login, signup, Google OAuth)
- **Onboarding** (flujo de 4 pasos: situación, fecha, experiencia, completado)
- **Dashboard** (`/app`) con etapa del bebé, suscripción, envíos, feedback, tips
- **Settings** con gestión de hijos
- **Admin** con pestañas de leads, suscripciones, envíos
- **Páginas legales** (privacidad, condiciones)
- **Quiénes somos**
- **ChatBot**, WhatsApp, FloatingCTA
- **Seguridad**: RLS, guards de auth en checkout, protección de admin_credentials

### Lo que falta o se puede mejorar

**1. Historias / Testimonios (página dedicada)** — Prioridad alta
El masterplan menciona `/stories` como página independiente con mini-diarios de padres, filtrados por etapa. Actualmente solo hay una sección de testimonios en la homepage, pero no existe la página dedicada.

**2. SEO y meta tags** — Prioridad alta
No hay meta tags dinámicos (Open Graph, Twitter cards, description) en las páginas. Importante para compartir en redes y posicionamiento.

**3. Página de "Cómo funciona" dedicada** — Prioridad media
Existe como sección en la homepage pero no como página standalone para enlaces directos.

**4. Email de confirmación post-suscripción** — Prioridad alta
Existe la edge function `send-confirmation-email` pero no está claro si se integra correctamente tras el pago exitoso.

**5. Google OAuth** — Prioridad media
El código tiene `signInWithGoogle` implementado. Verificar que funciona correctamente.

**6. Gestión de suscripción desde el dashboard** — Prioridad media
Pausar, reprogramar envío, cambiar fecha — el dashboard muestra datos pero las acciones de gestión podrían no estar conectadas al backend real.

**7. Responsive / Mobile polish** — Prioridad media
El plan de la barra móvil con Sheet para gestión de cesta ya se implementó, pero puede haber más pulido mobile pendiente.

**8. Performance** — Prioridad baja
Las imágenes de producto no parecen estar optimizadas (formatos modernos, lazy loading, srcset).

### Recomendación de siguiente paso

Los items con más impacto inmediato para un MVP funcional serían:
1. **SEO y meta tags** — necesario para lanzamiento público
2. **Página de Historias** — diferenciador emocional del producto
3. **Verificar el flujo completo de pago end-to-end** — asegurar que Stripe webhook → suscripción en DB → dashboard funciona

¿Cuál de estas áreas te gustaría abordar primero?

