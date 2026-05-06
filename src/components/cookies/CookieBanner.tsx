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
          className="fixed inset-x-0 bottom-0 z-[60] p-3 md:p-6 md:left-auto md:right-6 md:bottom-6 md:max-w-md animate-in slide-in-from-bottom-4 duration-300"
        >
          <div className="bg-card border border-border rounded-2xl shadow-lg p-5 md:p-6">
            <div className="flex items-start gap-3 mb-3">
              <div className="rounded-full bg-primary/30 p-2 flex-shrink-0">
                <Cookie className="h-5 w-5 text-foreground" aria-hidden />
              </div>
              <div>
                <h2 className="font-serif text-lg text-foreground mb-1">
                  Cuidamos tu experiencia (y tu privacidad)
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Usamos cookies necesarias para que la web funcione y, si nos lo permites, también de
                  analítica para entender cómo mejorarla. Tú decides.{" "}
                  <Link to="/privacidad" className="underline hover:text-foreground">
                    Saber más
                  </Link>
                  .
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button onClick={handleAccept} className="cta-tension flex-1">
                Aceptar todo
              </Button>
              <Button variant="outline" onClick={handleReject} className="flex-1">
                Rechazar todo
              </Button>
              <Button
                variant="ghost"
                onClick={() => setPrefsOpen(true)}
                className="flex-1"
              >
                Personalizar
              </Button>
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
