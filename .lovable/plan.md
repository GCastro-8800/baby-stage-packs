

## Corregir seleccion por defecto en el quiz recomendador

### Problema

Cuando avanzas de una pregunta a la siguiente, la nueva pregunta aparece con la primera opcion visualmente seleccionada aunque no lo este realmente. Esto ocurre porque el componente `RadioGroup` no maneja correctamente el valor `undefined` para limpiar la seleccion visual.

### Solucion

En `src/components/dashboard/PlanRecommenderDialog.tsx`, cambiar el estado `currentAnswer` para que use una cadena vacia `""` en lugar de `undefined` como valor de "sin seleccion". Esto le indica claramente al RadioGroup que no hay ninguna opcion seleccionada.

### Cambios concretos

**Archivo:** `src/components/dashboard/PlanRecommenderDialog.tsx`

- Cambiar el tipo del estado `currentAnswer` de `string | undefined` a `string`
- Inicializar con `""` en lugar de `undefined`
- En `handleNext`, `handleBack` y `handleReset`: resetear a `""` en vez de `undefined`
- En la condicion del boton "Siguiente": comprobar `currentAnswer === ""` en vez de `currentAnswer === undefined`

Son aproximadamente 5 lineas de cambio, sin afectar logica, estilos ni otros archivos.

