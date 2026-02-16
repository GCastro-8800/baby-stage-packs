
# Permitir deseleccionar cualquier producto (minimo 1 total)

## Problema

Actualmente, en etapas donde solo hay productos fijos (sin variantes/choice), no se puede deseleccionar el ultimo producto fijo. Pero en etapas donde hay variantes, la restriccion es demasiado estricta: bloquea la deseleccion del ultimo producto fijo aunque las variantes (choice) siempre cuentan como 1 producto seleccionado.

## Solucion

Cambiar la condicion de guardia en `handleFixedToggle` para que solo bloquee si el total de productos seleccionados (fijos + variantes) quedaria en 0.

### Archivo: src/pages/PackStageProducts.tsx

**Cambio en la logica de deseleccion (linea 111)**:

La condicion actual:
```text
if (selectedFixed.size === 1 && choiceCategories.length === 0)
```

Se cambiara a:
```text
const totalAfterRemoval = (selectedFixed.size - 1) + choiceCategories.length;
if (totalAfterRemoval < 1)
```

Esto permite:
- Deseleccionar cualquier producto fijo si hay al menos una categoria de variante (choice) activa
- Deseleccionar cualquier producto fijo si quedan otros productos fijos seleccionados
- Solo bloquear cuando quedarian 0 productos en total (ultimo fijo sin variantes)
