import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";
import {
  hasConsent,
  acceptAll,
  rejectAll,
  CONSENT_EVENT,
  OPEN_PREFERENCES_EVENT,
} from "@/lib/consent";
import CookiePreferencesDialog from "./CookiePreferencesDialog";

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);

  useEffect(() => {
    // Defer one frame to avoid SSR/hydration noise and let the page render first.
    const t = window.setTimeout(() => setVisible(!hasConsent()), 400);
    const onUpdate = () => setVisible(!hasConsent());
    const onOpenPrefs = () => setPrefsOpen(true);
    window.addEventListener(CONSENT_EVENT, onUpdate);
    window.addEventListener(OPEN_PREFERENCES_EVENT, onOpenPrefs);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener(CONSENT_EVENT, onUpdate);
      window.removeEventListener(OPEN_PREFERENCES_EVENT, onOpenPrefs);
    };
  }, []);

  const handleAccept = () => {
    acceptAll();
    setVisible(false);
  };

  const handleReject = () => {
    rejectAll();
    setVisible(false);
  };

  return (
    <>
      {visible && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label="Aviso de cookies"
          className="fixed inset-x-0 bottom-0 z-[60] animate-in slide-in-from-bottom-2 duration-500"
        >
          <div className="bg-background/95 backdrop-blur-md border-t border-border">
            <div className="container max-w-6xl px-4 md:px-6 py-3 md:py-4">
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <Cookie className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" aria-hidden />
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    Usamos cookies para que la web funcione y, con tu permiso, para entender cómo mejorarla.{" "}
                    <Link to="/privacidad" className="underline underline-offset-2 hover:text-foreground">
                      Más info
                    </Link>
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPrefsOpen(true)}
                    className="text-xs h-9"
                  >
                    Personalizar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReject}
                    className="text-xs h-9"
                  >
                    Rechazar
                  </Button>
                  <Button
                    onClick={handleAccept}
                    size="sm"
                    className="text-xs h-9 bg-foreground text-background hover:bg-foreground/90"
                  >
                    Aceptar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <CookiePreferencesDialog
        open={prefsOpen}
        onOpenChange={setPrefsOpen}
        onSaved={() => setVisible(false)}
      />
    </>
  );
};

export default CookieBanner;
