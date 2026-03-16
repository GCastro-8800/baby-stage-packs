

## Plan: Fichas de producto con especificaciones técnicas detalladas

### Problema
Actualmente no existe ningún lugar donde ver las especificaciones detalladas de un producto (peso, dimensiones, materiales, edad recomendada, certificaciones). La descripción en la tarjeta es un texto breve de 1-2 frases.

### Solución: Dialog de detalle por producto
Al hacer clic en la tarjeta de producto (o en un botón "Ver detalle"), se abre un Dialog con toda la información del producto: imagen grande, descripción, y una tabla de especificaciones técnicas.

Un hover card no funcionaría bien en móvil (no hay hover). Un Dialog es consistente con el patrón que ya se usa en la app (`ProductPreviewDialog` en packs) y funciona en todos los dispositivos.

### Cambios

**1. `src/data/productCatalog.ts`** -- Añadir campo `specs` al tipo `Product`

```typescript
export interface Product {
  // ... campos existentes
  specs?: Record<string, string>; // ej: { "Peso": "9.9 kg", "Materiales": "Aluminio, tejido repelente" }
}
```

Añadir datos de specs a cada uno de los 17 productos con los datos del Excel (peso, dimensiones, materiales, edad recomendada, certificaciones cuando aplique).

**2. `src/components/catalog/ProductDetailDialog.tsx`** -- Nuevo componente

Dialog que muestra:
- Imagen del producto (grande, arriba)
- Nombre, marca (badge), precio desde X€/mes
- Descripción completa
- Tabla de especificaciones (filas clave-valor con fondo alternado)
- shortReason como badge
- Botón "Añadir a mi selección" o "En tu selección"

**3. `src/components/catalog/CatalogProductCard.tsx`** -- Integrar el dialog

- La tarjeta completa es clicable para abrir el dialog de detalle
- El botón "Añadir" sigue funcionando con `stopPropagation` para no abrir el dialog al añadir

### Especificaciones por producto (datos del Excel)

| Producto | Peso | Dimensiones / Datos clave | Materiales | Edad |
|---|---|---|---|---|
| Bugaboo Fox 3 | 9.9 kg | Cesta 30 L | Aluminio, tejido repelente | 0-36 m |
| Bugaboo Donkey 3 | 12.5 kg | Doble cesta 30 L | Aluminio | 0-36 m |
| Bugaboo Dragonfly | 7.9 kg | Plegado una pieza | Bio-based, -21% CO₂ | 0-36 m |
| Joolz Aer 2 | 6.5 kg | Cabe en cabina | Aluminio aeroespacial, REPREVE | 0-36 m |
| Babyzen YOYO3 | 6.2 kg | Respaldo 47 cm | Aluminio | 0-36 m |
| Stokke Sleepi Mini | -- | 67 cm ancho | Madera haya FSC | 0-6 m |
| Moisés mimbre | 2.5 kg | -- | Mimbre natural, algodón GOTS | 0-4 m |
| Stokke Tripp Trapp | -- | Hasta 136 kg | Madera haya FSC | 6 m+ |
| Bugaboo Giraffe | -- | 4 alturas, plegable | -- | 6 m+ |
| BabyBjörn Bliss | 2.1 kg | Plegado 11 cm | -- | 0-24 m |
| Bugaboo Giraffe Hamaca | -- | 5 posiciones | -- | 0-6 m |
| Nuna LEAF Grow | -- | Hasta 60 kg | -- | 0-36 m |
| BabyBjörn Balance Soft | 2.1 kg | -- | Jersey algodón 100% | 0-24 m |
| BabyBjörn Harmony | 2.2 kg | -- | Malla 3D, cuero vegano | 0-24 m |
| Ergobaby Omni | 0.79 kg | 4 posiciones | SoftFlex, UPF 50+ | 0-48 m |
| Boba Wrap | 0.54 kg | Talla única | Algodón peinado 95%, spandex | 0-18 m |
| Cambiador mimbre | 1.8 kg | -- | Mimbre, colchoneta impermeable | 0-12 m |

### Archivos
| Archivo | Acción |
|---|---|
| `src/data/productCatalog.ts` | Añadir `specs` a tipo e instancias |
| `src/components/catalog/ProductDetailDialog.tsx` | Crear |
| `src/components/catalog/CatalogProductCard.tsx` | Hacer tarjeta clicable, abrir dialog |

