import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { type Subscription, daysUntilEnd } from "@/hooks/useSubscription";

const STATUS_LABEL: Record<Subscription["status"], string> = {
  active: "Activo",
  paused: "En pausa",
  cancelled: "Cancelado",
  expired: "Finalizado",
};

const STAGE_LABELS: Record<string, string> = {
  prenatal: "En espera",
  "0-3m": "Primeros días · 0–3 meses",
  "3-6m": "Descubriendo · 3–6 meses",
  "6-12m": "Explorando · 6–12 meses",
  "12-18m": "Creciendo · 12–18 meses",
  "18-24m": "Pequeño grande · 18–24 meses",
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

function HairlineButton({
  onClick,
  children,
  disabled,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="font-serif text-base text-foreground border-b border-foreground/40 hover:border-foreground transition-colors pb-0.5 disabled:opacity-50"
    >
      {children}
    </button>
  );
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const navigate = useNavigate();
  const [portalLoading, setPortalLoading] = useState(false);

  const days = daysUntilEnd(subscription.end_date);
  const isEndingSoon =
    subscription.status === "active" && days !== null && days <= 30 && days >= 0;
  const isExpiredPending =
    subscription.status === "expired" && subscription.pickup_status === "pending";
  const isPickupScheduled =
    subscription.pickup_status === "scheduled" && subscription.pickup_scheduled_date;

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

  const planName = PLAN_LABELS[subscription.plan_name] || subscription.plan_name;
  const stageLabel =
    STAGE_LABELS[subscription.current_stage] || subscription.current_stage;
  const statusLabel = STATUS_LABEL[subscription.status] ?? "Activo";

  return (
    <section aria-label="Tu servicio" className="space-y-8">
      {/* Cabecera editorial */}
      <header className="space-y-3">
        <p className="eyebrow text-[10px]">Tu servicio</p>
        <h3
          className="font-serif text-foreground"
          style={{ fontSize: "clamp(1.5rem, 2.8vw, 2rem)", fontWeight: 400, lineHeight: 1.15 }}
        >
          {planName}
        </h3>
        <p className="text-sm text-muted-foreground">
          Ahora: {stageLabel} · <span className="text-foreground/70">{statusLabel}</span>
        </p>
      </header>

      {/* Banners contextuales — hairline, sin caja de color */}
      {isPickupScheduled && (
        <div className="border-t border-foreground/10 pt-6">
          <p className="font-serif text-lg text-foreground leading-snug">
            Tu recogida está confirmada para el{" "}
            <strong className="font-normal">{formatEs(subscription.pickup_scheduled_date)}</strong>
            {subscription.pickup_window && (
              <>
                , ventana <strong className="font-normal">{subscription.pickup_window}</strong>
              </>
            )}
            .
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Pasaremos a por el kit. No tienes que hacer nada más.
          </p>
        </div>
      )}

      {isExpiredPending && (
        <div className="border-t border-foreground/10 pt-6 space-y-4">
          <div>
            <p className="font-serif text-lg text-foreground leading-snug">
              Tu Momento ha terminado.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Cuando quieras, programamos la recogida o preparamos el siguiente. Sin prisa.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Button size="sm" onClick={handleRenew}>
              Preparar el siguiente
            </Button>
            <a
              href="https://wa.me/34638706467?text=Hola%2C%20quiero%20programar%20la%20recogida%20de%20mi%20kit%20bebloo"
              target="_blank"
              rel="noopener noreferrer"
              className="font-serif text-base text-foreground border-b border-foreground/40 hover:border-foreground transition-colors pb-0.5"
            >
              Programar recogida
            </a>
          </div>
        </div>
      )}

      {isEndingSoon && !isExpiredPending && !isPickupScheduled && (
        <div className="border-t border-foreground/10 pt-6 space-y-4">
          <p className="font-serif text-lg text-foreground leading-snug">
            Tu Momento actual termina el{" "}
            <strong className="font-normal">{formatEs(subscription.end_date)}</strong>
            {days !== null && days >= 0 && (
              <>
                . Quedan {days} {days === 1 ? "día" : "días"}
              </>
            )}
            .
          </p>
          <p className="text-sm text-muted-foreground">
            Si quieres seguir, podemos preparar el siguiente cuando tú decidas.
          </p>
          <div>
            <Button size="sm" onClick={handleRenew}>
              Preparar el siguiente
            </Button>
          </div>
        </div>
      )}

      {/* Gestión */}
      {(subscription.status === "active" || subscription.status === "paused") && (
        <div className="border-t border-foreground/10 pt-6">
          <HairlineButton onClick={handleManage} disabled={portalLoading}>
            {portalLoading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Abriendo…
              </span>
            ) : (
              "Gestionar servicio"
            )}
          </HairlineButton>
        </div>
      )}
    </section>
  );
}
