

## Onboarding Sensible para Todo Tipo de Padres

Implementaremos un flujo de onboarding cálido que funcione tanto para padres primerizos como experimentados, embarazadas como padres con bebés ya nacidos.

---

## Flujo Visual del Onboarding

```text
Paso 1: Situacion
+-------------------------------------------------------------+
|                                                             |
|   [Logo bebloo]                                             |
|                                                             |
|   "Hola, [nombre]. Cuentanos un poco sobre ti."             |
|                                                             |
|   +------------------------+  +------------------------+    |
|   |                        |  |                        |    |
|   |   Estoy esperando      |  |   Ya nacio mi bebe     |    |
|   |   un bebe              |  |                        |    |
|   |                        |  |                        |    |
|   +------------------------+  +------------------------+    |
|                                                             |
|   [ o  o  o  o ] <- indicador de progreso                   |
+-------------------------------------------------------------+
                            |
                            v
Paso 2: Fecha (adapta segun seleccion anterior)
+-------------------------------------------------------------+
|                                                             |
|   "Cuando esperas que llegue?" / "Cuando nacio tu bebe?"    |
|   (Una fecha aproximada esta bien)                          |
|                                                             |
|   +--------------------------------------------------+      |
|   |  [Selector de fecha con calendario]              |      |
|   +--------------------------------------------------+      |
|                                                             |
|   [Anterior]                               [Continuar]      |
+-------------------------------------------------------------+
                            |
                            v
Paso 3: Experiencia previa (opcional)
+-------------------------------------------------------------+
|                                                             |
|   "Es tu primer bebe?"                                      |
|   (Esto nos ayuda a personalizar tu experiencia)            |
|                                                             |
|   +------------------------+  +------------------------+    |
|   |                        |  |                        |    |
|   |   Si, es mi primero    |  |   No, ya tengo         |    |
|   |                        |  |   experiencia          |    |
|   |                        |  |                        |    |
|   +------------------------+  +------------------------+    |
|                                                             |
|   [Anterior]                               [Continuar]      |
+-------------------------------------------------------------+
                            |
                            v
Paso 4: Cierre emocional
+-------------------------------------------------------------+
|                                                             |
|                         [icono]                             |
|                                                             |
|   "Todo listo!"                                             |
|                                                             |
|   Nos encargamos de lo complicado.                          |
|   Tu encargate de disfrutarlo.                              |
|                                                             |
|                     [Empezar]                               |
|                                                             |
+-------------------------------------------------------------+
```

---

## Cambios en la Base de Datos

Se anadiran 3 columnas nuevas a la tabla `profiles`:

| Columna | Tipo | Default | Proposito |
|---------|------|---------|-----------|
| `onboarding_completed` | boolean | false | Saber si completo el onboarding |
| `is_first_child` | boolean | null | Personalizar tono y contenido |
| `parent_situation` | text | null | "expecting" o "born" |

**Migracion SQL:**
```sql
ALTER TABLE profiles
ADD COLUMN onboarding_completed boolean DEFAULT false,
ADD COLUMN is_first_child boolean,
ADD COLUMN parent_situation text;
```

Las politicas RLS existentes ya permiten que los usuarios actualicen su propio perfil.

---

## Arquitectura de Archivos

### Nuevos archivos a crear:

| Archivo | Descripcion |
|---------|-------------|
| `src/pages/Onboarding.tsx` | Pagina principal del onboarding |
| `src/components/onboarding/OnboardingFlow.tsx` | Wizard con estado y navegacion |
| `src/components/onboarding/StepIndicator.tsx` | Puntos de progreso |
| `src/components/onboarding/steps/SituationStep.tsx` | Paso 1: esperando o ya nacio |
| `src/components/onboarding/steps/DateStep.tsx` | Paso 2: selector de fecha |
| `src/components/onboarding/steps/ExperienceStep.tsx` | Paso 3: primer bebe o no |
| `src/components/onboarding/steps/CompletionStep.tsx` | Paso 4: cierre emocional |

### Archivos a modificar:

