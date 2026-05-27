import { useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    <aside className="border-y border-foreground/10 py-5 flex items-start gap-4">
      <div className="flex-1 text-sm">
        <p className="font-serif text-foreground text-lg leading-snug">
          ¿Nos dejas tu teléfono?
        </p>
        <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
          Así te avisamos por WhatsApp cuando preparemos un cambio o programemos
          una recogida. Nada más.
        </p>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <button
          onClick={() => navigate("/app/settings")}
          className="font-serif text-base text-foreground border-b border-foreground/40 hover:border-foreground transition-colors pb-0.5"
        >
          Añadir
        </button>
        <button
          onClick={handleDismiss}
          aria-label="Cerrar"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
