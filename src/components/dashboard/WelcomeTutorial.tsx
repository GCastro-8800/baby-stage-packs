import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Baby, Package, Truck, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface WelcomeTutorialProps {
  open: boolean;
  userId: string;
  onComplete: () => void;
}

const steps = [
  {
    icon: Baby,
    title: "¡Bienvenido a Bebloo!",
    description:
      "Equipamiento de bebé premium por suscripción mensual. Recibes todo lo que necesitas, sin comprar ni acumular.",
  },
  {
    icon: Package,
    title: "Elige tu plan",
    description:
      "Selecciona el pack que mejor se adapte a ti. Puedes personalizar el equipamiento eligiendo las marcas y productos que prefieras.",
  },
  {
    icon: Truck,
    title: "Nosotros nos encargamos",
    description:
      "Te entregamos el equipamiento en casa y lo cambiamos cuando tu bebé crece. Sin estrés, sin acumular cosas que ya no usa.",
  },
];

export function WelcomeTutorial({ open, userId, onComplete }: WelcomeTutorialProps) {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const handleFinish = async () => {
    await supabase
      .from("profiles")
      .update({ has_seen_tutorial: true } as any)
      .eq("id", userId);
    onComplete();
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const current = steps[step];
  const Icon = current.icon;
  const isLast = step === steps.length - 1;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleFinish(); }}>
      <DialogContent className="max-w-sm text-center p-8 gap-0">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Icon className="h-8 w-8 text-primary" />
          </div>
        </div>

        <h2 className="font-serif text-xl font-bold text-foreground mb-2">
          {current.title}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          {current.description}
        </p>

        {/* Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        <Button onClick={handleNext} className="w-full gap-2">
          {isLast ? "Explorar planes" : "Siguiente"}
          <ArrowRight className="h-4 w-4" />
        </Button>

        {!isLast && (
          <button
            onClick={handleFinish}
            className="mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Omitir
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
}
