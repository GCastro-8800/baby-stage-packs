

## Próximos pasos para bebloo — Priorizado

### Ya completado
- Homepage, Configurador, Selección, Catálogo, Auth, Onboarding, Dashboard, Settings, Admin, Legal, About Us, ChatBot, WhatsApp
- Flujo de pago único adelantado con Stripe
- Panel móvil con Sheet para gestión de cesta

### Lo que sigue (por orden de impacto)

**1. SEO y meta tags** — Impacto alto, esfuerzo bajo
- Instalar `react-helmet-async`
- Añadir `<title>`, `<meta description>`, Open Graph (`og:title`, `og:description`, `og:image`) y Twitter Cards a todas las páginas públicas: Index, About Us, Catálogo, Configurador, Privacidad, Condiciones
- Necesario antes de cualquier lanzamiento público o compartir en redes

**2. Email de confirmación post-pago** — Impacto alto, esfuerzo medio
- Configurar dominio de email con la infraestructura integrada de Lovable
- Crear template de email con desglose de productos contratados, duraciones y total pagado
- Disparar el envío desde el webhook de Stripe tras pago exitoso
- El usuario recibe confirmación profesional con todo el detalle de su pedido

**3. Página de Historias `/historias`** — Impacto alto, esfuerzo medio
- Página dedicada con testimonios tipo mini-diarios de padres
- Tarjetas con foto, quote, contexto del bebé (etapa, edad)
- Filtro por etapa
- Enlace desde Header y Footer

**4. Página "Cómo funciona" `/como-funciona`** — Impacto medio
- Extraer y ampliar la sección HowItWorks a página standalone
- Timeline visual más detallado con ejemplos de packs

**5. Pulido mobile y performance** — Impacto medio-bajo
- Auditar responsive en Configurador y Dashboard
- Lazy loading de imágenes, optimización a WebP

### Recomendación
Empezar por **SEO y meta tags** — es rápido, de alto impacto y bloquea el lanzamiento. ¿Por cuál quieres empezar?

