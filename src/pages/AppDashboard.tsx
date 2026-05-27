import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useChildren } from "@/hooks/useChildren";
import { useBabyStage } from "@/hooks/useBabyStage";
import { useSubscription } from "@/hooks/useSubscription";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { BabyTimeline } from "@/components/dashboard/BabyTimeline";
import { CurrentKitSection } from "@/components/dashboard/CurrentKitSection";
import { PaolaWidget } from "@/components/dashboard/PaolaWidget";
import { EmotionalTip } from "@/components/dashboard/EmotionalTip";
import { WeeklyRecommendation } from "@/components/dashboard/WeeklyRecommendation";
import { SubscriptionCard } from "@/components/dashboard/SubscriptionCard";
import { ShipmentCard } from "@/components/dashboard/ShipmentCard";
import { WelcomeTutorial } from "@/components/dashboard/WelcomeTutorial";
import { PhoneCaptureBanner } from "@/components/dashboard/PhoneCaptureBanner";
import logo from "@/assets/logo-bebloo.png";

export default function AppDashboard() {
  const navigate = useNavigate();
  const { user, profile, signOut, refreshProfile } = useAuth();
  const { children, activeChild, setActiveChild } = useChildren();
  const babyStage = useBabyStage(activeChild);
  const { subscription, nextShipment, lastDelivered, feedback, submitFeedback } = useSubscription();
  const [tutorialDismissed, setTutorialDismissed] = useState(false);
  const showTutorial = !!user && !!profile && !profile.has_seen_tutorial && !tutorialDismissed;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleFeedback = (shipmentId: string) => (itemKey: string, rating: "useful" | "not_useful") => {
    submitFeedback.mutate({ shipmentId, itemKey, rating });
  };

  return (
    <div className="min-h-screen bg-background">
      {showTutorial && (
        <WelcomeTutorial
          open={showTutorial}
          userId={user!.id}
          onComplete={() => { setTutorialDismissed(true); refreshProfile(); }}
        />
      )}

      {/* Header editorial */}
      <header className="border-b border-foreground/10 bg-background/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-5xl px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <a href="/" className="flex-shrink-0" aria-label="Volver al inicio">
              <img src={logo} alt="bebloo" className="h-10 md:h-12" />
            </a>
            <nav className="flex items-center gap-6">
              <button
                onClick={() => navigate("/quienes-somos")}
                className="hidden md:inline text-sm text-foreground/70 hover:text-foreground transition-colors"
              >
                Sobre nosotras
              </button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/app/settings")}
                aria-label="Ajustes"
              >
                <Settings className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                aria-label="Cerrar sesión"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container max-w-5xl px-4 md:px-6 pb-16 md:pb-24">
        {/* Zona 1 — Saludo + Momento actual */}
        <WelcomeHeader
          fullName={profile?.full_name}
          email={user?.email}
          avatarUrl={profile?.avatar_url}
          situation={babyStage.situation}
          ageText={babyStage.ageText}
          daysUntilBirth={babyStage.daysUntilBirth}
          stage={babyStage.stage}
        />

        {/* Selector de hijo (si hay >1) */}
        {children.length > 1 && (
          <div className="flex items-center gap-3 pb-6 border-b border-foreground/10">
            <span className="text-[10px] tracking-[0.14em] uppercase text-muted-foreground">
              Viendo a
            </span>
            <Select
              value={activeChild?.id ?? ""}
              onValueChange={(id) => setActiveChild.mutate(id)}
            >
              <SelectTrigger className="w-[200px] border-none shadow-none bg-transparent font-serif text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {children.map((child) => (
                  <SelectItem key={child.id} value={child.id}>
                    {child.name || (child.situation === "expecting" ? "En espera" : "Bebé")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Timeline del bebé */}
        <BabyTimeline currentStage={babyStage.stage} />

        {/* Banner teléfono (cálido, sutil) */}
        <PhoneCaptureBanner show={!!subscription && !profile?.phone} />

        {/* Zona 2 — Tu kit ahora */}
        <CurrentKitSection
          lastDelivered={lastDelivered}
          hasSubscription={!!subscription}
        />

        {/* Zona 3 — Próximos cambios */}
        {nextShipment && (
          <ShipmentCard
            shipment={nextShipment}
            feedback={feedback}
            onFeedback={handleFeedback(nextShipment.id)}
            isNext
          />
        )}

        {/* Servicio: estado + gestión (solo si hay servicio activo) */}
        {subscription && (
          <div className="py-8 md:py-12 border-t border-foreground/10">
            <SubscriptionCard subscription={subscription} />
          </div>
        )}

        {/* Pensamiento del día */}
        <EmotionalTip
          stage={babyStage.stage}
          isFirstChild={children.length <= 1}
        />

        {/* Esta semana te sugerimos */}
        <WeeklyRecommendation stage={babyStage.stage} />

        {/* Zona 4 — Paola permanente */}
        <div className="pt-8 md:pt-12">
          <PaolaWidget />
        </div>

        {/* Último entregado con feedback (al final, opcional) */}
        {lastDelivered && (
          <ShipmentCard
            shipment={lastDelivered}
            feedback={feedback}
            onFeedback={handleFeedback(lastDelivered.id)}
          />
        )}
      </main>
    </div>
  );
}
