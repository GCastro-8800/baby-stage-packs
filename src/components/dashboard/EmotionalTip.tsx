import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type Stage = "prenatal" | "0-3m" | "3-6m" | "6-9m" | "9-12m" | "12m+";

interface EmotionalTipProps {
  stage: Stage | null;
  isFirstChild: boolean | null;
}

const TIPS: Record<Stage, { firstTime: string; experienced: string }> = {
  prenatal: {
    firstTime: "Es normal tener mil preguntas. Estamos aquí para ayudarte.",
    experienced: "Ya conoces el camino, pero cada bebé es único.",
  },
  "0-3m": {
    firstTime: "Los primeros días son intensos. Descansa cuando puedas.",
    experienced: "Ya sabes que esta etapa pasa rápido. Disfrútala.",
  },
  "3-6m": {
    firstTime: "Tu bebé empieza a descubrir el mundo. Y tú a conocerlo.",
    experienced: "Cada hijo es diferente. Disfruta las sorpresas.",
  },
  "6-9m": {
    firstTime: "La curiosidad de tu bebé crece cada día. Acompáñalo.",
    experienced: "Esta etapa es mágica. Cada momento cuenta.",
  },
  "9-12m": {
    firstTime: "Pronto dará sus primeros pasos. Tú ya has dado muchos.",
    experienced: "El primer año vuela. Saborea cada logro.",
  },
  "12m+": {
    firstTime: "Ya no es un bebé pequeño. Lo estás haciendo increíble.",
    experienced: "Otro aventurero en casa. La diversión continúa.",
  },
};

export function EmotionalTip({ stage, isFirstChild }: EmotionalTipProps) {
  if (!stage) return null;

  const tipSet = TIPS[stage];
  const tip = isFirstChild === false ? tipSet.experienced : tipSet.firstTime;

  return (
    <Card className="bg-gradient-to-br from-rose-50/50 to-background border-rose-100/50 dark:from-rose-950/20 dark:border-rose-900/30">
      <CardContent className="py-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-rose-100/50 dark:bg-rose-900/30">
            <Heart className="h-5 w-5 text-rose-500" />
          </div>
          <div className="flex-1">
            <p className="text-foreground font-medium leading-relaxed italic">
              "{tip}"
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
