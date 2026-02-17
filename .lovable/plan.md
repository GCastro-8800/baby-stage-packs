

# Fix: Precio identico entre packs Comfort y Total Peace

## Problema

Comfort y Total Peace comparten las mismas opciones base (comfortCunas, comfortCarritos, etc.) con los mismos valores de `precio_en_pack`. Cuando el usuario entra en cualquiera de los dos packs con las selecciones por defecto (indice 0), ambos calculan exactamente 171 euros/mes.

Start no tiene este problema (calcula ~79 euros/mes correctamente).

## Solucion

Anadir un **margen de servicio por tier** al modelo de datos de cada pack, que se suma al total de equipamiento. Esto refleja que Total Peace incluye servicios premium (gestor personal, cambios ilimitados, etc.) que justifican el precio superior.

### Cambios tecnicos

**1. `src/data/packStages.ts`** — Anadir campo `serviceFee` a `PackConfig`

```text
export interface PackConfig {
  id: string;
  name: string;
  price: number;       // Precio de referencia/marketing
  serviceFee: number;  // Cuota mensual de servicio del tier
  tagline: string;
  stages: PackStage[];
}
```

Valores:
- Start: serviceFee = 0 (el precio ya refleja el tier basico)
- Comfort: serviceFee = 0 (el precio de equipamiento ya cubre el servicio)
- Total Peace: serviceFee = 30 (refleja gestor personal, cambios ilimitados, prioridad)

Con esto, Total Peace con las selecciones por defecto daria: 171 + 30 = 201 euros/mes (cercano al precio de referencia de 199).

**2. `src/hooks/usePackSelections.ts`** — Sumar `serviceFee` al total

En `calculateTotalPrice`, despues de sumar los precios de equipamiento, anadir `pack.serviceFee`:

```text
return equipmentTotal + pack.serviceFee;
```

**3. `src/components/packs/StickyPriceFooter.tsx`** — Mostrar desglose del servicio

En el desglose colapsable, anadir una linea para la cuota de servicio si es mayor que 0:

```text
Servicios premium: 30.00 euros/mes
```

**4. `src/components/packs/PriceSummary.tsx`** — Sin cambios necesarios (ya usa el total calculado)

**5. `src/pages/PackStageProducts.tsx`** — Sin cambios necesarios (ya usa calculateTotalPrice)

## Resultado esperado

- Start: ~79 euros/mes (solo equipamiento)
- Comfort: ~171 euros/mes (equipamiento, serviceFee = 0)
- Total Peace: ~201 euros/mes (equipamiento 171 + servicio 30)

Cada pack tendra un precio total diferente incluso con las mismas marcas seleccionadas.
