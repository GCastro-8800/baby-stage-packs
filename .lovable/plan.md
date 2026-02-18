
# Pagina de Configuracion (Settings)

## Resumen
Crear una pagina `/app/settings` donde el usuario pueda ver y editar su perfil: nombre, situacion (esperando/nacido), fecha del bebe, y si es su primer hijo. El boton de Settings del dashboard navegara a esta nueva pagina.

## Que vera el usuario
- Al pulsar el icono de engranaje en el dashboard, se abre una pagina de configuracion
- Formulario con campos editables: nombre completo, situacion del bebe, fecha (nacimiento o fecha esperada), primer hijo
- Boton "Guardar cambios" que actualiza el perfil en la base de datos
- Boton para volver al dashboard
- Misma cabecera que el dashboard (logo + cerrar sesion)

## Cambios tecnicos

### 1. Nueva pagina: `src/pages/Settings.tsx`
- Ruta protegida en `/app/settings`
- Formulario con los campos del perfil:
  - **Nombre completo** (input de texto)
  - **Situacion** (selector: "Estoy esperando" / "Ya nacio")
  - **Fecha** (calendario, cambia entre fecha esperada y fecha de nacimiento segun la situacion)
  - **Primer hijo** (switch si/no)
- Al guardar, actualiza la tabla `profiles` via Supabase y llama a `refreshProfile()` del hook `useAuth`
- Toast de confirmacion al guardar exitosamente

### 2. Modificar `src/pages/AppDashboard.tsx`
- Cambiar el `onClick={() => {}}` del boton Settings por `onClick={() => navigate("/app/settings")}`

### 3. Modificar `src/App.tsx`
- Agregar ruta `/app/settings` envuelta en `ProtectedRoute`
- Importar el nuevo componente Settings

### 4. Sin cambios en base de datos
- La tabla `profiles` ya tiene todos los campos necesarios (full_name, parent_situation, baby_due_date, baby_birth_date, is_first_child)
- Las politicas RLS existentes ya permiten al usuario actualizar su propio perfil
