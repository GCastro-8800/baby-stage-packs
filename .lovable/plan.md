# Fix: error al guardar el onboarding

## Diagnóstico
El toast "No se pudo guardar tu información" viene de:
```
permission denied for function has_role
```
Las RLS policies `"Admins can read all profiles"` y `"Admins can manage all children"` ejecutan `public.has_role(auth.uid(), 'admin')`. La función existe y es `SECURITY DEFINER`, pero el rol `authenticated` no tiene `EXECUTE` sobre ella, así que cualquier `INSERT`/`SELECT` que dispare esas policies falla — incluso para un usuario normal, porque Postgres evalúa todas las policies permisivas.

## Cambio
Migración SQL única:

```sql
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, anon;
```

No se tocan policies, ni tablas, ni código frontend. Como `has_role` es `SECURITY DEFINER` con `search_path` fijo, conceder EXECUTE es seguro y es el patrón estándar.

## Verificación
1. Reintentar el botón "Empezar" del onboarding → debe redirigir a `/app` sin toast de error.
2. La fila debe quedar creada en `children` y `profiles.onboarding_completed = true`.
