import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPlanById } from "@/data/planEquipment";
import { useAnalytics } from "@/hooks/useAnalytics";
import EquipmentSection from "@/components/plan/EquipmentSection";
import ContactSection from "@/components/plan/ContactSection";

const PlanDetail = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const { track } = useAnalytics();

  const [selections, setSelections] = useState<Record<string, boolean>>({});
  const [showContact, setShowContact] = useState(false);

  const plan = getPlanById(planId || "");

  useEffect(() => {
    if (plan) {
      track("plan_detail_view", { plan: plan.name });
      setSelections({});
      setShowContact(false);
    }
  }, [plan, track]);

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

  const handleContinue = () => setShowContact(true);

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
          <Button variant="ghost" size="icon" onClick={() => navigate("/#precios")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="font-serif font-semibold text-foreground">{plan.name}</span>
        </div>
      </div>

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

        {/* Step 1: Equipment */}
        <EquipmentSection
          plan={plan}
          selections={selections}
          onToggle={handleToggle}
          onContinue={handleContinue}
        />

        {/* Step 2: Contact (revealed after continue or always visible via scroll) */}
        {showContact && (
          <ContactSection plan={plan} selectedItems={selectedItems} />
        )}
      </div>
    </div>
  );
};

export default PlanDetail;
