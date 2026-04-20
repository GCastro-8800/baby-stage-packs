

**Análisis de la situación:**

El usuario quiere limpiar `index.html` para que GTM (`GTM-PR9NKCJH`) sea la única fuente de carga de GA4. Reviso punto por punto:

1. **Línea 31 (gtag.js async)**: cargar `https://www.googletagmanager.com/gtag/js?id=G-DG23NL3Q5B` directamente compite con GTM. Si en GTM hay un tag de configuración GA4 con el mismo ID `G-DG23NL3Q5B`, hay doble carga / doble conteo. Eliminarla es correcto.

2. **Línea 17 (`gtag('config', 'G-DG23NL3Q5B')`)**: también dispara GA4 fuera de GTM. Si GTM va a gestionar GA4, esta línea también debe eliminarse para evitar el doble conteo. El usuario menciona "elimina la duplicidad" → asumo que también quiere fuera el `gtag('config')` directo. Lo incluyo en el plan.

3. **Consent Mode bloqueando GTM**: Importante aclaración técnica — `gtag('consent', 'default', {...denied})` **NO bloquea** la carga del contenedor GTM. Lo que hace es indicar a los tags dentro de GTM (GA4, Ads) que no deben enviar datos hasta que el consentimiento sea actualizado vía `gtag('consent', 'update', ...)`. GTM-PR9NKCJH se carga siempre, independientemente del consent.

   El "bloqueo" real que ve el usuario en Tag Assistant probablemente es:
   - GA4 muestra "denied" para `analytics_storage` → los hits no se envían (o se envían en modo cookieless ping).
   - Como CookieYes está comentado (desactivado para pruebas), nunca se dispara `consent update` → todo queda en `denied` permanentemente.

   **Solución para la prueba**: mientras CookieYes esté desactivado, cambiar los defaults a `granted` para que los tags de GTM puedan disparar libremente durante el test. Cuando se reactive CookieYes, hay que volver a `denied`.

4. **Verificación ID**: el único ID GA4 es `G-DG23NL3Q5B`. Confirmado. Tras eliminar gtag.js directo, el ID solo existirá dentro de los tags configurados en GTM (no en `index.html`).

**Cambios concretos en `index.html`:**

- **Eliminar líneas 30-31**: el `<script async src="...gtag/js?id=G-DG23NL3Q5B">`.
- **Eliminar línea 17**: `gtag('config', 'G-DG23NL3Q5B');` (ahora lo hace GTM).
- **Cambiar defaults del Consent Mode (líneas 10-15)**: pasar todos a `'granted'` temporalmente para la prueba sin CookieYes. Añadir comentario claro de que esto es **temporal** y debe volver a `denied` cuando se reactive CookieYes.
- **Mantener**: `gtag('js', new Date())` (necesario para timestamps), bloque GTM loader, noscript GTM.

**Estructura final del `<head>` (orden):**
```text
1. CookieYes (comentado - desactivado para pruebas)
2. Consent Mode v2 con defaults GRANTED (temporal) + gtag('js')
3. GTM loader (GTM-PR9NKCJH)
4. Meta tags / SEO
```

**Publicación:**
Los cambios en `index.html` son frontend. Una vez aplicados, el usuario debe pulsar **Publish → Update** desde el editor para que la nueva versión esté disponible en `bebloo.es` y poder probar con Tag Assistant. No puedo publicar yo automáticamente — es una acción manual del usuario.

**Recordatorio importante (post-prueba):**
Cuando reactives CookieYes, hay que revertir los defaults del Consent Mode a `'denied'` para cumplir RGPD. Lo dejo anotado como comentario en el HTML.

**Archivos:**
- `index.html` (1 edición múltiple)

**Acción manual del usuario tras los cambios:**
- Pulsar **Publish → Update** en la esquina superior derecha del editor.

