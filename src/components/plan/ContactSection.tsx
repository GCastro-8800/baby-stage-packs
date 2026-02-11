import { useState } from "react";
import { MessageCircle, CalendarDays, Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { openExternal } from "@/lib/openExternal";
import { useToast } from "@/hooks/use-toast";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useAuth } from "@/hooks/useAuth";
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
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || "");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const productNames = selectedItems.map((k) => k.split("::")[1]);

  const selectionText = productNames.length > 0
    ? ` Me interesan: ${productNames.join(", ")}.`
    : "";

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hola, me interesa el plan ${plan.name}.${selectionText} ¿Podrías darme más información?`
  )}`;

  const handleContactClick = (type: "whatsapp" | "calendly") => {
    track("contact_click", { type, plan: plan.name });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setIsLoading(true);

    const { error } = await supabase
      .from("leads")
      .insert({
        email,
        plan: plan.name,
        user_id: user?.id || null,
        selected_products: productNames.length > 0 ? productNames : null,
      });

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
          description: "No pudimos guardar tu información. Inténtalo de nuevo.",
        });
      }
      return;
    }

    try {
      await supabase.functions.invoke("send-confirmation-email", {
        body: {
          email,
          plan: plan.name,
          selectedProducts: productNames,
        },
      });
    } catch (emailError) {
      console.error("Error sending confirmation email:", emailError);
    }

    setIsLoading(false);
    setIsSubmitted(true);
    track("lead_captured", { plan: plan.name, has_email: true, product_count: productNames.length });
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center max-w-lg mx-auto">
        <h1 className="text-2xl md:text-3xl font-serif text-foreground mb-2">
          ¿Cómo quieres continuar?
        </h1>
        <p className="text-muted-foreground text-sm">
          Elige la opción que mejor te venga. Sin compromiso.
        </p>
        {productNames.length > 0 && (
          <p className="text-xs text-muted-foreground/70 mt-2">
            Te interesan: {productNames.join(", ")}
          </p>
        )}
      </div>

      {/* 3 contact options grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
        {/* WhatsApp */}
        <div
          onClick={() => { handleContactClick("whatsapp"); openExternal(whatsappUrl); }}
          role="button"
          tabIndex={0}
          className="flex flex-col items-center text-center p-6 rounded-xl border-2 border-border hover:border-primary/40 bg-card transition-all hover:shadow-md cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-[hsl(142,70%,45%)]/10 flex items-center justify-center mb-3">
            <MessageCircle className="h-6 w-6 text-[hsl(142,70%,45%)]" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">Habla por WhatsApp</h3>
          <p className="text-sm text-muted-foreground">
            Respuesta rápida. Resolvemos tus dudas al momento.
          </p>
        </div>

        {/* Calendly */}
        <div
          onClick={() => { handleContactClick("calendly"); openExternal(CALENDLY_URL); }}
          role="button"
          tabIndex={0}
          className="flex flex-col items-center text-center p-6 rounded-xl border-2 border-border hover:border-primary/40 bg-card transition-all hover:shadow-md cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <CalendarDays className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">Reserva una llamada</h3>
          <p className="text-sm text-muted-foreground">
            30 min para explicarte todo con calma. Elige tu horario.
          </p>
        </div>

        {/* Email / postal code card */}
        <div className="flex flex-col items-center text-center p-6 rounded-xl border-2 border-border bg-card">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-3">
            <Mail className="h-6 w-6 text-accent" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">Te contactamos</h3>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="w-full mt-2 space-y-2">
              <p className="text-sm text-muted-foreground mb-2">
                Déjanos tu correo y te escribimos.
              </p>
              <div className="flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={255}
                  required
                  className="h-10 text-sm"
                />
              </div>
              <Button type="submit" className="w-full h-10 cta-tension text-sm" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Enviar"}
              </Button>
            </form>
          ) : (
            <div className="mt-2 space-y-2">
              <CheckCircle className="h-8 w-8 text-primary mx-auto" />
              <p className="text-sm font-medium text-foreground">¡Listo!</p>
              <p className="text-xs text-muted-foreground">
                Te escribiremos pronto con toda la info sobre tu plan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
