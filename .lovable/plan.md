

## Plan: Frontend del ciclo de fin de servicio

### 1. Página pública de programación de recogida
**Nueva ruta `/recogida/:subscriptionId`** (acceso por token, sin login)
- Lee `?token=...` de la URL
- Llama a edge function `schedule-pickup` con `action: "validate"` para verificar token y traer datos (nombre, productos, fecha fin)
- Muestra calendario (4 semanas próximas, lun-vie) + selector de franja (mañana 10-13h / tarde 16-19h)
- Si ya está programada: muestra confirmación con fecha/franja y opción de cambiar
- Submit → `schedule-pickup` con `action: "schedule", date, window`
- Estados: loading, token inválido/expirado, ya programada, éxito
- Diseño coherente con marca (Fraunces + DM Sans, light blue/coral)

### 2. Banners de estado en `SubscriptionCard.tsx`
Tres variantes según `end_date` y `pickup_status`:
- **Ámbar (≤30 días al fin, status `active`)**: "Tu servicio termina el [fecha] · Renovar ahora"
- **Coral (status `expired`, pickup `pending`)**: "Tu servicio ha terminado · Programa la recogida o renueva"
- **Verde (pickup `scheduled`)**: "Recogida confirmada el [fecha] · [franja]"

CTA "Renovar" → navega a `/configurador?renew=<subscription_id>` (pre-rellena selección desde último shipment — pequeño cambio en `Selection.tsx` para leer ese param)

### 3. Captura de teléfono y preferencias en `Settings.tsx`
Sección nueva "Notificaciones":
- Input teléfono (validación E.164 con zod, prefijo +34)
- 3 toggles: Email (siempre on, deshabilitado), WhatsApp, SMS
- Banner informativo si los canales SMS/WhatsApp aún no están activos: "Los avisos por WhatsApp y SMS llegarán cuando activemos el servicio"
- Guarda en `profiles.phone` y `profiles.notification_preferences`

### 4. Banner global en `AppDashboard.tsx`
Si `profile.phone` está vacío y hay subscription activa:
- Banner dismissible arriba del dashboard: "Añade tu teléfono para no perderte avisos importantes → Ir a ajustes"

### 5. Tab "Recogidas" en panel admin (`Admin.tsx`)
Nuevo `PickupsTab.tsx` con:
- Tabla de subscriptions con `pickup_status` ∈ {pending, scheduled, completed}
- Columnas: cliente, fecha fin, fecha recogida, franja, estado, acciones
- Filtros por estado
- Botón "Marcar como recogida" → update `pickup_status = 'completed'`
- Botón "Reenviar link de recogida" para pending (regenera token vía edge function)

### 6. Hook `useSubscription` actualizado
- Exponer `end_date`, `pickup_status`, `pickup_scheduled_date`, `pickup_window` en el tipo `Subscription`
- Helper `daysUntilEnd` calculado

### Ficheros a crear
- `src/pages/SchedulePickup.tsx`
- `src/components/admin/PickupsTab.tsx`
- `src/components/dashboard/PhoneCaptureBanner.tsx`
- `src/components/settings/NotificationPreferences.tsx`

### Ficheros a editar
- `src/App.tsx` — ruta `/recogida/:subscriptionId`
- `src/components/dashboard/SubscriptionCard.tsx` — banners de estado
- `src/pages/AppDashboard.tsx` — banner captura teléfono
- `src/pages/Settings.tsx` — sección notificaciones
- `src/pages/Admin.tsx` — tab Recogidas
- `src/hooks/useSubscription.ts` — campos nuevos
- `src/pages/Selection.tsx` — soporte query param `renew`
- `supabase/functions/schedule-pickup/index.ts` — añadir acción `validate` (solo lectura del token sin marcarlo usado) si no existe ya

### Orden de ejecución
1. Hook `useSubscription` + tipos
2. Página `/recogida` + acción validate en edge function
3. Banners en `SubscriptionCard`
4. Settings: preferencias de notificación + captura de teléfono
5. Banner global en dashboard
6. Tab admin de recogidas
7. Soporte `?renew=` en Selection

¿Confirmas para arrancar?

