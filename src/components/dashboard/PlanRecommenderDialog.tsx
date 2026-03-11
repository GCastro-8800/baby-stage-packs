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
import { openExternal } from "@/lib/openExternal";

interface PlanRecommenderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QUESTIONS = [
  {
    title: "¿Qué te preocupa MÁS ahora mismo sobre el equipamiento del bebé?",
    options: [
      "No sé qué necesito en cada momento",
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

// Scoring to determine if the user is anxious (needs human contact first)
// [ignored, ignored, ignored, isAnxious]
const SCORING_ANXIOUS: boolean[][] = [
  [false, false, true, false],
  [false, false, false, false],
  [false, false, false, false],
  [false, false, false],
];

function calculateIsAnxious(answers: number[]): boolean {
  return answers.some((answerIdx, questionIdx) => SCORING_ANXIOUS[questionIdx]?.[answerIdx]);
}

const RESULT_COPY = {
  practical: {
    title: "Tu selección personalizada te espera",
    description:
      "Según tus respuestas, lo que más valoras es simplicidad y ahorro de espacio. En nuestro configurador puedes elegir exactamente lo que necesitas, con la duración que mejor te venga para cada producto.",
  },
  anxious: {
    title: "Te recomendamos hablar con una asesora",
    description:
      "Según tus respuestas, la seguridad y la tranquilidad son lo más importante para ti. Una asesora de bebloo puede ayudarte a elegir exactamente lo que necesitas, sin presión.",
  },
};

function buildCalendlyUrl(isAnxious: boolean, name?: string, email?: string) {
  const base = "https://calendly.com/martincabanaspaola/30min";
  const params = new URLSearchParams();
  if (name) params.set("name", name);
  if (email) params.set("email", email);
  params.set("a1", `Lead desde Quiz - Alta ansiedad: ${isAnxious ? "Sí" : "No"}`);
  return `${base}?${params.toString()}`;
}

export function PlanRecommenderDialog({ open, onOpenChange }: PlanRecommenderDialogProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const totalSteps = QUESTIONS.length;
  const isResult = step >= totalSteps;

  const handleNext = () => {
    if (currentAnswer === "") return;
    const newAnswers = [...answers, parseInt(currentAnswer)];
    setAnswers(newAnswers);
    setCurrentAnswer("");
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step === 0) return;
    setAnswers(answers.slice(0, -1));
    setCurrentAnswer("");
    setStep(step - 1);
  };

  const handleReset = () => {
    setStep(0);
    setAnswers([]);
    setCurrentAnswer("");
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) handleReset();
    onOpenChange(val);
  };

  const isAnxious = isResult ? calculateIsAnxious(answers) : false;
  const resultCopy = isAnxious ? RESULT_COPY.anxious : RESULT_COPY.practical;

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
                disabled={currentAnswer === ""}
              >
                {step < totalSteps - 1 ? "Siguiente" : "Ver resultado"}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogDescription className="text-xs font-medium text-primary">
                Tu recomendación
              </DialogDescription>
              <DialogTitle className="text-2xl font-display">
                {resultCopy.title}
              </DialogTitle>
            </DialogHeader>

            <p className="text-sm text-muted-foreground leading-relaxed">{resultCopy.description}</p>

            <div className="flex flex-col gap-2 mt-4">
              {isAnxious ? (
                <>
                  <Button onClick={() => openExternal(buildCalendlyUrl(isAnxious, userName, userEmail))}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Hablar con una asesora
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleOpenChange(false);
                      navigate("/configurador");
                    }}
                  >
                    Descubre qué necesitas
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      handleOpenChange(false);
                      navigate("/configurador");
                    }}
                  >
                    Descubre qué necesitas
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                  <Button variant="outline" onClick={() => openExternal(buildCalendlyUrl(isAnxious, userName, userEmail))}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Prefiero hablar con una asesora primero
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
