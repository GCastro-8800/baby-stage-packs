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

  const originalTotal = products.reduce((s, p) => s + (p.prices?.[1] ?? p.pricePerMonth), 0);
  const savings = originalTotal - totalPrice;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-card shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.1)] p-4 flex items-center justify-between gap-4 md:hidden">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 text-left"
        >
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">
              {count} {count === 1 ? "producto" : "productos"}
            </p>
            <p className="text-xl font-serif font-semibold">
              {totalPrice}€<span className="text-sm font-normal text-muted-foreground">/mes</span>
            </p>
          </div>
        </button>
        <Button className="cta-tension flex-1 max-w-[200px]" size="lg" onClick={onCheckout}>
          Contratar
        </Button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="max-h-[85vh] rounded-t-2xl p-0">
          <SheetHeader className="px-5 pt-5 pb-3 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle className="font-serif text-lg">Tu selección</SheetTitle>
              <span className="text-xs font-medium text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
                {count} {count === 1 ? "producto" : "productos"}
              </span>
            </div>
            <SheetDescription className="sr-only">Gestiona los productos de tu cesta</SheetDescription>
          </SheetHeader>

          <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
            {products.map((p) => {
              const months = getDuration(p.id);
              const discounted = getDiscountedPrice(p);
              const basePrice = p.prices?.[1] ?? p.pricePerMonth;
              const hasDiscount = discounted < basePrice;
              return (
                <div key={p.id} className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.name}</p>
                      <p className="text-[11px] text-muted-foreground">{p.brand}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {hasDiscount && (
                        <span className="text-xs text-muted-foreground line-through">{basePrice}€</span>
                      )}
                      <span className="text-sm font-semibold">{discounted}€</span>
                      <button
                        onClick={() => onRemove(p.id)}
                        className="text-muted-foreground/60 hover:text-destructive transition-colors ml-1"
                        aria-label={`Quitar ${p.name}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {DURATION_OPTIONS.map((opt) => (
                      <button
                        key={opt.months}
                        onClick={() => setDuration(p.id, opt.months)}
                        className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                          months === opt.months
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {opt.months}m
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t px-5 py-4 space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium">Total mensual</span>
              <div className="text-right">
                <span className="text-2xl font-serif font-semibold">{totalPrice}€</span>
                <span className="text-sm text-muted-foreground">/mes</span>
              </div>
            </div>
            {savings > 0 && (
              <p className="text-xs text-primary">Ahorro por compromiso: {savings}€/mes</p>
            )}
            <p className="text-[10px] text-muted-foreground">Compromiso mínimo: 3 meses por producto</p>
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
