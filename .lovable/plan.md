

## Corregir enlaces externos (WhatsApp, Calendly) bloqueados en preview

### Problema

Los enlaces a `wa.me` y otros sitios externos muestran `ERR_BLOCKED_BY_RESPONSE` porque `api.whatsapp.com` rechaza ser cargado dentro de un iframe. La vista previa de Lovable ejecuta la app dentro de un iframe, lo que causa este bloqueo. En la app publicada (`bebloo.lovable.app`) esto no deberia ocurrir, pero igualmente se puede mejorar.

### Solucion

Cambiar todos los enlaces externos para usar `window.open()` de forma explicita, lo cual fuerza al navegador a abrir una nueva ventana/pestana fuera del contexto del iframe.

### Archivos a modificar

**1. `src/pages/AppDashboard.tsx` (linea 116)**
- Ya usa `window.open()`, mantener como esta (no cambiar a `<a>` como se habia planificado antes)

**2. `src/components/plan/ContactSection.tsx` (lineas 111-125 y 128-134)**
- WhatsApp: cambiar el `<a href={whatsappUrl} target="_blank">` por un `<div>` con `onClick={() => window.open(whatsappUrl, "_blank")}`
- Calendly: cambiar el `<a href={CALENDLY_URL} target="_blank">` por un `<div>` con `onClick={() => window.open(CALENDLY_URL, "_blank")}`
- Mantener estilos y clases identicos, solo cambiar la etiqueta y el metodo de apertura

**3. `src/components/dashboard/PlanRecommenderDialog.tsx` (lineas 247-251 y 278-282)**
- Los botones de Calendly con `<a target="_blank">`: cambiar a `<Button onClick={() => window.open(url, "_blank")}>` sin `asChild`
- Aplicar lo mismo para ambos CTAs de Calendly en el resultado del quiz

### Nota importante

Este cambio mejora la experiencia en el preview de Lovable. En la version publicada, ambas soluciones (enlaces nativos y `window.open`) funcionan correctamente. La ventaja de `window.open` es que es mas robusto en contextos de iframe.
