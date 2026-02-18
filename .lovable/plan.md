

# Soporte para Multiples Hijos (hasta 5)

## Resumen
Permitir que cada usuario registre hasta 5 hijos en su perfil. El dashboard mostrara la informacion del hijo "activo" (seleccionable), y la pagina de Settings permitira agregar, editar y eliminar hijos.

## Que vera el usuario
- En **Settings**: una seccion "Mis hijos" con tarjetas por cada hijo registrado, un boton "+ Agregar hijo" (hasta 5 max), y la posibilidad de editar o eliminar cada uno
- En el **Dashboard**: si tiene mas de un hijo, un selector para cambiar entre ellos; las tarjetas de edad y etapa reflejan al hijo activo
- En el **Onboarding**: sin cambios visibles; al completar, se crea automaticamente el primer hijo en la nueva tabla

## Impacto en la app

Estos son los archivos y componentes que se veran afectados:

- `profiles` table: se mantiene pero los campos `baby_due_date`, `baby_birth_date`, `parent_situation`, `is_first_child` dejaran de usarse (se migrara a la tabla nueva)
- `useBabyStage`: recibira un objeto `Child` en vez de `Profile`
- `AppDashboard`: mostrara selector de hijo activo si hay mas de uno
- `OnboardingFlow`: creara un registro en la tabla `children` en vez de actualizar `profiles`
- `Settings`: seccion nueva para gestionar hijos

## Cambios tecnicos

### 1. Nueva tabla: `children`

```text
children
---------
id            uuid (PK, default gen_random_uuid())
user_id       uuid (NOT NULL, references auth.users indirectly)
name          text (nullable, nombre del bebe)
situation     text NOT NULL ('expecting' | 'born')
due_date      date (nullable)
birth_date    date (nullable)
is_active     boolean (default false)
created_at    timestamptz (default now())
updated_at    timestamptz (default now())
```

- RLS: usuarios solo pueden CRUD sus propios hijos
- Trigger de validacion: maximo 5 hijos por usuario
- Trigger `handle_updated_at` para actualizar `updated_at`

### 2. Migracion de datos existentes
- SQL que copia los datos de `profiles` (baby_due_date, baby_birth_date, parent_situation) a un registro en `children` para usuarios que ya tienen datos
- El hijo migrado se marca como `is_active = true`

### 3. Nuevo tipo `Child` en `src/types/baby.ts`
```text
interface Child {
  id: string
  user_id: string
  name: string | null
  situation: 'expecting' | 'born'
  due_date: string | null
  birth_date: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}
```

### 4. Nuevo hook: `src/hooks/useChildren.ts`
- Fetch de todos los hijos del usuario
- CRUD operations (crear, actualizar, eliminar hijo)
- Cambiar hijo activo (desactivar todos, activar el seleccionado)
- Validacion client-side del limite de 5

### 5. Modificar `src/hooks/useBabyStage.ts`
- Cambiar la firma para recibir un `Child` en vez de `Profile`
- Adaptar los campos: `child.birth_date`, `child.due_date`, `child.situation`
- Eliminar referencia a `is_first_child` (campo del perfil)

### 6. Modificar `src/pages/Settings.tsx`
- Eliminar los campos de situacion/fecha/primer hijo del formulario actual
- Agregar seccion "Mis hijos" con:
  - Lista de tarjetas con nombre, situacion, fecha de cada hijo
  - Boton de editar (abre dialog con formulario)
  - Boton de eliminar (con confirmacion)
  - Boton "+ Agregar hijo" (deshabilitado si ya hay 5)
  - Indicador visual del hijo activo (estrella o badge)

### 7. Nuevo componente: `src/components/settings/ChildCard.tsx`
- Tarjeta que muestra nombre, situacion, fecha
- Botones de editar, eliminar, marcar como activo

### 8. Nuevo componente: `src/components/settings/ChildFormDialog.tsx`
- Dialog reutilizable para agregar/editar un hijo
- Campos: nombre (opcional), situacion (esperando/nacido), fecha, selector de calendario
- Reutiliza el mismo patron de Popover+Calendar del Settings actual

### 9. Modificar `src/pages/AppDashboard.tsx`
- Obtener hijos del hook `useChildren`
- Encontrar el hijo activo
- Pasar el hijo activo a `useBabyStage` en vez de `profile`
- Si hay mas de 1 hijo: mostrar selector (tabs o dropdown) para cambiar el hijo activo
- Pasar `null` para `isFirstChild` en `EmotionalTip` (o eliminarlo)

### 10. Modificar `src/components/onboarding/OnboardingFlow.tsx`
- Al completar, en vez de actualizar `profiles` con los campos del bebe, insertar un registro en `children` con `is_active = true`
- Seguir marcando `onboarding_completed = true` en `profiles`

### 11. Componentes del dashboard afectados
- `BabyAgeCard`: sin cambios (ya recibe props, no profile directo)
- `StageCard`: sin cambios
- `EmotionalTip`: revisar prop `isFirstChild` - podria eliminarse o basarse en cantidad de hijos en la tabla

### 12. Campo `is_first_child` en profiles
- Se mantiene en la tabla por retrocompatibilidad pero deja de usarse activamente
- No se elimina la columna para evitar romper queries existentes

## Orden de implementacion
1. Crear tabla `children` con RLS y triggers
2. Migrar datos existentes de `profiles` a `children`
3. Crear tipo `Child` y hook `useChildren`
4. Adaptar `useBabyStage` para recibir `Child`
5. Crear componentes de Settings (ChildCard, ChildFormDialog)
6. Actualizar Settings page
7. Actualizar Dashboard (selector de hijo + hijo activo)
8. Actualizar OnboardingFlow

## Riesgos y consideraciones
- Usuarios existentes: la migracion SQL debe copiar sus datos correctamente
- Si un usuario no tiene hijo activo, el dashboard debe manejar el caso gracefully
- El limite de 5 hijos se valida tanto en frontend (boton deshabilitado) como en backend (trigger SQL)
- Las suscripciones y envios actualmente no estan vinculados a un hijo especifico; eso se puede hacer en una fase posterior

