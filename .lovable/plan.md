## Fase 3b — Settings editorial

Llevar `/app/settings` al mismo lenguaje del dashboard: sin `Card`/cajas, secciones separadas por aire vertical y hairlines, headers con eyebrow + serif h3, copy cálido en español.

### 1. `src/pages/Settings.tsx`
- Header sticky: quitar fondo `bg-background/80` y borde duro. Dejar `border-b border-foreground/10` muy sutil, mantener logo y "Cerrar sesión" como botón ghost con hairline.
- Sustituir el botón "Volver al inicio" por enlace ghost discreto con flecha (igual estilo que en SubscriptionCard).
- `<main>`: usar `max-w-2xl`, `py-12 md:py-20`, `space-y-16 md:space-y-20` entre secciones.
- Título de página: eyebrow `Tu cuenta` + serif h2 "Ajustes" + muted lead corta ("Tu perfil, tus pequeños y cómo te avisamos.").
- Reemplazar las 3 `Card` por `<section>` con:
  - eyebrow uppercase tracking,
  - serif h3,
  - cuerpo con `space-y-6`,
  - separador `border-t border-foreground/10` entre secciones.

### 2. Sección "Tu perfil"
- Eyebrow "Perfil" + h3 "Tu nombre".
- Input sin borde de Card, mantener `Input` shadcn pero envuelto en bloque limpio.
- Botón "Guardar" como hairline-button (variant ghost con `border-b border-foreground/40`), no full width.

### 3. Sección "Tus pequeños" (antes "Mis hijos")
- Eyebrow "Familia" + h3 "Tus pequeños".
- Botón "Añadir" hairline en la esquina derecha del header de la sección.
- Texto de límite: muted sutil, sin badge.
- `ChildCard` rediseñado (ver §5).
- Empty state cálido: "Aún no has añadido a nadie. Cuéntanos quién viene en camino o quién acaba de llegar." + CTA hairline "Añadir el primero".

### 4. Sección "Notificaciones" (`NotificationPreferences.tsx`)
- Quitar `Card` wrapper, mantener como `<section>`.
- Eyebrow "Avisos" + h3 "Cómo te escribimos".
- Lead: "Te avisamos cuando tu Momento esté por terminar y cuando programemos una recogida."
- Quitar la caja `bg-secondary/30` con borde. Cada canal (Email/WhatsApp/SMS) como fila con hairline inferior `border-b border-foreground/10`, sin fondo.
- Quitar la caja info azul; sustituir por nota muted en línea: "WhatsApp y SMS llegarán muy pronto."
- Botón "Guardar preferencias" hairline (no full width).

### 5. `src/components/settings/ChildCard.tsx`
- Quitar `Card`/`CardContent`. Renderizar como fila con `border-b border-foreground/10`, `py-5`.
- Quitar el círculo gris con icono Baby (demasiado SaaS).
- Nombre en serif `font-display` text-lg.
- Si activo: pequeño eyebrow "Activo ·" antes de la fecha, en color `text-foreground/70`, sin Badge ni background tinte.
- Fecha y situación: muted small ("En espera · 12 de marzo 2026" o "Nacido/a · 3 de enero 2026").
- Acciones: botones ghost icon sin fondo, alineados a la derecha. "Marcar activo" como link hairline con texto en vez de icono solo cuando no está activo.

### 6. Out of scope
- `ChildFormDialog`: queda igual (es un modal funcional, no rompe el lenguaje del dashboard).
- AlertDialog de eliminar: igual.
- Hooks, validación zod, lógica Supabase: sin cambios.

### Verificación
- /app/settings desktop 1280px: tres secciones separadas por aire y hairlines, sin tarjetas.
- /app/settings móvil 390px: serif legible, hairlines respetan padding, botones tocables.
- ChildCard activo: lectura clara sin badge ni tinte azul.
- Notificaciones: 3 canales en filas limpias, no caja.
- Toasts y navegación intactos.
