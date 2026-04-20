
GTM ya está instalado correctamente en `index.html` y, como es una **SPA con React Router**, el `index.html` es la única página HTML real que sirve toda la app. Cualquier ruta (`/`, `/configurador`, `/dashboard`, etc.) carga este mismo `index.html`, así que GTM se ejecuta en **todas las páginas** automáticamente. No hace falta repetirlo.

**Verificación actual:**
- `<head>` línea 22-28: GTM loader `GTM-PR9NKCJH` ✅
- `<body>` línea 52-55: noscript fallback ✅
- Aplica a todas las rutas por la naturaleza SPA ✅

**Lo que falta (importante para SPA):**
GTM por defecto solo dispara `gtm.js` una vez al cargar el HTML inicial. Cuando el usuario navega entre rutas con React Router (`/`, `/configurador`, etc.), **no se dispara un nuevo pageview** automáticamente. Hay que empujar manualmente un evento al `dataLayer` en cada cambio de ruta.

**Plan propuesto:**

1. Crear hook `src/hooks/useGTMPageView.ts` que escuche cambios de `useLocation()` y haga push:
```ts
window.dataLayer.push({
  event: 'page_view',
  page_path: location.pathname + location.search,
  page_title: document.title,
});
```

2. Invocar el hook una vez en `src/App.tsx` dentro del `<BrowserRouter>` para que cubra todas las rutas.

Esto garantiza que GTM (y GA4 vía GTM o directo) reciban un pageview en cada navegación SPA, equivalente a "pegar el código en cada página" que pide Google.

**Archivos:**
- nuevo: `src/hooks/useGTMPageView.ts`
- editar: `src/App.tsx` (1 import + 1 llamada de hook)
