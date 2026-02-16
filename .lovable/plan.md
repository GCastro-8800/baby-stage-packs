

# Sistema de Precios por Producto con precio_en_pack

## Resumen

Cada producto mostrara su precio proporcional dentro del pack (precio_en_pack), su precio individual, y el ahorro. Los precios en pack de todos los productos de un pack suman exactamente el precio del pack.

## Cambios en datos

### 1. planEquipment.ts — Nuevo campo precio_en_pack

Agregar `precio_en_pack` al tipo `EquipmentOption`:

```text
export interface EquipmentOption {
  brand: string;
  model: string;
  image?: string;
  description?: string;
  precio_individual?: number;
  coste_real_mes?: number;
  precio_en_pack?: number;  // NUEVO
}
```

### 2. packStages.ts — Agregar precio_en_pack a cada producto

Agregar el campo `precio_en_pack` precalculado a cada producto en cada pack. Los valores exactos (del usuario):

**Pack Start (79 euros, costes totales 52.13)**
- Chicco Next2Me: precio_en_pack 24.10
- Cambiador portatil: precio_en_pack 10.58
- Chicco Lite Way: precio_en_pack 13.35
- Joolz Aer 2: precio_en_pack 28.02 (calculado: 79 x 18.50/52.13)
- YOYO3: precio_en_pack 25.43 (calculado: 79 x 16.79/52.13)
- Hamaca Fisher Price: precio_en_pack 14.62
- Boba Wrap: precio_en_pack 14.02 (calculado: 79 x 9.25/52.13)
- Trona Chicco: precio_en_pack 16.35

**Pack Comfort (169 euros, costes totales 126.81)**
- Stokke Sleepi Mini: precio_en_pack 43.56
- Leander Matty: precio_en_pack 14.88
- Bugaboo Fox 5: precio_en_pack 37.68
- Bugaboo Dragonfly: precio_en_pack 35.31 (calculado: 169 x 26.50/126.81)
- BabyBjorn Bliss: precio_en_pack 17.56
- Bugaboo Giraffe hamaca: precio_en_pack 18.96 (calculado)
- Ergobaby Omni: precio_en_pack 15.21 (calculado: 169 x 11.44/126.81, redondeado a 15.25 segun tabla)
- Boba Wrap: precio_en_pack 12.33
- Stokke Tripp Trapp: precio_en_pack 21.97 (calculado: 169 x 16.44/126.81, redondeado a 21.91)
- Bugaboo Giraffe trona: precio_en_pack 18.96 (calculado)
- Alfombra Toddlekind: precio_en_pack 18.24 (calculado: 169 x 13.67/126.81, redondeado a 18.21)
- Totter & Tumble: precio_en_pack 16.65 (calculado)

**Pack Total Peace (199 euros, costes totales 166.31)**
- Stokke Sleepi Mini: precio_en_pack 39.11 (calculado: 199 x 32.67/166.31, ajustado a tabla: 39.09)
- Leander Matty: precio_en_pack 13.36
- Monitor Angelcare: precio_en_pack 17.93 (calculado: 199 x 15/166.31, redondeado a 17.95)
- Bugaboo Donkey 5: precio_en_pack 35.84 (calculado: 199 x 30/166.31, redondeado a 35.90)
- Bugaboo Dragonfly: precio_en_pack 31.70 (calculado)
- Nuna LEAF Grow: precio_en_pack 30.72 (calculado: 199 x 25.67/166.31, redondeado a 30.71)
- BabyBjorn One Air: precio_en_pack 13.72 (calculado: 199 x 11.44/166.31, redondeado a 13.69)
- Stokke Tripp Trapp: precio_en_pack 19.69 (calculado: 199 x 16.44/166.31, redondeado a 19.67)
- Alfombra Toddlekind: precio_en_pack 16.35 (calculado: 199 x 13.67/166.31, redondeado a 16.36)

Nota: Los valores se usaran directamente de la tabla del usuario. Para variantes alternativas dentro de una categoria choice, se calcula usando la misma formula con el coste de esa variante.

### 3. plansEquipment.ts — Mismo cambio

Agregar precio_en_pack a los productos en este archivo tambien para mantener consistencia.

## Cambios en la UI

### 4. PackStageProducts.tsx — Mostrar precios por producto

