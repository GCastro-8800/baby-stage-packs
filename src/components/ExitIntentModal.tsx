import { useEffect, useRef, useState } from "react";
import { X, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLeadCapture } from "@/hooks/useLeadCapture";
import { useAnalytics } from "@/hooks/useAnalytics";

const STORAGE_KEY = "bebloo_exit_modal_shown";
const MIN_TIME_ON_PAGE_MS = 30_000;

interface ExitIntentModalProps {
  /** Plan identifier passed to the lead. Defaults to 'configurator-exit'. */
  plan?: string;
  /** If true, modal is suppressed (e.g. user already submitted email this session). */
  disabled?: boolean;
}

export default function ExitIntentModal({
  plan = "configurador-exit",
  disabled = false,
}: ExitIntentModalProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const mountedAt = useRef<number>(Date.now());
  const { track } = useAnalytics();
  const { submitLead, isLoading, isSubmitted, reset } = useLeadCapture();

  useEffect(() => {
    if (disabled) return;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY) === "1") return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    const trigger = () => {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
      if (Date.now() - mountedAt.current < MIN_TIME_ON_PAGE_MS) return;
      sessionStorage.setItem(STORAGE_KEY, "1");
      setOpen(true);
      track("modal_open", { source: "exit_intent" });
    };

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger();
    };

    const onPopState = () => {
      // Re-push so the user stays on the page when we capture them
      window.history.pushState(null, "", window.location.href);
      trigger();
    };

    if (isMobile) {
      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", onPopState);
    } else {
      document.addEventListener("mouseleave", onMouseLeave);
    }

    return () => {
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("popstate", onPopState);
    };
  }, [disabled, track]);

  const close = () => {
    setOpen(false);
    setEmail("");
    reset();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    await submitLead(
      { email, plan, postal_code: null },
      { email, plan },
      { source: "exit_intent" },
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={close}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md rounded-2xl bg-background shadow-xl p-6"
      >
        <button
          onClick={close}
          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>

        {!isSubmitted ? (
          <>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                <Mail className="h-5 w-5 text-primary-foreground" />
              </div>
              <h2 className="font-serif text-xl text-foreground">¿Te quedas con la duda?</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-5">
              Te enviamos por email un resumen de tu selección y unos consejos de
              padres expertos. Sin compromiso, sin spam.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Quiero recibirlo"}
              </Button>
              <p className="text-[11px] text-muted-foreground text-center">
                Solo te escribimos si lo necesitas. Puedes darte de baja en cualquier momento.
              </p>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <h2 className="font-serif text-xl text-foreground mb-2">¡Hecho! 💙</h2>
            <p className="text-sm text-muted-foreground mb-5">
              Te llegará en unos minutos. Mientras tanto, ¿quieres seguir mirando?
            </p>
            <Button onClick={close} className="w-full">Seguir explorando</Button>
          </div>
        )}
      </div>
    </div>
  );
}
