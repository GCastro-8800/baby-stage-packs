

# Boton flotante de WhatsApp sin solapamiento con el chatbot

## Distribucion visual

```text
Desktop:
+----------------------------------+
|                                  |
|                                  |
|  [WA]                    [Chat]  |
|  bottom-6 left-6   bottom-6 right-6
+----------------------------------+

Movil:
+------------------+
|                  |
|  [WA]     [Chat] |
|  left-4   right-4|
|  bottom-20       |
| [===CTA flotante===] |
|  bottom-0            |
+------------------+
```

- **WhatsApp**: esquina inferior **izquierda**
- **Chatbot**: esquina inferior **derecha**
- **CTA movil**: barra completa abajo del todo
- No hay solapamiento en ningun caso

## Archivo nuevo: `src/components/WhatsAppButton.tsx`

- Boton circular verde WhatsApp (#25D366) con icono SVG blanco
- Desktop: `fixed bottom-6 left-6 z-50`
- Movil: `fixed bottom-20 left-4 z-50` (sube por encima del CTA flotante)
- Tooltip en hover (desktop) con texto "WhatsApp"
- Abre `https://wa.me/34638706467?text=Hola%2C%20me%20interesa%20saber%20m%C3%A1s%20sobre%20bebloo`
- Registra clic con `useAnalytics` como evento `contact_click` con `{ channel: "whatsapp", location: "floating_button" }`
- Animacion de entrada `animate-scale-in` (ya existe en el proyecto)
- Tamano 56px (igual al chatbot, coherencia visual)

## Archivos modificados

- **`src/pages/Index.tsx`**: importar y renderizar `<WhatsAppButton />`
- **`src/pages/AboutUs.tsx`**: importar y renderizar `<WhatsAppButton />`
- **`src/hooks/useAnalytics.ts`**: anadir `"whatsapp_click"` al tipo `EventType` (o reusar `contact_click` que ya existe)

Sin dependencias nuevas ni cambios en base de datos.

