import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import type { Situation } from "@/types/baby";

interface StageCardProps {
  stage: string | null;
  stageName: string | null;
  stageProgress: number;
  daysInStage: number;
  totalDaysInStage: number;
  situation: Situation | null;
}

export function StageCard({
  stage,
  stageName,
  stageProgress,
  daysInStage,
  totalDaysInStage,
  situation,
}: StageCardProps) {
  const navigate = useNavigate();
  if (!stage || !stageName) {
    return null;
  }

  const showProgress = situation === "born" && stage !== "12m+";
  const stageLabel = stage === "prenatal" ? "Preparándote" : stage === "12m+" ? "+12 meses" : stage;

  return (
    <Card>
      <CardContent className="py-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-accent/50">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                Etapa actual
              </p>
              <p className="text-2xl font-display font-medium text-foreground">
                {stageLabel}
              </p>
              <p className="text-sm text-primary font-medium mt-0.5">
                "{stageName}"
              </p>
            </div>

            {showProgress && (
              <div className="space-y-2">
                <Progress value={stageProgress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Día {daysInStage} de {totalDaysInStage}
                </p>
              </div>
            )}

            <Button variant="outline" size="sm" className="w-full" onClick={() => navigate("/#precios")}>
              Ver pack recomendado
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
