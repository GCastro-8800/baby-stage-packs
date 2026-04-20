

Reactivar CookieYes y revertir Consent Mode a `denied` para cumplir RGPD.

**Cambios en `index.html`:**

1. **Línea ~5**: descomentar el script de CookieYes.
2. **Líneas ~10-15**: revertir los defaults del Consent Mode v2 de `'granted'` a `'denied'` (excepto `security_storage` que siempre va granted por defecto de Google).

**Resultado:**
- Banner de CookieYes vuelve a mostrarse.
- GTM sigue cargando siempre.
- GA4 (vía GTM) respeta el consentimiento del usuario hasta que acepte/rechace en el banner.

**Archivo:** `index.html` (1 edición múltiple)

