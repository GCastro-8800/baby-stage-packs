
# Actualizar Pack BEBLOO Start — Nuevos productos y precios

## Resumen

Reemplazar los productos actuales del Pack Start (7 productos en 3 etapas) por los 4 productos reales con costes calculados, organizados en 2 etapas. El precio del pack sigue siendo 79 euros/mes.

## Cambios en datos

### Archivo: src/data/packStages.ts — Seccion "start"

Se reemplaza toda la seccion `stages` del pack Start por:

**Etapa 0 — Preparacion (3 productos, todos fijos):**

| Producto | coste_real_mes | precio_en_pack | precio_individual |
|----------|---------------|----------------|-------------------|
| Chicco Next2Me (Cuna colecho) | 22.58 | 31.58 | 71.46 |
| Cambiador portatil | 11.04 | 16.38 | 44.27 |
| Monitor bebe solo audio | 8.75 | 15.51 | 42.70 |

**Etapa 1 — Primeros meses (1 producto, fijo):**

| Producto | coste_real_mes | precio_en_pack | precio_individual |
|----------|---------------|----------------|-------------------|
| Chicco Lite Way (Carrito) | 11.17 | 15.63 | 42.92 |

**Verificacion:**
- Suma costes: 22.58 + 11.04 + 8.75 + 11.17 = 53.54
- Suma precio_en_pack: 31.58 + 16.38 + 15.51 + 15.63 = 79.10 (nota: hay 10 centimos de diferencia con 79 por redondeo de los valores proporcionados; se usaran los valores exactos del usuario)
- Se elimina Etapa 2 completamente
- Se eliminan productos antiguos: Joolz Aer 2, YOYO3, Hamaca Fisher Price, Boba Wrap, Trona Chicco

### Detalles de cada producto

**Chicco Next2Me:**
- Etapa: 0
- Tipo: fixed
- Descripcion: "Cuna de colecho segura y practica. Se acopla a la cama de los padres."

**Cambiador portatil:**
- Etapa: 0
- Tipo: fixed
- Brand: "Bebloo" (se mantiene)
- Descripcion: "Cambiador portatil funcional y ligero. Acompana todo el ciclo."

**Monitor de bebe solo audio:**
- Etapa: 0
- Tipo: fixed
- Brand: "Bebloo" / generico
- Descripcion: "Monitor de audio para vigilar al bebe. Acompana todo el ciclo."

**Chicco Lite Way:**
- Etapa: 1
- Tipo: fixed (ya no es choice, no hay alternativas)
- Descripcion: "Carrito ligero y compacto, ideal para ciudad."

## Impacto en otros componentes

No se requieren cambios en la logica de PackStageProducts.tsx, DeselectionModal, ni StickyPriceFooter — estos componentes ya soportan:
- Etapas con solo productos fijos
- Deseleccion con minimo 1 producto
- Calculo de precios individuales vs pack

El unico cambio es eliminar la referencia a etapa-2 en la navegacion del pack Start (que se resuelve automaticamente ya que el boton "Continuar" busca la siguiente etapa en el array).

## Seccion tecnica

### Archivo a modificar

| Archivo | Cambio |
|---------|--------|
| `src/data/packStages.ts` | Reemplazar lineas 25-94 (stages del pack start) con 2 etapas y 4 productos |

### Estructura resultante

```text
start.stages = [
  etapa-0: Cuna (fixed), Cambiador (fixed), Monitor (fixed)
  etapa-1: Carrito (fixed)
]
```

Todos los productos son tipo "fixed" (sin opciones choice). El carrito ya no tiene variantes alternativas.
