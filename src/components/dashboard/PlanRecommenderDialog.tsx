import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, ChevronRight, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

type Plan = "start" | "comfort" | "total-peace";

interface PlanRecommenderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QUESTIONS = [
  {
    title: "¿Qué te preocupa MÁS ahora mismo sobre el equipamiento del bebé?",
    options: [
      "No sé qué necesito en cada etapa",
      "Me agobia tener objetos acumulados en casa",
      "Me da miedo equivocarme con algo importante (seguridad)",
      "No tengo tiempo para investigar, comparar y decidir",
    ],
  },
  {
    title: "¿Cómo te sientes con la idea de comprar todo nuevo?",
    options: [
      "Me estresa el gasto inicial de golpe",
      "Me da pena que se quede obsoleto en meses",
      "No me importa el dinero, pero SÍ el espacio",
      "Prefiero no tener objetos de segunda mano, pero odio gestionar la reventa",
    ],
  },
  {
    title: "Si pudieras delegar UNA SOLA COSA del primer año, ¿cuál sería?",
    options: [
      "Elegir qué comprar (curación experta)",
      "Limpiar/desinfectar el equipamiento usado",
      "Gestionar los cambios cuando el bebé crece",
      "Deshacerme de lo que ya no uso sin venderlo yo misma",
    ],
  },
  {
    title: "¿Cuánto espacio de almacenaje tienes disponible para equipamiento bebé?",
    options: [
      "Menos de 2m² (piso pequeño)",
      "2-4m² (habitación dedicada pero limitada)",
      "Más de 4m² (trastero, garaje, casa grande)",
    ],
  },
];

// Points: [start, comfort, totalPeace, isAnxious]
type ScoreEntry = [number, number, number, boolean];

const SCORING: ScoreEntry[][] = [
  // P1
  [[2, 0, 0, false], [0, 2, 0, false], [0, 0, 2, true], [0, 1, 1, false]],
  // P2
  [[2, 0, 0, false], [0, 2, 0, false], [0, 1, 1, false], [0, 1, 1, false]],
  // P3
  [[1, 1, 0, false], [0, 2, 0, false], [0, 1, 1, false], [0, 0, 2, false]],
  // P4
  [[0, 0, 2, false], [0, 1, 0, false], [1, 0, 0, false]],
];

const PLAN_DATA: Record<Plan, { name: string; price: string; copy: string; slug: string }> = {
  start: {
    name: "BEBLOO Start",
    price: "59 €/mes",
    copy: "Quieres probar sin comprometerte. Start te da lo esencial durante 3 meses para que veas si Bebloo encaja en tu día a día. Sin permanencia, sin estrés.",
    slug: "start",
  },
  comfort: {
    name: "BEBLOO Comfort",
    price: "129 €/mes",
    copy: "Buscas tranquilidad sin pensar. Comfort te entrega todo lo que necesitas en cada etapa, lo cambia automáticamente y lo recoge cuando ya no sirve. Sin decisiones, sin espacio perdido.",
    slug: "comfort",
  },
  "total-peace": {
    name: "BEBLOO Total Peace",
    price: "149 €/mes",
    copy: "Necesitas delegación absoluta. Total Peace incluye asesoría personalizada, cambios proactivos (nosotros anticipamos qué necesitas) y atención prioritaria. Es tu equipo de logística invisible.",
    slug: "total-peace",
  },
};

function calculateResult(answers: number[]): { plan: Plan; isAnxious: boolean } {
  let start = 0, comfort = 0, totalPeace = 0, isAnxious = false;

  answers.forEach((answerIdx, questionIdx) => {
    const entry = SCORING[questionIdx][answerIdx];
    if (!entry) return;
    start += entry[0];
    comfort += entry[1];
    totalPeace += entry[2];
    if (entry[3]) isAnxious = true;
  });

  let plan: Plan = "comfort"; // default on tie
  if (start > comfort && start > totalPeace) plan = "start";
  else if (totalPeace > comfort && totalPeace > start) plan = "total-peace";
  else if (comfort >= start && comfort >= totalPeace) plan = "comfort";

  return { plan, isAnxious };
}

