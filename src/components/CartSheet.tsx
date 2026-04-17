import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSelectionCount, SELECTION_CHANGED_EVENT } from "@/hooks/useSelectionCount";
import { Product, getProductById } from "@/data/productCatalog";
import { DEFAULT_DURATION } from "@/lib/constants";
import ProductImagePlaceholder from "@/components/configurator/ProductImagePlaceholder";

const STORAGE_KEY = "bebloo_selection";

interface CartItem {
  product: Product;
  duration: number;
  price: number;
}

function readCartItems(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const ids: string[] = Array.isArray(parsed.productIds) ? parsed.productIds : [];
    const durations: Record<string, number> = parsed.durations ?? {};
    return ids
      .map((id) => {
        const p = getProductById(id);
        if (!p) return null;
        const duration = durations[id] ?? DEFAULT_DURATION;
        const price = p.prices?.[duration] ?? p.pricePerMonth;
        return { product: p, duration, price };
      })
      .filter(Boolean) as CartItem[];
  } catch {
    return [];
  }
}

function removeFromStorage(productId: string) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : { productIds: [], durations: {} };
    parsed.productIds = (parsed.productIds ?? []).filter((id: string) => id !== productId);
    if (parsed.durations) delete parsed.durations[productId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    window.dispatchEvent(new Event(SELECTION_CHANGED_EVENT));
  } catch {
    /* ignore */
  }
}

interface CartSheetProps {
  variant?: "icon" | "compact";
}

export default function CartSheet({ variant = "icon" }: CartSheetProps) {
  const navigate = useNavigate();
  const count = useSelectionCount();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (!open) return;
    setItems(readCartItems());
    const refresh = () => setItems(readCartItems());
    window.addEventListener(SELECTION_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(SELECTION_CHANGED_EVENT, refresh);
  }, [open]);

  const total = items.reduce((sum, it) => sum + it.price, 0);

  const goToProduct = (id: string) => {
    setOpen(false);
    navigate(`/mi-seleccion`, { state: { preselectedProduct: id } });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size={variant === "icon" ? "icon" : "sm"}
          aria-label="Ver mi cesta"
          className="relative"
        >
          <ShoppingBag className="h-5 w-5" />
          {count > 0 && (
            <Badge
              variant="default"
              className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 flex items-center justify-center text-[10px] rounded-full"
            >
              {count}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Mi cesta {count > 0 && <span className="text-sm text-muted-foreground">({count})</span>}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto -mx-6 px-6 mt-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              <ShoppingBag className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>Tu cesta está vacía</p>
              <Button
                variant="link"
                size="sm"
                onClick={() => {
                  setOpen(false);
                  navigate("/catalogo");
                }}
              >
                Explorar catálogo
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3 p-2 rounded-lg border hover:border-primary/40 transition-colors"
              >
                <button
                  onClick={() => goToProduct(item.product.id)}
                  className="shrink-0"
                  aria-label={`Ver ${item.product.name}`}
                >
                  <ProductImagePlaceholder
                    category={item.product.category}
                    image={item.product.image}
                    size="sm"
                  />
                </button>
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => goToProduct(item.product.id)}
                    className="text-left w-full"
                  >
                    <p className="text-sm font-medium truncate hover:text-primary transition-colors">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.product.brand}</p>
                  </button>
                  <p className="text-xs font-semibold mt-1">
                    {item.price}€<span className="font-normal text-muted-foreground">/mes</span>
                    <span className="text-muted-foreground font-normal"> · {item.duration} meses</span>
                  </p>
                </div>
                <button
                  onClick={() => removeFromStorage(item.product.id)}
                  className="h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                  aria-label={`Quitar ${item.product.name}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t pt-4 mt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total mensual</span>
              <span className="text-lg font-semibold">{total}€/mes</span>
            </div>
            <Button
              className="w-full gap-2"
              onClick={() => {
                setOpen(false);
                navigate("/mi-seleccion");
              }}
            >
              Ver mi selección
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
