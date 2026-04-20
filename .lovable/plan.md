

## Instalar CookieYes + Google Consent Mode v2

Instalación correcta del banner de CookieYes con tu nuevo `client_data` y conexión real con la etiqueta GA4 ya instalada (`G-G2070NPYMS`), de forma que GA respete el consentimiento del usuario desde el primer pageview.

### Cambios en `index.html`

El orden importa. Quedará así dentro de `<head>`, justo después de `<meta charset>`:

1. **Consent Mode v2 — defaults `denied`** (debe ir ANTES de cargar gtag para que el primer hit ya respete el consentimiento):
   ```html
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('consent', 'default', {
       ad_storage: 'denied',
       ad_user_data: 'denied',
       ad_personalization: 'denied',
       analytics_storage: 'denied',
       functionality_storage: 'granted',
       security_storage: 'granted',
       wait_for_update: 500
     });
   </script>
   ```

2. **CookieYes** (carga el banner y, al aceptar, dispara `consent update` automáticamente porque detecta que existe `gtag`):
   ```html
   <script id="cookieyes" type="text/javascript" src="https://cdn-cookieyes.com/client_data/57a9019cf00b96663b195463/script.js"></script>
   ```

3. **Google Analytics 4** (queda como está, ya cargado y configurado con `G-G2070NPYMS`). Solo se elimina la línea duplicada `function gtag(){...}` y `window.dataLayer = ...` del bloque actual de GA, porque ya quedan declaradas en el bloque de Consent Mode de arriba.

### Resultado de comportamiento

- Primer pageview: GA4 dispara pero **sin cookies de analítica** (porque `analytics_storage: denied`). Consent Mode v2 envía pings anónimos = Google puede modelar conversiones sin violar RGPD.
- Banner CookieYes aparece con Aceptar / Rechazar / Configurar.
- Si el usuario acepta analytics → CookieYes llama a `gtag('consent', 'update', {analytics_storage: 'granted'})` → GA empieza a usar cookies normales.
- Si rechaza → todo sigue en modo anónimo.

### Lo que NO se toca

- `G-G2070NPYMS` se mantiene.
- Google Tag Manager: sigue eliminado (no se reintroduce).
- Analítica propia (`useAnalytics` → tabla `analytics_events`): no usa cookies de tracking publicitario, no necesita consentimiento previo bajo AEPD (interés legítimo / función necesaria), se queda igual.
- `PrivacyPolicy.tsx`: sigue siendo coherente. Más adelante conviene actualizar la sección de cookies para mencionar CookieYes + GA4 + Consent Mode, pero no es bloqueante.

### Verificación posterior (tras Publish)

1. Incógnito en `bebloo.es` → debe aparecer el banner CookieYes.
2. DevTools → Network filtro `gtag`: debe cargar `gtag/js?id=G-G2070NPYMS`.
3. DevTools → Network filtro `collect`: debe haber requests con parámetro `gcs=G100` (denied) antes de aceptar y `gcs=G111` (granted) tras aceptar analytics.
4. CookieYes dashboard → ver el primer registro de consentimiento entrante.

### Detalle técnico

- El bloque actual de GA4 en `index.html` declara `window.dataLayer` y `function gtag` ANTES de definir Consent Mode. Si dejamos los dos bloques, `function gtag` se redeclara sin problema (mismo cuerpo), pero es más limpio dejar la declaración una sola vez en el bloque de Consent Mode (que va primero) y eliminarla del bloque GA4.
- `wait_for_update: 500` da 500 ms al CMP para inyectar el estado real antes de que GA envíe el primer hit, evitando un hit "denied" innecesario si el usuario ya tenía consentimiento previo guardado.
- CookieYes detecta automáticamente GA4 vía `gtag` global y mapea sus categorías (`analytics_storage`, `ad_storage`, etc.) sin configuración adicional por nuestra parte.
- No hay cambios en componentes React, hooks, edge functions, migraciones ni dependencias npm. Todo es HTML estático.

