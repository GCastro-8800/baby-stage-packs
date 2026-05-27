import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ItemFeedback } from "./ItemFeedback";
import type { Shipment, Feedback } from "@/hooks/useSubscription";

const STATUS_LABEL: Record<Shipment["status"], string> = {
  scheduled: "Preparando tu próximo Momento",
  packed: "Listo para salir",
  shipped: "En camino a casa",
  delivered: "Entregado",
};

interface ShipmentCardProps {
  shipment: Shipment;
  feedback: Feedback[];
  onFeedback: (itemKey: string, rating: "useful" | "not_useful") => void;
  isNext?: boolean;
}

export function ShipmentCard({ shipment, feedback, onFeedback, isNext }: ShipmentCardProps) {
  const [open, setOpen] = useState(isNext || false);
  const items = Array.isArray(shipment.items) ? shipment.items : [];

  const date = new Date(shipment.scheduled_date);
  const day = format(date, "d", { locale: es });
  const month = format(date, "MMM", { locale: es });
  const year = format(date, "yyyy", { locale: es });

  const headline = isNext
    ? STATUS_LABEL[shipment.status]
    : "Entregado a tu hogar";

  return (
    <section
      aria-label={headline}
      className="py-8 md:py-12 border-t border-foreground/10"
    >
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="w-full text-left group"
          >
            <div className="flex items-start gap-6 md:gap-10">
              {/* Fecha grande */}
              <div className="shrink-0 text-center md:text-left">
                <p
                  className="font-serif text-foreground leading-none"
                  style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 400 }}
                >
                  {day}
                </p>
                <p className="text-[10px] tracking-[0.14em] uppercase text-muted-foreground mt-2">
                  {month} · {year}
                </p>
              </div>

              {/* Texto */}
              <div className="flex-1 min-w-0">
                <p className="eyebrow mb-3 text-[10px]">
                  {isNext ? "Próximo cambio" : "Último envío"}
                </p>
                <h3
                  className="font-serif text-foreground"
                  style={{ fontSize: "clamp(1.25rem, 2.4vw, 1.875rem)", fontWeight: 400, lineHeight: 1.2 }}
                >
                  {headline}
                </h3>
                {items.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {items.length} {items.length === 1 ? "pieza" : "piezas"}
                  </p>
                )}
              </div>

              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform shrink-0 mt-3 ${open ? "rotate-180" : ""}`}
                aria-hidden
              />
            </div>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="pt-8 md:pl-[5.5rem]">
            {items.length > 0 ? (
              <ul className="divide-y divide-foreground/10">
                {items.map((item) => {
                  const itemFeedback = feedback.find((f) => f.item_key === item.key);
                  return (
                    <li key={item.key} className="py-4">
                      <ItemFeedback
                        item={item}
                        feedback={itemFeedback}
                        onFeedback={(rating) => onFeedback(item.key, rating)}
                        showFeedback={shipment.status === "delivered"}
                      />
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground py-2">
                El contenido se confirmará pronto.
              </p>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
}
