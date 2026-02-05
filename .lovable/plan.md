

## Personalizar el Dashboard con Datos del Onboarding

Transformaremos el dashboard generico en una experiencia completamente personalizada que muestre la etapa del bebe, cuenta regresiva/edad, y contenido contextual basado en los datos recopilados durante el onboarding.

---

## Vista General del Dashboard Personalizado

```text
+-----------------------------------------------------------------------+
|  [Logo bebloo]                               [Settings] [Cerrar sesion]|
+-----------------------------------------------------------------------+
|                                                                       |
|  [Avatar]  Hola, Maria                                                |
|            Todo esta bajo control. Aqui tienes tu resumen.            |
|                                                                       |
+-----------------------------------------------------------------------+
|                                                                       |
|  +---------------------------+  +---------------------------+         |
|  |  [Baby icon]              |  |                           |         |
|  |                           |  |  ETAPA ACTUAL             |         |
|  |  Tu bebe tiene            |  |  0-3 meses                |         |
|  |  2 meses y 14 dias        |  |                           |         |
|  |                           |  |  Pack recomendado:        |         |
|  |  Nacido el 15 nov 2025    |  |  "Primeros dias"          |         |
|  |                           |  |                           |         |
|  +---------------------------+  +---------------------------+         |
|                                                                       |
|  +---------------------------+                                        |
|  |  [Heart icon]             |                                        |
|  |                           |  O para embarazadas:                   |
|  |  "Es normal sentirse      |  +---------------------------+         |
|  |  abrumada en esta etapa.  |  |  Faltan 47 dias           |         |
|  |  Respira. Lo estas        |  |  para conocer a tu bebe   |         |
|  |  haciendo genial."        |  |                           |         |
|  |                           |  |  Fecha estimada:          |         |
|  +---------------------------+  |  15 marzo 2026            |         |
|                                 +---------------------------+         |
+-----------------------------------------------------------------------+
```

---

## Logica de Calculo de Etapa

### Hook personalizado: `useBabyStage`

Creamos un hook que calcula automaticamente:

| Dato | Calculo |
|------|---------|
| `ageInDays` | Diferencia entre hoy y `baby_birth_date` |
| `ageText` | "2 meses y 14 dias" o similar |
| `daysUntilBirth` | Para embarazadas: dias hasta `baby_due_date` |
| `stage` | Etapa actual basada en edad |
| `stageName` | Nombre legible: "0-3 meses", "3-6 meses", etc. |

### Etapas definidas:

| Etapa | Rango | Nombre en UI |
|-------|-------|--------------|
| `prenatal` | Antes del nacimiento | "Preparandote" |
| `0-3m` | 0-90 dias | "Primeros dias" |
| `3-6m` | 91-180 dias | "Descubriendo" |
| `6-9m` | 181-270 dias | "Explorando" |
| `9-12m` | 271-365 dias | "Creciendo" |
| `12m+` | >365 dias | "Pequeno grande" |

---

## Nuevos Componentes del Dashboard

### Estructura de archivos:

| Archivo | Descripcion |
|---------|-------------|
| `src/hooks/useBabyStage.ts` | Hook para calcular etapa y edad |
| `src/components/dashboard/BabyAgeCard.tsx` | Tarjeta con edad/cuenta regresiva |
| `src/components/dashboard/StageCard.tsx` | Tarjeta con etapa actual y pack recomendado |
| `src/components/dashboard/EmotionalTip.tsx` | Mensaje emocional contextual |
| `src/components/dashboard/WelcomeHeader.tsx` | Header personalizado con saludo |

---

## Componente: BabyAgeCard

Muestra contenido diferente segun `parent_situation`:

**Para padres con bebe nacido (`born`):**
```text
+---------------------------+
|  [Baby icon]              |
|                           |
|  Tu bebe tiene            |
|  2 meses y 14 dias        |
|                           |
|  Nacido el 15 nov 2025    |
+---------------------------+
```

**Para embarazadas (`expecting`):**
```text
+---------------------------+
|  [Calendar icon]          |
|                           |
|  Faltan 47 dias           |
|  para conocer a tu bebe   |
|                           |
|  Fecha estimada:          |
|  15 marzo 2026            |
+---------------------------+
```

---

## Componente: StageCard

Muestra la etapa actual y el pack recomendado:

```text
+---------------------------+
|  ETAPA ACTUAL             |
|  =====================    |
|                           |
|  0-3 meses                |
|  "Primeros dias"          |
|                           |
|  [Barra de progreso]      |
|  Dia 75 de 90             |
|                           |
|  [Ver pack recomendado]   |
+---------------------------+
```

---

## Componente: EmotionalTip

