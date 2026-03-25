import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "@/components/SEO";
import { ArrowLeft, ArrowRight, Baby, Home, ShieldCheck, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { StepIndicator } from "@/components/onboarding/StepIndicator";
import Header from "@/components/Header";
import { useAnalytics } from "@/hooks/useAnalytics";
import { QuestionnaireAnswers, getRecommendation, buildSituationSummary } from "@/data/recommendationEngine";
import { cn } from "@/lib/utils";

const TOTAL_STEPS = 4;

const CONCERN_OPTIONS = [
  { id: "dont-know", label: "No sé qué productos necesito" },
  { id: "no-clutter", label: "No quiero acumular cosas" },
  { id: "tight-budget", label: "Presupuesto ajustado" },
  { id: "best-quality", label: "Quiero lo mejor sin investigar" },
];

export default function Configurator() {
  const navigate = useNavigate();
  const { track } = useAnalytics();
  const [step, setStep] = useState(1);

  // Answers state
  const [dueDateType, setDueDateType] = useState<"not-born" | "already-born" | "">("");
  const [dueDateValue, setDueDateValue] = useState("");
  const [housing, setHousing] = useState("");
  const [concerns, setConcerns] = useState<string[]>([]);
  const [existingEquipment, setExistingEquipment] = useState("");

  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return dueDateType === "already-born" || (dueDateType === "not-born" && dueDateValue !== "");
      case 2:
        return housing !== "";
      case 3:
        return concerns.length > 0;
      case 4:
        return existingEquipment !== "";
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      // Build answers and navigate to selection
      const answers: QuestionnaireAnswers = {
        dueDate: dueDateType === "already-born" ? "already-born" : dueDateValue,
        housing: housing as QuestionnaireAnswers["housing"],
        concerns,
        existingEquipment: existingEquipment as QuestionnaireAnswers["existingEquipment"],
      };

      const recommended = getRecommendation(answers);
      track("cta_click", { source: "configurator", action: "configurator_complete" });

      navigate("/mi-seleccion", {
        state: { answers, recommended: recommended.map((p) => p.id) },
      });
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate(-1);
  };

  const toggleConcern = (id: string) => {
    setConcerns((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12 px-4 md:px-6">
        <div className="container max-w-lg mx-auto">
          {/* Progress */}
          <div className="mb-2">
            <p className="text-xs font-medium text-muted-foreground text-center mb-3">
              Paso {step} de {TOTAL_STEPS}
            </p>
            <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS} />
          </div>

          {/* Step content */}
          <div className="mt-8 min-h-[340px]">
            {step === 1 && (
              <StepWrapper
                icon={<Baby className="h-6 w-6 text-primary-foreground" />}
                title="¿Cuándo nace tu bebé?"
              >
                <RadioGroup
                  value={dueDateType}
                  onValueChange={(v) => setDueDateType(v as "not-born" | "already-born")}
                  className="space-y-3"
                >
                  <RadioOption value="not-born" label="Aún no ha nacido" selected={dueDateType === "not-born"} />
                  <RadioOption value="already-born" label="Ya ha nacido" selected={dueDateType === "already-born"} />
                </RadioGroup>

                {dueDateType === "not-born" && (
                  <div className="mt-4">
                    <Label htmlFor="due-date" className="text-sm text-muted-foreground mb-1 block">
                      Fecha prevista de parto
                    </Label>
                    <Input
                      id="due-date"
                      type="date"
                      value={dueDateValue}
                      onChange={(e) => setDueDateValue(e.target.value)}
                      className="max-w-xs"
                    />
                  </div>
                )}
              </StepWrapper>
            )}

            {step === 2 && (
              <StepWrapper
                icon={<Home className="h-6 w-6 text-primary-foreground" />}
                title="¿Dónde vives?"
              >
                <RadioGroup
                  value={housing}
                  onValueChange={setHousing}
                  className="space-y-3"
                >
                  <RadioOption value="small-apartment" label="Apartamento pequeño (<60 m²)" selected={housing === "small-apartment"} />
                  <RadioOption value="spacious" label="Casa o piso amplio" selected={housing === "spacious"} />
                  <RadioOption value="no-elevator" label="Edificio sin ascensor" selected={housing === "no-elevator"} />
                </RadioGroup>
              </StepWrapper>
            )}

            {step === 3 && (
              <StepWrapper
                icon={<ShieldCheck className="h-6 w-6 text-primary-foreground" />}
                title="¿Qué te preocupa más?"
                subtitle="Puedes seleccionar varias"
              >
                <div className="space-y-3">
                  {CONCERN_OPTIONS.map((option) => {
                    const checked = concerns.includes(option.id);
                    return (
                      <label
                        key={option.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                          checked
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/40"
                        )}
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggleConcern(option.id)}
                        />
                        <span className="text-sm">{option.label}</span>
                      </label>
                    );
                  })}
                </div>
              </StepWrapper>
            )}

            {step === 4 && (
              <StepWrapper
                icon={<Package className="h-6 w-6 text-primary-foreground" />}
                title="¿Ya tienes algo de equipamiento?"
              >
                <RadioGroup
                  value={existingEquipment}
                  onValueChange={setExistingEquipment}
                  className="space-y-3"
                >
                  <RadioOption value="nothing" label="Nada, empiezo de cero" selected={existingEquipment === "nothing"} />
                  <RadioOption value="some" label="Tengo algunas cosas" selected={existingEquipment === "some"} />
                  <RadioOption value="specific" label="Solo necesito productos concretos" selected={existingEquipment === "specific"} />
                </RadioGroup>
              </StepWrapper>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-3 mt-8">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Atrás
            </Button>
            <Button
              className="ml-auto cta-tension"
              size="lg"
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {step < TOTAL_STEPS ? "Siguiente" : "Ver mi recomendación"}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ── Shared sub-components ── */

function StepWrapper({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-serif text-foreground">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function RadioOption({
  value,
  label,
  selected,
}: {
  value: string;
  label: string;
  selected: boolean;
}) {
  return (
    <Label
      htmlFor={`opt-${value}`}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
        selected ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
      )}
    >
      <RadioGroupItem value={value} id={`opt-${value}`} />
      <span className="text-sm">{label}</span>
    </Label>
  );
}
