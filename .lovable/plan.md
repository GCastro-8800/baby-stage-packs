

# Login dedicado para el panel admin

## Que se hara

Crear una pagina de login exclusiva para administradores en una ruta dedicada (por ejemplo `/admin/login`). Esta pagina:

- Tiene su propia URL unica que solo tu y tu co-founder conocen
- Muestra un formulario de login limpio y minimalista (solo email + contrasena, sin Google, sin registro)
- Tras autenticarse, verifica que el usuario tenga rol `admin`; si no lo tiene, muestra error y no deja pasar
- Si es admin, redirige al panel `/admin`

La ruta `/admin` seguira protegida: si alguien no esta logueado, sera redirigido a `/admin/login` (no a `/auth` como los usuarios normales).

## Flujo

1. Tu o tu co-founder van a `/admin/login`
2. Ingresan email y contrasena
3. El sistema verifica credenciales + rol admin
4. Si todo OK, entran al panel `/admin`
5. Si no son admin, ven un mensaje de error

## Cambios tecnicos

### Archivo nuevo
- **`src/pages/AdminLogin.tsx`** - Pagina de login minimalista para admins. Solo formulario de email/contrasena. Sin tabs de registro, sin Google, sin branding emocional. Despues del login exitoso, verifica rol admin via `has_role` RPC. Si no es admin, cierra sesion y muestra error.

### Archivos modificados
- **`src/components/auth/AdminRoute.tsx`** - Cambiar la redireccion: si el usuario no esta logueado, redirigir a `/admin/login` en vez de `/`. Si esta logueado pero no es admin, redirigir a `/`.
- **`src/App.tsx`** - Agregar la ruta `/admin/login` apuntando al nuevo componente `AdminLogin`.

### Sin cambios en base de datos
No se necesitan cambios en tablas ni politicas. La verificacion de rol ya existe con `has_role()`.

