
# Gestionar 4 productos y mostrar mínimo 3 meses antes de añadir

## Resumen

Dos mejoras:
1. **Pre-cargar 4 productos por defecto** en la selección para que siempre haya contenido visible y editable al entrar en `/mi-seleccion` sin cuestionario previo.
2. **Mostrar "mín. 3 meses"** en todas las tarjetas de producto **antes** de añadirlo (catálogo, tarjetas sugeridas) para que el compromiso mínimo quede claro.

---

## Cambios detallados

### 1. Pre-selección de 4 productos por defecto

**`src/hooks/useSelection.ts`**:
- Cuando no hay `initialProducts` del cuestionario NI datos guardados en localStorage, inicializar con 4 productos por defecto: `bugaboo-fox-3`, `stokke-sleepi-mini`, `babybjorn-bliss`, `ergobaby-omni` (uno por categoría principal: movilidad, descanso, hamaca, porteo).
- Estos se cargan con la duración por defecto (6 meses).
- El usuario puede quitarlos o cambiarlos como siempre.

### 2. Mostrar "mín. 3 meses" antes de añadir

**`src/components/catalog/CatalogProductCard.tsx`**:
- Añadir bajo el precio una línea de texto pequeña: "Alquiler mín. 3 meses" (texto en `text-[10px] text-muted-foreground`).

**`src/components/configurator/ProductCardSuggested.tsx`**:
- Añadir la misma indicación "Alquiler mín. 3 meses" junto al precio o debajo del botón "Añadir".

**`src/components/configurator/SelectionSidebar.tsx`**:
- Añadir una nota pequeña debajo del total: "Compromiso mínimo: 3 meses por producto".

---

## Archivos a modificar

1. `src/hooks/useSelection.ts` - Inicializar con 4 productos si no hay selección previa
2. `src/components/catalog/CatalogProductCard.tsx` - Texto "Alquiler mín. 3 meses"
3. `src/components/configurator/ProductCardSuggested.tsx` - Texto "Alquiler mín. 3 meses"
4. `src/components/configurator/SelectionSidebar.tsx` - Nota sobre compromiso mínimo
