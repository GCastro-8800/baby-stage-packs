import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getConsent, setConsent, acceptAll, rejectAll } from "@/lib/consent";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
}

const CookiePreferencesDialog = ({ open, onOpenChange, onSaved }: Props) => {
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (!open) return;
    const current = getConsent();
    setAnalytics(current?.analytics ?? false);
    setMarketing(current?.marketing ?? false);
  }, [open]);

  const handleSave = () => {
    setConsent({ analytics, marketing });
    onOpenChange(false);
    onSaved?.();
  };

  const handleAccept = () => {
    acceptAll();
    onOpenChange(false);
    onSaved?.();
  };

  const handleReject = () => {
    rejectAll();
    onOpenChange(false);
    onSaved?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Tus preferencias de cookies</DialogTitle>
          <DialogDescription>
            En bebloo cuidamos también tu privacidad. Elige qué tipo de cookies quieres permitir.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-4 bg-muted/40">
            <div>
              <p className="font-semibold">Necesarias</p>
              <p className="text-sm text-muted-foreground">
                Imprescindibles para que la web funcione: sesión, login y tu selección. Siempre activas.
              </p>
            </div>
            <Switch checked disabled />
          </div>

          <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
            <div>
              <p className="font-semibold">Analítica</p>
              <p className="text-sm text-muted-foreground">
                Google Analytics y Hotjar. Nos ayudan a entender cómo usas la web para mejorarla.
              </p>
            </div>
            <Switch checked={analytics} onCheckedChange={setAnalytics} />
          </div>

          <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
            <div>
              <p className="font-semibold">Marketing</p>
              <p className="text-sm text-muted-foreground">
                Cookies para mostrarte publicidad relevante en otras webs. Hoy no usamos ninguna, pero podríamos en el futuro.
              </p>
            </div>
            <Switch checked={marketing} onCheckedChange={setMarketing} />
          </div>

          <p className="text-xs text-muted-foreground">
            Puedes cambiar tus preferencias cuando quieras desde el enlace "Configurar cookies" del pie de página.{" "}
            <Link to="/privacidad" className="underline hover:text-foreground">
              Más información
            </Link>
            .
          </p>
        </div>

        <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReject}>
              Rechazar todo
            </Button>
            <Button variant="outline" onClick={handleAccept}>
              Aceptar todo
            </Button>
          </div>
          <Button onClick={handleSave} className="cta-tension">
            Guardar mis preferencias
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CookiePreferencesDialog;
