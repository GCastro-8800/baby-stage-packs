

## Eliminar por completo Google Analytics, Google Tag Manager, Consent Mode y CookieYes

Borrado total de cualquier rastro de Google/CookieYes en el código. Se conserva la analítica interna propia (`useAnalytics` → tabla `analytics_events`), que no toca Google. Tras esto, el sitio publicado no cargará ningún script de `googletagmanager.com`, `google-analytics.com` ni `cookieyes.com`, dejándote partir de cero con tu nueva cuenta de Google.

### Cambios en código

**1. `index.html`** — Eliminar 3 bloques del `<head>` y 1 del `<body>`:
- Bloque `<script>` de Google Consent Mode v2 (defaults `denied` + función `gtag`).
- `<script id="cookieyes" ...>` (banner CookieYes).
- `<script>` snippet de Google Tag Manager (`GTM-PR9NKCJH`).
- `<noscript><iframe src="googletagmanager.com/ns.html?...">` del `<body>`.

Resultado: `<head>` queda solo con meta tags (charset, viewport, title, description, OG, Twitter, favicon) y `<body>` solo con `#root` y el script de `main.tsx`.

**2. `src/hooks/useGTMPageView.ts`** — Borrar el archivo completo.

**3. `src/App.tsx`** — Quitar:
- `import { useGTMPageView } from "@/hooks/useGTMPageView";`
- Componente interno `GTMPageViewBoot`.
- Su uso `<GTMPageViewBoot />` dentro de `<AuthProvider>`.

### Lo que NO se toca

- `src/hooks/useAnalytics.ts` y la tabla `analytics_events` → analítica propia, no Google.
- Todos los `track(...)` en componentes → siguen funcionando contra Supabase.
- `PrivacyPolicy.tsx` → la sección 8 ya dice "no usamos cookies de seguimiento publicitario de terceros", queda coherente.
- Edge functions, migraciones, configuración Supabase: sin cambios.

### Tras aplicar

1. Pulsa **Publish → Update** para que la nueva versión sin Google quede en `bebloo.es`.
2. Verifica en incógnito (DevTools → Network): no debe haber ninguna request a `googletagmanager.com`, `google-analytics.com/g/collect` ni `cookieyes.com`.
3. En tu cuenta de Google nueva, cuando quieras volver a instalar: pídeme reinstalar GTM con el nuevo container ID y, si quieres, CookieYes con el nuevo site key.

### Detalle técnico

- No hay dependencias npm de Google/CookieYes que desinstalar (todo va por scripts inline en `index.html`).
- El tipo global `declare global { interface Window { dataLayer } }` desaparece junto con el archivo `useGTMPageView.ts`. Ningún otro fichero referencia `dataLayer`, así que no hay errores de TypeScript residuales.
- Ningún componente importa `useGTMPageView` salvo `App.tsx`.

