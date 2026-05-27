import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/data/productCatalog";
import { DURATION_OPTIONS } from "@/lib/constants";
import TrustBadges from "@/components/configurator/TrustBadges";
import { cn } from "@/lib/utils";

interface SelectionSidebarProps {
  products: Product[];
  totalPrice: number;
  onRemove: (productId: string) => void;
  onCheckout: () => void;
  getDuration: (productId: string) => number;
  setDuration: (productId: string, months: number) => void;
  getDiscountedPrice: (product: Product) => number;
}

const INCLUDED_PERKS = [
  "Limpieza UV-C profesional",
  "Entrega y recogida en casa",
  "Cambios gratis entre Momentos",
  "Soporte experto personalizado",
];

export default function SelectionSidebar({
  products,
  totalPrice,
  onRemove,
  onCheckout,
  getDuration,
  setDuration,
  getDiscountedPrice,
}: SelectionSidebarProps) {
  const upfrontTotal = products.reduce((sum, p) => {
    const months = getDuration(p.id);
    const price = getDiscountedPrice(p);
    return sum + price * months;
  }, 0);

  return (
    <aside className="sticky top-28 space-y-10">
      <div className="border-t border-b border-foreground/15 py-6 space-y-5">
        <div className="flex items-baseline justify-between">
          <h3 className="font-display text-xl">Tu selección</h3>
          <p className="text-[10px] uppercase tracking-[0.18em] text-foreground/50">
            {products.length} {products.length === 1 ? "producto" : "productos"}
          </p>
        </div>

        {products.length === 0 ? (
          <p className="text-sm text-muted-foreground italic py-4">
            Aún no has elegido nada
          </p>
        ) : (
          <ul className="space-y-4">
            {products.map((p) => {
              const months = getDuration(p.id);
              const discounted = getDiscountedPrice(p);
              const basePrice = p.prices?.[1] ?? p.pricePerMonth;
              const hasDiscount = discounted < basePrice;
              const itemTotal = discounted * months;
              return (
                <li key={p.id} className="space-y-2 pb-3 border-b border-foreground/10 last:border-b-0">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm truncate flex-1">{p.name}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {hasDiscount && (
                        <span className="text-xs text-muted-foreground line-through">{basePrice}€</span>
                      )}
                      <span className="text-sm">{discounted}€/mes</span>
                      <button
                        onClick={() => onRemove(p.id)}
                        className="text-muted-foreground/60 hover:text-destructive transition-colors ml-1"
                        aria-label={`Quitar ${p.name}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {DURATION_OPTIONS.map((opt) => (
                        <button
                          key={opt.months}
                          onClick={() => setDuration(p.id, opt.months)}
                          className={cn(
                            "px-1.5 py-0.5 rounded-full text-[10px] transition-colors border",
                            months === opt.months
                              ? "bg-foreground text-background border-foreground"
                              : "bg-transparent text-muted-foreground border-foreground/20 hover:border-foreground/40"
                          )}
                        >
                          {opt.months}m
                        </button>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">= {itemTotal}€</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="border-t border-foreground/15 pt-4 space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-sm">Pago único</span>
            <span className="font-display text-3xl">{upfrontTotal}€</span>
          </div>
          {products.length > 0 && (
            <p className="text-[11px] text-muted-foreground">
              Se cobra el importe total del compromiso de una sola vez
            </p>
          )}
        </div>

        {products.length > 0 && <TrustBadges className="pt-1" />}

        <Button className="w-full cta-tension" size="lg" onClick={onCheckout}>
          Contratar ahora
        </Button>
      </div>

      <div className="space-y-3">
        <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/50">Incluye siempre</p>
        <ul className="space-y-2">
          {INCLUDED_PERKS.map((label) => (
            <li key={label} className="text-sm text-muted-foreground">
              · {label}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
