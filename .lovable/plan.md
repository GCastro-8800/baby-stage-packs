

# Pagina "Quienes Somos" (/quienes-somos)

## Resumen
Crear una pagina estatica completa con 8 secciones que cuenta la historia de Bebloo, siguiendo el estilo visual existente (colores de marca, tipografias Fraunces/DM Sans, espaciado generoso). Se registrara como nueva ruta y se enlazara desde el Header y Footer.

## Que vera el usuario
Una pagina larga con scroll que incluye: hero con degradado, tarjetas de descubrimiento, historia de los fundadores, bloque diferenciador, principios con iconos, tarjetas del equipo, compromiso con Madrid, y CTA final con enlace a packs.

## Cambios tecnicos

### 1. Nuevo archivo: `src/pages/AboutUs.tsx`
Componente unico con las 8 secciones inline (no se necesitan componentes separados al ser una pagina estatica):

- **Hero**: degradado suave (`hero-section` class existente), titulo y subtitulo centrados, sin imagen
- **Lo Que Descubrimos**: 3 tarjetas con iconos de Lucide (`RefreshCw`, `TrendingDown`, `AlertTriangle`), grid 3 columnas desktop / stack mobile
- **Nuestra Historia**: layout asimetrico con texto a la izquierda y bloque decorativo a la derecha, texto centrado en mobile
- **Por Que Somos Diferentes**: fondo `bg-step` (color existente), texto con formato destacado
- **Nuestros Principios**: 4 bloques con iconos (`CheckCircle`, `Sparkles`, `Truck`, `Shield`), grid 2x2 tablet / 4 columnas desktop / 1 columna mobile
- **El Equipo**: 2 tarjetas lado a lado con nombre, rol y descripcion
- **Compromiso con Madrid**: icono `MapPin` con texto corto
- **CTA Final**: boton principal "Descubre nuestros packs" enlazando a `/#precios`, boton secundario "Contactanos" enlazando a `mailto:info@bebloo.es`

Animaciones sutiles al scroll usando `IntersectionObserver` nativo con clases CSS de fade-in.

### 2. Modificar `src/App.tsx`
- Importar `AboutUs`
- Agregar ruta: `<Route path="/quienes-somos" element={<AboutUs />} />`

### 3. Modificar `src/components/Header.tsx`
- Agregar enlace "Quienes somos" al array `navLinks` con `isRoute: true` y `href: "/quienes-somos"`

### 4. Modificar `src/components/Footer.tsx`
- Agregar enlace "Quienes somos" en la columna "Servicio" usando `<Link to="/quienes-somos">`

### 5. SEO
- Agregar `document.title` y meta description via `useEffect` en el componente AboutUs

## Estilos reutilizados
- Clases existentes: `hero-section`, `bg-step`, `bg-warm`, `container max-w-6xl`, `font-serif`
- Componentes existentes: `Button`, `Badge`, `Card`
- Paleta de marca (primary, accent, muted-foreground)
- Sin imagenes stock; solo iconos Lucide y bloques decorativos con colores de marca

## Orden de implementacion
1. Crear `src/pages/AboutUs.tsx` con las 8 secciones
2. Registrar ruta en `App.tsx`
3. Agregar enlaces en Header y Footer

