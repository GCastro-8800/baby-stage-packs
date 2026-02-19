

# Explicaciones de precio + Guia de funcionamiento de packs

## Como funciona la logica de precios actualmente

El sistema tiene **dos modos de precio** segun si el pack esta completo o no:

- **Pack completo** (todos los productos seleccionados): cada producto usa su `precio_en_pack` (precio con descuento por suscripcion). Este es el precio mas bajo.
- **Pack incompleto** (el usuario quita algun producto): cada producto restante pasa a usar `precio_individual`, que es **3x** el precio en pack. Esto significa que quitar un producto no solo no reduce el total, sino que puede **aumentarlo** considerablemente.

Esta logica existe en `usePackSelections.ts` linea 110: si `isPackComplete` es true usa `precio_en_pack`, si no usa `precio_individual`.

**Ejemplo con Comfort:**
- Pack completo con opciones por defecto: ~169 euros/mes (precio en pack de cada producto sumado)
- Si quitas 1 producto: los 7 restantes pasan a precio individual (3x), y el total sube a ~400+ euros/mes

La cuota de servicio (`serviceFee`) se suma siempre al final (solo Total Peace tiene 30 euros/mes; los demas tienen 0).

## Que falta: el usuario no entiende por que cambia el precio

Actualmente no hay ninguna explicacion visible de:
1. Por que el precio sube al quitar un producto
2. Que es un "pack" vs productos sueltos
3. Como funcionan las etapas
4. Que pasa con el equipamiento cuando el bebe crece

## Cambios propuestos

### 1. Banner explicativo en la pagina de configuracion

Anadir un bloque informativo justo debajo del titulo del pack en `PackDetail.tsx` con:
- Explicacion corta de como funciona: "Tu pack incluye todo el equipamiento que necesitas. Te lo entregamos por etapas segun crece tu bebe."
- Nota sobre precios: "Todos los productos incluidos tienen precio de pack. Si quitas algun producto, los restantes pasan a precio individual."

### 2. Feedback dinamico en el footer al deseleccionar

Modificar el footer sticky para que cuando el pack NO este completo:
- Muestre un aviso claro: "Precio individual aplicado — anade todos los productos para obtener el precio de pack"
- Muestre la comparativa: precio actual vs precio del pack completo
- Use color naranja para el estado incompleto y verde para el completo

### 3. Tooltip/ayuda en cada producto sobre su precio

Anadir junto al precio de cada producto un icono de info con tooltip que explique:
- "Este es tu precio de pack. Si quitas productos, el precio individual seria de X euros/mes"

### 4. Seccion "Como funciona" colapsable

Un accordion al inicio de la pagina que explique:
- Que es un pack Bebloo (suscripcion mensual, todo incluido)
- Como funcionan las etapas (entrega progresiva segun la edad del bebe)
- Que significa el precio de pack vs individual
- Que pasa si quiero cambiar algo despues

## Detalles tecnicos

### `src/pages/PackDetail.tsx`

**Bloque explicativo** (nuevo, despues del titulo):
- Card con icono de `Info` y texto explicativo sobre el pack
- Texto breve: como funciona + nota sobre precios
- Collapsible con mas detalle ("Como funciona Bebloo")

**Footer sticky** (modificar la seccion existente lineas 161-177):
- Detectar si el pack esta completo usando `isPackComplete` del hook
- Si incompleto: mostrar precio actual en naranja + texto "Pack completo desde X euros/mes"
- Si completo: mostrar precio en verde con checkmark "Pack completo"

**Productos** (modificar `FixedProductRow` y el radio group):
- Anadir un `Tooltip` de Radix junto al precio que muestre el precio individual como referencia
- Formato: "Precio pack: X euros | Individual: Y euros"

### `src/hooks/usePackSelections.ts`

- Exportar `isPackComplete` como parte del return (ya existe, solo verificar que se usa en PackDetail)
- Anadir `calculatePackCompletePrice`: calcula el total si todos los productos estuvieran seleccionados (para mostrar la comparativa en el footer)

### Archivos modificados

1. **`src/pages/PackDetail.tsx`** — Bloque explicativo, footer mejorado, tooltips en precios
2. **`src/hooks/usePackSelections.ts`** — Verificar que `isPackComplete` y `calculatePackCompletePrice` estan disponibles
3. **`src/components/packs/StickyPriceFooter.tsx`** — No se usa directamente en el nuevo flujo, pero se puede reutilizar la logica de comparativa

### Sin cambios en

- Estructura de datos (`packStages.ts`, `planEquipment.ts`)
- Logica de precios core (el mecanismo pack vs individual se mantiene)
- Rutas ni navegacion
- Tutorial de bienvenida (ya implementado)

