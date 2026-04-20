

**Plan: Aplicar fix de doble pageview + nota sobre propagación de GTM**

**1. Fix en código** (`src/hooks/useGTMPageView.ts`):
- Añadir `useRef(true)` como flag `isFirstRender`.
- En el `useEffect`, si es el primer render: marcar `false` y salir sin hacer push.
- En navegaciones SPA posteriores: hacer push de `page_view` al dataLayer.
- Razón: GTM ya dispara automáticamente un `page_view` al cargar `gtm.js` en la primera visita. El hook duplicaba ese hit inicial.

**2. Sobre el borrado de tags en GTM (informativo, no requiere código):**
- Cuando borras tags en `tagmanager.google.com`, el cambio NO es inmediato en la web.
- Necesitas pulsar **Submit → Publish** dentro de GTM para crear una nueva versión del contenedor.
- Una vez publicado en GTM, los navegadores que ya tienen `gtm.js` cacheado pueden tardar unos minutos en recibir la nueva versión (caché de hasta ~15 min).
- Verificación: tras publicar en GTM, abrir la web en incógnito y revisar las network requests a `google-analytics.com/g/collect` — solo debe aparecer `tid=G-DG23NL3Q5B`.

**3. Lo que NO se toca:**
- `index.html` (Consent Mode ya en `denied`, GTM snippet correcto).
- `useAnalytics.ts` (tracking propio en Supabase, decisión separada).
- `App.tsx`.

**Archivo a editar:**
- `src/hooks/useGTMPageView.ts`

**Acción manual tras el fix:**
- Publicar la app (Publish → Update).
- Confirmar en GTM que pulsaste **Submit → Publish** después de borrar los tags duplicados.
- Probar en incógnito y verificar en GA4 DebugView que solo llegan eventos a `G-DG23NL3Q5B`.

