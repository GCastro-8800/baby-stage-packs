

## Plan: Pestaña "Clientes Inactivos" en el panel de administración

### Qué se construye
Una nueva pestaña en `/admin` que muestra usuarios registrados sin suscripción activa, con filtro configurable por meses de inactividad.

---

### Paso 1 — Componente `InactiveCustomersTab`
Crear `src/components/admin/InactiveCustomersTab.tsx`:
- Selector de rango: "Sin actividad en los últimos X meses" (slider o dropdown: 1, 3, 6, 12 meses, default 6)
- Consulta: obtener perfiles que NO tengan suscripción activa, y cuya última actividad (max de `subscriptions.updated_at` o `shipments.delivered_date`) sea anterior a la fecha de corte
- Tabla con columnas: Nombre, Email (de auth, vía profiles), Última actividad, Estado última suscripción, Acciones
- Botón de exportar CSV opcional

### Paso 2 — Query lógica
```sql
-- Perfiles con última actividad > X meses
SELECT p.id, p.full_name, 
  GREATEST(
    MAX(s.updated_at), 
    MAX(sh.delivered_date::timestamptz)
  ) as last_activity,
  MAX(s.status) as last_status
FROM profiles p
LEFT JOIN subscriptions s ON s.user_id = p.id
LEFT JOIN shipments sh ON sh.user_id = p.id
WHERE NOT EXISTS (
  SELECT 1 FROM subscriptions 
  WHERE user_id = p.id AND status = 'active'
)
GROUP BY p.id
HAVING GREATEST(...) < now() - interval 'X months'
   OR GREATEST(...) IS NULL
```
Esto se ejecuta desde el frontend con el cliente Supabase usando RPC o queries directas (el admin ya tiene permisos de lectura en todas las tablas).

### Paso 3 — Integrar en Admin.tsx
- Añadir la pestaña "Inactivos" al `TabsList`
- Importar y renderizar `InactiveCustomersTab`

### Archivos afectados
- `src/components/admin/InactiveCustomersTab.tsx` — nuevo
- `src/pages/Admin.tsx` — añadir pestaña
- Posible migración: función RPC `get_inactive_customers(months int)` para encapsular la query compleja