function buildCalendlyUrl(plan: Plan, isAnxious: boolean, name?: string, email?: string) {
  const base = "https://calendly.com/martincabanaspaola/30min";
  const params = new URLSearchParams();
  if (name) params.set("name", name);
  if (email) params.set("email", email);
  params.set("a1", `Lead desde Quiz - Perfil: ${PLAN_DATA[plan].name} - Alta ansiedad: ${isAnxious ? "Sí" : "No"}`);
  return `${base}?${params.toString()}`;
}

export function PlanRecommenderDialog({ open, onOpenChange }: PlanRecommenderDialogProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const totalSteps = QUESTIONS.length;
  const isResult = step >= totalSteps;

  const handleNext = () => {
    if (currentAnswer === undefined) return;
    const newAnswers = [...answers, parseInt(currentAnswer)];
    setAnswers(newAnswers);
    setCurrentAnswer(undefined);
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step === 0) return;
    const newAnswers = answers.slice(0, -1);
    setAnswers(newAnswers);
    setCurrentAnswer(undefined);
    setStep(step - 1);
  };

  const handleReset = () => {
    setStep(0);
    setAnswers([]);
    setCurrentAnswer(undefined);
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) handleReset();
    onOpenChange(val);
  };

  const result = isResult ? calculateResult(answers) : null;
  const planData = result ? PLAN_DATA[result.plan] : null;

  const userName = profile?.full_name || user?.user_metadata?.full_name || undefined;
  const userEmail = user?.email || undefined;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        {!isResult ? (
          <>
            <DialogHeader>
              <DialogDescription className="text-xs font-medium text-muted-foreground">
                Pregunta {step + 1} de {totalSteps}
              </DialogDescription>
              <DialogTitle className="text-lg font-display leading-tight">
                {QUESTIONS[step].title}
              </DialogTitle>
            </DialogHeader>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
              />
            </div>

            <RadioGroup
              value={currentAnswer}
              onValueChange={setCurrentAnswer}
              className="space-y-3 mt-2"
            >
              {QUESTIONS[step].options.map((option, idx) => (
                <Label
                  key={idx}
                  htmlFor={`option-${idx}`}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    currentAnswer === String(idx)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <RadioGroupItem value={String(idx)} id={`option-${idx}`} className="mt-0.5" />
                  <span className="text-sm leading-snug">{option}</span>
                </Label>
              ))}
            </RadioGroup>

            <div className="flex gap-2 mt-4">
              {step > 0 && (
                <Button variant="ghost" size="sm" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Atrás
                </Button>
              )}
              <Button
                className="ml-auto"
                size="sm"
                onClick={handleNext}
                disabled={currentAnswer === undefined}
              >
                {step < totalSteps - 1 ? "Siguiente" : "Ver resultado"}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </>
        ) : (
          result && planData && (
            <>
              <DialogHeader>
                <DialogDescription className="text-xs font-medium text-primary">
                  Tu plan recomendado
                </DialogDescription>
                <DialogTitle className="text-2xl font-display">
                  {planData.name}
                </DialogTitle>
              </DialogHeader>

              <p className="text-xl font-semibold text-primary">{planData.price}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{planData.copy}</p>

              <div className="flex flex-col gap-2 mt-4">
                {result.isAnxious ? (
                  <>
                    <Button asChild>
                      <a
                        href={buildCalendlyUrl(result.plan, result.isAnxious, userName, userEmail)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Hablar 15min con Patricia
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleOpenChange(false);
                        navigate(`/plan/${planData.slug}`);
                      }}
                    >
                      Ver detalles de {planData.name}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => {
                        handleOpenChange(false);
                        navigate(`/plan/${planData.slug}`);
                      }}
                    >
                      Ver detalles de {planData.name}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                    <Button variant="outline" asChild>
                      <a
                        href={buildCalendlyUrl(result.plan, result.isAnxious, userName, userEmail)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Prefiero hablar con Patricia primero
                      </a>
                    </Button>
                  </>
                )}

                <button
                  className="text-xs text-muted-foreground underline mt-2 hover:text-foreground transition-colors"
                  onClick={() => {
                    handleOpenChange(false);
                    navigate("/#precios");
                  }}
                >
                  ¿No estás segura? Ver todos los planes
                </button>
              </div>
            </>
          )
        )}
      </DialogContent>
    </Dialog>
  );
}
