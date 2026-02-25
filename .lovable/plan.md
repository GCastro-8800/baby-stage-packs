
# Correcciones: eliminar referencias a "packs" y arreglar diseño movil

## Problema

Hay dos problemas principales:

1. **Referencias a "packs" obsoletas**: El modelo de negocio ha cambiado a seleccion de productos individuales, pero multiples componentes siguen mencionando "packs", "planes" y la seccion de precios antigua (Start/Comfort/Total Peace) que ya no aplica.

2. **Problemas de diseño movil**: Algunos elementos se cortan o no caben bien en pantallas pequenas (tarjetas de producto con selectores de duracion, botones flotantes superpuestos).

---

## Cambios a realizar

### 1. Eliminar/corregir textos con "pack" en toda la app

**`src/components/FAQSection.tsx`**:
- Pregunta "Que incluye exactamente cada pack?" -> Cambiar a "Que incluye el servicio?" con respuesta sobre seleccion individual de productos
- Pregunta sobre cambio de etapa: quitar "recogida del pack actual" -> "recogida del equipamiento actual"

**`src/pages/AboutUs.tsx`** (linea 299):
- "Descubre nuestros packs" -> "Descubre nuestro servicio"

**`src/components/ChatBot.tsx`** (linea 18):
- "nuestros planes, envios" -> "nuestro servicio, envios"

**`src/pages/PrivacyPolicy.tsx`** (linea 58):
- "packs de suscripcion" -> "equipamiento de suscripcion"

**`src/pages/Selection.tsx`** (linea 185):
- "monta tu pack a medida" -> "monta tu seleccion a medida"

### 2. Actualizar la seccion de precios (PricingSection)

La PricingSection muestra 3 planes fijos (Start/Comfort/Total Peace) con equipamiento predefinido. Esto ya no aplica porque el modelo es de seleccion individual.

**`src/components/PricingSection.tsx`**: Reemplazar completamente por una seccion simplificada que:
- Explique que el precio se calcula segun los productos que elijas
- Muestre un rango orientativo (ej: "desde X euros/mes")
- Tenga un CTA claro hacia el configurador o catalogo
- Mantenga el selector de duracion con descuentos
- Elimine las 3 columnas de planes fijos

**`src/pages/Index.tsx`**: Actualizar el uso de PricingSection (ya no necesita `onSelectPlan` ni `pricingRef` si se simplifica).

### 3. Arreglar diseño movil

**`src/components/configurator/ProductCardSelected.tsx`**:
- Los chips de duracion pueden desbordar en pantallas pequenas. Anadir `flex-wrap` y reducir tamano en movil
- La card con imagen + info + precio necesita mejor disposicion en pantallas de 320px

**`src/components/catalog/CatalogProductCard.tsx`**:
- Asegurar que el precio y nombre no se corten con `truncate`

**`src/components/FloatingCTA.tsx`** y **`src/components/WhatsAppButton.tsx`**:
- Verificar que el CTA flotante inferior no se superpone con WhatsApp y ChatBot. Ajustar posiciones (WhatsApp arriba del CTA, ChatBot a la derecha)

**`src/components/configurator/ProductCardSelected.tsx`**:
- En movil, cambiar el layout de la tarjeta a vertical (imagen arriba, info debajo) para que todo quepa

---

## Archivos a modificar

1. `src/components/FAQSection.tsx` - Corregir textos de FAQ
2. `src/pages/AboutUs.tsx` - Quitar "packs"
3. `src/components/ChatBot.tsx` - Quitar "planes"
4. `src/pages/PrivacyPolicy.tsx` - Quitar "packs"
5. `src/pages/Selection.tsx` - Quitar "pack a medida"
6. `src/components/PricingSection.tsx` - Reemplazar planes fijos por seccion de precios dinamica
7. `src/pages/Index.tsx` - Actualizar integracion de PricingSection
8. `src/components/configurator/ProductCardSelected.tsx` - Mejorar layout movil
9. `src/components/catalog/CatalogProductCard.tsx` - Ajustes responsive
