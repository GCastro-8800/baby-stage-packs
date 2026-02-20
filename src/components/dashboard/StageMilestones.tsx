import { Compass } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Stage } from "@/types/baby";

interface StageMilestonesProps {
  stage: Stage | null;
}

const MILESTONES: Record<Stage, string[]> = {
  prenatal: [
    "Tu cuerpo se está preparando para algo increíble",
    "El bebé ya responde a tu voz y a la música",
    "Es buen momento para preparar lo esencial sin agobios",
  ],
  "0-3m": [
    "Primeras sonrisas sociales: te reconoce",
    "Empieza a seguir objetos con la mirada",
    "El contacto piel con piel es su lugar favorito",
  ],
  "3-6m": [
    "Empieza a agarrar objetos con las manos",
    "Primeras risas a carcajadas",
    "Reconoce tu voz desde lejos",
  ],
  "6-9m": [
    "Puede sentarse solo y explorar desde ahí",
    "Empieza a gatear o arrastrarse",
    "Muestra preferencia por personas conocidas",
  ],
  "9-12m": [
    "Primeros pasos o ganas de ponerse de pie",
    "Señala lo que quiere con el dedo",
    "Entiende palabras simples como 'no' y su nombre",
  ],
  "12m+": [
    "Dice sus primeras palabras con intención",
    "Camina con más seguridad cada día",
    "Imita gestos y juegos: es una esponja",
  ],
};

export function StageMilestones({ stage }: StageMilestonesProps) {
  if (!stage) return null;

  const milestones = MILESTONES[stage];

  return (
    <Card className="border-accent/30 bg-accent/5">
      <CardContent className="py-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-accent/10">
            <Compass className="h-5 w-5 text-accent-foreground" />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="font-display font-medium text-sm text-foreground mb-3">
              Qué esperar en esta etapa
            </h3>
            <ul className="space-y-2">
              {milestones.map((m, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
