import { MessageCircle, CalendarDays, Mail } from "lucide-react";
import { openExternal } from "@/lib/openExternal";
import { useAnalytics } from "@/hooks/useAnalytics";
import type { PlanData } from "@/data/planEquipment";

const WHATSAPP_NUMBER = "34638706467";
const CALENDLY_URL = "https://calendly.com/martincabanaspaola/30min";

interface ContactSectionProps {
  plan: PlanData;
  selectedItems: string[];
}

const ContactSection = ({ plan, selectedItems }: ContactSectionProps) => {
  const { track } = useAnalytics();

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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
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
    </div>
  );
};

export default ContactSection;
