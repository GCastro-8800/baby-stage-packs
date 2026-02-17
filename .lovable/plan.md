

# Fix: Enlaces rotos en Footer y warnings de refs

## 1. Footer - Enlaces con IDs incorrectos

Los IDs reales de las secciones son:
- Precios: `id="precios"` (en PricingSection.tsx)
- Como funciona: `id="como-funciona"` (en HowItWorksSection.tsx)
- FAQ: `id="faq"` (ya correcto)

**Cambio en `src/components/Footer.tsx`** (lineas 23 y 33):
- `href="#pricing"` cambia a `href="#precios"`
- `href="#how-it-works"` cambia a `href="#como-funciona"`
- `href="#faq"` se mantiene igual (ya funciona)

## 2. Warnings de refs en consola

Revisados los tres componentes (FloatingCTA, ChatBot, EmailCaptureModal): ninguno recibe refs ni usa forwardRef. Estos componentes se renderizan directamente en Index.tsx sin asignarles refs.

Los warnings, si aparecen, provienen de librerias internas (Radix UI en Drawer/Dialog) y no del codigo del proyecto. No requieren cambios en el codigo de la aplicacion; no afectan funcionalidad.

**Resultado**: Solo se modifica Footer.tsx para corregir los dos enlaces rotos.

