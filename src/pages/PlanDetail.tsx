import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPlanById } from "@/data/planEquipment";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useAuth } from "@/hooks/useAuth";
import EquipmentSection from "@/components/plan/EquipmentSection";
import ContactSection from "@/components/plan/ContactSection";
import CheckoutStep from "@/components/plan/CheckoutStep";

interface PlanLocationState {
  selections?: Record<string, boolean>;
  fromAuth?: boolean;
}

const PlanDetail = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { track } = useAnalytics();
  const { user } = useAuth();

  const locationState = location.state as PlanLocationState | null;

  const [selections, setSelections] = useState<Record<string, boolean>>(
    locationState?.selections || {}
  );
  const [step, setStep] = useState<1 | 2>(locationState?.fromAuth ? 2 : 1);

  const plan = getPlanById(planId || "");

  useEffect(() => {
    if (plan) {
      track("plan_detail_view", { plan: plan.name });
      if (!locationState?.fromAuth) {
        if (!locationState?.selections) {
          setSelections({});
        }
      }
    }
    if (locationState) {
      window.history.replaceState({}, "");
    }
  }, [plan]);

  const handleToggle = useCallback(
    (key: string) => {
      setSelections((prev) => {
        const next = { ...prev, [key]: !prev[key] };
        const model = key.split("::")[1];
        const category = key.split("::")[0];
        track("equipment_selection", { category, model, selected: !prev[key] });
        return next;
      });
    },
    [track],
  );

  const handleContinue = () => {
    if (!user) {
      navigate("/auth", {
        state: {
          from: location.pathname,
          selections,
        },
      });
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleBack = () => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-foreground mb-4">Plan no encontrado</h1>
          <Button variant="outline" onClick={() => navigate("/")}>
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  const selectedItems = Object.entries(selections)
    .filter(([, v]) => v)
    .map(([k]) => k);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-30">
        <div className="container max-w-5xl flex items-center gap-3 py-4 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={step === 2 ? handleBack : () => navigate("/#precios")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="font-serif font-semibold text-foreground">
            {step === 2 ? "Suscripción" : plan.name}
          </span>
          {step === 2 && (
            <span className="ml-auto text-sm text-muted-foreground">
              {plan.name} · €{plan.price}/mes
            </span>
          )}
        </div>
      </div>

      {step === 1 ? (
        <div className="container max-w-5xl px-4 py-10 md:py-16 space-y-12">
          {/* Plan header */}
          <section className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-serif text-foreground mb-3">{plan.name}</h1>
            <p className="text-muted-foreground text-base md:text-lg mb-4">{plan.description}</p>
            <div className="flex items-baseline justify-center gap-1 mb-2">
              <span className="text-4xl md:text-5xl font-serif font-bold text-foreground">€{plan.price}</span>
              <span className="text-muted-foreground">/mes</span>
            </div>
            <p className="text-sm text-muted-foreground">{plan.duration}</p>
            <div className="flex items-start justify-center gap-2 mt-4 text-sm text-muted-foreground max-w-md mx-auto">
              <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>{plan.guarantee}</span>
            </div>
          </section>

          <EquipmentSection
            plan={plan}
            selections={selections}
            onToggle={handleToggle}
            onContinue={handleContinue}
          />
        </div>
      ) : (
        <div className="container max-w-3xl px-4 py-10 md:py-16 space-y-16">
          <CheckoutStep plan={plan} selectedItems={selectedItems} />
          
          <div className="border-t border-border pt-10">
            <p className="text-center text-sm text-muted-foreground mb-6">
              ¿Prefieres hablar primero?
            </p>
            <ContactSection plan={plan} selectedItems={selectedItems} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanDetail;
