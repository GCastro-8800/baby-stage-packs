import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut, Save, Loader2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useChildren } from "@/hooks/useChildren";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function Settings() {
  const navigate = useNavigate();
  const { user, profile, signOut, refreshProfile } = useAuth();
  const { children, canAddMore, createChild, updateChild, deleteChild, setActiveChild } = useChildren();
  const { toast } = useToast();

  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [savingName, setSavingName] = useState(false);

  // Child form dialog state
  const [formOpen, setFormOpen] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);

  // Delete confirmation state
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
      // If deleted child was active and there are others, activate first remaining
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

      <main className="container max-w-2xl px-4 md:px-6 py-8 md:py-12">
        <Button variant="ghost" className="gap-2 mb-6 -ml-2" onClick={() => navigate("/app")}>
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Button>

        <div className="space-y-6">
          {/* Profile name */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Tu perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre completo</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Tu nombre"
                />
              </div>
              <Button className="w-full gap-2" onClick={handleSaveName} disabled={savingName}>
                {savingName ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Guardar nombre
              </Button>
            </CardContent>
          </Card>

          {/* Children section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-display">Mis hijos</CardTitle>
                <Button
                  size="sm"
                  onClick={() => { setEditingChild(null); setFormOpen(true); }}
                  disabled={!canAddMore}
                  className="gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Agregar
                </Button>
              </div>
              {!canAddMore && (
                <p className="text-sm text-muted-foreground">Máximo de 5 hijos alcanzado.</p>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {children.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">
                  Aún no has agregado ningún hijo/a.
                </p>
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
            </CardContent>
          </Card>
          {/* Notifications */}
          <NotificationPreferences />
        </div>
      </main>

      {/* Child form dialog */}
      <ChildFormDialog
        open={formOpen}
        onOpenChange={(open) => { setFormOpen(open); if (!open) setEditingChild(null); }}
        onSubmit={handleChildSubmit}
        child={editingChild}
        isLoading={createChild.isPending || updateChild.isPending}
      />

      {/* Delete confirmation */}
      <AlertDialog open={!!deletingChild} onOpenChange={(open) => !open && setDeletingChild(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar hijo/a?</AlertDialogTitle>
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
