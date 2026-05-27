import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut, Loader2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useChildren } from "@/hooks/useChildren";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ChildCard } from "@/components/settings/ChildCard";
import { ChildFormDialog } from "@/components/settings/ChildFormDialog";
import { NotificationPreferences } from "@/components/settings/NotificationPreferences";
import type { Child } from "@/types/baby";
import logo from "@/assets/logo-bebloo.png";

function HairlineButton({
  children,
  onClick,
  disabled,
  loading,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 text-sm uppercase tracking-wider text-foreground border-b border-foreground/40 pb-1 hover:border-foreground transition-colors disabled:opacity-50"
    >
      {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      {children}
    </button>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const { user, profile, signOut, refreshProfile } = useAuth();
  const { children, canAddMore, createChild, updateChild, deleteChild, setActiveChild } = useChildren();
  const { toast } = useToast();

  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [savingName, setSavingName] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [deletingChild, setDeletingChild] = useState<Child | null>(null);

  const handleSaveName = async () => {
    if (!user) return;
    setSavingName(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName.trim() || null })
      .eq("id", user.id);

    if (error) {
      toast({ title: "Error al guardar", description: error.message, variant: "destructive" });
    } else {
      await refreshProfile();
      toast({ title: "Nombre actualizado" });
    }
    setSavingName(false);
  };

  const handleChildSubmit = async (data: { name?: string; situation: "expecting" | "born"; due_date?: string | null; birth_date?: string | null }) => {
    try {
      if (editingChild) {
        await updateChild.mutateAsync({ id: editingChild.id, ...data });
        toast({ title: "Hijo/a actualizado" });
      } else {
        await createChild.mutateAsync(data);
        toast({ title: "Hijo/a agregado" });
      }
      setFormOpen(false);
      setEditingChild(null);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!deletingChild) return;
    try {
      const wasActive = deletingChild.is_active;
      await deleteChild.mutateAsync(deletingChild.id);
      if (wasActive && children.length > 1) {
        const remaining = children.find((c) => c.id !== deletingChild.id);
        if (remaining) await setActiveChild.mutateAsync(remaining.id);
      }
      toast({ title: "Hijo/a eliminado" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
    setDeletingChild(null);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-foreground/10 sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
        <div className="container max-w-6xl px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <a href="/" className="flex-shrink-0">
              <img src={logo} alt="bebloo" className="h-10 md:h-12" />
            </a>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-foreground/70 border-b border-foreground/30 pb-1 hover:text-foreground hover:border-foreground transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container max-w-2xl px-4 md:px-6 py-12 md:py-20">
        <button
          onClick={() => navigate("/app")}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-foreground/60 hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Volver al inicio
        </button>

        <header className="space-y-3 mb-16 md:mb-20">
          <p className="text-[11px] uppercase tracking-[0.18em] text-foreground/60">Tu cuenta</p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground">Ajustes</h2>
          <p className="text-muted-foreground max-w-md">
            Tu perfil, tus pequeños y cómo te avisamos.
          </p>
        </header>

        <div className="space-y-16 md:space-y-20">
          {/* Profile */}
          <section className="space-y-6">
            <header className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-foreground/60">Perfil</p>
              <h3 className="font-display text-2xl md:text-3xl text-foreground">Tu nombre</h3>
            </header>

            <div className="space-y-2 max-w-sm">
              <Label htmlFor="fullName" className="text-xs uppercase tracking-wider text-foreground/70">
                Nombre completo
              </Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Tu nombre"
              />
            </div>

            <HairlineButton onClick={handleSaveName} disabled={savingName} loading={savingName}>
              Guardar nombre
            </HairlineButton>
          </section>

          <div className="border-t border-foreground/10" />

          {/* Children */}
          <section className="space-y-6">
            <header className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-foreground/60">Familia</p>
              <div className="flex items-end justify-between gap-4 flex-wrap">
                <h3 className="font-display text-2xl md:text-3xl text-foreground">
                  Tus pequeños
                </h3>
                {canAddMore && children.length > 0 && (
                  <button
                    onClick={() => { setEditingChild(null); setFormOpen(true); }}
                    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-foreground/80 border-b border-foreground/40 pb-1 hover:text-foreground hover:border-foreground transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Añadir
                  </button>
                )}
              </div>
              {!canAddMore && (
                <p className="text-xs text-muted-foreground">Máximo de 5 alcanzado.</p>
              )}
            </header>

            <div>
              {children.length === 0 ? (
                <div className="space-y-5 py-4">
                  <p className="text-muted-foreground">
                    Aún no has añadido a nadie. Cuéntanos quién viene en camino o quién acaba de llegar.
                  </p>
                  <HairlineButton onClick={() => { setEditingChild(null); setFormOpen(true); }}>
                    <Plus className="h-3.5 w-3.5" />
                    Añadir el primero
                  </HairlineButton>
                </div>
              ) : (
                children.map((child) => (
                  <ChildCard
                    key={child.id}
                    child={child}
                    onEdit={() => { setEditingChild(child); setFormOpen(true); }}
                    onDelete={() => setDeletingChild(child)}
                    onSetActive={() => setActiveChild.mutate(child.id)}
                    isOnly={children.length === 1}
                  />
                ))
              )}
            </div>
          </section>

          <div className="border-t border-foreground/10" />

          {/* Notifications */}
          <NotificationPreferences />
        </div>
      </main>

      <ChildFormDialog
        open={formOpen}
        onOpenChange={(open) => { setFormOpen(open); if (!open) setEditingChild(null); }}
        onSubmit={handleChildSubmit}
        child={editingChild}
        isLoading={createChild.isPending || updateChild.isPending}
      />

      <AlertDialog open={!!deletingChild} onOpenChange={(open) => !open && setDeletingChild(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará {deletingChild?.name || "este registro"} de tu lista. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
