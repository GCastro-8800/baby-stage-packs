import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, PauseCircle, XCircle, Sparkles, ExternalLink, Loader2, Clock, PackageOpen, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { type Subscription, daysUntilEnd } from "@/hooks/useSubscription";

const STATUS_CONFIG = {
  active: { label: "Activa", icon: CheckCircle, className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  paused: { label: "Pausada", icon: PauseCircle, className: "bg-amber-100 text-amber-700 border-amber-200" },
  cancelled: { label: "Cancelada", icon: XCircle, className: "bg-red-100 text-red-700 border-red-200" },
  expired: { label: "Finalizada", icon: Clock, className: "bg-muted text-muted-foreground border-border" },
} as const;

const STAGE_LABELS: Record<string, string> = {
  prenatal: "Preparándote",
  "0-3m": "Primeros días (0-3 meses)",
  "3-6m": "Descubriendo (3-6 meses)",
  "6-12m": "Explorando (6-12 meses)",
  "12-18m": "Creciendo (12-18 meses)",
  "18-24m": "Pequeño grande (18-24 meses)",
};

const PLAN_LABELS: Record<string, string> = {
  start: "BEBLOO Start",
  esencial: "BEBLOO Start",
  comfort: "BEBLOO Comfort",
  "total-peace": "BEBLOO Total Peace",
};

interface SubscriptionCardProps {
  subscription: Subscription;
}

function formatEs(date: string | null): string {
  if (!date) return "";
  return format(new Date(date + "T00:00:00"), "d 'de' MMMM", { locale: es });
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const navigate = useNavigate();
  const status = STATUS_CONFIG[subscription.status] ?? STATUS_CONFIG.active;
  const StatusIcon = status.icon;
  const [portalLoading, setPortalLoading] = useState(false);

  const days = daysUntilEnd(subscription.end_date);
  const isEndingSoon = subscription.status === "active" && days !== null && days <= 30 && days >= 0;
  const isExpiredPending = subscription.status === "expired" && subscription.pickup_status === "pending";
  const isPickupScheduled = subscription.pickup_status === "scheduled" && subscription.pickup_scheduled_date;

  const handleManage = async () => {
    setPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      } else {
        throw new Error("No portal URL returned");
      }
    } catch (err) {
      console.error("Portal error:", err);
      toast.error("No se pudo abrir el portal de gestión. Inténtalo de nuevo.");
    } finally {
      setPortalLoading(false);
    }
  };

  const handleRenew = () => {
    navigate(`/configurador?renew=${subscription.id}`);
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            Tu servicio
          </CardTitle>
          <Badge className={status.className}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {status.label}
          </Badge>
        </div>
        <CardDescription>
          {PLAN_LABELS[subscription.plan_name] || subscription.plan_name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Etapa actual</span>
            <span className="font-medium">
              {STAGE_LABELS[subscription.current_stage] || subscription.current_stage}
            </span>
          </div>

          {/* Pickup scheduled banner (highest priority) */}
          {isPickupScheduled && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 flex items-start gap-2">
              <PackageOpen className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-900">
                Recogida confirmada el <strong>{formatEs(subscription.pickup_scheduled_date)}</strong>
                {subscription.pickup_window && <> · {subscription.pickup_window}</>}
              </p>
            </div>
          )}

          {/* Expired + pending pickup */}
          {isExpiredPending && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 space-y-2">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm">
                  Tu servicio ha terminado. Programa la recogida del kit o renueva para seguir.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button size="sm" className="flex-1" onClick={handleRenew}>
                  Renovar
                </Button>
                <Button size="sm" variant="outline" className="flex-1" onClick={handleManage}>
                  Programar recogida
                </Button>
              </div>
            </div>
          )}

          {/* Ending soon banner */}
          {isEndingSoon && !isExpiredPending && !isPickupScheduled && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-2">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-900">
                  Tu servicio termina el <strong>{formatEs(subscription.end_date)}</strong>
                  {days !== null && days >= 0 && <> · quedan {days} {days === 1 ? "día" : "días"}</>}.
                </p>
              </div>
              <Button size="sm" className="w-full" onClick={handleRenew}>
                Renovar ahora
              </Button>
            </div>
          )}

          {subscription.status === "active" && !isEndingSoon && (
            <p className="text-sm text-muted-foreground bg-background/60 rounded-lg p-3 text-center">
              ✨ Todo bajo control. Nos encargamos de todo.
            </p>
          )}

          {(subscription.status === "active" || subscription.status === "paused") && (
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2"
              onClick={handleManage}
              disabled={portalLoading}
            >
              {portalLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="h-4 w-4" />
              )}
              Gestionar servicio
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
