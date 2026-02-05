import { Card } from "@/components/ui/card";
import { Baby, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

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
        <Card
          className={cn(
            "p-6 cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-md",
            value === "expecting" && "border-primary bg-primary/5 shadow-md"
          )}
          onClick={() => onChange("expecting")}
        >
          <div className="flex flex-col items-center text-center gap-4">
            <div className={cn(
              "p-4 rounded-full transition-colors",
              value === "expecting" ? "bg-primary/10" : "bg-muted"
            )}>
              <Heart className={cn(
                "h-8 w-8 transition-colors",
                value === "expecting" ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <div>
              <h3 className="font-medium text-lg">Estoy esperando un bebé</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Aún no ha nacido
              </p>
            </div>
          </div>
        </Card>

        <Card
          className={cn(
            "p-6 cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-md",
            value === "born" && "border-primary bg-primary/5 shadow-md"
          )}
          onClick={() => onChange("born")}
        >
          <div className="flex flex-col items-center text-center gap-4">
            <div className={cn(
              "p-4 rounded-full transition-colors",
              value === "born" ? "bg-primary/10" : "bg-muted"
            )}>
              <Baby className={cn(
                "h-8 w-8 transition-colors",
                value === "born" ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <div>
              <h3 className="font-medium text-lg">Ya nació mi bebé</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Ya está con nosotros
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
