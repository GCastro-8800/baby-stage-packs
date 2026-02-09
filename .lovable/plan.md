

## Rediseño del flujo de detalle del plan: selección guiada y contacto contextualizado

### Resumen

Transformar la página `/plan/:planId` de una vista estática con contacto genérico a un flujo secuencial donde el usuario primero explora el equipamiento de su plan, opcionalmente marca lo que le interesa, y luego accede a opciones de contacto contextualizadas (incluyendo la comprobación de disponibilidad por zona).

### Cambios principales

**1. Flujo secuencial en pasos**

La página pasará de mostrar todo a la vez a guiar al usuario en dos secciones claras:

```text
Paso 1: "Esto es lo que incluye tu plan [Comfort]"
  - Grid de categorías con marcas/modelos
  - Cada categoría tiene checkboxes opcionales para marcar interés
  - Nota al pie: "¿Necesitas más? Descubre [plan superior]"
  - Botón "Continuar" (también se puede saltar)

Paso 2: "¿Cómo quieres continuar?"
  - WhatsApp (con preselección incluida en el mensaje)
  - Calendly (reservar llamada)
  - "Comprueba si Bebloo está disponible en tu zona" (email + código postal)
```

**2. Preselección orientativa de equipamiento**

- Cada categoría mostrará checkboxes junto a las opciones de marca/modelo
- La selección es opcional — el usuario puede saltarla e ir directo al contacto
- Cuando contacte por WhatsApp, el mensaje prellenado incluirá las opciones marcadas
- Tracking: se registrará qué categorías/modelos generan más interés

**3. Contextualizar la captura de email**

La tarjeta de email cambiará de "Déjanos tu email / te avisamos cuando lleguemos a tu zona" a:

- Título: "Comprueba si Bebloo está disponible en tu zona"
- El código postal pasa a ser campo principal (no opcional)
- El email se presenta como "Te avisamos cuando lleguemos a tu código postal"
- Esto ancla el formulario en Madrid y da una razón real para compartir datos

**4. Solo equipamiento del plan seleccionado**

- Se muestra únicamente lo que incluye el plan elegido, sin items bloqueados de otros planes
- Al final del grid de equipamiento, un enlace sutil: "¿Necesitas más categorías? Descubre [plan superior]" que lleva a la página de ese plan
- Esto evita frustración y mantiene la experiencia limpia

### Detalle técnico

**Archivos modificados:**

- `src/pages/PlanDetail.tsx` — Reestructurar en dos secciones (equipamiento con checkboxes + contacto contextualizado). Añadir estado local para la preselección. Incluir las selecciones en el mensaje de WhatsApp. Cambiar copy del formulario de email a "Comprueba disponibilidad". Añadir enlace al plan superior.

- `src/data/planEquipment.ts` — Añadir campo `upgradePlanId` a cada plan para saber qué plan superior sugerir (ej: Start apunta a Comfort, Comfort a Total Peace). Opcionalmente añadir un campo `selectable: boolean` a cada categoría para controlar cuáles permiten preselección.

**Sin cambios en:**
- Base de datos (la tabla `leads` ya tiene todo lo necesario)
- `EmailCaptureModal.tsx` (no se usa en esta página)
- Rutas ni navegación general

### Flujo visual propuesto

```text
/plan/comfort
  |
  [Cabecera: nombre, precio, garantía]
  |
  [Sección 1: "Tu equipamiento en BEBLOO Comfort"]
  |  - Carrito completo: [ ] Bugaboo Fox 5  [ ] Cybex Priam  [ ] Stokke Xplory
  |  - Cuna: [ ] Stokke Sleepi  [ ] Babyzen Yoyo  [ ] Cybex Lemo Cot
  |  - Trona: [ ] Stokke Tripp Trapp  [ ] Cybex Lemo 2
  |  - ... (resto de categorías)
  |  - "¿Necesitas más? Descubre Total Peace →"
  |  - [Botón: "Continuar →"]
  |
  [Sección 2: "¿Cómo quieres continuar?"]
  |  - [WhatsApp] con mensaje: "Hola, me interesa Comfort. Me interesan: Bugaboo Fox 5, Stokke Sleepi..."
  |  - [Calendly] reservar llamada
  |  - [Disponibilidad] "Comprueba si Bebloo llega a tu zona"
  |     - Campo: Código postal
  |     - Campo: Email
  |     - Botón: "Comprobar disponibilidad"
```

### Copy clave

- Sección equipamiento: "Estos son los modelos disponibles en tu plan {nombre}. Marca los que más te interesan para que podamos preparar tu asesoramiento."
- Nota preselección: "La selección es orientativa. Tu asesor personal te ayudará a elegir."
- Email/disponibilidad: "Comprueba si Bebloo está disponible en tu zona de Madrid"
- Enlace upsell: "¿Necesitas hamaca, portabebé o más? Descubre {plan superior} →"

### Nuevos eventos de analytics

- `equipment_selection` — cuando el usuario marca/desmarca un producto (con categoría y modelo)
- `plan_upgrade_click` — cuando hace clic en "Descubre [plan superior]"

