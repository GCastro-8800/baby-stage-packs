import { useState } from "react";
import { ChevronUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Product } from "@/data/productCatalog";
import { DURATION_OPTIONS } from "@/lib/constants";
import TrustBadges from "@/components/configurator/TrustBadges";
import { cn } from "@/lib/utils";

interface StickyMobileBarProps {
  count: number;
  totalPrice: number;
  onCheckout: () => void;
  products: Product[];
  onRemove: (productId: string) => void;
  getDuration: (productId: string) => number;
  setDuration: (productId: string, months: number) => void;
  getDiscountedPrice: (product: Product) => number;
}

export default function StickyMobileBar({
  count,
  totalPrice,
  onCheckout,
  products,
  onRemove,
  getDuration,
  setDuration,
  getDiscountedPrice,
}: StickyMobileBarProps) {
  const [open, setOpen] = useState(false);

  if (count === 0) return null;

  const upfrontTotal = products.reduce((sum, p) => {
    const months = getDuration(p.id);
    const price = getDiscountedPrice(p);
    return sum + price * months;
  }, 0);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-foreground/15 p-4 flex items-center justify-between gap-4 md:hidden">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 text-left"
        >
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-foreground/50">
              {count} {count === 1 ? "producto" : "productos"}
            </p>
            <p className="font-display text-xl">
              {upfrontTotal}€
              <span className="text-xs font-sans text-muted-foreground ml-1">pago único</span>
            </p>
          </div>
        </button>
        <Button className="cta-tension flex-1 max-w-[200px]" size="lg" onClick={onCheckout}>
          Contratar
        </Button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="max-h-[85vh] rounded-t-2xl p-0">
          <SheetHeader className="px-5 pt-5 pb-3 border-b border-foreground/10">
            <div className="flex items-baseline justify-between">
              <SheetTitle className="font-display text-xl">Tu selección</SheetTitle>
              <p className="text-[10px] uppercase tracking-[0.18em] text-foreground/50">
                {count} {count === 1 ? "producto" : "productos"}
              </p>
            </div>
            <SheetDescription className="sr-only">Gestiona los productos de tu cesta</SheetDescription>
          </SheetHeader>

          <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
            {products.map((p) => {
              const months = getDuration(p.id);
              const discounted = getDiscountedPrice(p);
              const basePrice = p.prices?.[1] ?? p.pricePerMonth;
              const hasDiscount = discounted < basePrice;
              const itemTotal = discounted * months;
              return (
                <div key={p.id} className="space-y-2 pb-4 border-b border-foreground/10 last:border-b-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-foreground/50">
                        {p.brand}
                      </p>
                      <p className="text-sm truncate mt-0.5">{p.name}</p>
                    </div>
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
                    <div className="flex gap-1.5">
                      {DURATION_OPTIONS.map((opt) => (
                        <button
                          key={opt.months}
                          onClick={() => setDuration(p.id, opt.months)}
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[11px] transition-colors border",
                            months === opt.months
                              ? "bg-foreground text-background border-foreground"
                              : "bg-transparent text-muted-foreground border-foreground/20"
                          )}
                        >
                          {opt.months}m
                        </button>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">= {itemTotal}€</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-foreground/15 px-5 py-4 space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm">Pago único</span>
              <span className="font-display text-2xl">{upfrontTotal}€</span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Se cobra el importe total del compromiso de una sola vez
            </p>
            <TrustBadges />
            <Button
              className="w-full cta-tension"
              size="lg"
              onClick={() => {
                setOpen(false);
                onCheckout();
              }}
            >
              Contratar ahora
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
