import { Package, Truck, CheckCircle2, Clock, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";
import { ItemFeedback } from "./ItemFeedback";
import type { Shipment, Feedback } from "@/hooks/useSubscription";

const STATUS_CONFIG = {
  scheduled: { label: "Programado", icon: Clock, className: "bg-blue-100 text-blue-700" },
  packed: { label: "Preparado", icon: Package, className: "bg-amber-100 text-amber-700" },
  shipped: { label: "En camino", icon: Truck, className: "bg-purple-100 text-purple-700" },
  delivered: { label: "Entregado", icon: CheckCircle2, className: "bg-emerald-100 text-emerald-700" },
};

interface ShipmentCardProps {
  shipment: Shipment;
  feedback: Feedback[];
  onFeedback: (itemKey: string, rating: "useful" | "not_useful") => void;
  isNext?: boolean;
}

export function ShipmentCard({ shipment, feedback, onFeedback, isNext }: ShipmentCardProps) {
  const [open, setOpen] = useState(isNext || false);
  const status = STATUS_CONFIG[shipment.status];
  const StatusIcon = status.icon;
  const items = Array.isArray(shipment.items) ? shipment.items : [];

  return (
    <Card className={isNext ? "border-primary/30 shadow-sm" : ""}>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <StatusIcon className="h-4 w-4 text-muted-foreground" />
                {isNext ? "Próximo envío" : `Envío — ${shipment.stage}`}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge className={status.className}>{status.label}</Badge>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {format(new Date(shipment.scheduled_date), "d 'de' MMMM yyyy", { locale: es })}
            </p>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            {items.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                  Contenido del pack
                </p>
                {items.map((item) => {
                  const itemFeedback = feedback.find((f) => f.item_key === item.key);
                  return (
                    <ItemFeedback
                      key={item.key}
                      item={item}
                      feedback={itemFeedback}
                      onFeedback={(rating) => onFeedback(item.key, rating)}
                      showFeedback={shipment.status === "delivered"}
                    />
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                El contenido se confirmará pronto.
              </p>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
