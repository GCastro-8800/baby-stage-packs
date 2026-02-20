import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Stage } from "@/types/baby";

interface EmotionalTipProps {
  stage: Stage | null;
  isFirstChild: boolean | null | undefined;
}

const TIPS: Record<Stage, { firstTime: string[]; experienced: string[] }> = {
  prenatal: {
    firstTime: [
      "Es normal tener mil preguntas. Estamos aquí para ayudarte.",
      "No necesitas tenerlo todo claro. Solo necesitas empezar.",
      "Cada día que pasa, tu bebé y tú os preparáis juntos.",
    ],
    experienced: [
      "Ya conoces el camino, pero cada bebé es único.",
      "Esta vez sabes que lo importante es disfrutar el proceso.",
      "Tu experiencia es tu mejor aliada. Confía en ella.",
    ],
  },
  "0-3m": {
    firstTime: [
      "Los primeros días son intensos. Descansa cuando puedas.",
      "No hay manual perfecto. Tú ya eres lo que tu bebé necesita.",
      "Cada día aprendes algo nuevo. Y tu bebé también.",
    ],
    experienced: [
      "Ya sabes que esta etapa pasa rápido. Disfrútala.",
      "Con experiencia, los miedos se convierten en confianza.",
      "Cada hijo trae su propia magia. Déjate sorprender.",
    ],
  },
  "3-6m": {
    firstTime: [
      "Tu bebé empieza a descubrir el mundo. Y tú a conocerlo.",
      "Las primeras risas son el mejor regalo. Van a llegar.",
      "Estás encontrando tu ritmo. Y lo estás haciendo genial.",
    ],
    experienced: [
      "Cada hijo es diferente. Disfruta las sorpresas.",
      "Ya sabes: esta etapa tiene más risas que noches sin dormir.",
      "Tu tranquilidad se la transmites. Eso vale oro.",
    ],
  },
  "6-9m": {
    firstTime: [
      "La curiosidad de tu bebé crece cada día. Acompáñalo.",
      "Empezará a moverse más. Tu casa se convierte en su mundo.",
      "Cada logro suyo es también un logro tuyo.",
    ],
    experienced: [
      "Esta etapa es mágica. Cada momento cuenta.",
      "Ya sabes que gatear es una aventura. Disfruta verlo explorar.",
      "Tu calma le da seguridad para atreverse a más.",
    ],
  },
  "9-12m": {
    firstTime: [
      "Pronto dará sus primeros pasos. Tú ya has dado muchos.",
      "Su personalidad brilla cada vez más. Conócelo sin prisa.",
      "El primer año casi termina. Lo has hecho increíble.",
    ],
    experienced: [
      "El primer año vuela. Saborea cada logro.",
      "Sabes que los primeros pasos llegan cuando menos los esperas.",
      "Otro pequeño a punto de caminar. La casa se llena de vida.",
    ],
  },
  "12m+": {
    firstTime: [
      "Ya no es un bebé pequeño. Lo estás haciendo increíble.",
      "Camina, habla, explora. Y tú le has dado las raíces.",
      "Mírate: un año entero siendo su mundo. Enhorabuena.",
    ],
    experienced: [
      "Otro aventurero en casa. La diversión continúa.",
      "Cada hijo te enseña algo nuevo. Este no será la excepción.",
      "La experiencia se nota. Tu familia crece con confianza.",
    ],
  },
};

function getDayIndex(): number {
  return new Date().getDay(); // 0-6
}

export function EmotionalTip({ stage, isFirstChild }: EmotionalTipProps) {
  if (!stage) return null;

  const tipSet = TIPS[stage];
  const pool = isFirstChild === false ? tipSet.experienced : tipSet.firstTime;
  const tip = pool[getDayIndex() % pool.length];

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
