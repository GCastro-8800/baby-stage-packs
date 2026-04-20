
GTM `GTM-PR9NKCJH` no está instalado. Solo está GA4 (`G-DG23NL3Q5B`) directo. Voy a añadir GTM **manteniendo** el orden de consentimiento existente.

**Cambios en `index.html`:**

1. **En `<head>`** — añadir el loader de GTM **después** del bloque de Consent Mode v2 (línea 20) y **antes** del loader de gtag.js, para que GTM herede los defaults `denied`:

```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PR9NKCJH');</script>
<!-- End Google Tag Manager -->
```

2. **Justo después de `<body>`** (línea 43) — añadir el fallback noscript:

```html
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PR9NKCJH"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```

**Orden final en `<head>`:**
1. CookieYes
2. Consent Mode v2 defaults (denied) + gtag config GA4
3. **GTM loader (nuevo)**
4. gtag.js async loader

**Notas importantes:**
- Mantengo GA4 directo (`G-DG23NL3Q5B`) además de GTM. Si en el futuro mueves GA4 dentro de GTM como tag, hay que quitar el config directo para evitar doble conteo.
- El `noscript` va en `<body>`, no en `<head>` (restricción HTML5).
- Ambos comparten el mismo `dataLayer`, así que el Consent Mode aplica a los dos.

**Archivo:** `index.html` (2 inserciones, sin borrados).