**Productos fijos (con checkbox):**

Cuando pack completo y seleccionado:
```text
Bugaboo Fox 5
[x] Incluir
En pack: €37.68/mes (check verde)
Sin pack: €85.62/mes
Ahorro: €47.94/mes
```

Cuando NO pack completo y seleccionado:
```text
Bugaboo Fox 5
[x] Incluir
Precio: €85.62/mes (naranja con warning)
Con pack: €37.68/mes
Pagas €47.94 mas sin pack
```

Cuando NO pack completo y NO seleccionado:
```text
Leander Matty
[ ] Incluir
Si lo anades: €42.92/mes
Con pack completo: €14.88/mes
```

**Productos elegibles (radio buttons):**

Cuando pack completo:
```text
Bugaboo Fox 5 (seleccionado)
En pack: €37.68/mes (check verde)
Sin pack: €85.62/mes
Ahorro: €47.94/mes
```

Cuando NO pack completo:
```text
Bugaboo Fox 5 (seleccionado)
Precio: €85.62/mes (naranja)
Con pack: €37.68/mes
Pagas €47.94 mas sin pack
```

### 5. DeselectionModal.tsx — Mostrar precio_en_pack

Actualizar el modal para usar precio_en_pack del producto en lugar de solo el total:

```text
Quieres quitar [Producto]?

En pack completo: €[precio_en_pack]/mes por este producto (check verde)
Sin pack: €[precio_individual]/mes (warning)
Pagarias €[diferencia] mas por este producto

[Mantener pack completo] [Quitar producto]
```

Tambien mantener los totales del pack vs individual.

### 6. StickyPriceFooter.tsx — Desglose con precios por producto

Actualizar el desglose expandible para mostrar precio_en_pack o precio_individual segun estado:

Pack completo:
```text
Bugaboo Fox 5:    €37.68/mes (incluido)
Stokke Sleepi:    €43.56/mes (incluido)
...
Total: €169/mes
```

Productos individuales:
```text
Bugaboo Fox 5:    €85.62/mes (individual)
Stokke Sleepi:    €96.68/mes (individual)
...
Total: €238/mes
```

Tambien actualizar el texto del footer cuando hay productos sueltos para mostrar cuantos productos y la comparacion:

```text
3 productos: €238/mes
Con pack completo: €169/mes por 7 productos
```

### 7. LowProductWarning.tsx — Ya funciona

Este componente ya muestra coste por producto, no necesita cambios.

## Seccion tecnica

### Archivos a modificar

| Archivo | Cambio |
|---------|--------|
| `src/data/planEquipment.ts` | Agregar `precio_en_pack?: number` al tipo, agregar valores a cada producto |
| `src/data/packStages.ts` | Agregar `precio_en_pack` a cada producto en cada pack |
| `src/pages/PackStageProducts.tsx` | Actualizar las tarjetas de productos fijos y elegibles para mostrar precio_en_pack, precio_individual y ahorro con 3 estados visuales |
| `src/components/packs/DeselectionModal.tsx` | Agregar precio_en_pack del producto y mostrar comparativa por producto |
| `src/components/packs/StickyPriceFooter.tsx` | Actualizar desglose para mostrar precio_en_pack o precio_individual, agregar contador de productos |

### Calculo del precio_en_pack

La formula es: `precio_en_pack = pack_price * (coste_real_mes / suma_costes_pack)`

Donde suma_costes_pack es la suma de todos los coste_real_mes de los productos del pack (usando la primera opcion de cada categoria choice para el calculo base).

Los valores se precalculan y hardcodean en el archivo de datos para evitar errores de redondeo. La suma de todos los precio_en_pack de un pack debe ser exactamente el precio del pack.

### Props adicionales necesarios

DeselectionModal necesitara recibir `precioEnPack` del producto ademas de los totales actuales.

StickyPriceFooter necesitara recibir `precio_en_pack` por producto en el breakdown.

### Flujo de datos

```text
packStages.ts (datos con precio_en_pack)
  -> PackStageProducts.tsx (lee datos, calcula estado)
    -> Tarjetas de producto (muestran 3 lineas de precio)
    -> DeselectionModal (muestra precio por producto)
    -> StickyPriceFooter (desglose con precios por producto)
```
