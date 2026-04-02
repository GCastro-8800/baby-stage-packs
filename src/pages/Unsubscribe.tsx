import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2, MailX } from "lucide-react";

type Status = "loading" | "valid" | "already" | "invalid" | "confirming" | "done" | "error";

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }

    const validate = async () => {
      try {
        const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${token}`;
        const res = await fetch(url, {
          headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
        });
        const data = await res.json();

        if (!res.ok) {
          setStatus("invalid");
        } else if (data.valid === false && data.reason === "already_unsubscribed") {
          setStatus("already");
        } else if (data.valid) {
          setStatus("valid");
        } else {
          setStatus("invalid");
        }
      } catch {
        setStatus("invalid");
      }
    };

    validate();
  }, [token]);

  const handleConfirm = async () => {
    setStatus("confirming");
    try {
      const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", {
        body: { token },
      });

      if (error) {
        setStatus("error");
        return;
      }

      if (data?.success) {
        setStatus("done");
      } else if (data?.reason === "already_unsubscribed") {
        setStatus("already");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-8 pb-8 text-center space-y-6">
          {status === "loading" && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground">Verificando…</p>
            </>
          )}

          {status === "valid" && (
            <>
              <MailX className="h-12 w-12 text-primary mx-auto" />
              <h1 className="text-xl font-semibold text-foreground">
                ¿Quieres darte de baja?
              </h1>
              <p className="text-muted-foreground text-sm">
                Dejarás de recibir emails de notificación de bebloo.
                Siempre podrás volver a suscribirte desde tu cuenta.
              </p>
              <Button onClick={handleConfirm} variant="default" size="lg" className="w-full">
                Confirmar baja
              </Button>
            </>
          )}

          {status === "confirming" && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground">Procesando…</p>
            </>
          )}

          {status === "done" && (
            <>
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <h1 className="text-xl font-semibold text-foreground">
                Te has dado de baja correctamente
              </h1>
              <p className="text-muted-foreground text-sm">
                Ya no recibirás más emails de notificación.
                Si cambias de opinión, puedes configurarlo desde tu cuenta.
              </p>
            </>
          )}

          {status === "already" && (
            <>
              <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto" />
              <h1 className="text-xl font-semibold text-foreground">
                Ya estás dado/a de baja
              </h1>
              <p className="text-muted-foreground text-sm">
                No recibirás más emails de notificación de bebloo.
              </p>
            </>
          )}

          {(status === "invalid" || status === "error") && (
            <>
              <XCircle className="h-12 w-12 text-destructive mx-auto" />
              <h1 className="text-xl font-semibold text-foreground">
                Enlace no válido
              </h1>
              <p className="text-muted-foreground text-sm">
                Este enlace de baja ha expirado o no es válido.
                Si necesitas ayuda, contacta con nosotros.
              </p>
            </>
          )}

          <p className="text-xs text-muted-foreground pt-4">
            bebloo — Todo llega a tiempo. 💙
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Unsubscribe;
