# Añadir el tracker de Apollo.io

## Qué quieres conseguir
Activar el píxel de Apollo.io para identificar visitantes en la web de Bebloo.

## Cómo lo voy a hacer

El script de Apollo es una herramienta de **marketing/tracking de visitantes**, así que por RGPD debe cargarse **solo si el usuario acepta cookies de marketing** en nuestro banner Bebloo (igual que ya hacemos con Hotjar para analítica).

### Cambios

1. **`index.html`** — añadir, justo después del bloque de Hotjar y antes del script de gtag, un bloque equivalente que:
   - Define `loadApollo()` (inserta el `<script>` de `assets.apollo.io/.../tracker.iife.js` con tu `appId: "69fa21bd328a66001113ff4e"`).
   - Comprueba `bebloo_consent_v1` en `localStorage` y solo carga si `marketing === true`.
   - Escucha el evento `bebloo_consent_update` para cargarlo en cuanto el usuario acepte marketing sin recargar la página.
   - Usa la guarda `window.__apolloLoaded` para no cargarlo dos veces.

2. **No hace falta tocar nada más**: el banner Bebloo ya gestiona la categoría "Marketing" y dispara el evento. La Política de Privacidad ya menciona la categoría Marketing en la sección 8 (puedo añadir "Apollo.io" a la lista si quieres, dímelo).

## Notas
- Si NO quieres condicionarlo al consentimiento (por ejemplo, porque Apollo solo identifica empresas y no personas físicas), dímelo y lo cargo siempre. Pero por defecto, y para estar tranquilos con RGPD, lo dejo bajo consentimiento de marketing.
- ¿Lanzo así?
