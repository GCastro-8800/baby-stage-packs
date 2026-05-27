import { useState } from "react";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+[1-9]\d{6,14}$/, { message: "Usa formato internacional, p. ej. +34600000000" });

interface Prefs {
  email: boolean;
  whatsapp: boolean;
  sms: boolean;
}

export function NotificationPreferences() {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();

  const initialPrefs: Prefs = (profile?.notification_preferences as Prefs | null) ?? {
    email: true,
    whatsapp: true,
    sms: true,
  };

  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [prefs, setPrefs] = useState<Prefs>(initialPrefs);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user) return;

    let normalisedPhone: string | null = null;
    if (phone.trim().length > 0) {
      const parsed = phoneSchema.safeParse(phone);
      if (!parsed.success) {
        toast({
          title: "Teléfono no válido",
          description: parsed.error.issues[0].message,
          variant: "destructive",
        });
        return;
      }
      normalisedPhone = parsed.data;
    }

    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        phone: normalisedPhone,
        notification_preferences: { ...prefs },
      })
      .eq("id", user.id);
    setSaving(false);

    if (error) {
      toast({ title: "Error al guardar", description: error.message, variant: "destructive" });
      return;
    }
    await refreshProfile();
    toast({ title: "Preferencias guardadas" });
  };

  return (
    <section className="space-y-6">
      <header className="space-y-3">
        <p className="text-[11px] uppercase tracking-[0.18em] text-foreground/60">Avisos</p>
        <h3 className="font-display text-2xl md:text-3xl text-foreground">
          Cómo te escribimos
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Te avisamos cuando tu Momento esté por terminar y cuando programemos una recogida.
        </p>
      </header>

      <div className="space-y-2 max-w-sm">
        <Label htmlFor="phone" className="text-xs uppercase tracking-wider text-foreground/70">
          Teléfono móvil
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+34 600 00 00 00"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">Formato internacional con prefijo (+34…).</p>
      </div>

      <div>
        {[
          { key: "email", label: "Email", hint: "Siempre activo. Es tu canal principal.", disabled: true, checked: true },
          { key: "whatsapp", label: "WhatsApp", hint: "Avisos importantes en tu móvil.", disabled: false, checked: prefs.whatsapp },
          { key: "sms", label: "SMS", hint: "Como respaldo si no ves WhatsApp.", disabled: false, checked: prefs.sms },
        ].map((row) => (
          <div
            key={row.key}
            className="flex items-center justify-between gap-6 py-4 border-b border-foreground/10 last:border-b-0"
          >
            <div>
              <p className="font-display text-base text-foreground">{row.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{row.hint}</p>
            </div>
            <Switch
              checked={row.checked}
              disabled={row.disabled}
              onCheckedChange={(v) =>
                setPrefs((p) => ({ ...p, [row.key]: v } as Prefs))
              }
            />
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground italic">
        WhatsApp y SMS llegarán muy pronto. Mientras tanto, te escribimos por email.
      </p>

      <button
        onClick={handleSave}
        disabled={saving}
        className="inline-flex items-center gap-2 text-sm uppercase tracking-wider text-foreground border-b border-foreground/40 pb-1 hover:border-foreground transition-colors disabled:opacity-50"
      >
        {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        Guardar preferencias
      </button>
    </section>
  );
}
