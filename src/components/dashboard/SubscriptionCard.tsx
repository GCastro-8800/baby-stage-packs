import { useState } from "react";
import { CheckCircle, PauseCircle, XCircle, Sparkles, ExternalLink, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Subscription } from "@/hooks/useSubscription";

const STATUS_CONFIG = {
  active: { label: "Activa", icon: CheckCircle, variant: "default" as const, className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  paused: { label: "Pausada", icon: PauseCircle, variant: "secondary" as const, className: "bg-amber-100 text-amber-700 border-amber-200" },
  cancelled: { label: "Cancelada", icon: XCircle, variant: "destructive" as const, className: "bg-red-100 text-red-700 border-red-200" },
};

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

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const status = STATUS_CONFIG[subscription.status];
  const StatusIcon = status.icon;
  const [portalLoading, setPortalLoading] = useState(false);

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
    } catch (err: any) {
      console.error("Portal error:", err);
      toast.error("No se pudo abrir el portal de gestión. Inténtalo de nuevo.");
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            Tu suscripción
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
          {subscription.status === "active" && (
            <>
              <p className="text-sm text-muted-foreground bg-background/60 rounded-lg p-3 text-center">
                ✨ Todo bajo control. Nos encargamos de todo.
              </p>
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
                Gestionar suscripción
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}