

# Reorganizacion del flujo de Packs: Pack > Etapas > Productos

## Resumen del cambio

Actualmente `/packs` muestra productos organizados por etapa de edad (0-3m, 3-6m...). El nuevo flujo sera:

```text
/packs                          → Muestra los 3 packs (Start, Comfort, Total Peace) como tarjetas
/packs/:packId                  → Muestra las etapas de ese pack (Etapa 0, Etapa 1, Etapa 2)
/packs/:packId/etapa/:stageId   → Selector de productos con checkboxes + logica de precios
```

Con breadcrumbs visibles en todo momento: **Packs > Pack Comfort > Etapa 1**

## Logica de precios

- Todos los productos vienen **seleccionados por defecto** (checked)
- Pack completo = precio fijo del plan (59, 129 o 149 euros/mes) — el mejor precio
- Si deseleccionan algun producto, el precio cambia a **suma de precios individuales** de los productos seleccionados
- Se muestra un aviso claro:
  - "Pack completo 129 euros/mes" (cuando todo esta seleccionado)
  - "Productos sueltos XXX euros/mes — XX euros mas caro" (cuando faltan productos)
- Cada producto tendra un nuevo campo `precio_individual` en los datos

## Estructura de etapas por pack

Cada pack tendra 3 etapas que agrupan su equipamiento por momento de uso:

- **Etapa 0 — Preparacion (prenatal/recien nacido)**: Cuna, cambiador, monitor
- **Etapa 1 — Primeros meses (0-6m)**: Carrito, hamaca, portabebe
- **Etapa 2 — Crecimiento (6-12m)**: Trona, parque de juegos

Los productos de cada etapa dependen del pack (Start tiene menos, Total Peace tiene todo lo de Comfort + extras).

## Archivos a crear

| Archivo | Descripcion |
|---------|-------------|
| `src/data/packStages.ts` | Nuevo archivo que organiza los productos de cada plan en 3 etapas, con `precio_individual` por producto |
| `src/pages/PackDetail.tsx` | Pagina `/packs/:packId` — muestra las 3 etapas como tarjetas clickeables |
| `src/pages/PackStageProducts.tsx` | Pagina `/packs/:packId/etapa/:stageId` — selector de productos con logica de precios |
| `src/components/packs/PriceSummary.tsx` | Componente que muestra el resumen de precio (pack vs sueltos) |
| `src/components/packs/Breadcrumbs.tsx` | Componente de breadcrumbs reutilizable |

## Archivos a modificar

| Archivo | Cambio |
|---------|--------|
| `src/data/planEquipment.ts` | Agregar `precio_individual` al tipo `EquipmentOption` |
| `src/pages/Packs.tsx` | Reemplazar las tabs de etapas por tarjetas de los 3 packs (Start, Comfort, Total Peace) que enlazan a `/packs/:packId` |
| `src/App.tsx` | Agregar rutas `/packs/:packId` y `/packs/:packId/etapa/:stageId` |

## Seccion tecnica

### Datos: packStages.ts

Nuevo archivo que mapea cada plan a 3 etapas con los productos correspondientes. Cada producto incluye `precio_individual`:

```text
packStages = {
  "start": {
    stages: [
      { id: "etapa-0", name: "Preparacion", products: [...] },
      { id: "etapa-1", name: "Primeros meses", products: [...] },
      { id: "etapa-2", name: "Crecimiento", products: [...] }
    ]
  },
  "comfort": { ... },
  "total-peace": { ... }
}
```

### Tipo EquipmentOption actualizado

```text
EquipmentOption {
  brand, model, image?, description?,
  precio_individual?: number   // nuevo campo
}
```

### Logica de precios (PriceSummary.tsx)

- Recibe: `packPrice` (precio fijo del pack), `allProducts` (lista completa), `selectedProducts` (los seleccionados)
- Si todos seleccionados: muestra "Pack completo X euros/mes" con check verde
- Si faltan: suma `precio_individual` de cada seleccionado, muestra "Productos sueltos XX euros/mes" con warning y diferencia

### Pagina Packs.tsx (reformada)

En lugar de tabs con etapas, muestra 3 tarjetas con:
- Nombre del pack
- Precio
- Numero de productos incluidos
- Boton "Explorar pack" que lleva a `/packs/:packId`
- Se mantiene hero, trust banner, CTAs y FloatingCTA

### Pagina PackDetail.tsx (nueva)

- Header con breadcrumbs: Packs > Pack Comfort
- 3 tarjetas de etapa con nombre, descripcion breve, numero de productos
- Click en etapa navega a `/packs/:packId/etapa/:stageId`
- CTAs intercalados entre etapas

### Pagina PackStageProducts.tsx (nueva)

- Breadcrumbs: Packs > Pack Comfort > Etapa 1
- Reutiliza la logica del `EquipmentSection` existente (checkboxes, preview dialog, Eye icon)
- Todos los productos preseleccionados
- `PriceSummary` fijo abajo mostrando precio pack vs sueltos
- Boton "Continuar" que lleva al checkout o a la siguiente etapa

### Rutas en App.tsx

```text
/packs                          → Packs (reformada)
/packs/:packId                  → PackDetail (nueva)
/packs/:packId/etapa/:stageId   → PackStageProducts (nueva)
```

