import { useState } from "react";
import { CreditCard, Loader2, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAnalytics } from "@/hooks/useAnalytics";
import type { PlanData } from "@/data/planEquipment";

interface CheckoutStepProps {
  plan: PlanData;
  selectedItems: string[];
}

const CheckoutStep = ({ plan, selectedItems }: CheckoutStepProps) => {
  const { toast } = useToast();
  const { track } = useAnalytics();
  const [isLoading, setIsLoading] = useState(false);

  const productNames = selectedItems.map((k) => k.split("::")[1]);

  const handleCheckout = async () => {
    setIsLoading(true);
    track("checkout_start", { plan: plan.name, product_count: productNames.length });

    try {
      const { data, error } = await supabase.functions.invoke("stripe-checkout", {
        body: {
          planId: plan.id,
          selectedItems,
        },
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
        toast({
          variant: "destructive",
          title: "Pago no disponible todavía",
          description: "El sistema de pago está en proceso de configuración. Puedes contactarnos directamente mientras tanto.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error al iniciar el pago",
          description: "Inténtalo de nuevo o contacta con nosotros.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center max-w-lg mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-serif text-foreground">
          Confirma tu suscripción
        </h1>
        <p className="text-muted-foreground text-sm">
          Acceso inmediato a tu equipamiento. Sin permanencia.
        </p>
      </div>

      {/* Plan summary card */}
      <div className="rounded-xl border-2 border-primary/20 bg-card p-6 space-y-4">
        <div className="flex items-baseline justify-between">
          <span className="font-serif font-semibold text-foreground text-lg">{plan.name}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-serif font-bold text-foreground">€{plan.price}</span>
            <span className="text-muted-foreground text-sm">/mes</span>
          </div>
        </div>

        {productNames.length > 0 && (
          <div className="text-left space-y-1 border-t border-border pt-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Equipamiento seleccionado
            </p>
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

      <Button
        onClick={handleCheckout}
        disabled={isLoading}
        className="w-full h-12 text-base cta-tension"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Conectando con el pago...
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5 mr-2" />
            Suscribirme · €{plan.price}/mes
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground">
        Pago seguro con Stripe. Puedes cancelar en cualquier momento.
      </p>
    </div>
  );
};

export default CheckoutStep;
