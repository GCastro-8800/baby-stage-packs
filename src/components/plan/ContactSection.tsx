import { useState } from "react";
import { MessageCircle, CalendarDays, MapPin, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAnalytics } from "@/hooks/useAnalytics";
import type { PlanData } from "@/data/planEquipment";

const WHATSAPP_NUMBER = "34638706467";
const CALENDLY_URL = "https://calendly.com/martincabanaspaola/30min";

interface ContactSectionProps {
  plan: PlanData;
  selectedItems: string[];
}

const ContactSection = ({ plan, selectedItems }: ContactSectionProps) => {
  const { toast } = useToast();
  const { track } = useAnalytics();
  const [email, setEmail] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const selectionText = selectedItems.length > 0
    ? ` Me interesan: ${selectedItems.map((k) => k.split("::")[1]).join(", ")}.`
    : "";

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hola, me interesa el plan ${plan.name}.${selectionText} ¿Podrías darme más información?`
  )}`;

  const handleContactClick = (type: "whatsapp" | "calendly") => {
    track("contact_click", { type, plan: plan.name });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !postalCode) return;

    setIsLoading(true);

    const { error } = await supabase
      .from("leads")
      .insert({ email, plan: plan.name, postal_code: postalCode });

    if (error) {
      setIsLoading(false);
      if (error.code === "23505") {
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

    try {
      await supabase.functions.invoke("send-confirmation-email", {
        body: { email, plan: plan.name, postalCode },
      });
    } catch (emailError) {
      console.error("Error sending confirmation email:", emailError);
    }

    setIsLoading(false);
    setIsSubmitted(true);
    track("lead_captured", { plan: plan.name, has_postal_code: true });
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center max-w-lg mx-auto">
        <h1 className="text-2xl md:text-3xl font-serif text-foreground mb-2">
          ¿Cómo quieres continuar?
        </h1>
        <p className="text-muted-foreground text-sm">
          Habla con nosotros antes de decidir. Sin compromiso.
        </p>
        {selectedItems.length > 0 && (
          <p className="text-xs text-muted-foreground/70 mt-2">
            Te interesan: {selectedItems.map((k) => k.split("::")[1]).join(", ")}
          </p>
        )}
      </div>

      {/* Primary contact options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleContactClick("whatsapp")}
          className="flex flex-col items-center text-center p-6 rounded-xl border-2 border-border hover:border-primary/40 bg-card transition-all hover:shadow-md"
        >
          <div className="w-12 h-12 rounded-full bg-[hsl(142,70%,45%)]/10 flex items-center justify-center mb-3">
            <MessageCircle className="h-6 w-6 text-[hsl(142,70%,45%)]" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">Habla por WhatsApp</h3>
          <p className="text-sm text-muted-foreground">
            Respuesta rápida. Resolvemos tus dudas al momento.
          </p>
        </a>

        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleContactClick("calendly")}
          className="flex flex-col items-center text-center p-6 rounded-xl border-2 border-border hover:border-primary/40 bg-card transition-all hover:shadow-md"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <CalendarDays className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">Reserva una llamada</h3>
          <p className="text-sm text-muted-foreground">
            30 min para explicarte todo con calma. Elige tu horario.
          </p>
        </a>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 max-w-2xl mx-auto">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground uppercase tracking-wider">o bien</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Availability check */}
      <div className="max-w-md mx-auto rounded-xl border-2 border-border bg-card p-6 sm:p-8">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-3">
            <MapPin className="h-6 w-6 text-accent" />
          </div>
          <h3 className="font-semibold text-foreground text-lg mb-1">
            Comprueba disponibilidad en tu zona
          </h3>
          <p className="text-sm text-muted-foreground">
            Ahora mismo operamos en <span className="font-medium text-foreground">Madrid capital y alrededores</span>.
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Input
                type="text"
                placeholder="Tu código postal (ej. 28001)"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ""))}
                maxLength={5}
                inputMode="numeric"
                required
                className="h-12 text-sm"
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 text-sm"
              />
              <p className="text-xs text-muted-foreground/70 mt-1.5 ml-1">
                Te avisaremos cuando Bebloo esté disponible en tu zona.
              </p>
            </div>
            <Button type="submit" className="w-full h-12 cta-tension" disabled={isLoading}>
              {isLoading ? "Comprobando..." : "Comprobar disponibilidad"}
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <CheckCircle className="h-10 w-10 text-primary mx-auto" />
            <div>
              <p className="font-semibold text-foreground text-lg">
                Zona {postalCode || "registrada"} registrada
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Te avisaremos cuando Bebloo esté disponible en tu área de Madrid.
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Mientras tanto, puedes hablar con nosotros:
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleContactClick("whatsapp")}
                className="flex-1"
              >
                <Button variant="outline" className="w-full gap-2" size="sm">
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </Button>
              </a>
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleContactClick("calendly")}
                className="flex-1"
              >
                <Button variant="outline" className="w-full gap-2" size="sm">
                  <CalendarDays className="h-4 w-4" /> Reservar llamada
                </Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactSection;
