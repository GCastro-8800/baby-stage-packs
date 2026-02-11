

# Panel de Administracion - bebloo

## Resumen

Crear un panel admin en `/admin` completamente oculto de la web publica. Sin enlaces en header, footer ni menus. Solo accesible escribiendo la URL directamente, y protegido por verificacion de rol `admin` en la base de datos.

## Que incluye

El panel tendra 3 secciones con pestanas (tabs):

1. **Suscripciones** - Tabla con todas las suscripciones activas/pausadas/canceladas, nombre del usuario, etapa actual, plan y proxima fecha de envio
2. **Envios** - Tabla con todos los shipments, su estado actual, y botones para cambiar el estado (programado -> empaquetado -> enviado -> entregado)
3. **Leads** - Tabla con todos los leads capturados (email, plan seleccionado, fecha)

## Seguridad (3 capas)

- **Capa 1 - UI**: Ningun enlace visible en la web publica. Cero rastro del admin
- **Capa 2 - Ruta protegida**: Componente `AdminRoute` que verifica el rol `admin` en la tabla `user_roles` via la funcion `has_role()`. Si no eres admin, redirige a `/`
- **Capa 3 - Base de datos**: Las politicas RLS existentes ya garantizan que solo admins pueden leer todas las suscripciones, envios y feedback. Para leads se necesitara una nueva politica de lectura para admins

## Cambios necesarios en la base de datos

Se necesita una nueva politica RLS en la tabla `leads` para que los admins puedan leer los leads:

```text
CREATE POLICY "Admins can read all leads"
ON public.leads FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));
```

## Archivos a crear/modificar

### Nuevos archivos
- `src/hooks/useAdminRole.ts` - Hook que consulta `user_roles` para verificar si el usuario actual es admin
- `src/components/auth/AdminRoute.tsx` - Componente de ruta protegida que verifica rol admin
- `src/pages/Admin.tsx` - Pagina principal del panel con 3 tabs
- `src/components/admin/SubscriptionsTab.tsx` - Tabla de suscripciones con datos de perfil del usuario
- `src/components/admin/ShipmentsTab.tsx` - Tabla de envios con acciones para cambiar estado
- `src/components/admin/LeadsTab.tsx` - Tabla de leads capturados

### Archivos modificados
- `src/App.tsx` - Agregar ruta `/admin` envuelta en `AdminRoute`

## Detalles tecnicos

- Las consultas admin usaran el cliente Supabase normal; las politicas RLS existentes (`has_role(auth.uid(), 'admin')`) ya permiten acceso total a `subscriptions`, `shipments` y `feedback`
- Para mostrar nombres de usuario junto a suscripciones, se hara un join con `profiles`
- El cambio de estado de envios usara un `UPDATE` directo a `shipments` (la politica admin ya lo permite)
- Se usaran los componentes existentes de shadcn/ui: `Tabs`, `Table`, `Badge`, `Button`, `Select`

