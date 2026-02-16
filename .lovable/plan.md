

# Flujo desde Precios: Pricing → Pack → Etapas → Productos

## Que cambia

Actualmente el flujo tiene dos entradas separadas: la seccion de precios en la landing (que lleva a `/plan/:planId`) y la pagina `/packs` (que lleva a `/packs/:packId`). El usuario se confunde con dos caminos distintos.

El nuevo flujo unificado es:

```text
Landing → Seccion Precios (3 tarjetas) 
  → Click "Seleccionar Start" → /packs/start (ve las 3 etapas)
    → Click "Etapa 1" → /packs/start/etapa/etapa-1 (selector de productos + precios)
```

La pagina `/packs` (listado de los 3 packs) ya NO es necesaria porque ese rol lo cumple la seccion de precios en la landing.

## Cambios concretos

### 1. PricingSection.tsx — Cambiar destino de los botones

Actualmente los botones "Seleccionar X" navegan a `/plan/:planId`. Hay que cambiarlos para que naveguen a `/packs/:planId` (la pagina de etapas que ya existe).

### 2. Header.tsx — Quitar enlace "Packs" del menu

El enlace "Packs" en la navegacion ya no tiene sentido porque el punto de entrada es la seccion de precios. Se elimina del menu.

### 3. App.tsx — Eliminar ruta /packs y limpiar la ruta /plan/:planId

- La ruta `/packs` (listado) se puede eliminar o redirigir a `/#precios`
- La ruta `/plan/:planId` se puede redirigir a `/packs/:planId` para no romper links existentes
- Las rutas `/packs/:packId` y `/packs/:packId/etapa/:stageId` se mantienen tal cual

### 4. PackDetail.tsx — Ajustar el boton "Volver"

El boton de volver actualmente lleva a `/packs`. Hay que cambiarlo para que vuelva a `/#precios` (la seccion de precios en la landing).

### 5. PackStageProducts.tsx — Ajustar navegacion

El boton "Volver a etapas" ya apunta a `/packs/:packId` que es correcto. El boton final "Ver planes" deberia llevar al checkout o a contacto, no de vuelta a precios.

### 6. PackBreadcrumbs.tsx — Actualizar primer nivel

Actualmente el primer breadcrumb es "Packs" y enlaza a `/packs`. Hay que cambiarlo a "Precios" y que enlace a `/#precios`.

## Seccion tecnica

### PricingSection.tsx
```text
// Cambiar:
navigate(`/plan/${plan.id}`)
// Por:
navigate(`/packs/${plan.id}`)
```

### Header.tsx
```text
// Eliminar de navLinks:
{ label: "Packs", href: "/packs", isRoute: true }
```

### App.tsx
```text
// Eliminar:
<Route path="/packs" element={<Packs />} />

// Agregar redirect para /plan/:planId:
<Route path="/plan/:planId" element={<Navigate to ... />} />

// Mantener:
<Route path="/packs/:packId" element={<PackDetail />} />
<Route path="/packs/:packId/etapa/:stageId" element={<PackStageProducts />} />
```

### PackDetail.tsx
- Boton volver → `navigate("/#precios")` en lugar de `/packs`
- CTA inferior se mantiene igual

### PackBreadcrumbs.tsx
- Primer nivel: "Planes" → enlace a `/#precios`

### Archivos que ya NO se necesitan
- `src/pages/Packs.tsx` — se puede eliminar (su funcion la cumple la seccion de precios)

| Archivo | Accion |
|---------|--------|
| `src/components/PricingSection.tsx` | Cambiar navigate a `/packs/:id` |
| `src/components/Header.tsx` | Quitar enlace "Packs" |
| `src/App.tsx` | Eliminar ruta `/packs`, redirect `/plan/:id` |
| `src/pages/PackDetail.tsx` | Boton volver a `/#precios` |
| `src/components/packs/PackBreadcrumbs.tsx` | Primer nivel "Planes" → `/#precios` |
| `src/pages/Packs.tsx` | Eliminar archivo |
