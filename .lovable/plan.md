

## Plan: Correcciones pre-lanzamiento (SEO, Social Proof, OG Image)

### 1. SEO BASE_URL
**Archivo:** `src/components/SEO.tsx` (línea 12)  
Cambiar `https://bebloo.lovable.app` → `https://www.bebloo.es`

También actualizar las referencias en `index.html` (og:image y twitter:image URLs).

### 2. Social proof en Hero
**Archivo:** `src/components/Hero.tsx` (línea 35)  
Cambiar `"50+ familias ya confían en nosotros"` → `"Primeras familias ya confían en nosotros"`

### 3. OG Image
El archivo `/public/og-image.jpg` no existe. Se generará una imagen OG básica (1200x630px) con el logo/nombre bebloo y el tagline, usando la paleta de colores del proyecto. Se colocará en `public/og-image.jpg`.

### Archivos modificados
- `src/components/SEO.tsx` — BASE_URL
- `src/components/Hero.tsx` — social proof copy
- `index.html` — og:image URLs actualizadas
- `public/og-image.jpg` — nuevo archivo generado

