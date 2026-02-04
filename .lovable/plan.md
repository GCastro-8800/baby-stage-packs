

## QR Code + Enlace al Formulario de Validación

Después de analizar la estructura actual de la landing page, te propongo las mejores opciones de ubicación considerando el flujo de usuario y la experiencia en cada dispositivo.

---

## Análisis del contexto

**Objetivo**: Dirigir usuarios a un formulario de Google Forms para recopilar y validar información.

**Diferencia por dispositivo**:
- **Desktop**: QR code tiene sentido porque el usuario puede escanearlo con su móvil
- **Móvil**: Enlace directo al formulario (el QR no tiene sentido en móvil)

---

## Opciones de ubicación (ordenadas por recomendación)

### Opcion 1: Después de la sección de Precios (RECOMENDADA)

```text
┌─────────────────────────────────────────────────────────┐
│                    PRICING SECTION                      │
│           "Elige lo que necesitas"                      │
│     [Esencial]    [Confort]    [Tranquilidad]          │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              NUEVA SECCIÓN: EARLY ACCESS                │
│                                                         │
│  Desktop:                    │  Móvil:                  │
│  ┌─────────┐                 │  ┌─────────────────┐     │
│  │ QR Code │  + Texto        │  │ Botón: "Ayúdanos│     │
│  │         │  explicativo    │  │ a mejorar"      │     │
│  └─────────┘                 │  └─────────────────┘     │
│                                                         │
│  "¿Nos ayudas a mejorar?                               │
│   Responde unas preguntas rápidas"                     │
└─────────────────────────────────────────────────────────┘
```

**Por qué funciona**:
- El usuario ya vio los precios y está interesado
- Es un momento de alta intención
- Ofrece participación activa antes de las FAQ

---

### Opcion 2: Integrado en el FAQ

Añadir al final de las preguntas frecuentes una pregunta especial:

```text
"¿Quieres ayudarnos a diseñar el servicio perfecto?"
→ Abre/muestra el QR o enlace al formulario
```

**Ventaja**: Se integra naturalmente sin añadir una sección nueva.

---

### Opcion 3: En el Footer

Añadir una columna extra con el QR y un mensaje tipo "Cuéntanos qué necesitas".

**Ventaja**: Siempre visible al final.
**Desventaja**: Menos prominente, menor conversión.

---

## Mi recomendación: Opcion 1

Crear una nueva sección ligera entre Pricing y FAQ con:

**Diseño propuesto**:

```text
┌──────────────────────────────────────────────────────────────┐
│                     bg-background (limpio)                   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│              "¿Nos ayudas a mejorar?"                        │
│                                                              │
│   Estamos diseñando bebloo contigo. Cuéntanos qué           │
│   necesitas en 2 minutos y te recompensaremos.              │
│                                                              │
│   ┌────────────────┬────────────────────────────────────┐   │
│   │                │                                     │   │
│   │   [QR CODE]    │  • Solo 5 preguntas                │   │
│   │    150x150     │  • 2 minutos máximo                │   │
│   │                │  • Tu opinión nos importa          │   │
│   │   (desktop)    │                                     │   │
│   └────────────────┴────────────────────────────────────┘   │
│                                                              │
│   Escanea el código o [Responder ahora →] (botón móvil)     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Implementación técnica

### Archivos a crear/modificar

| Archivo | Acción |
|---------|--------|
| `src/components/SurveySection.tsx` | Crear nueva sección |
| `src/pages/Index.tsx` | Añadir componente entre Pricing y FAQ |

### Componente SurveySection

```tsx
// Comportamiento responsive:
// - Desktop: Muestra QR code + texto + botón alternativo
// - Móvil: Oculta QR, muestra solo botón directo

// QR Code:
// - Generado dinámicamente usando una librería como 'qrcode.react'
// - O imagen estática del QR pre-generado
```

### Dependencias

**Opción A (recomendada)**: Generar QR dinámicamente
- Instalar: `qrcode.react` (~3KB gzipped)
- Ventaja: Si cambias el enlace, el QR se actualiza solo

**Opción B**: QR estático
- Generar imagen del QR externamente
- Subirla como asset a `src/assets/`
- Desventaja: Si cambias el enlace, tienes que regenerar la imagen

---

## Flujo de usuario

```text
Usuario en Desktop                    Usuario en Móvil
       │                                     │
       ▼                                     ▼
   Ve pricing                            Ve pricing
       │                                     │
       ▼                                     ▼
 ┌─────────────┐                     ┌─────────────────┐
 │ Ve QR Code  │                     │ Ve botón        │
 │ + mensaje   │                     │ "Responder"     │
 └──────┬──────┘                     └────────┬────────┘
        │                                     │
        ▼                                     ▼
   Escanea con                          Tap en botón
   su móvil                                  │
        │                                     │
        └──────────────┬──────────────────────┘
                       ▼
              Google Forms abre
              en nueva pestaña
```

---

## Detalles de diseño

- **Fondo**: `bg-background` (blanco) para contrastar con el mint de Comparison
- **Estilo**: Minimalista, coherente con la estética bebloo
- **Sin urgencia**: Tono amable, no presión
- **Recompensa**: Mencionar que su feedback les beneficiará

### Copy sugerido

**Título**: "¿Nos ayudas a mejorar?"

**Subtítulo**: "Estamos diseñando bebloo contigo. Cuéntanos qué necesitas en 2 minutos."

**Bullet points**:
- Solo 5 preguntas rápidas
- Tu opinión da forma al servicio
- Sin spam, lo prometemos

**CTA móvil**: "Responder ahora"

---

## Resumen de cambios

1. Instalar dependencia `qrcode.react` para generar QR dinámicamente
2. Crear `SurveySection.tsx` con diseño responsive
3. Añadir sección en `Index.tsx` después de `PricingSection`
4. El QR apuntará a: `https://forms.gle/hmHKqXDSDLL1Djza8`

