import { useNavigate } from "react-router-dom";
import { LogOut, User, Calendar, Baby, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo-bebloo.png";

export default function AppDashboard() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getInitials = (name: string | null | undefined, email: string | undefined) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return email?.charAt(0).toUpperCase() || "U";
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container max-w-6xl px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <a href="/" className="flex-shrink-0">
              <img src={logo} alt="bebloo" className="h-10 md:h-12" />
            </a>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => {}}>
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="outline" onClick={handleSignOut} className="gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Cerrar sesión</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container max-w-6xl px-4 md:px-6 py-8 md:py-12">
        <div className="space-y-8">
          {/* Welcome section */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                {getInitials(profile?.full_name, user?.email)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-medium text-foreground">
                Hola, {profile?.full_name?.split(" ")[0] || "bienvenido/a"}
              </h1>
              <p className="text-muted-foreground">
                Todo está bajo control. Aquí tienes tu resumen.
              </p>
            </div>
          </div>

          {/* Cards grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Profile card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-primary" />
                  Tu perfil
                </CardTitle>
                <CardDescription>
                  Información de tu cuenta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Nombre</p>
                  <p className="font-medium">{profile?.full_name || "Sin especificar"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </CardContent>
            </Card>

            {/* Baby info card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Baby className="h-5 w-5 text-primary" />
                  Tu bebé
                </CardTitle>
                <CardDescription>
                  Información de la etapa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile?.baby_birth_date ? (
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha de nacimiento</p>
                    <p className="font-medium">{formatDate(profile.baby_birth_date)}</p>
                  </div>
                ) : profile?.baby_due_date ? (
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha estimada</p>
                    <p className="font-medium">{formatDate(profile.baby_due_date)}</p>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Aún no has configurado la información de tu bebé.
                  </p>
                )}
                <Button variant="outline" size="sm" className="w-full mt-2">
                  Actualizar información
                </Button>
              </CardContent>
            </Card>

            {/* Subscription card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                  Tu suscripción
                </CardTitle>
                <CardDescription>
                  Estado de tu plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-6">
                  <div className="text-center">
                    <p className="text-muted-foreground text-sm mb-3">
                      Aún no tienes una suscripción activa
                    </p>
                    <Button size="sm" onClick={() => navigate("/#precios")}>
                      Ver planes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Help section */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="py-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-display font-medium text-lg">¿Necesitas ayuda?</h3>
                  <p className="text-muted-foreground text-sm">
                    Estamos aquí para acompañarte en cada paso.
                  </p>
                </div>
                <Button variant="outline">Contactar soporte</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
