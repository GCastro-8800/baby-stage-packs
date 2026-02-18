

# Pagina de Configuracion (Settings)

## Resumen
Crear una pagina `/app/settings` donde el usuario pueda ver y editar su perfil. El boton de engranaje del dashboard navegara a esta nueva pagina.

## Que vera el usuario
- Al pulsar el icono de engranaje en el dashboard, se abre una pagina de configuracion
- Formulario con campos editables: nombre completo, situacion del bebe, fecha, primer hijo
- Boton "Guardar cambios" que actualiza el perfil en la base de datos
- Boton "Volver al inicio" para regresar al dashboard
- Misma cabecera que el dashboard (logo + cerrar sesion)

## Cambios tecnicos

### 1. Nueva pagina: `src/pages/Settings.tsx`
- Ruta protegida en `/app/settings`
- Formulario con los campos del perfil:
  - **Nombre completo** (input de texto)
  - **Situacion** (dos botones: "Estoy esperando" / "Ya nacio")
  - **Fecha** (datepicker con Popover+Calendar, igual que en onboarding; cambia entre fecha esperada y nacimiento segun situacion)
  - **Primer hijo** (switch si/no)
- Al cargar, inicializa los campos desde `profile` del hook `useAuth`
- Al guardar, actualiza la tabla `profiles` via Supabase y llama a `refreshProfile()`
- Toast de confirmacion al guardar exitosamente
- Boton "Volver al inicio" con flecha para navegar a `/app`

### 2. Modificar `src/pages/AppDashboard.tsx`
- Linea 43: cambiar `onClick={() => {}}` por `onClick={() => navigate("/app/settings")}`

### 3. Modificar `src/App.tsx`
- Importar Settings
- Agregar ruta `/app/settings` envuelta en `ProtectedRoute`

### 4. Sin cambios en base de datos
- La tabla `profiles` ya tiene todos los campos necesarios
- Las politicas RLS existentes ya permiten al usuario actualizar su propio perfil

