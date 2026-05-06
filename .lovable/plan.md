
# Banner de cookies propio para Bebloo

## Objetivo

Quitar CookieYes (que está a punto de caducar) y reemplazarlo por un banner de cookies hecho a medida, con el look & feel de Bebloo, que cumpla la normativa europea (RGPD/LOPDGDD) y siga controlando correctamente la carga de Google Analytics y Hotjar.

## Qué verá el usuario

1. **Primera visita**: aparece un banner discreto en la parte inferior (en móvil ocupa el ancho completo, en escritorio queda como tarjeta flotante).
   - Texto cálido en el tono de Bebloo, sin tecnicismos.
   - Tres botones claros:
     - **Aceptar todo** (botón coral, principal)
     - **Rechazar todo** (botón secundario)
     - **Personalizar** (abre el panel de preferencias)
   - Enlace a la Política de Privacidad.

2. **Panel de preferencias** (modal):
   - **Necesarias** — siempre activas (sesión, login, carrito). No se pueden desactivar.
   - **Analítica** — Google Analytics y Hotjar (medir uso para mejorar la web).
   - **Marketing** — reservado para el futuro (remarketing, píxeles publicitarios).
   - Botón "Guardar mis preferencias".

3. **Reabrir preferencias en cualquier momento**:
   - Enlace "Configurar cookies" en el footer.
   - Enlace equivalente dentro de la sección 8 de la Política de Privacidad.

4. **Caducidad**: la decisión se recuerda durante 6 meses; pasado ese tiempo el banner vuelve a aparecer (recomendación del RGPD).

## Diseño

- Mismos tokens del proyecto: fondo crema, tipografía Fraunces para el título y DM Sans para el cuerpo, botón principal coral, botón secundario azul claro, bordes redondeados (`--radius`).
- Animación suave de entrada (slide-up).
- Accesible: foco atrapado en el modal, etiquetas ARIA, cierre con Esc.

## Qué pasa por dentro (sección técnica)

1. **`index.html`**
   - Eliminar el `<script id="cookieyes">`.
   - Sustituir las funciones `hasAnalyticsConsent` / listener `cookieyes_consent_update` por un listener del evento propio `bebloo_consent_update`.
   - Mantener Google Consent Mode v2 con defaults `denied` (ya está bien).
   - Hotjar se sigue cargando solo si hay consentimiento de analítica.

2. **Nuevo módulo `src/lib/consent.ts`**
   - Tipo `ConsentState = { necessary: true; analytics: boolean; marketing: boolean; timestamp: number }`.
   - API: `getConsent()`, `setConsent(partial)`, `hasConsent()`, `clearConsent()`, `onConsentChange(cb)`.
   - Persistencia en `localStorage` con clave `bebloo_consent_v1` y caducidad 180 días.
   - Al guardar: actualiza `gtag('consent','update', {...})` con el mapeo correcto (`analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization`) y dispara `window.dispatchEvent(new Event('bebloo_consent_update'))`.

3. **Nuevos componentes**
   - `src/components/cookies/CookieBanner.tsx` — banner inferior, se monta una sola vez en `App.tsx` y solo se muestra si `!hasConsent()`.
   - `src/components/cookies/CookiePreferencesDialog.tsx` — modal con los toggles por categoría, reutilizable desde el banner y desde el footer.
   - `src/hooks/useCookieConsent.ts` — hook que expone `consent`, `openPreferences()`, `acceptAll()`, `rejectAll()`.

4. **Integraciones existentes**
   - `App.tsx`: montar `<CookieBanner />` al final, junto a los toasters globales.
   - `src/components/Footer.tsx`: añadir botón "Configurar cookies" que dispare `openPreferences()`.
   - `src/pages/PrivacyPolicy.tsx`: actualizar sección 8 con la lista real de categorías y un enlace "Cambiar mis preferencias".

5. **Limpieza**
   - Eliminar todas las referencias a CookieYes (`getCkyConsent`, `cookieyes_consent_update`).
   - No tocamos los scripts de GA ni Hotjar más allá del cambio de listener.

## Fuera de alcance

- No se añaden píxeles de marketing nuevos (Meta, TikTok, etc.); la categoría queda preparada pero vacía.
- No se hace traducción a otros idiomas (solo español, como el resto de la web).
- No se sustituye la Política de Privacidad completa, solo la sección de cookies.

¿Lo lanzo así o prefieres ajustar algo (tono del texto, posición del banner, añadir logo, etc.)?
