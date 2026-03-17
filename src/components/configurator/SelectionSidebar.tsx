import { X, Sparkles, Truck, RefreshCw, HeadphonesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/data/productCatalog";
import { DURATION_OPTIONS } from "@/lib/constants";

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
{ icon: Sparkles, label: "Limpieza UV-C profesional" },
{ icon: Truck, label: "Entrega y recogida en casa" },
{ icon: RefreshCw, label: "Cambios gratis entre etapas" },
{ icon: HeadphonesIcon, label: "Soporte experto personalizado" }];


export default function SelectionSidebar({
  products,
  totalPrice,
  onRemove,
  onCheckout,
  getDuration,
  setDuration,
  getDiscountedPrice
}: SelectionSidebarProps) {
  // Calculate upfront total (sum of price × months for each product)
  const upfrontTotal = products.reduce((sum, p) => {
    const months = getDuration(p.id);
    const price = getDiscountedPrice(p);
    return sum + price * months;
  }, 0);

  return (
    <aside className="sticky top-28 space-y-5">
      <div className="rounded-2xl bg-card shadow-md p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg">Tu selección</h3>
          <span className="text-xs font-medium text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
            {products.length} {products.length === 1 ? "producto" : "productos"}
          </span>
        </div>

        {products.length === 0 ?
        <p className="text-sm text-muted-foreground py-6 text-center">
            Aún no has seleccionado productos
          </p> :

        <ul className="space-y-4">
            {products.map((p) => {
            const months = getDuration(p.id);
            const discounted = getDiscountedPrice(p);
            const basePrice = p.prices?.[1] ?? p.pricePerMonth;
            const hasDiscount = discounted < basePrice;
            const itemTotal = discounted * months;
            return (
              <li key={p.id} className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm truncate flex-1">{p.name}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {hasDiscount &&
                    <span className="text-xs text-muted-foreground line-through">{basePrice}€</span>
                    }
                      <span className="text-sm font-medium">{discounted}€/mes</span>
                      <button
                      onClick={() => onRemove(p.id)}
                      className="text-muted-foreground/60 hover:text-destructive transition-colors ml-1"
                      aria-label={`Quitar ${p.name}`}>
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {DURATION_OPTIONS.map((opt) =>
                    <button
                      key={opt.months}
                      onClick={() => setDuration(p.id, opt.months)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${
                      months === opt.months ?
                      "bg-primary text-primary-foreground" :
                      "bg-muted text-muted-foreground hover:text-foreground"}`
                      }>
                          {opt.months}m
                        </button>
                    )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      = {itemTotal}€
                    </span>
                  </div>
                </li>);

          })}
          </ul>
        }

        <div className="border-t pt-4 space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium">Pago único</span>
            <div className="text-right">
              <span className="text-3xl font-serif font-semibold">{upfrontTotal}€</span>
            </div>
          </div>
          {products.length > 0 && (
            <p className="text-[11px] text-muted-foreground">
              Se cobra el importe total del compromiso de una sola vez
            </p>
          )}
        </div>

        <Button className="w-full cta-tension" size="lg" onClick={onCheckout}>
          Contratar ahora
        </Button>
      </div>

      <div className="rounded-2xl bg-card shadow-sm p-5 space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Incluye siempre</h4>
        <ul className="space-y-3">
          {INCLUDED_PERKS.map((perk) =>
          <li key={perk.label} className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <perk.icon className="h-4 w-4 text-primary" />
              </div>
              {perk.label}
            </li>
          )}
        </ul>
      </div>
    </aside>);

}
