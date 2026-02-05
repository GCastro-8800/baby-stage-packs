import { Card } from "@/components/ui/card";
import { Sparkles, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExperienceStepProps {
  value: boolean | null;
  onChange: (value: boolean) => void;
}

export function ExperienceStep({ value, onChange }: ExperienceStepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
          ¿Es tu primer bebé?
        </h1>
        <p className="text-muted-foreground">
          Esto nos ayuda a personalizar tu experiencia
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card
          className={cn(
            "p-6 cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-md",
            value === true && "border-primary bg-primary/5 shadow-md"
          )}
          onClick={() => onChange(true)}
        >
          <div className="flex flex-col items-center text-center gap-4">
            <div className={cn(
              "p-4 rounded-full transition-colors",
              value === true ? "bg-primary/10" : "bg-muted"
            )}>
              <Sparkles className={cn(
                "h-8 w-8 transition-colors",
                value === true ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <div>
              <h3 className="font-medium text-lg">Sí, es mi primero</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Todo es nuevo para mí
              </p>
            </div>
          </div>
        </Card>

        <Card
          className={cn(
            "p-6 cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-md",
            value === false && "border-primary bg-primary/5 shadow-md"
          )}
          onClick={() => onChange(false)}
        >
          <div className="flex flex-col items-center text-center gap-4">
            <div className={cn(
              "p-4 rounded-full transition-colors",
              value === false ? "bg-primary/10" : "bg-muted"
            )}>
              <Users className={cn(
                "h-8 w-8 transition-colors",
                value === false ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <div>
              <h3 className="font-medium text-lg">No, ya tengo experiencia</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Ya he pasado por esto
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
