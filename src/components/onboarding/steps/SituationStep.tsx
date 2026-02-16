import { Baby, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { SelectionCard } from "../SelectionCard";

interface SituationStepProps {
  value: "expecting" | "born" | null;
  onChange: (value: "expecting" | "born") => void;
  userName?: string;
}

export function SituationStep({ value, onChange, userName }: SituationStepProps) {
  const greeting = userName ? `Hola, ${userName}.` : "Hola.";

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <p className="text-lg text-muted-foreground">{greeting}</p>
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
          Cuéntanos un poco sobre ti
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectionCard
          icon={<Heart className={cn("h-8 w-8 transition-colors", value === "expecting" ? "text-primary" : "text-muted-foreground")} />}
          title="Estoy esperando un bebé"
          description="Aún no ha nacido"
          selected={value === "expecting"}
          onClick={() => onChange("expecting")}
        />
        <SelectionCard
          icon={<Baby className={cn("h-8 w-8 transition-colors", value === "born" ? "text-primary" : "text-muted-foreground")} />}
          title="Ya nació mi bebé"
          description="Ya está con nosotros"
          selected={value === "born"}
          onClick={() => onChange("born")}
        />
      </div>
    </div>
  );
}
