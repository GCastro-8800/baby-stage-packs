

## Aplicar precios oficiales del Excel a los 7 productos nuevos + guardar como regla

### 1. Actualizar precios en `src/data/productCatalog.ts`

Reemplazar el objeto `prices` y el `pricePerMonth` (= precio a 1 mes) de los 7 productos nuevos según el Excel oficial:

| ID | Nuevos `prices` { 1, 3, 6, 12, 24 } | `pricePerMonth` |
|---|---|---|
| `bugaboo-donkey-5-duo` | `{ 1: 75, 3: 71, 6: 64, 12: 51, 24: 36 }` | 75 |
| `bugaboo-donkey-5-gemelar` | `{ 1: 65, 3: 62, 6: 56, 12: 44, 24: 31 }` | 65 |
| `chicco-next2me` | `{ 1: 46, 3: 44, 6: 39, 12: 31, 24: 22 }` | 46 |
| `babybjorn-hamaca` | `{ 1: 47, 3: 45, 6: 40, 12: 32, 24: 23 }` | 47 |
| `banwood-sin-pedales` | `{ 1: 48, 3: 46, 6: 41, 12: 33, 24: 23 }` | 48 |
| `banwood-triciclo` | `{ 1: 49, 3: 47, 6: 42, 12: 34, 24: 23 }` | 49 |
| `banwood-bicicleta-pedales` | `{ 1: 50, 3: 48, 6: 43, 12: 34, 24: 24 }` | 50 |

⚠️ Nota interesante: el Excel marca el "Donkey Gemelar" más barato que el "Donkey Duo", al revés de lo que asumí. Aplico tal cual el Excel.

### 2. Guardar como regla persistente en memoria

Crear `mem://logic/official-pricing` con el contenido:
> Los precios de productos individuales (matriz 1/3/6/12/24 meses) son los del archivo `Bebloo_Pricing_Individual-2.xlsx`. **Nunca inferir precios**: si se añade un producto nuevo y no aparece en el Excel oficial, preguntar al usuario en lugar de calcularlos.

Y añadir una línea en `mem://index.md` (sección **Core**, porque aplica a cualquier cambio futuro de catálogo):
> Precios de catálogo: usar SIEMPRE los del Excel oficial (Bebloo_Pricing_Individual-2.xlsx). Nunca inferirlos.

Y referencia en la sección **Memories**:
> - [Official pricing source](mem://logic/official-pricing) — Excel oficial como única fuente de verdad para precios individuales

### 3. Lo que NO se toca

- Resto de productos del catálogo (sus precios ya coinciden con el Excel — verificado).
- Imágenes, descripciones, specs, categorías ni stages.
- Lógica de descuentos en `src/lib/constants.ts` (sigue siendo informativa; el catálogo usa `prices[months]` directamente).

### Verificación post-cambio

- `/catalogo` → tarjetas de los 7 productos nuevos muestran los nuevos "desde X €/mes" (precio a 12 meses).
- Selector de duración en cada uno → al cambiar de 1 a 24 meses, el precio sigue la matriz oficial.

