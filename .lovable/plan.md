

**Plan: Desactivar temporalmente CookieYes para prueba de analytics**

**Objetivo:** Ocultar el banner de cookies comentando el script de CookieYes sin afectar GTM ni GA4.

**Cambio:**
- `index.html` línea 5: comentar el script de CookieYes

```html
<!-- <script id="cookieyes" type="text/javascript" src="https://cdn-cookieyes.com/client_data/a84a1c10553663081741fdce/script.js"></script> -->
```

**Notas:**
- GTM y GA4 seguirán cargando correctamente
- Google Consent Mode v2 se mantiene funcionando (los defaults seguirán siendo "denied")
- Fácil de revertir: eliminar los comentarios (`<!-- -->`)
- El banner no se mostrará en el preview

**Archivo:** `index.html` (1 línea comentada)

