
# Rediseno de `/mi-seleccion` - Aspecto e-commerce + flujo sin preguntas repetidas

## Resumen

Dos problemas a resolver:

1. **Visual**: La pagina parece una lista plana, no un e-commerce. Necesita imagenes de producto, cards mas visuales, mejor jerarquia y un aspecto mas premium.
2. **Flujo**: Las preguntas del cuestionario solo deben aparecer la primera vez. Si el usuario vuelve a `/mi-seleccion` directamente (sin pasar por `/configurador`), deberia poder ver el catalogo completo y elegir productos libremente, sin redirigir al cuestionario.

---

## Cambios visuales - Cards de producto tipo e-commerce

### `ProductCardSelected.tsx` - Rediseno completo
- Anadir imagen placeholder del producto (cuadrado 80x80px con fondo gris claro y icono de categoria si no hay imagen real)
- Layout horizontal: imagen a la izquierda, info a la derecha
- Nombre del producto mas grande (text-base font-semibold)
- Marca como badge sutil
- Precio destacado con fondo accent suave
- shortReason como chip/badge verde
- Boton "Cambiar" mas visible, estilo outline
- Boton "Quitar" como icono de papelera discreto
- Alternativas en collapsible con mini-cards que tambien tienen imagen placeholder

### `ProductCardSuggested.tsx` - Rediseno completo
- Mismo layout con imagen placeholder
- Fondo blanco con borde punteado sutil
- Badge "Recomendado para etapa 4-8" en azul claro
- Boton "+ Anadir" mas prominente, estilo outline con icono

### `CategorySection.tsx` - Mejor jerarquia
- Titulo de categoria mas grande con icono a la izquierda
- Separador visual entre categorias
- Si no hay producto seleccionado, mostrar texto "No has seleccionado ningun producto de esta categoria" con boton "Ver opciones"

### `SelectionSidebar.tsx` - Mas premium
- Fondo blanco con sombra sutil en vez de borde
- Precio total mas grande y destacado
- Anadir linea "Ahorro estimado vs compra: ~X EUR" como gancho
- Perks con iconos mas grandes y coloridos

### `StickyMobileBar.tsx` - Mas e-commerce
- Fondo blanco con sombra superior
- Precio en fuente serif grande
- Boton CTA mas ancho

---

## Cambio de flujo - Eliminar redireccion forzosa al cuestionario

### `Selection.tsx` - Acceso libre
- Eliminar la redireccion `<Navigate to="/configurador">` cuando no hay state
- Si el usuario llega sin state (sin cuestionario):
  - Mostrar TODOS los productos del catalogo organizados por categoria y etapa
  - Cada producto aparece como `ProductCardSuggested` (no seleccionado)
  - El usuario puede anadir los que quiera
  - Mostrar un banner superior tipo "Quieres que te ayudemos a elegir?" con enlace al configurador
- Si llega CON state (desde cuestionario):
  - Mantener el flujo actual: productos preseleccionados + sugerencias
  - Mostrar banner "Seleccion basada en tu cuestionario" con opcion de "Volver a hacer el cuestionario"

### `useSelection.ts` - Sin cambios
- El hook ya soporta inicializar con array vacio, asi que funciona en ambos casos

---

## Detalles tecnicos

### Imagenes de producto
- Como no hay imagenes reales aun, usar un placeholder visual:
  - Fondo con gradiente suave (segun categoria: azul para movilidad, lila para descanso, rosa para porteo, naranja para alimentacion, gris para extras)
  - Icono de lucide centrado (Baby, Moon, Heart, UtensilsCrossed, Package)
  - Tamano 80x80 en mobile, 96x96 en desktop
- Cuando haya imagenes reales, solo habra que rellenar el campo `image` en el catalogo

### Layout de la pagina
- Header: "Tu seleccion" + subtitulo contextual (resumen si viene de cuestionario, "Elige lo que necesitas" si acceso libre)
- Banner contextual: cuestionario o acceso libre
- Grid de productos por etapa y categoria
- Sidebar sticky (desktop) / Bottom bar (mobile)

### Archivos a modificar
1. `src/pages/Selection.tsx` - Logica de acceso libre + layout mejorado
2. `src/components/configurator/ProductCardSelected.tsx` - Rediseno visual
3. `src/components/configurator/ProductCardSuggested.tsx` - Rediseno visual
4. `src/components/configurator/CategorySection.tsx` - Mejor jerarquia
5. `src/components/configurator/SelectionSidebar.tsx` - Aspecto premium
6. `src/components/configurator/StickyMobileBar.tsx` - Estilo e-commerce
