

## Rediseño completo de la sección de Precios

### Resumen
Reemplazar los 3 planes actuales (Esencial, Confort, Tranquilidad Total) por los nuevos planes (Start, Comfort, Total Peace) con contenido mucho mas detallado, y anadir tooltips informativos con icono (i) para conceptos que necesitan explicacion.

### Nuevos planes

| | BEBLOO Start | BEBLOO Comfort | BEBLOO Total Peace |
|---|---|---|---|
| Precio | 59 EUR/mes | 129 EUR/mes | 149 EUR/mes |
| Destacado | No | Si (mas elegido) | No |
| Garantia | 30 dias | 60 dias | 90 dias |
| Duracion | 30 dias | Sin permanencia | Sin permanencia |

### Estructura de cada tarjeta

Cada plan mostrara:
1. Nombre y descripcion corta
2. Precio
3. Seccion "Equipamiento" con lista de items
4. Seccion "Servicios" con lista de items
5. Seccion "No incluye" (solo para Start, con icono X)
6. Bono incluido (si aplica)
7. Garantia con duracion
8. Boton CTA

### Tooltips informativos (icono i)

Los siguientes conceptos tendran un icono de informacion que al pasar el raton muestra una explicacion:

| Concepto | Explicacion resumida |
|---|---|
| Kit SOS Primeras Noches | Pack extra para las primeras semanas: ruido blanco, aspirador nasal, hamaca portatil extra, mochila recien nacido, pack emergencia y guia digital. No sustituye la hamaca principal. |
| Sistema Anti-Acumulacion | Bebloo retira lo que el bebe ya no usa. Solo tienes en casa lo que necesita hoy. |
| Cambios por etapa | El equipamiento evoluciona con el bebe: se retira lo que ya no usa y se entrega lo siguiente, sin costes extra. |
| Gestor personal | Una persona de Bebloo que conoce tu caso, gestiona entregas, retiradas y cambios. Tu unico punto de contacto. |
| Limpieza profesional | Todo el equipamiento se limpia, desinfecta y revisa antes de llegar a tu casa. |

Se usara el componente Tooltip de Radix UI (ya instalado) con el icono `Info` de lucide-react.

### Cambios tecnicos

**Archivo: `src/components/PricingSection.tsx`** - Reescritura completa:
- Nueva estructura de datos para los 3 planes con campos: equipamiento, servicios, exclusiones, bono, garantia
- Tipo para features con tooltip opcional: `{ text: string; tooltip?: string }`
- Componente `FeatureItem` que renderiza el check + texto + icono info con tooltip cuando aplique
- Seccion "No incluye" con icono X para el plan Start
- Garantia visible al final de cada tarjeta
- Orden mobile: Comfort primero (mantener logica actual)
- Envolver todo en `TooltipProvider`

**Archivo: `src/pages/Index.tsx`** - Sin cambios necesarios (la interfaz de props no cambia).

### Diseno visual
- Se mantiene el estilo actual de tarjetas con bordes redondeados
- El plan Comfort sigue siendo el destacado con badge "Mas elegido"
- Los tooltips usan el estilo nativo de shadcn/ui (fondo oscuro, texto claro)
- El icono (i) sera pequeno y sutil, en color `muted-foreground`
- Las secciones dentro de cada tarjeta se separan con subtitulos en negrita
