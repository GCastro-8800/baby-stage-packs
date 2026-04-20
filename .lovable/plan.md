

## Diagnóstico

**El mensaje "No se ha detectado su etiqueta de Google" es un FALSO NEGATIVO.**

La pantalla "Instalar manualmente" de GA4 solo busca el snippet literal `gtag/js?id=G-LCPNHMW3DG` en el HTML. Tú no usas gtag.js directo: usas **Google Tag Manager** (`GTM-PR9NKCJH`) que carga GA4 desde dentro. Esa pantalla no entiende esa arquitectura. Por eso da error aunque el tracking funcione.

**Lo que sí importa de esa captura:** GA te está mostrando como ID a pegar `G-LCPNHMW3DG`, lo que significa que estás logueado/mirando una property GA4 que **NO es** la oficial (`G-DG23NL3Q5B`). Esa property `G-LCPNHMW3DG` es una de las 3 "fantasma" que ya identificamos en la auditoría anterior y que estaban configuradas dentro de GTM disparando tráfico a destinos equivocados.

## Acciones (todas externas — no requieren tocar código)

**1. Verificar correctamente la instalación de GTM** (no GA4 directo)
- Instala la extensión de Chrome **"Tag Assistant Companion"** o entra a `https://tagassistant.google.com`.
- Añade el dominio `https://www.bebloo.es` y conecta.
- Debe detectar `GTM-PR9NKCJH`. Si lo detecta, la base está bien.

**2. Confirmar en GTM que solo queda 1 tag GA4 con el ID correcto**
- Entra a `tagmanager.google.com` → contenedor `GTM-PR9NKCJH` → Tags.
- Debe haber **un solo tag GA4 Configuration** con Measurement ID = `G-DG23NL3Q5B`.
- Si todavía aparecen tags con `G-LCPNHMW3DG`, `G-6G4G9QZBX1` o `G-0T07X0ZGWQ`: bórralos.
- Pulsa **Submit → Publish** para crear una nueva versión del contenedor. Sin Publish, los borrados NO surten efecto en producción.

**3. Confirmar que estás auditando la property GA4 correcta**
- Entra a `analytics.google.com` → Admin → Data Streams.
- Busca el stream con Measurement ID `G-DG23NL3Q5B`.
- Si NO existe en tu cuenta GA4, hay que crearlo (data stream Web apuntando a `https://www.bebloo.es`) y luego asegurarse de que el tag dentro de GTM use ese ID.
- La property que te muestra `G-LCPNHMW3DG` en la captura es DISTINTA y muy probablemente no es la que quieres conservar.

**4. Validación final (después de los pasos 1–3)**
- Abrir `https://www.bebloo.es` en ventana incógnita.
- DevTools → Network → filtro `collect`.
- Aceptar cookies en el banner de CookieYes.
- Debe aparecer **una sola** request a `google-analytics.com/g/collect` con `tid=G-DG23NL3Q5B`.
- En GA4 → Reports → Realtime, debe aparecer 1 usuario activo en `G-DG23NL3Q5B`.

## Lo que NO hay que hacer

- **No** pegar el snippet `gtag.js` que GA te ofrece en "Instalar manualmente". Duplicaría el tracking y entraría en conflicto con GTM.
- **No** tocar `index.html`, `useGTMPageView.ts` ni `App.tsx`. La instalación técnica del lado código está bien.
- **No** fiarse del verificador "Probar" de GA4 para validar GTM: usa Tag Assistant.

## Si tras los pasos 1–4 sigue sin funcionar

Vuelve aquí con captura de:
- Tag Assistant mostrando qué detecta en bebloo.es.
- Lista de tags activos dentro del contenedor GTM-PR9NKCJH.
- Network request a `/g/collect` (URL completa con el `tid=...`).

Con eso podré decirte si el fallo está en GTM, en la property GA4, o en CookieYes bloqueando indebidamente el disparo.

