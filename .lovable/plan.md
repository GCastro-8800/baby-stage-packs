

## Plan: Auditoría responsive 375px — Resultados y correcciones

### Resumen de la auditoría

Revisé las siguientes páginas a 375x812px (iPhone estándar):

| Pagina | Estado | Notas |
|--------|--------|-------|
| Landing (/) | OK | Hero, comparativa, pricing, FAQ, footer: todo bien |
| Auth (/auth) | OK | Redirige al dashboard al estar logueado |
| Onboarding (/configurador) | OK | Pasos, botones y formulario se ven bien |
| Dashboard (/app) | OK | Tarjetas, selectores, cards de etapa: bien |
| Settings (/app/settings) | Minor | Las child cards con nombre largo se truncan correctamente, pero cuando hay 5 hijos con badges+botones se aprietan |
| Catálogo (/catalogo) | OK | Cards, filtros por categoría, productos: todo bien |
| Mi Selección (/mi-seleccion) | OK | Tarjetas, selectores de duración, sticky footer: bien |
| Quiénes Somos | OK | Hero con overlay, texto legible |

### Problemas encontrados

**1. WhatsApp + ChatBot buttons se solapan con el floating CTA**
- El WhatsApp button está en `bottom-24 left-4` en móvil
- El ChatBot button está en `bottom-20 right-4` en móvil
- El floating CTA ocupa `bottom-0` con `p-4`
- Resultado: los 3 elementos coexisten pero el WhatsApp y ChatBot quedan muy cerca del CTA. Funcionalmente no se solapan porque WhatsApp está a la izquierda y ChatBot a la derecha, pero visualmente es un poco denso.
- **Fix**: Subir ambos botones flotantes un poco más cuando el floating CTA está visible (añadir `bottom-28` en móvil para dar más espacio respecto al CTA de ~72px de alto).

**2. Settings ChildCard: con nombre largo + badge "Activo" + 3 botones, el layout se comprime demasiado en 375px**
- El nombre se trunca bien pero la fecha ("27 de febrero 2026") fuerza un wrap extraño.
- **Fix**: En pantallas pequeñas, mover los action buttons debajo del contenido en vez de al lado, usando flex-wrap.

**3. Dashboard header: el botón "Cerrar sesión" oculta el texto con `hidden sm:inline` — correcto, solo muestra el icono. Pero hay solo un icono de logout sin tooltip, lo que puede confundir.**
- **Fix menor**: Añadir un tooltip al botón de logout en móvil.

### Correcciones a implementar

1. **WhatsApp button**: Cambiar `bottom-24` → `bottom-[7rem]` en móvil para dar más espacio con el floating CTA
2. **ChatBot button**: Cambiar `bottom-20` → `bottom-[7rem]` en móvil
3. **ChildCard**: Hacer el layout responsive con flex-wrap para que los botones de acción bajen en pantallas muy pequeñas
4. **Dashboard logout**: Añadir tooltip al botón de cerrar sesión

### Detalles técnicos
- `src/components/WhatsAppButton.tsx`: Ajustar clase `bottom-24` → `bottom-[7rem]`
- `src/components/ChatBot.tsx`: Ajustar clase `bottom-20` → `bottom-[7rem]` en el botón móvil
- `src/components/settings/ChildCard.tsx`: Cambiar el flex container a `flex-wrap` en el layout principal
- `src/pages/AppDashboard.tsx`: Añadir `Tooltip` al botón de logout

