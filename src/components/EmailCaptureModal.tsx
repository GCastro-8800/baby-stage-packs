import { useState, useEffect } from "react";
import { X, Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAnalytics } from "@/hooks/useAnalytics";

interface EmailCaptureModalProps {
  isOpen: boolean;
  selectedPlan: string;
  onClose: () => void;
}

const EmailCaptureModal = ({ isOpen, selectedPlan, onClose }: EmailCaptureModalProps) => {
  const [email, setEmail] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { track } = useAnalytics();

  // Reset state and track when modal opens
  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setPostalCode("");
      setIsSubmitted(false);
      track("modal_open", { plan: selectedPlan });
    }
  }, [isOpen, selectedPlan, track]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    const { error } = await supabase
      .from('leads')
      .insert({ email, plan: selectedPlan, postal_code: postalCode || null });

    if (error) {
      setIsLoading(false);
      if (error.code === '23505') {
        // Email duplicado
        toast({
          title: "Ya te habías registrado",
          description: "Este email ya está en nuestra lista. Te avisaremos pronto.",
        });
        setIsSubmitted(true);
      } else {
        toast({
          variant: "destructive",
          title: "Algo salió mal",
          description: "No pudimos guardar tu email. Inténtalo de nuevo.",
        });
      }
      return;
    }

    // Send confirmation email (don't block on failure)
    try {
      await supabase.functions.invoke('send-confirmation-email', {
        body: { email, plan: selectedPlan, postalCode: postalCode || undefined }
      });
    } catch (emailError) {
      console.error("Error sending confirmation email:", emailError);
    }

    setIsLoading(false);
    setIsSubmitted(true);
    track("lead_captured", { plan: selectedPlan, has_postal_code: !!postalCode });
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
      <div className="relative w-full max-w-md bg-background rounded-xl shadow-2xl border border-border p-6 md:p-8 mx-4 md:mx-0 animate-fade-up">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 p-2 text-muted-foreground hover:text-foreground transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <X className="h-5 w-5" />
        </button>

        {!isSubmitted ? (
          <>
            {/* Honest message */}
            <div className="text-center mb-5 md:mb-6">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Mail className="h-6 w-6 md:h-7 md:w-7 text-primary" />
              </div>
              <h3 className="text-xl md:text-2xl font-serif font-semibold text-foreground mb-2">
                ¡Buena elección! Has elegido {selectedPlan}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Estamos llegando poco a poco a nuevas zonas. Déjanos tu email y te avisaremos cuando podamos atenderte — sin spam, lo prometemos.
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
              <Input
                type="text"
                placeholder="Código postal (opcional)"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ""))}
                maxLength={5}
                inputMode="numeric"
                className="h-12 text-base"
              />
              <Button
                type="submit"
                className="w-full h-12 cta-tension"
                disabled={isLoading}
              >
                {isLoading ? "Enviando..." : "Quiero que me aviséis"}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Sin spam, lo prometemos. Solo un email cuando lleguemos a tu zona.
            </p>
          </>
        ) : (
          /* Success state */
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-serif font-semibold text-foreground mb-2">
              ¡Perfecto! Ya estás dentro
            </h3>
            <p className="text-muted-foreground mb-6">
              Te escribiremos cuando lleguemos a tu zona. Mientras, respira hondo — lo tienes todo bajo control.
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
