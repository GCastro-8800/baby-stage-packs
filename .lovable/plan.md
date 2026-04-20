

La etiqueta de **Google Analytics** está instalada pero **duplicada y en orden incorrecto**. Actualmente hay dos inicializaciones de gtag que pueden causar conflictos.

**Problemas encontrados:**

| Línea | Problema |
|-------|----------|
| 16-17 | `gtag('js', ...)` y `gtag('config', ...)` en script inline → **redundante** |
| 19 | Script async de gtag.js cargado **después** del inline (incorrecto) |

**Orden correcto requerido:**

```html
<head>
  <!-- 1. Google tag - script async primero -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-DG23NL3Q5B"></script>
  
  <!-- 2. Configuración inline después -->
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-DG23NL3Q5B');
  </script>
  
  <!-- 3. CookieYes (consent banner) -->
  <script id="cookieyes" ...></script>
  ...
</head>
```

**Acción:** Reemplazar las líneas 4-19 de `index.html` con la estructura correcta de la etiqueta Google, eliminando el bloque `consent default` redundante (CookieYes lo inyecta automáticamente).

**Archivo:** `index.html`
