import { X, Sparkles, Truck, RefreshCw, HeadphonesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/data/productCatalog";

interface SelectionSidebarProps {
  products: Product[];
  totalPrice: number;
  onRemove: (productId: string) => void;
  onCheckout: () => void;
}

const INCLUDED_PERKS = [
  { icon: Sparkles, label: "Limpieza UV-C profesional" },
  { icon: Truck, label: "Entrega y recogida en casa" },
  { icon: RefreshCw, label: "Cambios gratis entre etapas" },
  { icon: HeadphonesIcon, label: "Soporte experto personalizado" },
];

export default function SelectionSidebar({ products, totalPrice, onRemove, onCheckout }: SelectionSidebarProps) {
  const estimatedSavings = Math.round(totalPrice * 12 * 0.6);

  return (
    <aside className="sticky top-28 space-y-5">
      <div className="rounded-2xl bg-card shadow-md p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg">Tu selección</h3>
          <span className="text-xs font-medium text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
            {products.length} {products.length === 1 ? "producto" : "productos"}
          </span>
        </div>

        {products.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            Aún no has seleccionado productos
          </p>
        ) : (
          <ul className="space-y-2.5">
            {products.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-2 text-sm group">
                <span className="truncate flex-1">{p.name}</span>
                <span className="text-muted-foreground whitespace-nowrap font-medium">{p.pricePerMonth}€</span>
                <button
                  onClick={() => onRemove(p.id)}
                  className="text-muted-foreground/50 hover:text-destructive transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                  aria-label={`Quitar ${p.name}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="border-t pt-4 space-y-1">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium">Total mensual</span>
            <div className="text-right">
              <span className="text-3xl font-serif font-semibold">{totalPrice}€</span>
              <span className="text-sm text-muted-foreground">/mes</span>
            </div>
          </div>
          {products.length > 0 && (
            <p className="text-xs text-primary-foreground/70">
              Ahorro estimado vs compra: ~{estimatedSavings}€
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
          {INCLUDED_PERKS.map((perk) => (
            <li key={perk.label} className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <perk.icon className="h-4 w-4 text-primary-foreground" />
              </div>
              {perk.label}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
