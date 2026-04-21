

## Integrar Sentry en Bebloo (React + Vite)

Voy a instalar y configurar `@sentry/react` con tu DSN, integrarlo con tu `ErrorBoundary` existente y con React Router, y dejar source maps subidos en cada build de producción.

### 1. Instalar dependencias

- `@sentry/react` — SDK de runtime.
- `@sentry/vite-plugin` — sube source maps en build (preferible al wizard interactivo, que aquí no podemos correr).

### 2. Variables de entorno

Añadir al `.env` (no toco las gestionadas por Lovable):

```
VITE_SENTRY_DSN="https://5a8991dbffa9f9a28dad382152dfdc71@o4511253436301312.ingest.de.sentry.io/4511259453161552"
```

Y como **secret de build** (te lo pediré con `add_secret` al pasar a default mode, no se commitea ni se expone al cliente):

- `SENTRY_AUTH_TOKEN` → token de Sentry para subir source maps. Lo generas en Sentry → Settings → Auth Tokens con scope `project:releases`.

Org y project ya conocidos del wizard: `bebloo` / `debbuging-bebloo`.

### 3. Inicializar Sentry en `src/main.tsx`

Init **antes** de `createRoot(...).render(...)` con:

- `dsn` desde `import.meta.env.VITE_SENTRY_DSN` (no hardcodeado).
- `environment`: `'production'` si `import.meta.env.PROD`, si no `'preview'`.
- `release`: `import.meta.env.VITE_APP_VERSION ?? 'dev'` (el plugin lo inyecta en build).
- Integraciones:
  - `Sentry.browserTracingIntegration()` con instrumentación de **React Router v6** (`useLocation`, `useNavigationType`, `createRoutesFromChildren`, `matchRoutes`) → breadcrumbs y trazas por ruta.
  - `Sentry.replayIntegration({ maskAllText: false, blockAllMedia: false })` → Session Replay (útil para debug visual). Privacidad: enmascararemos inputs (`maskAllInputs: true`) para no capturar emails/datos del onboarding.
- Sample rates conservadores:
  - `tracesSampleRate: 0.1`
  - `replaysSessionSampleRate: 0.05`
  - `replaysOnErrorSampleRate: 1.0`
- `sendDefaultPii: false` (lo activamos solo si lo pides; tu app maneja datos de bebés/padres).
- `beforeSend`: filtrar errores ruidosos conocidos (`ResizeObserver loop limit exceeded`, extensiones del navegador).

### 4. Conectar con tu `ErrorBoundary`

Tu `src/components/ErrorBoundary.tsx` ya hace `console.error`. Le añado una llamada `Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } })` dentro de `componentDidCatch`. Mantengo tu UI de fallback en español tal cual.

### 5. Wrap del Router para route tracing

En `src/App.tsx`, envolver `Routes` con `Sentry.withSentryReactRouterV6Routing(Routes)` para que cada navegación se asocie a una transacción con el nombre de la ruta (`/catalogo`, `/configurador`, etc.).

### 6. Source maps en build

En `vite.config.ts`:

- `build.sourcemap: true`.
- Añadir `sentryVitePlugin({ org: 'bebloo', project: 'debbuging-bebloo', authToken: process.env.SENTRY_AUTH_TOKEN, disable: !process.env.SENTRY_AUTH_TOKEN })` al final del array `plugins`.
- `disable` evita romper builds locales/de preview cuando el token no esté disponible.

### 7. Botón de verificación (temporal)

Añado un pequeño botón **"Break the world"** SOLO visible en preview (`import.meta.env.DEV` o hostname `*lovable.app` distinto de producción) en una esquina del `Footer`, para confirmar que llegan errores a Sentry. Una vez verificado en tu dashboard, lo retiramos en el siguiente turno.

### Lo que NO se toca

- `src/integrations/supabase/client.ts`, `.env` gestionado, ni Edge Functions (Sentry para Deno es otra integración separada — lo vemos después si quieres).
- Lógica de negocio, catálogo, precios, auth.
- Consent Mode / CookieYes en `index.html`: Sentry no se considera analytics de marketing, pero si quieres condicionarlo a consent te lo planteo aparte.

### Verificación post-cambio

1. Abrir preview → footer → click en "Break the world" → ver el error en Sentry → Issues en pocos segundos.
2. Navegar entre `/`, `/catalogo`, `/configurador` → verificar breadcrumbs `navigation` con esas rutas.
3. Tras un build de producción, comprobar que en el issue el stack trace muestra archivos `.tsx` originales (source maps OK).

