import { useState } from "react";
import { X, Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EmailCaptureModalProps {
  isOpen: boolean;
  selectedPlan: string;
  onClose: () => void;
}

const EmailCaptureModal = ({ isOpen, selectedPlan, onClose }: EmailCaptureModalProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call - replace with actual backend
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    setIsSubmitted(true);

    // Track conversion event (for analytics integration)
    console.log("Conversion:", { plan: selectedPlan, email });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-background rounded-xl shadow-2xl border border-border p-8 animate-fade-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {!isSubmitted ? (
          <>
            {/* Honest message */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-serif font-semibold text-foreground mb-2">
                Has seleccionado {selectedPlan}
              </h3>
              <p className="text-muted-foreground">
                Actualmente estamos abriendo este servicio en zonas limitadas. Si es algo que considerarías usar, déjanos tu email y te avisaremos cuando haya plazas disponibles.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 text-base"
              />
              <Button
                type="submit"
                className="w-full h-12 cta-tension"
                disabled={isLoading}
              >
                {isLoading ? "Enviando..." : "Avísame cuando esté disponible"}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Sin spam. Solo un email cuando lancemos en tu zona.
            </p>
          </>
        ) : (
          /* Success state */
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-serif font-semibold text-foreground mb-2">
              ¡Estás en la lista!
            </h3>
            <p className="text-muted-foreground mb-6">
              Te contactaremos en cuanto bebloo esté disponible en tu zona.
            </p>
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailCaptureModal;
