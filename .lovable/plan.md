

## Instalar Hotjar (Site ID 6694632) con respeto a Consent Mode

Añadir el Tracking Code de Hotjar en el `<head>` de `index.html`. Como bebloo es una SPA (React + Vite) con un único `index.html`, pegarlo ahí equivale a instalarlo en todas las páginas del sitio.

Para cumplir RGPD y no romper la configuración de CookieYes + Consent Mode v2 ya instalada, el snippet se envuelve en un wrapper que lo carga **solo** cuando el usuario acepta la categoría `analytics` en el banner.

### Cambio en `index.html`

Insertar tras el bloque de CookieYes y antes del cierre de `</head>`:

```html
<!-- Hotjar Tracking Code for Bebloo (carga condicional según consentimiento) -->
<script>
  (function () {
    function loadHotjar() {
      if (window.__hjLoaded) return;
      window.__hjLoaded = true;
      (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:6694632,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    }

    function hasAnalyticsConsent() {
      try {
        var c = (window.getCkyConsent && window.getCkyConsent()) || {};
        return !!(c.categories && c.categories.analytics);
      } catch (e) { return false; }
    }

    if (hasAnalyticsConsent()) loadHotjar();
    document.addEventListener('cookieyes_consent_update', function () {
      if (hasAnalyticsConsent()) loadHotjar();
    });
  })();
</script>
```

### Comportamiento

- Visitante nuevo → banner CookieYes → Hotjar **no** carga.
- Acepta analytics → CookieYes emite `cookieyes_consent_update` → Hotjar se inyecta y empieza a grabar sesiones / heatmaps / encuestas.
- Rechaza analytics → Hotjar nunca se carga.
- Visitante recurrente que ya aceptó → Hotjar carga inmediatamente en el primer pageview.

### Alcance "cada página"

bebloo es SPA con un único `index.html` servido en todas las rutas (`/`, `/catalog`, `/configurator`, `/app`, etc.). Al pegar el snippet en ese `<head>` queda activo en todas las vistas automáticamente. Hotjar detecta los cambios de ruta de React Router vía History API y registra los pageviews virtuales sin configuración extra.

### Verificación posterior (tras Publish)

1. Abrir `bebloo.es` en incógnito → DevTools Network filtro `hotjar`: **0 requests** mientras el banner esté visible o si se rechaza.
2. Aceptar analytics en el banner → debe cargar `https://static.hotjar.com/c/hotjar-6694632.js?sv=6`.
3. Panel Hotjar → *Sites & Organizations* → indicador pasa a **Tracking code installed**.
4. Hotjar → *Recordings*: la sesión aparece en 2–5 minutos.

### Lo que NO se toca

- GA4 (`G-G2070NPYMS`), Consent Mode v2 y CookieYes siguen igual.
- Sin nuevas dependencias npm, sin componentes React, sin migraciones, sin edge functions.