Mensajes contextuales basados en:
- Etapa del bebe
- Si es primer hijo o no
- Situacion (embarazo o ya nacido)

**Ejemplos por etapa:**

| Etapa | Mensaje para primerizos | Mensaje para experimentados |
|-------|-------------------------|----------------------------|
| prenatal | "Es normal tener mil preguntas. Estamos aqui para ayudarte." | "Ya conoces el camino, pero cada bebe es unico." |
| 0-3m | "Los primeros dias son intensos. Descansa cuando puedas." | "Ya sabes que esta etapa pasa rapido. Disfrutala." |
| 3-6m | "Tu bebe empieza a descubrir el mundo. Y tu a conocerlo." | "Cada hijo es diferente. Disfruta las sorpresas." |

---

## Implementacion del Hook `useBabyStage`

```typescript
interface BabyStageResult {
  // Estado
  situation: "expecting" | "born" | null;
  isFirstChild: boolean | null;
  
  // Para bebes nacidos
  ageInDays: number | null;
  ageInMonths: number | null;
  ageText: string | null;
  birthDate: Date | null;
  
  // Para embarazadas
  daysUntilBirth: number | null;
  dueDate: Date | null;
  
  // Etapa
  stage: "prenatal" | "0-3m" | "3-6m" | "6-9m" | "9-12m" | "12m+" | null;
  stageName: string | null;
  stageProgress: number; // 0-100
  daysInStage: number;
  totalDaysInStage: number;
}
```

---

## Cambios en AppDashboard.tsx

El dashboard actual tiene 3 tarjetas estaticas:
1. Tu perfil (nombre, email)
2. Tu bebe (fecha basica)
3. Tu suscripcion (placeholder)

### Nuevo layout:

1. **WelcomeHeader** - Saludo personalizado con avatar
2. **BabyAgeCard** - Edad del bebe o cuenta regresiva
3. **StageCard** - Etapa actual con progreso visual
4. **EmotionalTip** - Mensaje contextual
5. **SubscriptionCard** - (placeholder para futuro)
6. **HelpCard** - Mantener seccion de ayuda

---

## Diseno Visual

### Principios (alineados con bebloo):
- Colores suaves del sistema existente (primary, secondary)
- Tarjetas con bordes redondeados y sombras sutiles
- Iconos de Lucide React (Baby, Calendar, Heart, Sparkles)
- Tipografia: Fraunces para titulos, DM Sans para texto
- Espacio visual generoso - todo respira

### Barra de progreso de etapa:
- Usa el componente `Progress` existente
- Color primary para indicador
- Muestra dias transcurridos / total de la etapa

---

## Resumen de Implementacion

| Paso | Descripcion |
|------|-------------|
| 1 | Crear hook `useBabyStage` con toda la logica de calculo |
| 2 | Crear componente `BabyAgeCard` |
| 3 | Crear componente `StageCard` |
| 4 | Crear componente `EmotionalTip` |
| 5 | Crear componente `WelcomeHeader` |
| 6 | Refactorizar `AppDashboard.tsx` para usar nuevos componentes |

No se requieren cambios en la base de datos - toda la personalizacion usa los campos existentes del perfil.

---

## Seccion Tecnica

### Calculo de edad del bebe:

```typescript
// Usando date-fns
import { differenceInDays, differenceInMonths, format } from "date-fns";
import { es } from "date-fns/locale";

const birthDate = new Date(profile.baby_birth_date);
const today = new Date();

const ageInDays = differenceInDays(today, birthDate);
const ageInMonths = differenceInMonths(today, birthDate);
const remainingDays = ageInDays - (ageInMonths * 30);

const ageText = ageInMonths > 0 
  ? `${ageInMonths} ${ageInMonths === 1 ? 'mes' : 'meses'} y ${remainingDays} dias`
  : `${ageInDays} dias`;
```

### Determinacion de etapa:

```typescript
const getStage = (ageInDays: number) => {
  if (ageInDays < 0) return "prenatal";
  if (ageInDays <= 90) return "0-3m";
  if (ageInDays <= 180) return "3-6m";
  if (ageInDays <= 270) return "6-9m";
  if (ageInDays <= 365) return "9-12m";
  return "12m+";
};
```

### Progreso dentro de la etapa:

```typescript
const stageRanges = {
  "0-3m": { start: 0, end: 90 },
  "3-6m": { start: 91, end: 180 },
  "6-9m": { start: 181, end: 270 },
  "9-12m": { start: 271, end: 365 },
};

const { start, end } = stageRanges[stage];
const daysInStage = ageInDays - start;
const totalDays = end - start;
const progress = Math.min(100, (daysInStage / totalDays) * 100);
```