| Archivo | Cambio |
|---------|--------|
| `src/App.tsx` | Anadir ruta `/onboarding` |
| `src/components/auth/ProtectedRoute.tsx` | Redirigir a onboarding si no completado |
| `src/hooks/useAuth.tsx` | Actualizar tipo Profile con nuevos campos |

---

## Logica de Redireccion

```text
Usuario hace login
       |
       v
ProtectedRoute verifica session
       |
       +-- No hay session --> Redirigir a /auth
       |
       +-- Hay session --> Verificar profile.onboarding_completed
                |
                +-- false o null --> Redirigir a /onboarding
                |
                +-- true --> Mostrar /app (dashboard)
```

**Importante**: La pagina `/onboarding` tambien sera una ruta protegida, pero no verificara el estado de onboarding (para evitar loops).

---

## Detalles de Implementacion

### Estado del Wizard

```typescript
interface OnboardingData {
  situation: "expecting" | "born" | null;
  date: Date | null;
  isFirstChild: boolean | null;
}

// Estado manejado con useState en OnboardingFlow
const [step, setStep] = useState(1);
const [data, setData] = useState<OnboardingData>({
  situation: null,
  date: null,
  isFirstChild: null,
});
```

### Guardado de Datos

Al completar el paso 4, se hace un UPDATE a la tabla `profiles`:

```typescript
await supabase
  .from("profiles")
  .update({
    parent_situation: data.situation,
    baby_due_date: data.situation === "expecting" ? data.date : null,
    baby_birth_date: data.situation === "born" ? data.date : null,
    is_first_child: data.isFirstChild,
    onboarding_completed: true,
  })
  .eq("id", user.id);
```

### Selector de Fecha

Usaremos el componente Calendar existente con Popover, siguiendo el patron de shadcn datepicker:
- Para "esperando": permitir fechas futuras (hasta +10 meses)
- Para "ya nacio": permitir fechas pasadas (hasta -3 anos)

### Animaciones

Transiciones suaves entre pasos usando CSS transitions con opacity y transform.

---

## Diseno Visual

### Principios (alineados con la marca bebloo):
- Fondo limpio (`bg-background`)
- Tarjetas de seleccion grandes y amigables
- Sin urgencia, sin presion
- Todo respira visualmente
- Tono calido y empatico

### Componentes UI usados:
- `Card` para las opciones de seleccion
- `Button` para navegacion
- `Calendar` + `Popover` para fechas
- Iconos de Lucide para acentos visuales

### Responsive:
- Desktop: contenido centrado con max-width
- Mobile: full width, tarjetas apiladas verticalmente

---

## Copy en Espanol (tono bebloo)

**Paso 1 - Situacion:**
- Titulo: "Cuentanos un poco sobre ti"
- Opcion A: "Estoy esperando un bebe"
- Opcion B: "Ya nacio mi bebe"

**Paso 2a - Fecha esperada:**
- Titulo: "Cuando esperas que llegue?"
- Subtitulo: "Una fecha aproximada esta bien"

**Paso 2b - Fecha nacimiento:**
- Titulo: "Cuando nacio tu bebe?"
- Subtitulo: "Asi sabremos en que etapa esta"

**Paso 3 - Experiencia:**
- Titulo: "Es tu primer bebe?"
- Subtitulo: "Esto nos ayuda a personalizar tu experiencia"
- Opcion A: "Si, es mi primero"
- Opcion B: "No, ya tengo experiencia"

**Paso 4 - Cierre:**
- Titulo: "Todo listo!"
- Subtitulo: "Nos encargamos de lo complicado. Tu encargate de disfrutarlo."
- Boton: "Empezar"

---

## Resumen de Cambios

1. **Migracion de BD**: Anadir 3 columnas a `profiles`
2. **Actualizar tipos**: Modificar interface Profile en useAuth
3. **Crear componentes**: OnboardingFlow + StepIndicator + 4 pasos
4. **Crear pagina**: `/onboarding`
5. **Modificar ProtectedRoute**: Verificar onboarding y redirigir
6. **Actualizar App.tsx**: Anadir ruta nueva

