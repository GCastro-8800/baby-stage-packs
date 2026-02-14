

# Pack Explorer - Pagina publica `/packs`

## Que es
Una pagina donde los padres pueden explorar visualmente que equipamiento reciben en cada etapa del bebe (0-3m, 3-6m, 6-9m, 9-12m). A diferencia de la pagina de precios que organiza por plan, el Pack Explorer organiza por **momento de vida del bebe**.

La idea central del masterplan: *"alguien responsable ya penso en esto"*. Cada etapa muestra que incluye, para que sirve y que problema evita.

## Experiencia del usuario

1. El usuario llega a `/packs` (desde el menu, landing o CTA)
2. Ve una cabecera emocional con titulo tipo "Todo lo que necesita, cuando lo necesita"
3. Navega entre etapas con tabs horizontales: **0-3 meses**, **3-6 meses**, **6-9 meses**, **9-12 meses**
4. Cada etapa muestra:
   - Nombre emocional de la etapa (ej: "Primeros dias", "Descubriendo el mundo")
   - Descripcion breve de lo que vive el bebe y la familia
   - Grid de productos con imagen, marca, modelo y para que sirve
   - Click en producto abre el dialog de vista previa (reutilizando `ProductPreviewDialog`)
5. Al final, un CTA hacia la seccion de precios: "Elige tu plan y empieza"

## Estructura de datos

Se creara un nuevo archivo `src/data/packsByStage.ts` que organiza el equipamiento por etapa en vez de por plan. Cada etapa tendra:
- `id`: identificador de la etapa (ej: "0-3m")
- `name`: nombre emocional
- `description`: texto breve sobre el momento vital
- `icon`: icono representativo
- `equipment`: lista de categorias y productos relevantes para esa etapa

Los productos se tomaran de los datos existentes en `planEquipment.ts`, reorganizados por cuando se necesitan.

## Archivos a crear/modificar

| Accion | Archivo | Detalle |
|--------|---------|---------|
| Crear | `src/data/packsByStage.ts` | Datos de equipamiento organizados por etapa |
| Crear | `src/pages/Packs.tsx` | Pagina principal del Pack Explorer |
| Crear | `src/components/packs/StageTab.tsx` | Componente de contenido de cada etapa |
| Crear | `src/components/packs/PackProductCard.tsx` | Tarjeta de producto con imagen y descripcion |
| Modificar | `src/App.tsx` | Agregar ruta `/packs` |
| Modificar | `src/components/Header.tsx` | Agregar enlace "Packs" en la navegacion |

## Seccion tecnica

### Datos por etapa (packsByStage.ts)

```text
0-3m "Primeros dias"
  - Carrito con capazo
  - Cuna/minicuna
  - Cambiador
  - Monitor de bebe
  - Hamaca ergonomica
  - Mochila portabebe

3-6m "Descubriendo"
  - Se mantiene carrito (cambio a silla)
  - Trona evolutiva (se introduce)
  - Parque de juegos (se introduce)

6-9m "Explorando"
  - Parque de juegos (protagonista)
  - Trona (uso diario)
  - Monitor (se mantiene)

9-12m "Creciendo"
  - Trona principal
  - Parque
  - Cuna evolutiva
```

### Componentes

- **Packs.tsx**: Header + Footer + Tabs (Radix UI) con las 4 etapas
- **StageTab.tsx**: Recibe los datos de una etapa, renderiza titulo emocional + grid de productos
- **PackProductCard.tsx**: Tarjeta con imagen, marca/modelo, descripcion corta. Click abre `ProductPreviewDialog` (ya existente)
- Ruta publica, sin autenticacion

### Navegacion

- Header: nuevo enlace "Packs" entre las opciones existentes
- CTA al final de la pagina redirige a `/#precios`
- Ruta: `/packs` (publica, sin `ProtectedRoute`)

