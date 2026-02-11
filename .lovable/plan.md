

## Corregir enlaces externos bloqueados en el iframe de preview

### Problema

El error `ERR_BLOCKED_BY_RESPONSE` ocurre porque la vista previa de Lovable se ejecuta dentro de un iframe, y tanto `<a target="_blank">` como `window.open()` son bloqueados por las politicas de seguridad del navegador en ese contexto.

### Solucion

Crear una funcion helper reutilizable que abra enlaces externos de forma fiable, usando la tecnica de crear un elemento `<a>` temporal, asignarle el href, y disparar un click programatico. Esta tecnica sortea las restricciones de iframe en la mayoria de navegadores.

### Cambios

**1. Crear `src/lib/openExternal.ts` (nuevo archivo)**

```typescript
export function openExternal(url: string) {
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
```

**2. `src/components/plan/ContactSection.tsx`**
- Importar `openExternal`
- Reemplazar `window.open(whatsappUrl, "_blank")` por `openExternal(whatsappUrl)`
- Reemplazar `window.open(CALENDLY_URL, "_blank")` por `openExternal(CALENDLY_URL)`

**3. `src/components/dashboard/PlanRecommenderDialog.tsx`**
- Importar `openExternal`
- Reemplazar los dos `window.open(buildCalendlyUrl(...), "_blank")` por `openExternal(buildCalendlyUrl(...))`

**4. `src/pages/AppDashboard.tsx`**
- Importar `openExternal`
- Reemplazar `window.open(...)` en el boton de soporte WhatsApp por `openExternal(...)`

### URL de WhatsApp

Todas las URLs ya usan el formato correcto: `https://wa.me/34638706467`. No hay error en la URL.

### Nota

En la version publicada (`bebloo.lovable.app`) no hay iframe, por lo que estos enlaces funcionarian con cualquier metodo. Este cambio asegura que funcionen tambien en el preview de desarrollo.
