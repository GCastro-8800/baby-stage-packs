import { Sparkles, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { SelectionCard } from "../SelectionCard";

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
        <SelectionCard
          icon={<Sparkles className={cn("h-8 w-8 transition-colors", value === true ? "text-primary" : "text-muted-foreground")} />}
          title="Sí, es mi primero"
          description="Todo es nuevo para mí"
          selected={value === true}
          onClick={() => onChange(true)}
        />
        <SelectionCard
          icon={<Users className={cn("h-8 w-8 transition-colors", value === false ? "text-primary" : "text-muted-foreground")} />}
          title="No, ya tengo experiencia"
          description="Ya he pasado por esto"
          selected={value === false}
          onClick={() => onChange(false)}
        />
      </div>
    </div>
  );
}
