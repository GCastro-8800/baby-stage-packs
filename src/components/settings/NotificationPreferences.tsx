import { useState } from "react";
import { Loader2, Save, Phone, Info } from "lucide-react";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
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
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <Phone className="h-5 w-5 text-primary-foreground" />
          Notificaciones
        </CardTitle>
        <CardDescription>
          Te avisamos cuando tu servicio termine y de las recogidas. Añade un teléfono si quieres
          recibir avisos por WhatsApp o SMS además del correo.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono móvil</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+34 600 00 00 00"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">Formato internacional con prefijo (+34…).</p>
        </div>

        <div className="space-y-3 rounded-lg border bg-secondary/30 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-sm">Email</p>
              <p className="text-xs text-muted-foreground">Siempre activo. Es tu canal principal.</p>
            </div>
            <Switch checked disabled />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-sm">WhatsApp</p>
              <p className="text-xs text-muted-foreground">Avisos importantes en tu móvil.</p>
            </div>
            <Switch
              checked={prefs.whatsapp}
              onCheckedChange={(v) => setPrefs((p) => ({ ...p, whatsapp: v }))}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-sm">SMS</p>
              <p className="text-xs text-muted-foreground">Como respaldo si no ves WhatsApp.</p>
            </div>
            <Switch
              checked={prefs.sms}
              onCheckedChange={(v) => setPrefs((p) => ({ ...p, sms: v }))}
            />
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-lg bg-primary/5 border border-primary/20 p-3 text-xs text-foreground">
          <Info className="h-4 w-4 text-primary-foreground shrink-0 mt-0.5" />
          <p>
            Los avisos por WhatsApp y SMS se activarán muy pronto. Mientras tanto, te escribimos por
            email.
          </p>
        </div>

        <Button className="w-full gap-2" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Guardar preferencias
        </Button>
      </CardContent>
    </Card>
  );
}
