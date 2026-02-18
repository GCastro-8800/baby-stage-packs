

# Rediseno de la pagina Quienes Somos - Estilo zigzag editorial

## Inspiracion

Del ejemplo de StrollMe tomamos:
- Layout en **zigzag**: secciones alternas imagen-izquierda/texto-derecha y viceversa
- Imagenes grandes y prominentes con bordes redondeados
- Tipografia serif para titulos de seccion, con un separador decorativo debajo
- Fondo calido uniforme (beige/cream) como base
- Texto narrativo personal y cercano, sin tarjetas ni iconos excesivos

De lo que ya tenemos conservamos:
- El contenido narrativo (historia de Paola y Gabriel, descubrimientos, principios)
- Las estadisticas destacadas (+400 carritos, +4 anos, 100s familias)
- Los principios como seccion de tarjetas (simplificada)
- El CTA final con compromiso Madrid
- Las animaciones de scroll reveal
- El SEO meta y la estructura Header/Footer/WhatsApp

## Nueva estructura de secciones

```text
1. Hero (compacto)
   Badge "Nuestra mision" + H1 serif grande + subtitulo + imagen derecha
   Layout: 2 columnas zigzag (texto izq, imagen der)
   Imagen: mother-stroller.png

2. Somos Bebloo (quienes somos)
   Layout: imagen izq, texto der
   Imagen: twins-happy.jpg
   Contenido: Historia personal de Paola y Gabriel resumida

3. La Idea (lo que descubrimos -> la solucion)
   Layout: texto izq, imagen der
   Imagen: mother-carrier.png
   Contenido: El patron descubierto + como nacio bebloo

4. Nuestra Vision (principios resumidos)
   Layout: imagen izq, texto der
   Imagen: mission-family.jpg
   Contenido: Compromiso con calidad, Madrid, y sostenibilidad

5. Estadisticas (banda horizontal)
   3 numeros grandes en fila

6. Principios (4 tarjetas, conservadas)

7. CTA Final
   Compromiso Madrid + botones
```

## Cambios tecnicos

### Archivo: `src/pages/AboutUs.tsx` (reescritura completa)

- Eliminar las secciones actuales (hero centrado, discoveries cards, historia con stats sidebar, diferenciadores, equipo cards, madrid+cta)
- Reemplazar con secciones zigzag que alternan `grid-cols-2` con imagen y texto
- Cada seccion zigzag usa:
  - En desktop: `grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`
  - Orden alterno via `order-1/order-2` en las columnas
  - Imagen con `aspect-[4/5] rounded-2xl overflow-hidden shadow-lg` y `object-cover`
  - Titulo con `font-serif text-2xl md:text-4xl` + separador coral debajo (`h-1 w-12 bg-accent`)
  - Texto narrativo con `text-muted-foreground leading-relaxed`
- Conservar `RevealSection` y `useScrollReveal` para animaciones
- Conservar las 4 tarjetas de principios (simplificadas, sin numeros)
- Conservar la banda de estadisticas
- Conservar el CTA final con Madrid
- Conservar SEO meta tags

### Imagenes utilizadas (ya disponibles en `src/assets/`)
- `mother-stroller.png` - Hero / mision
- `twins-happy.jpg` - Somos Bebloo
- `mother-carrier.png` - La idea
- `mission-family.jpg` - Nuestra vision

### Sin cambios en otros archivos
- No hay dependencias nuevas
- No hay cambios en la base de datos
- El routing ya existe (`/quienes-somos`)

