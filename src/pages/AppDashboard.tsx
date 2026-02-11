import { useNavigate } from "react-router-dom";
import { LogOut, Settings, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useBabyStage } from "@/hooks/useBabyStage";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { BabyAgeCard } from "@/components/dashboard/BabyAgeCard";
import { StageCard } from "@/components/dashboard/StageCard";
import { EmotionalTip } from "@/components/dashboard/EmotionalTip";
import logo from "@/assets/logo-bebloo.png";
import { openExternal } from "@/lib/openExternal";

export default function AppDashboard() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const babyStage = useBabyStage(profile);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
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
          <WelcomeHeader
            fullName={profile?.full_name}
            email={user?.email}
            avatarUrl={profile?.avatar_url}
          />

          {/* Cards grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Baby age card - shows countdown or age */}
            <BabyAgeCard
              situation={babyStage.situation}
              ageText={babyStage.ageText}
              birthDateFormatted={babyStage.birthDateFormatted}
              daysUntilBirth={babyStage.daysUntilBirth}
              dueDateFormatted={babyStage.dueDateFormatted}
            />

            {/* Stage card - shows current stage and progress */}
            <StageCard
              stage={babyStage.stage}
              stageName={babyStage.stageName}
              stageProgress={babyStage.stageProgress}
              daysInStage={babyStage.daysInStage}
              totalDaysInStage={babyStage.totalDaysInStage}
              situation={babyStage.situation}
            />
          </div>

          {/* Emotional tip */}
          <EmotionalTip
            stage={babyStage.stage}
            isFirstChild={babyStage.isFirstChild}
          />

          {/* Subscription card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-primary" />
                Tu suscripción
              </CardTitle>
              <CardDescription>Estado de tu plan</CardDescription>
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
                <Button variant="outline" onClick={() => openExternal(`https://wa.me/34638706467?text=${encodeURIComponent("Hola, necesito ayuda con mi cuenta en bebloo.")}`)}>Contactar soporte</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
