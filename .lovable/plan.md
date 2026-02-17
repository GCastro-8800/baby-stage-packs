

# Fix: Precios de referencia estaticos en multiples componentes

## Problema

Cuando el pack esta incompleto, varios componentes muestran el precio de referencia estatico (`pack.price`: 79/169/199) como lo que costaria el "pack completo". Pero ahora el precio real del pack completo es dinamico (depende de las marcas elegidas + serviceFee). Esto hace que los mensajes de comparacion sean incorrectos.

Componentes afectados:
- **StickyPriceFooter**: "Con pack completo: euros X/mes" muestra precio estatico
- **DeselectionModal**: "Tu total pasaria de euros X/mes (pack completo)..." muestra precio estatico
- **LowProductWarning**: Calcula coste por producto usando precio estatico

## Solucion

Anadir una funcion `calculatePackCompletePrice` al hook `usePackSelections` que calcule el precio que tendria el pack si todos los productos estuvieran seleccionados (con las marcas/variantes actuales + serviceFee). Usar este valor en lugar de `pack.price` en los componentes.

### Cambios tecnicos

**1. `src/hooks/usePackSelections.ts`** -- Nueva funcion `calculatePackCompletePrice`

Calcular la suma de `precio_en_pack` de todos los productos (no solo los seleccionados) usando las variantes actuales, mas `serviceFee`. Esto da el precio real del pack completo con las marcas que el usuario ha elegido.

```text
const calculatePackCompletePrice = (pack) => {
  let total = 0;
  pack.stages.forEach(stage => {
    stage.products.forEach(cat => {
      const idx = variantChoices[cat.category] || 0;
      total += cat.options[idx].precio_en_pack;
    });
  });
  return total + pack.serviceFee;
};
```

Exportar esta funcion junto con las demas.

**2. `src/pages/PackStageProducts.tsx`** -- Usar precio dinamico

- Llamar a `calculatePackCompletePrice(pack)` para obtener el precio real del pack completo
- Pasar este valor como `packPrice` a StickyPriceFooter, DeselectionModal y LowProductWarning en lugar de `pack.price`

**3. `src/pages/PackDetail.tsx`** -- Sin cambios

La pagina de detalle del pack muestra "Desde X euros/mes" que es correcto como precio de marketing/referencia.

**4. `src/components/PricingSection.tsx`** -- Sin cambios

La seccion de precios en la landing muestra precios de marketing, lo cual es correcto.

## Resultado esperado

- Cuando el usuario deselecciona un producto, los mensajes de comparacion reflejan el precio real del pack completo segun las marcas elegidas
- Start: precio completo ~79 euros/mes
- Comfort: precio completo ~171 euros/mes (varia segun marcas)
- Total Peace: precio completo ~201 euros/mes (varia segun marcas + 30 euros servicio)
