import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut, CalendarIcon, Save, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import logo from "@/assets/logo-bebloo.png";

export default function Settings() {
  const navigate = useNavigate();
  const { user, profile, signOut, refreshProfile } = useAuth();
  const { toast } = useToast();

  const [fullName, setFullName] = useState("");
  const [situation, setSituation] = useState<"expecting" | "born">("expecting");
  const [date, setDate] = useState<Date | undefined>();
  const [isFirstChild, setIsFirstChild] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? "");
      setSituation((profile.parent_situation as "expecting" | "born") ?? "expecting");
      setIsFirstChild(profile.is_first_child ?? false);
      const dateStr = profile.parent_situation === "born" ? profile.baby_birth_date : profile.baby_due_date;
      setDate(dateStr ? new Date(dateStr) : undefined);
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const updates: Record<string, unknown> = {
      full_name: fullName.trim() || null,
      parent_situation: situation,
      is_first_child: isFirstChild,
    };

    if (situation === "expecting") {
      updates.baby_due_date = date ? format(date, "yyyy-MM-dd") : null;
      updates.baby_birth_date = null;
    } else {
      updates.baby_birth_date = date ? format(date, "yyyy-MM-dd") : null;
      updates.baby_due_date = null;
    }

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);

    if (error) {
      toast({ title: "Error al guardar", description: error.message, variant: "destructive" });
    } else {
      await refreshProfile();
      toast({ title: "Perfil actualizado", description: "Tus cambios se han guardado correctamente." });
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container max-w-6xl px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <a href="/" className="flex-shrink-0">
              <img src={logo} alt="bebloo" className="h-10 md:h-12" />
            </a>
            <Button variant="outline" onClick={handleSignOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container max-w-2xl px-4 md:px-6 py-8 md:py-12">
        <Button variant="ghost" className="gap-2 mb-6 -ml-2" onClick={() => navigate("/app")}>
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="font-display">Configuración del perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre completo</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Tu nombre"
              />
            </div>

            {/* Situación */}
            <div className="space-y-2">
              <Label>Situación</Label>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant={situation === "expecting" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => {
                    setSituation("expecting");
                    setDate(undefined);
                  }}
                >
                  Estoy esperando
                </Button>
                <Button
                  type="button"
                  variant={situation === "born" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => {
                    setSituation("born");
                    setDate(undefined);
                  }}
                >
                  Ya nació
                </Button>
              </div>
            </div>

            {/* Fecha */}
            <div className="space-y-2">
              <Label>
                {situation === "expecting" ? "Fecha esperada de nacimiento" : "Fecha de nacimiento"}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Primer hijo */}
            <div className="flex items-center justify-between">
              <Label htmlFor="firstChild">¿Es tu primer hijo/a?</Label>
              <Switch
                id="firstChild"
                checked={isFirstChild}
                onCheckedChange={setIsFirstChild}
              />
            </div>

            {/* Guardar */}
            <Button className="w-full gap-2" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Guardar cambios
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
