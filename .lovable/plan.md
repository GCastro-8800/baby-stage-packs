## Análisis de los 4 hallazgos

Tras inspeccionar `pg_proc` y `pg_class`, los 4 findings corresponden a:

### 1. INFO — RLS Enabled No Policy
- **Tabla**: `public.login_attempts`
- **Estado**: RLS activado, 0 políticas → solo `service_role` accede (uso interno desde edge function `admin-login`).
- **Acción**: **Aceptar como intencional** (marcar como ignorado + actualizar `security-memory`).

### 2. WARN — Public (anon) Can Execute SECURITY DEFINER
- **Función**: `public.has_role(uuid, app_role)` tiene `EXECUTE` para `anon`.
- **Riesgo real**: bajo (solo devuelve boolean), pero **innecesario**: ninguna política RLS evalúa `has_role` para usuarios anónimos (todas las políticas admin requieren sesión).
- **Acción**: **Arreglar** → `REVOKE EXECUTE ... FROM anon`.

### 3. WARN — Authenticated Can Execute SECURITY DEFINER (`has_role`)
- **Función**: `public.has_role(uuid, app_role)` con `EXECUTE` para `authenticated`.
- **Necesario** para que las políticas RLS tipo `has_role(auth.uid(), 'admin')` se evalúen cuando el caller es un usuario autenticado.
- Lógica interna segura: solo lee `user_roles` filtrando por `(user_id, role)` exactos, devuelve boolean. No expone datos.
- **Acción**: **Aceptar como intencional** (patrón estándar Supabase para evitar recursión RLS).

### 4. WARN — Authenticated Can Execute SECURITY DEFINER (`get_user_subscription_overview`)
- **Función**: `public.get_user_subscription_overview()`.
- Lógica interna: fuerza `v_user_id := auth.uid()`, devuelve `NULL`/vacío si no hay sesión, y filtra **siempre** por `user_id = auth.uid()`. Imposible que un usuario lea datos de otro.
- **Acción**: **Aceptar como intencional**.

---

## Migración propuesta

```sql
-- Revocar EXECUTE innecesario sobre has_role para anon
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
```

Una sola sentencia; no toca lógica de negocio, no afecta a `authenticated` ni a `service_role`.

## Post-migración

1. Re-ejecutar scan para confirmar que el WARN #2 (anon) desaparece.
2. Marcar los 3 hallazgos restantes (#1, #3, #4) como `ignore` con `security--manage_security_finding`, explicando la justificación.
3. Actualizar `security-memory` documentando:
   - `login_attempts` es tabla interna sin políticas a propósito (solo service_role).
   - `has_role` SECURITY DEFINER para authenticated es patrón requerido para RLS no-recursivo.
   - `get_user_subscription_overview` está scoped por `auth.uid()` internamente.

## Riesgo

Nulo. Revocar `EXECUTE` a `anon` sobre `has_role` no rompe nada: ninguna ruta pública necesita evaluar roles de un usuario anónimo (anon no tiene `auth.uid()`).
