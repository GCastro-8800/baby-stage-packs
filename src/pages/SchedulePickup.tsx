import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Loader2, CheckCircle2, Calendar as CalendarIcon, AlertCircle, PackageOpen } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import logo from "@/assets/logo-bebloo.png";

type Status = "loading" | "ready" | "scheduled" | "invalid" | "submitting" | "success";

const WINDOWS = [
  { value: "10:00-13:00", label: "Mañana · 10:00 – 13:00" },
  { value: "16:00-19:00", label: "Tarde · 16:00 – 19:00" },
];

interface ValidateResponse {
  ok: boolean;
  subscription?: {
    id: string;
    status: string;
    pickupStatus: string;
    pickupDate: string | null;
    pickupWindow: string | null;
  };
  tokenUsed?: boolean;
}

export default function SchedulePickup() {
  const { subscriptionId } = useParams<{ subscriptionId: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [status, setStatus] = useState<Status>("loading");
  const [data, setData] = useState<ValidateResponse["subscription"] | null>(null);
  const [date, setDate] = useState<Date | undefined>();
  const [window, setWindow] = useState<string>(WINDOWS[0].value);
  const [allowChange, setAllowChange] = useState(false);

  useEffect(() => {
    (async () => {
      if (!subscriptionId || !token) {
        setStatus("invalid");
        return;
      }
      const { data: res, error } = await supabase.functions.invoke<ValidateResponse>(
        "schedule-pickup",
        { body: { action: "validate", subscriptionId, token } },
      );
      if (error || !res?.ok || !res.subscription) {
        setStatus("invalid");
        return;
      }
      setData(res.subscription);
      if (res.subscription.pickupStatus === "scheduled" && res.subscription.pickupDate) {
        setStatus("scheduled");
      } else {
        setStatus("ready");
      }
    })();
  }, [subscriptionId, token]);

  // Allowed date range: from tomorrow up to 4 weeks ahead, weekdays only
  const { minDate, maxDate } = useMemo(() => {
    const min = new Date();
    min.setDate(min.getDate() + 1);
    min.setHours(0, 0, 0, 0);
    const max = new Date();
    max.setDate(max.getDate() + 28);
    max.setHours(0, 0, 0, 0);
    return { minDate: min, maxDate: max };
  }, []);

  const handleSubmit = async () => {
    if (!date || !window || !subscriptionId) return;
    setStatus("submitting");
    const pickupDate = format(date, "yyyy-MM-dd");
    const { data: res, error } = await supabase.functions.invoke(
      "schedule-pickup",
      { body: { action: "schedule", subscriptionId, token, pickupDate, pickupWindow: window } },
    );
    if (error || !res?.ok) {
      toast.error("No pudimos confirmar la recogida. Inténtalo de nuevo.");
      setStatus("ready");
      return;
    }
    setData((prev) => prev ? { ...prev, pickupStatus: "scheduled", pickupDate, pickupWindow: window } : prev);
    setStatus("success");
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="border-b border-border bg-background">
        <div className="container max-w-2xl px-4 py-4 flex items-center">
          <img src={logo} alt="bebloo" className="h-10" />
        </div>
      </header>

      <main className="container max-w-2xl px-4 py-10">
        {status === "loading" && (
          <Card>
            <CardContent className="py-16 flex flex-col items-center gap-3 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
              <p>Verificando tu enlace…</p>
            </CardContent>
          </Card>
        )}

        {status === "invalid" && (
          <Card>
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Enlace no válido
              </CardTitle>
              <CardDescription>
                Este enlace ha caducado o ya no es válido. Si necesitas programar la recogida,
                escríbenos por WhatsApp y te enviamos uno nuevo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <a href="https://wa.me/34638706467" target="_blank" rel="noopener noreferrer">
                  Contactar por WhatsApp
                </a>
              </Button>
            </CardContent>
          </Card>
        )}

        {(status === "scheduled" && !allowChange) && data && (
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                Recogida confirmada
              </CardTitle>
              <CardDescription>
                Pasaremos a recoger tu kit el{" "}
                <strong>
                  {data.pickupDate && format(new Date(data.pickupDate + "T00:00:00"), "EEEE d 'de' MMMM", { locale: es })}
                </strong>{" "}
                en la franja <strong>{data.pickupWindow}</strong>.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg bg-background/60 p-4 text-sm text-muted-foreground flex gap-3">
                <PackageOpen className="h-5 w-5 text-primary-foreground shrink-0 mt-0.5" />
                <div>
                  Ten el material listo y limpio en la entrada. No hace falta caja: nuestro equipo
                  llevará la suya.
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={() => setAllowChange(true)}>
                Cambiar fecha o franja
              </Button>
            </CardContent>
          </Card>
        )}

        {status === "success" && data && (
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                ¡Listo!
              </CardTitle>
              <CardDescription>
                Hemos guardado tu recogida para el{" "}
                <strong>
                  {data.pickupDate && format(new Date(data.pickupDate + "T00:00:00"), "EEEE d 'de' MMMM", { locale: es })}
                </strong>{" "}
                ({data.pickupWindow}). Te enviaremos un recordatorio el día anterior.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {(status === "ready" || status === "submitting" || (status === "scheduled" && allowChange)) && (
          <Card>
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary-foreground" />
                Programa la recogida de tu kit
              </CardTitle>
              <CardDescription>
                Elige el día y la franja que mejor te venga. Pasamos de lunes a viernes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="mb-3 block">Fecha</Label>
                <div className="rounded-lg border bg-background flex justify-center">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    locale={es}
                    fromDate={minDate}
                    toDate={maxDate}
                    disabled={(d) => {
                      const day = d.getDay();
                      return day === 0 || day === 6;
                    }}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </div>
              </div>

              <div>
                <Label className="mb-3 block">Franja horaria</Label>
                <RadioGroup value={window} onValueChange={setWindow} className="grid gap-2">
                  {WINDOWS.map((w) => (
                    <Label
                      key={w.value}
                      htmlFor={w.value}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-colors",
                        window === w.value ? "border-primary bg-primary/5" : "border-border hover:bg-secondary/50",
                      )}
                    >
                      <RadioGroupItem id={w.value} value={w.value} />
                      <span className="font-medium">{w.label}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleSubmit}
                disabled={!date || status === "submitting"}
              >
                {status === "submitting" ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Confirmar recogida
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
