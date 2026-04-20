
Objetivo: hacer una prueba controlada cambiando temporalmente el Consent Mode para que todos los permisos arranquen en `granted`, sin tocar el snippet de GTM ni el tracking SPA ya existente.

Estado actual verificado:
- `index.html` ya contiene correctamente el contenedor GTM `GTM-PR9NKCJH` en `<head>` y el `noscript` en `<body>`.
- La app ya tiene tracking de navegación SPA mediante `src/hooks/useGTMPageView.ts`, montado en `src/App.tsx`.
- El único bloqueo visible en el HTML actual es el bloque:
  ```js
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied'
  })
  ```

Implementación propuesta:
1. Editar `index.html`.
2. Cambiar temporalmente en el bloque `gtag('consent', 'default', ...)` estos 4 valores de `denied` a `granted`:
   - `ad_storage`
   - `ad_user_data`
   - `ad_personalization`
   - `analytics_storage`
3. Mantener sin cambios:
   - script de CookieYes
   - snippet de GTM `GTM-PR9NKCJH`
   - `noscript` de GTM
   - hook `useGTMPageView`
4. Añadir un comentario breve en el HTML indicando que este cambio es solo para diagnóstico y luego debe volver a `denied`.

Resultado esperado:
- GTM seguirá cargando como ahora, pero los tags gestionados por consentimiento arrancarán habilitados.
- Si Tag Assistant conecta tras este cambio, quedará confirmado que el problema está en la configuración/actualización del consentimiento, no en la instalación base de GTM.
- Si sigue sin detectar GTM, el problema estará en otro punto distinto del Consent Mode.

Archivo a tocar:
- `index.html`

Validación tras implementarlo:
1. Abrir la versión actualizada publicada.
2. Probar con Tag Assistant sobre `bebloo.es`.
3. Verificar que detecta `GTM-PR9NKCJH`.
4. Verificar también que las navegaciones SPA siguen enviando `page_view`.

Detalle importante sobre publicación:
- El cambio es frontend, así que después de implementarlo habrá que pulsar `Publish → Update` para que quede activo en la web publicada y puedas probar Tag Assistant sobre la versión nueva.

Detalle técnico:
- Aunque técnicamente GTM suele cargarse aunque el consentimiento esté en `denied`, este test sigue siendo válido para aislar si la detección o activación efectiva de tags está condicionada por la configuración actual de consentimiento.
- No hace falta tocar `src/App.tsx` ni `src/hooks/useGTMPageView.ts` para esta prueba.
