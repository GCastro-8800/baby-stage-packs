

# Corregir dos problemas: logo en el footer y tutorial de bienvenida repetido

## Problema 1: Tutorial de bienvenida aparece siempre

La causa raiz es que el tipo `Profile` en `src/types/baby.ts` no incluye el campo `has_seen_tutorial`. Cuando se carga el perfil desde la base de datos, se castea a este tipo y el campo se pierde. Por eso la condicion `!(profile as any).has_seen_tutorial` siempre es `true` (porque el valor es `undefined`), y el tutorial se muestra cada vez.

### Solucion

1. **Editar `src/types/baby.ts`**: Agregar `has_seen_tutorial: boolean;` al interface `Profile`.
2. **Editar `src/pages/AppDashboard.tsx`**: Quitar el `as any` del acceso a `profile.has_seen_tutorial` ya que el tipo ahora lo incluira.
3. **Editar `src/components/dashboard/WelcomeTutorial.tsx`**: Quitar el `as any` del update y llamar a `refreshProfile()` despues de marcar el tutorial como visto, para que el estado local se actualice correctamente.

## Problema 2: Logo en el pie de pagina se ve mal

En la captura se ve que el logo aparece con un icono generico (gota + texto "Bebloo") en lugar del logo completo. El filtro CSS `brightness-0 invert` puede no estar funcionando bien con el PNG del logo sobre el fondo oscuro.

### Solucion

1. **Editar `src/components/Footer.tsx`**: Ajustar las clases del logo, quitando `brightness-0` y dejando solo `invert` con opacidad, o bien usando `filter: brightness(0) invert(1)` de forma mas explicita. Si el logo original es oscuro sobre fondo claro, `brightness-0 invert` deberia convertirlo a blanco, pero puede que el PNG tenga transparencia o colores que lo distorsionan. Se probara con `invert brightness-200` o simplemente con opacidad para que se integre mejor.

## Seccion tecnica

### Archivos a modificar

- `src/types/baby.ts` (linea 26): agregar `has_seen_tutorial: boolean;`
- `src/pages/AppDashboard.tsx` (linea 31): cambiar `(profile as any).has_seen_tutorial` por `profile.has_seen_tutorial`
- `src/components/dashboard/WelcomeTutorial.tsx` (linea 45): quitar `as any` del update, y pasar `refreshProfile` como prop para refrescar el perfil tras guardar
- `src/components/Footer.tsx` (linea 12): ajustar las clases CSS del logo para que se vea limpio sobre fondo oscuro

