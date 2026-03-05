import { useState } from "react";
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

function buildWhatsAppMessage(items: CheckoutProduct[], totalPrice: number): string {
  const lines = items.map((i) => {
    const dur = DURATION_OPTIONS.find((o) => o.months === i.months);
    const label = dur?.label ?? `${i.months} meses`;
    if (i.discountedPrice < i.originalPrice) {
      return `• ${i.product.name} – ${label} (${i.originalPrice}€ → ${i.discountedPrice}€/mes)`;
    }
    return `• ${i.product.name} – ${label} (${i.discountedPrice}€/mes)`;
  });
  return `¡Hola! Me gustaría contratar estos productos:\n\n${lines.join("\n")}\n\nTotal: ${totalPrice}€/mes`;
}

const OPTIONS: { key: string; icon: typeof Calendar; title: string; description: string; cta: string; disabled?: boolean }[] = [
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
    description: "Pago seguro con tarjeta — facturación según duración elegida",
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

  const handleOption = async (key: string) => {
    if (key === "whatsapp") {
      const msg = encodeURIComponent(buildWhatsAppMessage(items, totalPrice));
      openExternal(`https://wa.me/34638706467?text=${msg}`);
    } else if (key === "calendly") {
      openExternal("https://calendly.com/bebloo/asesoria");
    } else if (key === "online") {
      setLoading(true);
      try {
        const cartItems = items.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          months: i.months,
          pricePerMonth: i.discountedPrice,
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
          <DialogTitle className="font-serif text-xl">¿Cómo quieres continuar?</DialogTitle>
          <DialogDescription>
            Elige la opción que prefieras para finalizar tu suscripción de {totalPrice}€/mes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-2">
          {OPTIONS.map((opt) => (
            <button
              key={opt.key}
              disabled={opt.disabled || (opt.key === "online" && loading)}
              onClick={() => handleOption(opt.key)}
              className="w-full text-left rounded-xl border bg-card p-4 flex items-start gap-4 hover:border-primary/40 hover:shadow-sm transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                {opt.key === "online" && loading ? (
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                ) : (
                  <opt.icon className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground">{opt.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{opt.description}</p>
                <span className="inline-block mt-2 text-xs font-medium text-primary">
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
