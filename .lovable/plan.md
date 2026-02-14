

# Mas CTAs en el Pack Explorer

## Situacion actual
La pagina `/packs` solo tiene **un CTA al final** ("Ver planes y empezar"). El usuario puede recorrer todo el contenido sin encontrar ningun punto de conversion intermedio.

## Cambios propuestos

### 1. CTA en el hero (arriba)
Agregar un boton debajo del subtitulo del hero que invite a ver los planes directamente. Asi el usuario que ya esta convencido no tiene que bajar hasta el final.

### 2. CTA dentro de cada etapa (StageTab)
Al final de cada tab de etapa, agregar una mini-seccion con un mensaje contextual y un boton. El mensaje cambia segun la etapa, por ejemplo:
- **0-3m**: "Empieza con todo listo desde el primer dia"
- **3-6m**: "El equipamiento evoluciona con tu bebe"
- **6-9m**: "Sin comprar, sin acumular"
- **9-12m**: "Todo incluido hasta su primer cumpleanos"

Cada uno con un boton "Ver planes desde 59 euros/mes" que lleva a `/#precios`.

### 3. Floating CTA en movil
Reutilizar el componente `FloatingCTA` que ya existe en la landing para que tambien aparezca en `/packs`. Asi en movil siempre hay un boton visible mientras hace scroll.

### 4. CTA en el dialog de producto
Cuando el usuario abre el preview de un producto, agregar un boton secundario tipo "Incluido en nuestros planes" que lleve a precios. El usuario que explora un producto ya esta interesado.

## Resumen de archivos a modificar

| Archivo | Cambio |
|---------|--------|
| `src/pages/Packs.tsx` | Agregar boton CTA en el hero + importar FloatingCTA |
| `src/components/packs/StageTab.tsx` | Agregar CTA contextual al final de cada etapa |
| `src/data/packsByStage.ts` | Agregar campo `cta` con mensaje personalizado por etapa |
| `src/components/plan/ProductPreviewDialog.tsx` | Agregar boton secundario hacia precios |

## Seccion tecnica

- Los CTAs usaran el componente `Button` existente con variantes `default` y `outline`
- Se trackean con `useAnalytics` usando el evento `cta_click` con `location` especifico (ej: `packs_hero`, `packs_stage_0-3m`, `packs_product_dialog`)
- El `FloatingCTA` ya tiene logica de intersection observer para ocultarse cerca de la seccion de precios; en `/packs` se mostrara siempre ya que no hay seccion de precios en esa pagina
- Navegacion hacia precios usa `useNavigate("/#precios")`
