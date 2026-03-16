import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, CreditCard, Loader2, Shield, CheckCircle, MessageCircle, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAnalytics } from "@/hooks/useAnalytics";
import { openExternal } from "@/lib/openExternal";
import { getPlanById } from "@/data/planEquipment";
import { DURATION_OPTIONS } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";

const WHATSAPP_NUMBER = "34638706467";
const CALENDLY_URL = "https://calendly.com/martincabanaspaola/30min";

interface LocationState {
  selections?: Record<string, boolean>;
  durationMonths?: number;
}

const PackCheckout = () => {
  const { packId } = useParams<{ packId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { track } = useAnalytics();
  const [isLoading, setIsLoading] = useState(false);

  const locationState = location.state as LocationState | null;
  const selectedItems = Object.entries(locationState?.selections || {})
    .filter(([, v]) => v)
    .map(([k]) => k);
  const productNames = selectedItems.map((k) => k.split("::")[1]);
  const durationMonths = locationState?.durationMonths || 1;
  const durationOption = DURATION_OPTIONS.find((d) => d.months === durationMonths) || DURATION_OPTIONS[0];

  const plan = getPlanById(packId || "");
  const discountedPrice = Math.round((plan?.price || 0) * (1 - durationOption.discount));

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-foreground mb-4">Plan no encontrado</h1>
          <Button variant="outline" onClick={() => navigate("/")}>Volver al inicio</Button>
        </div>
      </div>
    );
  }

  const handleCheckout = async () => {
    if (!user) {
      toast({ variant: "destructive", title: "Inicia sesión", description: "Debes iniciar sesión para completar la compra." });
      navigate("/auth?returnTo=" + encodeURIComponent(location.pathname));
      return;
    }
    setIsLoading(true);
    track("checkout_start", { plan: plan.name, product_count: productNames.length });

    try {
      const { data, error } = await supabase.functions.invoke("stripe-checkout", {
        body: { planId: plan.id, selectedItems, durationMonths },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      const message = err?.message || "";
      if (message.includes("Stripe not configured")) {
        toast({ variant: "destructive", title: "Pago no disponible todavía", description: "El sistema de pago está en proceso de configuración. Puedes contactarnos directamente mientras tanto." });
      } else {
        toast({ variant: "destructive", title: "Error al iniciar el pago", description: "Inténtalo de nuevo o contacta con nosotros." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const selectionText = productNames.length > 0 ? ` Me interesan: ${productNames.join(", ")}.` : "";
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola, me interesa el plan ${plan.name}.${selectionText} ¿Podrías darme más información?`)}`;

  const handleContactClick = (type: "whatsapp" | "calendly") => {
    track("contact_click", { type, plan: plan.name });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-30">
        <div className="container max-w-3xl flex items-center gap-3 py-4 px-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="font-serif font-semibold text-foreground">Suscripción</span>
          <span className="ml-auto text-sm text-muted-foreground">
            {plan.name} · €{discountedPrice}/mes{durationMonths > 1 && ` × ${durationMonths} meses`}
          </span>
        </div>
      </div>

      <div className="container max-w-3xl px-4 py-10 md:py-16 space-y-16">
        {/* Checkout */}
        <div className="text-center max-w-lg mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-serif text-foreground">Confirma tu suscripción</h1>
            <p className="text-muted-foreground text-sm">
              Acceso inmediato a tu equipamiento.{durationMonths > 1 ? ` Compromiso de ${durationMonths} meses.` : " Sin permanencia."}
            </p>
          </div>

          <div className="rounded-xl border-2 border-primary/20 bg-card p-6 space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="font-serif font-semibold text-foreground text-lg">{plan.name}</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-serif font-bold text-foreground">€{discountedPrice}</span>
                <span className="text-muted-foreground text-sm">/mes</span>
              </div>
            </div>
            {durationOption.discount > 0 && (
              <p className="text-xs text-primary font-medium">
                -{durationOption.discount * 100}% descuento · {durationMonths} meses · €{discountedPrice * durationMonths} total
              </p>
            )}

            {productNames.length > 0 && (
              <div className="text-left space-y-1 border-t border-border pt-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Equipamiento seleccionado</p>
                <ul className="space-y-1">
                  {productNames.map((name, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-start gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
              <Shield className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
              <span>{plan.guarantee}</span>
            </div>
          </div>

          <Button onClick={handleCheckout} disabled={isLoading} className="w-full h-12 text-base cta-tension" size="lg">
            {isLoading ? (
              <><Loader2 className="h-5 w-5 animate-spin mr-2" />Conectando con el pago...</>
            ) : (
              <><CreditCard className="h-5 w-5 mr-2" />Suscribirme · €{discountedPrice}/mes</>
            )}
          </Button>

          <p className="text-xs text-muted-foreground">Pago seguro con Stripe. Puedes cancelar en cualquier momento.</p>
        </div>

        {/* Contact */}
        <div className="border-t border-border pt-10">
          <p className="text-center text-sm text-muted-foreground mb-6">¿Prefieres hablar primero?</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
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
              <p className="text-sm text-muted-foreground">Respuesta rápida. Resolvemos tus dudas al momento.</p>
            </div>

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
              <p className="text-sm text-muted-foreground">30 min para explicarte todo con calma. Elige tu horario.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackCheckout;
