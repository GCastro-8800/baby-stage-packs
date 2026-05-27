import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, CreditCard, MessageCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Product } from "@/data/productCatalog";
import { DURATION_OPTIONS } from "@/lib/constants";
import { openExternal } from "@/lib/openExternal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface CheckoutProduct {
  product: Product;
  months: number;
  originalPrice: number;
  discountedPrice: number;
}

interface CheckoutOptionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CheckoutProduct[];
  totalPrice: number;
}

function buildWhatsAppMessage(items: CheckoutProduct[], upfrontTotal: number): string {
  const lines = items.map((i) => {
    const dur = DURATION_OPTIONS.find((o) => o.months === i.months);
    const label = dur?.label ?? `${i.months} meses`;
    const itemTotal = i.discountedPrice * i.months;
    return `• ${i.product.name} – ${label} (${i.discountedPrice}€/mes × ${i.months} = ${itemTotal}€)`;
  });
  return `¡Hola! Me gustaría contratar estos productos:\n\n${lines.join("\n")}\n\nTotal a pagar: ${upfrontTotal}€`;
}

const OPTIONS: { key: string; icon: typeof Calendar; title: string; description: string; cta: string }[] = [
  {
    key: "calendly",
    icon: Calendar,
    title: "Hablar con una asesora",
    description: "Reserva una videollamada gratuita de 15 min para resolver tus dudas",
    cta: "Reservar llamada",
  },
  {
    key: "whatsapp",
    icon: MessageCircle,
    title: "Contratar por WhatsApp",
    description: "Te enviamos un mensaje con tu selección lista para confirmar",
    cta: "Abrir WhatsApp",
  },
  {
    key: "online",
    icon: CreditCard,
    title: "Pagar online",
    description: "Pago único seguro con tarjeta — se cobra el importe total del compromiso",
    cta: "Pagar con tarjeta",
  },
];

export default function CheckoutOptionsDialog({
  open,
  onOpenChange,
  items,
  totalPrice,
}: CheckoutOptionsDialogProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const upfrontTotal = items.reduce((sum, i) => sum + i.discountedPrice * i.months, 0);

  const handleOption = async (key: string) => {
    if (key === "whatsapp") {
      const msg = encodeURIComponent(buildWhatsAppMessage(items, upfrontTotal));
      openExternal(`https://wa.me/34638706467?text=${msg}`);
    } else if (key === "calendly") {
      openExternal("https://calendly.com/bebloo/asesoria");
    } else if (key === "online") {
      if (!user) {
        toast.error("Debes iniciar sesión para pagar con tarjeta");
        onOpenChange(false);
        navigate("/auth?returnTo=/mi-seleccion");
        return;
      }
      setLoading(true);
      try {
        const cartItems = items.map((i) => ({
          productId: i.product.id,
          months: i.months,
        }));

        const { data, error } = await supabase.functions.invoke("stripe-checkout", {
          body: { items: cartItems },
        });

        if (error) throw error;
        if (data?.url) {
          window.open(data.url, "_blank");
        } else {
          throw new Error("No checkout URL returned");
        }
      } catch (err: any) {
        console.error("Checkout error:", err);
        toast.error(err?.message || "Error al iniciar el pago. Inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">¿Cómo quieres continuar?</DialogTitle>
          <DialogDescription className="text-sm">
            Tu selección: {upfrontTotal}€ (pago único)
          </DialogDescription>
        </DialogHeader>

        {/* Breakdown */}
        <div className="border-t border-b border-foreground/10 py-3 space-y-2">
          {items.map((i) => {
            const itemTotal = i.discountedPrice * i.months;
            const periodLabel = i.months === 1 ? "1 mes" : `${i.months} meses`;
            return (
              <div key={i.product.id} className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  {i.product.name} — {periodLabel}
                </span>
                <span>
                  {i.discountedPrice}€ × {i.months} = {itemTotal}€
                </span>
              </div>
            );
          })}
          <div className="flex justify-between text-sm pt-2 border-t border-foreground/10">
            <span>Total a pagar</span>
            <span className="font-display text-lg">{upfrontTotal}€</span>
          </div>
        </div>

        <div className="space-y-0">
          {OPTIONS.map((opt) => (
            <button
              key={opt.key}
              disabled={opt.key === "online" && loading}
              onClick={() => handleOption(opt.key)}
              className="w-full text-left border-b border-foreground/10 py-4 flex items-start gap-4 hover:bg-foreground/5 transition-colors disabled:opacity-50 disabled:pointer-events-none last:border-b-0"
            >
              <div className="shrink-0 mt-1">
                {opt.key === "online" && loading ? (
                  <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
                ) : (
                  <opt.icon className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-base text-foreground">{opt.title}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{opt.description}</p>
                <span className="inline-block mt-2 text-xs text-foreground border-b border-foreground/40 pb-0.5">
                  {opt.key === "online" && loading ? "Procesando..." : `${opt.cta} →`}
                </span>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export type { CheckoutProduct };
