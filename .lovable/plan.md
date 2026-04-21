

## Quitar el botón temporal de debug del Footer

Sentry ya está verificado y recibiendo eventos correctamente.

### Cambio en `src/components/Footer.tsx`

- Eliminar la constante `isPreviewEnv` (líneas 4-8).
- Eliminar el bloque `{isPreviewEnv && (...)}` con el botón "[debug] Break the world" (líneas finales antes del cierre de `</div></footer>`).
- Eliminar el import de `Link` no afectado; el resto del footer queda intacto.

### Lo que queda activo en Sentry
- Captura automática de errores de render via `ErrorBoundary`.
- Captura de excepciones no manejadas y promesas rechazadas (automático del SDK).
- Tracing de navegación por ruta (React Router v6).
- Session Replay (5% de sesiones, 100% en errores).
- Source maps subidos en cada build de producción.

### Cómo seguir usando Sentry desde ahora
- Errores reales en preview/prod aparecen solos en **Sentry → Issues**.
- Para reportar algo manualmente desde código: `import * as Sentry from "@sentry/react"; Sentry.captureException(err)` o `Sentry.captureMessage("texto")`.

