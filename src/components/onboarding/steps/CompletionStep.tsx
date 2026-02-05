import { Button } from "@/components/ui/button";
import { PartyPopper } from "lucide-react";

interface CompletionStepProps {
  onComplete: () => void;
  isLoading?: boolean;
}

export function CompletionStep({ onComplete, isLoading }: CompletionStepProps) {
  return (
    <div className="space-y-8 text-center">
      <div className="flex justify-center">
        <div className="p-6 rounded-full bg-primary/10">
          <PartyPopper className="h-12 w-12 text-primary" />
        </div>
      </div>

      <div className="space-y-3">
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
          ¡Todo listo!
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Nos encargamos de lo complicado.
          <br />
          Tú encárgate de disfrutarlo.
        </p>
      </div>

      <Button
        size="lg"
        onClick={onComplete}
        disabled={isLoading}
        className="mt-4"
      >
        {isLoading ? "Guardando..." : "Empezar"}
      </Button>
    </div>
  );
}
