

# Corregir email e Instagram en toda la app

## Cambios

Hay inconsistencias en el email y el Instagram en varios archivos. Se corregiran todos para usar los datos correctos:

- **Email**: `info@bebloo.es` (tanto en el texto visible como en el enlace `mailto:`)
- **Instagram**: `@bebloo.es` (tanto en el texto visible como en el enlace a `instagram.com/bebloo.es`)

## Archivos a modificar

### 1. `src/components/Footer.tsx`
- Linea 50: cambiar texto "hola@bebloo.es" a "info@bebloo.es" (el mailto ya es correcto)
- Linea 70: cambiar texto "@bebloo" a "@bebloo.es" (el enlace ya es correcto)

### 2. `src/pages/PrivacyPolicy.tsx`
- Lineas 37, 106, 142: cambiar "hola@bebloo.es" a "info@bebloo.es" (tanto texto como mailto)

### 3. `src/pages/TermsOfService.tsx`
- Linea 151: cambiar "hola@bebloo.es" a "info@bebloo.es" (tanto texto como mailto)

## Total: 6 cambios en 3 archivos
