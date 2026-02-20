

# Contenido emocional en el dashboard

## Resumen

Actualmente el dashboard tiene un unico componente emocional (`EmotionalTip`) que muestra una frase segun la etapa y si es primer hijo o no. El objetivo es enriquecer la experiencia con mas contenido contextual y personalizado.

## Cambios propuestos

### 1. Nuevo componente: `StageMilestones` (hitos de la etapa)

Un componente que muestra 2-3 hitos o cosas que esperar en la etapa actual del bebe. Por ejemplo, en "3-6m": "Empieza a agarrar objetos", "Primeras risas a carcajadas", "Reconoce tu voz desde lejos".

- Archivo: `src/components/dashboard/StageMilestones.tsx`
- Icono: estrella o brujula
- Estilo: tarjeta con lista visual de hitos
- Datos estaticos por etapa (no requiere base de datos)

### 2. Nuevo componente: `WeeklyRecommendation` (recomendacion semanal)

Una tarjeta que sugiere una actividad o consejo practico que rota semanalmente (basado en el numero de semana del anio). Ejemplo: "Esta semana prueba el contacto piel con piel durante 15 minutos al dia."

- Archivo: `src/components/dashboard/WeeklyRecommendation.tsx`
- Icono: bombilla (Lightbulb)
- Rotacion automatica por semana sin backend
- Contenido diferente por etapa

### 3. Mejorar `EmotionalTip` existente

Ampliar de 1 frase a un pool de 3 frases por etapa/perfil, rotando por dia de la semana para que no sea siempre la misma.

### 4. Saludo contextual en `WelcomeHeader`

Cambiar el saludo fijo "Todo esta bajo control" por uno contextual segun la hora del dia y la etapa:
- Maniana: "Buenos dias, [nombre]. Un nuevo dia con tu pequeno/a."
- Tarde: "Buenas tardes. Esperamos que el dia este yendo bien."
- Noche: "Buenas noches. Descansa, lo estas haciendo genial."

### 5. Integrar en `AppDashboard.tsx`

Anadir los nuevos componentes entre las tarjetas existentes:
- `StageMilestones` despues de la grid de BabyAgeCard/StageCard
- `WeeklyRecommendation` despues de EmotionalTip

## Seccion tecnica

### Archivos a crear
- `src/components/dashboard/StageMilestones.tsx`
- `src/components/dashboard/WeeklyRecommendation.tsx`

### Archivos a modificar
- `src/components/dashboard/EmotionalTip.tsx` - ampliar pool de frases, rotar por dia
- `src/components/dashboard/WelcomeHeader.tsx` - saludo contextual por hora/etapa
- `src/pages/AppDashboard.tsx` - importar y colocar nuevos componentes

### Sin cambios en base de datos
Todo el contenido es estatico y se calcula en el frontend basandose en la etapa del bebe y la fecha actual.

