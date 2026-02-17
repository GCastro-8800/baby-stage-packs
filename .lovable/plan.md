

# Precios diferenciados por marca en los tres packs + Total Peace como superconjunto de Comfort

## Resumen

Dos cambios principales:
1. **Precios diferenciados**: En los tres packs (Start, Comfort, Total Peace), cada marca tendra su propio `precio_en_pack` y `precio_individual`. El total mensual variara segun las marcas que elija el usuario.
2. **Total Peace = superconjunto**: Total Peace incluira todas las opciones de marca que tiene Comfort, mas sus opciones premium propias (cuando las haya).

## Cambios tecnicos

### 1. `src/data/packStages.ts` - Datos de precios y opciones

**Comfort**: Cambiar los precios iguales por precios diferenciados. Se usaran como referencia los precios que ya existen en `planEquipment.ts` (que ya tiene precios diferenciados por marca), adaptados a la estructura por etapas:

- Cuna: Chicco Next2Me, Stokke Sleepi V3, Artesanal Moises -- cada uno con su precio propio
- Carrito: Bugaboo Fox 5, Donkey 5, Dragonfly, Joolz Aer 2, Babyzen YOYO 3 -- precios distintos
- Hamaca: BabyBjorn Bliss, Balance Soft, Bugaboo Giraffe, Nuna LEAF -- precios distintos
- Etc.

**Total Peace**: Convertir categorias de "fixed" a "choice" e incluir todas las opciones de Comfort mas las propias premium:

- Cuna: las 3 de Comfort + Stokke Sleepi Mini (premium propia)
- Cambiador: los 3 de Comfort + Leander Matty (premium propia)
- Monitor: Monitor con camara de Comfort + Angelcare premium
- Carrito: los 5 de Comfort + Bugaboo Donkey 5 con precio premium propio
- Hamaca: las 4 de Comfort + Nuna LEAF Grow con precio premium
- Porteo: las 4 de Comfort + BabyBjorn One Air premium
- Trona: las 2 de Comfort + Stokke Tripp Trapp premium
- Alfombra: las 3 de Comfort + Toddlekind premium

**Start**: Mantener como esta (productos fijos con una sola opcion por categoria, asi que "diferenciado" no aplica porque no hay alternativas).

### 2. `src/hooks/usePackSelections.ts` - Calculo de precio total

Modificar `calculateTotalPrice`: en vez de devolver `pack.price` cuando todo esta seleccionado, siempre calcular la suma de `precio_en_pack` de los productos seleccionados (segun la variante elegida). El campo `pack.price` pasa a ser un precio de referencia/marketing, no el precio real calculado.

```text
Antes:  if (complete) return pack.price;   // siempre 169
Ahora:  siempre sumar precio_en_pack       // varia segun marcas
```

### 3. `src/components/packs/PriceSummary.tsx` y `StickyPriceFooter.tsx`

Adaptar la logica visual: cuando todos los productos estan seleccionados, mostrar el precio calculado (suma de precio_en_pack) en vez del precio fijo del pack. El indicador de "pack completo" sigue apareciendo pero con el precio real segun las marcas elegidas.

### 4. `src/data/planEquipment.ts`

Sincronizar los datos de Total Peace para que tambien incluya las opciones de Comfort, manteniendo coherencia con packStages.ts.

## Nota sobre precios

Para los productos de Comfort que actualmente tienen precio identico (ej. todos los carritos a 29.49), se asignaran precios diferenciados tomando como referencia los valores de `planEquipment.ts`. Si algun producto no tiene referencia alli, se estimara proporcionalmente.

