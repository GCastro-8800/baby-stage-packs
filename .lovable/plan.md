

# Corregir precio €0 y navegacion del boton Continuar

## Problema 1: Precio muestra €0/mes

En etapas con un solo producto fijo y sin variantes (como Start etapa-2 con solo la Trona), al deseleccionar ese producto el precio cae a €0 porque no queda ningun producto sumando precio. El sistema deberia impedir esta deseleccion ya que es el ultimo producto, pero la validacion actual solo comprueba `selectedFixed.size === 1 && choiceCategories.length === 0`. El problema real es que ese check funciona, pero el precio de €0 se muestra momentaneamente o hay un caso donde la logica no lo atrapa correctamente.

Al revisar el codigo, la validacion en linea 70 SI deberia prevenir esto. Sin embargo, el screenshot muestra el producto deseleccionado con €0. Esto indica que el checkbox puede estar llegando al estado deseleccionado de alguna forma. La raiz es que el `isPackComplete` depende de `fixedKeys`, y cuando solo hay 1 fixed key y se deselecciona, el calculo individual da 0 porque no hay nada seleccionado.

**Solucion**: Reforzar la logica para que `currentPrice` nunca sea 0. Ademas, cuando solo hay productos fijos (sin choice), al deseleccionar el unico producto se debe mantener seleccionado y mostrar toast de error.

## Problema 2: Continuar lleva a pagina principal

En `handleContinue` (linea 144-146), cuando no hay `nextStage` (ultima etapa), el codigo navega a `/#precios`. Deberia navegar a `/plan/${pack.id}` para mostrar la pagina con las opciones de contacto (Calendly, WhatsApp).

**Solucion**: Cambiar `navigate("/#precios")` por `navigate(\`/plan/${pack.id}\`)`.

## Seccion tecnica

### Archivo: src/pages/PackStageProducts.tsx

**Cambio 1** — Linea 145: Cambiar destino de navegacion
```text
// Antes:
navigate("/#precios");

// Despues:
navigate(`/plan/${pack.id}`);
```

**Cambio 2** — Asegurar que el precio nunca sea 0 cuando hay productos disponibles. Despues del calculo de `currentPrice` (linea 65), agregar una proteccion:
```text
// Si el precio calculado es 0 pero hay productos en la etapa,
// usar el precio individual del primer producto disponible como minimo
const currentPrice = isPackComplete 
  ? pack.price 
  : Math.max(calculateIndividualTotal(), 0);
```

Y verificar que la guardia en `handleFixedToggle` (linea 70) cubra correctamente el caso donde el unico producto restante se intenta desmarcar. El check actual `selectedFixed.size === 1 && choiceCategories.length === 0` es correcto, pero debemos asegurarnos de que el estado del checkbox refleje esto correctamente al inicializar.

**Cambio 3** — El estado `selectedFixed` se inicializa con `useState(() => new Set(fixedKeys))`, pero `fixedKeys` depende de `stage` que puede cambiar al navegar entre etapas. El `useState` solo se ejecuta una vez, asi que si el usuario navega de etapa-1 a etapa-2 sin recargar, el estado no se reinicia.

Solucion: Agregar un `useEffect` que reinicie `selectedFixed` y `variantChoices` cuando cambie el `stageId`.

### Resumen de cambios

| Linea | Cambio |
|-------|--------|
| 145 | `navigate("/#precios")` → `navigate(\`/plan/${pack.id}\`)` |
| 35-41 | Agregar useEffect para reiniciar estado al cambiar de etapa |
| 70 | Verificar guardia de ultimo producto (ya funciona, pero asegurar) |
