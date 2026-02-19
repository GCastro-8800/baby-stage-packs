

# Cambiar orden de planes en movil

## Cambio

Actualmente en movil se muestra primero el plan Comfort (169 euro) porque tiene el flag `highlighted`. El usuario quiere que en movil se muestren en orden natural: Start (79 euro) primero, luego Comfort (169 euro, con la etiqueta "Mas elegido"), y despues Total Peace (199 euro).

## Paso

1. **Editar `src/components/PricingSection.tsx`** (linea ~122): cambiar la variable `mobilePlans` para que use el mismo orden que `desktopPlans` (es decir, el orden original del array `plans`: start, comfort, total-peace), eliminando el sort que pone el highlighted primero.

Cambiar:
```ts
const mobilePlans = [...plans].sort((a, b) => {
  if (a.highlighted) return -1;
  if (b.highlighted) return 1;
  return 0;
});
```

Por:
```ts
const mobilePlans = plans;
```

Esto hara que en movil se vean en orden: Start (79), Comfort (169, "Mas elegido"), Total Peace (199). No se modifica nada en desktop.
