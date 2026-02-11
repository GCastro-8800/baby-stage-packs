

# Activar acceso admin para tu cuenta

## El problema

Tu cuenta tiene el rol `user` pero no `admin`. Por eso al ir a `/admin` te redirige automaticamente a la homepage.

## La solucion

### Paso 1 - Asignar rol admin a tu usuario

Insertar una entrada en la tabla `user_roles` con el rol `admin` para tu cuenta. Tu usuario seguira teniendo tambien el rol `user`, simplemente se le agrega el de `admin`.

```text
INSERT INTO public.user_roles (user_id, role)
VALUES ('ad2c2123-d94f-405b-b884-4a94da4ee68d', 'admin');
```

### Paso 2 - Acceso para tu co-founder

Cuando tu co-founder cree su cuenta (via Google o email), se le asignara el mismo rol admin con el mismo tipo de comando. Solo necesitamos saber su user ID despues de que se registre.

## Como funciona el acceso

- **URL**: Vas a `https://bebloo.lovable.app/admin` (o la URL de preview)
- **Requisito**: Estar logueado con una cuenta que tenga rol `admin`
- **Seguridad**: Si alguien sin rol admin escribe esa URL, es redirigido a la homepage automaticamente
- **Visibilidad**: No hay ningun enlace en la web publica que apunte a `/admin`

No se necesitan credenciales separadas ni un sistema de login adicional. Tu cuenta normal + el rol admin es todo lo que hace falta.

## Cambios tecnicos

- Un solo INSERT en la tabla `user_roles` (via herramienta de base de datos)
- Cero cambios en el codigo frontend

