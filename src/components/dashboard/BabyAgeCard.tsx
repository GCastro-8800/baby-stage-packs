import { Baby, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Situation } from "@/types/baby";

interface BabyAgeCardProps {
  situation: Situation | null;
  // For born babies
  ageText: string | null;
  birthDateFormatted: string | null;
  // For expecting parents
  daysUntilBirth: number | null;
  dueDateFormatted: string | null;
}

export function BabyAgeCard({
  situation,
  ageText,
  birthDateFormatted,
  daysUntilBirth,
  dueDateFormatted,
}: BabyAgeCardProps) {
  if (!situation) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground text-sm">
            No hay información de tu bebé configurada.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (situation === "expecting") {
    return (
      <Card className="bg-gradient-to-br from-secondary/50 to-background border-secondary/30">
        <CardContent className="py-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-secondary/50">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Faltan</p>
              <p className="text-3xl font-display font-medium text-foreground">
                {daysUntilBirth} {daysUntilBirth === 1 ? "día" : "días"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                para conocer a tu bebé
              </p>
              <div className="mt-4 pt-4 border-t border-border/50">
                <p className="text-xs text-muted-foreground">Fecha estimada</p>
                <p className="text-sm font-medium text-foreground capitalize">
                  {dueDateFormatted}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-background border-primary/20">
      <CardContent className="py-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Baby className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">Tu bebé tiene</p>
            <p className="text-3xl font-display font-medium text-foreground">
              {ageText}
            </p>
            <div className="mt-4 pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground">Nacido el</p>
              <p className="text-sm font-medium text-foreground capitalize">
                {birthDateFormatted}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
