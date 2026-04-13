

## Plan: Intercambiar imágenes Hero y Mission

### Resumen

1. **Copiar la imagen subida** (el cochecito Bugaboo Dragonfly) como nueva imagen del Hero → `src/assets/mother-stroller.png`
2. **Copiar la imagen actual del Hero** (`mother-stroller.png`) al lugar de la Mission → `src/assets/mother-carrier.png`

Como las imágenes se sobrescriben con los mismos nombres de archivo, no se necesitan cambios en el código TypeScript.

### Orden de ejecución

Dado que se sobrescriben mutuamente, primero hay que guardar la imagen actual del Hero en un temporal:

1. Copiar `src/assets/mother-stroller.png` → `/tmp/old-hero.png` (backup temporal)
2. Copiar `user-uploads://WhatsApp_Image_2026-04-12_at_4.51.28_PM.jpeg` → `src/assets/mother-stroller.png` (nuevo Hero)
3. Copiar `/tmp/old-hero.png` → `src/assets/mother-carrier.png` (antigua Hero pasa a Mission)

### Resultado

- **Hero**: La foto del cochecito Bugaboo con fondo urbano
- **Mission**: La foto que actualmente está en el Hero (madre con cochecito)

