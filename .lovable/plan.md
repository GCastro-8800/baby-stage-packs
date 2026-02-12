

# Login admin con contraseña separada

## Concepto

El login admin usara email + una contraseña exclusiva para admin (diferente de la contraseña/Google de la cuenta normal). Maximo 2 cuentas admin.

## Como funciona

```text
Usuario va a /admin/login
        |
  Ingresa email + contraseña admin
        |
  Edge function "admin-login":
    1. Busca usuario por email
    2. Verifica que tenga rol admin
    3. Compara contraseña contra hash en tabla admin_credentials
    4. Si todo OK, genera un magic link token (sin enviar email)
    5. Retorna el token al cliente
        |
  Cliente usa el token para crear sesion de Supabase
        |
  Redirige a /admin (con sesion activa + rol admin = RLS funciona)
```

## Cambios

### 1. Nueva tabla: `admin_credentials`

Almacena la contraseña admin (hasheada con bcrypt) separada de la autenticacion normal.

- `id` UUID (PK)
- `user_id` UUID (referencia a auth.users, unico)
- `password_hash` TEXT
- `created_at` TIMESTAMP

Politicas RLS: bloquear todo acceso (solo el edge function con service role puede leer/escribir). Trigger para limitar a maximo 2 filas.

### 2. Edge function: `admin-login`

Recibe `{ email, password }` y:
1. Busca el usuario por email usando el admin API (service role)
2. Verifica que tenga rol admin en `user_roles`
3. Verifica la contraseña contra el hash en `admin_credentials` usando bcrypt
4. Si todo es valido, genera un magic link token via `auth.admin.generateLink`
5. Retorna el token hasheado al cliente
6. El cliente llama `supabase.auth.verifyOtp()` para crear la sesion

### 3. Edge function: `set-admin-password`

Para configurar/cambiar la contraseña admin. Requiere estar autenticado + tener rol admin. Recibe `{ password }` y guarda el hash en `admin_credentials`.

### 4. Actualizar `AdminLogin.tsx`

Cambiar el flujo: en vez de `signInWithPassword`, llamar al edge function `admin-login`. Si retorna el token, usarlo con `verifyOtp` para crear sesion y navegar a `/admin`.

### 5. Setup inicial

Despues de desplegar, usaremos el edge function `set-admin-password` para establecer tu contraseña admin. Te pedire que me digas que contraseña quieres usar (o la configuras directamente).

## Seguridad

- Las contraseñas admin se almacenan hasheadas con bcrypt (nunca en texto plano)
- Solo el service role puede acceder a `admin_credentials`
- El magic link token se genera server-side y nunca se envia por email
- Maximo 2 cuentas admin (forzado por trigger en la tabla)
- RLS sigue protegiendo todos los datos del panel admin

## Archivos

| Accion | Archivo |
|--------|---------|
| Crear | `supabase/functions/admin-login/index.ts` |
| Crear | `supabase/functions/set-admin-password/index.ts` |
| Migrar | Nueva tabla `admin_credentials` + trigger limite 2 filas |
| Modificar | `src/pages/AdminLogin.tsx` - usar edge function en vez de signInWithPassword |

