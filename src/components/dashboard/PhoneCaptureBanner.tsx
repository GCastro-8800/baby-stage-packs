import { useState } from "react";
import { Phone, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const DISMISS_KEY = "bebloo-phone-banner-dismissed";

interface Props {
  show: boolean;
}

export function PhoneCaptureBanner({ show }: Props) {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(
    typeof window !== "undefined" && window.localStorage.getItem(DISMISS_KEY) === "1",
  );

  if (!show || dismissed) return null;

  const handleDismiss = () => {
    window.localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  return (
    <div className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 flex items-start gap-3">
      <Phone className="h-5 w-5 text-primary-foreground shrink-0 mt-0.5" />
      <div className="flex-1 text-sm">
        <p className="font-medium">Añade tu teléfono para no perderte nada</p>
        <p className="text-muted-foreground text-xs mt-0.5">
          Te avisaremos por WhatsApp cuando tu servicio esté por terminar o haya una recogida.
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button size="sm" variant="outline" onClick={() => navigate("/app/settings")}>
          Añadir
        </Button>
        <Button size="icon" variant="ghost" onClick={handleDismiss} aria-label="Cerrar">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
