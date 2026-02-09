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
    <section className="space-y-8">
      <div className="text-center max-w-lg mx-auto">
        <h2 className="text-xl md:text-2xl font-serif text-foreground mb-2">
          ¿Cómo quieres continuar?
        </h2>
        <p className="text-sm text-muted-foreground">
          Habla con nosotros antes de decidir. Sin compromiso.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {/* WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleContactClick("whatsapp")}
          className="flex flex-col items-center text-center p-6 rounded-xl border-2 border-border hover:border-primary/40 bg-card transition-all hover:shadow-md"
        >
          <div className="w-12 h-12 rounded-full bg-[hsl(142,70%,45%)]/10 flex items-center justify-center mb-4">
            <MessageCircle className="h-6 w-6 text-[hsl(142,70%,45%)]" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">Habla por WhatsApp</h3>
          <p className="text-sm text-muted-foreground">
            Respuesta rápida. Resolvemos tus dudas al momento.
          </p>
        </a>

        {/* Calendly */}
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleContactClick("calendly")}
          className="flex flex-col items-center text-center p-6 rounded-xl border-2 border-border hover:border-primary/40 bg-card transition-all hover:shadow-md"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <CalendarDays className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">Reserva una llamada</h3>
          <p className="text-sm text-muted-foreground">
            30 min para explicarte todo con calma. Elige tu horario.
          </p>
        </a>

        {/* Availability check */}
        <div className="flex flex-col items-center text-center p-6 rounded-xl border-2 border-border bg-card">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
            <MapPin className="h-6 w-6 text-accent" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">
            Comprueba disponibilidad
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Verifica si Bebloo está disponible en tu zona de Madrid.
          </p>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="w-full space-y-3">
              <Input
                type="text"
                placeholder="Código postal"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ""))}
                maxLength={5}
                inputMode="numeric"
                required
                className="h-11 text-sm"
              />
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 text-sm"
              />
              <Button type="submit" className="w-full cta-tension" disabled={isLoading}>
                {isLoading ? "Comprobando..." : "Comprobar disponibilidad"}
              </Button>
            </form>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <CheckCircle className="h-8 w-8 text-primary" />
              <p className="text-sm text-foreground font-medium">
                ¡Listo! Te avisaremos cuando lleguemos a tu zona.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
