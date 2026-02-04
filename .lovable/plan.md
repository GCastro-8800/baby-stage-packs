
## Sistema de Autenticación para bebloo

Implementaremos un sistema de autenticación completo con email/contraseña y Google OAuth, incluyendo perfiles de usuario para almacenar datos relevantes del usuario.

---

## Estructura de la implementación

```text
┌────────────────────────────────────────────────────────────────────────┐
│                         SISTEMA DE AUTENTICACIÓN                       │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   Páginas                                                              │
│   ├── /auth ─────────────── Login y Registro (unificada)              │
│   └── /app ──────────────── Área protegida (usuario logueado)         │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   Componentes                                                          │
│   ├── AuthContext ────────── Estado global de autenticación           │
│   ├── ProtectedRoute ─────── Protección de rutas                      │
│   └── AuthPage ───────────── Formularios de login/signup              │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   Base de datos                                                        │
│   ├── profiles ───────────── Datos adicionales del usuario            │
│   └── user_roles ─────────── Roles (user, admin)                      │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Base de datos

### Tabla: `profiles`
Almacena datos adicionales del usuario.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid (PK) | Referencia a auth.users |
| full_name | text | Nombre completo |
| baby_due_date | date | Fecha estimada de nacimiento del bebé |
| baby_birth_date | date | Fecha de nacimiento (si ya nació) |
| avatar_url | text | URL del avatar (opcional) |
| created_at | timestamptz | Fecha de creación |
| updated_at | timestamptz | Fecha de actualización |

### Tabla: `user_roles`
Almacena los roles de usuario de forma segura (separada de profiles).

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid (PK) | ID único |
| user_id | uuid | Referencia a auth.users |
| role | app_role | Enum: user, admin |

### Enum: `app_role`
- `user` - Usuario estándar (padres)
- `admin` - Administrador interno

### Función de seguridad: `has_role`
Función `SECURITY DEFINER` para verificar roles sin recursión en RLS.

---

## Archivos a crear

### 1. Hook de autenticación
`src/hooks/useAuth.tsx`
- Contexto global con estado de sesión y usuario
- Funciones: signIn, signUp, signOut, signInWithGoogle
- Listener de cambios de autenticación
- Redirección automática para usuarios logueados

### 2. Componente de ruta protegida
`src/components/auth/ProtectedRoute.tsx`
- Verifica si el usuario está autenticado
- Redirige a /auth si no lo está
- Muestra loading mientras verifica

### 3. Página de autenticación
`src/pages/Auth.tsx`
- Formularios de Login y Signup en pestañas
- Validación con zod
- Botón de Google OAuth
- Diseño coherente con la estética de bebloo
- Mensajes de error amigables

### 4. Página del área de usuario
`src/pages/App.tsx`
- Dashboard básico para usuarios autenticados
- Muestra información del perfil
- Botón de cerrar sesión

---

## Flujo de usuario

```text
Usuario no autenticado                    Usuario autenticado
         │                                        │
         ▼                                        ▼
    ┌─────────┐                            ┌─────────────┐
    │ Landing │────── Clic "Acceder" ─────▶│  /auth      │
    │   /     │                            │  (Login)    │
    └─────────┘                            └──────┬──────┘
                                                  │
                        ┌─────────────────────────┼─────────────────────────┐
                        │                         │                         │
                        ▼                         ▼                         ▼
                   Email/Pass              Google OAuth              Crear cuenta
                        │                         │                         │
                        └─────────────────────────┴─────────────────────────┘
                                                  │
                                                  ▼
                                           ┌───────────┐
                                           │   /app    │
                                           │ Dashboard │
                                           └───────────┘
```

---

## Seguridad

### Políticas RLS para `profiles`
- **SELECT**: Solo el usuario puede ver su propio perfil
- **INSERT**: Solo el usuario autenticado puede crear su perfil
- **UPDATE**: Solo el usuario puede actualizar su perfil
- **DELETE**: Bloqueado (los perfiles no se eliminan directamente)

### Políticas RLS para `user_roles`
- **SELECT**: Solo lectura a través de función `has_role`
- **INSERT/UPDATE/DELETE**: Bloqueado para usuarios normales

### Trigger automático
- Al crear un usuario en `auth.users`, se crea automáticamente su perfil en `profiles`
- Se asigna rol `user` por defecto

---

## Cambios en archivos existentes

| Archivo | Cambio |
|---------|--------|
| `src/App.tsx` | Añadir rutas `/auth` y `/app`, envolver con AuthProvider |
| `src/components/Header.tsx` | Añadir botón "Acceder" que lleva a /auth |

---

## Diseño visual

La página de autenticación seguirá la estética de bebloo:
- Colores suaves (azul claro #A7D9FF)
- Tipografía: Fraunces para títulos, DM Sans para texto
- Sin urgencia, mensaje acogedor
- Diseño limpio con mucho espacio en blanco

---

## Detalles técnicos

### Migración SQL
```sql
-- Enum para roles
CREATE TYPE public.app_role AS ENUM ('user', 'admin');

-- Tabla de perfiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  baby_due_date DATE,
  baby_birth_date DATE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla de roles (separada para seguridad)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

-- Función SECURITY DEFINER para verificar roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Trigger para crear perfil automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS para profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- RLS para user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
```

### Estructura de componentes

```tsx
// useAuth.tsx - Patrón de contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Setup listener PRIMERO
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // 2. Verificar sesión existente DESPUÉS
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ... funciones signIn, signUp, signOut, signInWithGoogle
}
```

