

## Mejora de UX/UI en la seccion de equipamiento

### Problema

Las tarjetas de equipamiento se ven planas y poco interactivas. Los checkboxes parecen radio buttons circulares (por su tamano pequeno y el estilo de borde), el espaciado es limitado, y las tarjetas no invitan a interactuar. La experiencia no transmite la calidad premium de Bebloo.

### Cambios propuestos

**1. Tarjetas de equipamiento mas atractivas**

- Fondo mas diferenciado: usar `bg-card` con un borde mas suave por defecto y un efecto hover sutil
- Aumentar el padding interno de cada tarjeta (de `p-6` a `p-6 sm:p-8`)
- Separar visualmente el titulo de categoria del listado con un separador sutil o mas margen
- Anadir un icono o indicador visual por categoria (opcional, con iconos de Lucide como `Baby`, `Bed`, `ShoppingBag`)

**2. Checkboxes mas visibles y diferenciados**

- Aumentar el tamano del checkbox de `h-4 w-4` a `h-5 w-5` para que sea claramente un checkbox y no un radio button
- Aumentar el tamano del icono Check interno de forma proporcional
- Mejorar el contraste del borde cuando no esta seleccionado (usar `border-muted-foreground/40` en vez de `border-primary`)
- Cuando esta seleccionado: fondo mas visible con el check mas grande

**3. Labels mas legibles**

- Aumentar el tamano del texto de `text-sm` a `text-base` para los nombres de marca/modelo
- Anadir mas espacio entre items (de `space-y-3` a `space-y-3.5`)
- Hacer que toda la fila sea clickable con un hover sutil (fondo `hover:bg-muted/50` en el `li`)

**4. Feedback visual de seleccion mejorado**

- Cuando un item esta seleccionado, anadir un fondo muy suave a la fila (`bg-primary/5 rounded-lg px-2 py-1`)
- La tarjeta con items seleccionados ya tiene borde `border-primary/50`, mantener eso

**5. Espaciado general**

- Aumentar el gap del grid de `gap-5` a `gap-6`
- Mejorar la jerarquia del titulo de seccion

### Detalle tecnico

**Archivos a modificar:**

- `src/components/ui/checkbox.tsx` — Aumentar tamano base a `h-5 w-5`, cambiar borde sin seleccionar a `border-muted-foreground/40`, aumentar icono Check a `h-3.5 w-3.5`

- `src/components/plan/EquipmentSection.tsx` — Mejorar el layout de cada tarjeta (padding, hover), aumentar tamano de texto en labels, anadir fondo de seleccion a items individuales, hacer filas clickables con padding y hover, aumentar gap del grid

