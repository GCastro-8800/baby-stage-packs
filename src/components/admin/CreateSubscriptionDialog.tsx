import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type BabyStage = Database["public"]["Enums"]["baby_stage"];

const plans = [
  { id: "start", label: "BEBLOO Start (59€/mes)" },
  { id: "comfort", label: "BEBLOO Comfort (129€/mes)" },
  { id: "total-peace", label: "BEBLOO Total Peace (149€/mes)" },
];

const stages: { value: BabyStage; label: string }[] = [
  { value: "prenatal", label: "Prenatal" },
  { value: "0-3m", label: "0-3 meses" },
  { value: "3-6m", label: "3-6 meses" },
  { value: "6-12m", label: "6-12 meses" },
  { value: "12-18m", label: "12-18 meses" },
  { value: "18-24m", label: "18-24 meses" },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateSubscriptionDialog({ open, onOpenChange }: Props) {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState("");
  const [planName, setPlanName] = useState("");
  const [stage, setStage] = useState<BabyStage>("prenatal");
  const [nextShipmentDate, setNextShipmentDate] = useState("");

  const { data: profiles, isLoading: profilesLoading } = useQuery({
    queryKey: ["admin-profiles-for-sub"],
    queryFn: async () => {
      const { data: allProfiles, error } = await supabase
        .from("profiles")
        .select("id, full_name")
        .order("full_name");
      if (error) throw error;

      // Get users with active subscriptions to filter them out
      const { data: activeSubs } = await supabase
        .from("subscriptions")
        .select("user_id")
        .eq("status", "active");

      const activeUserIds = new Set(activeSubs?.map((s) => s.user_id) || []);
      return allProfiles?.filter((p) => !activeUserIds.has(p.id)) || [];
    },
    enabled: open,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("subscriptions").insert({
        user_id: userId,
        plan_name: planName,
        current_stage: stage,
        next_shipment_date: nextShipmentDate || null,
        status: "active",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-subscriptions"] });
      toast.success("Suscripción creada");
      resetAndClose();
    },
    onError: () => toast.error("Error al crear la suscripción"),
  });

  const resetAndClose = () => {
    setUserId("");
    setPlanName("");
    setStage("prenatal");
    setNextShipmentDate("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva suscripción</DialogTitle>
          <DialogDescription>Crea una suscripción manual para un usuario registrado.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Usuario</Label>
            {profilesLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Cargando...
              </div>
            ) : (
              <Select value={userId} onValueChange={setUserId}>
                <SelectTrigger><SelectValue placeholder="Seleccionar usuario" /></SelectTrigger>
                <SelectContent>
                  {profiles?.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.full_name || p.id.slice(0, 8)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="space-y-2">
            <Label>Plan</Label>
            <Select value={planName} onValueChange={setPlanName}>
              <SelectTrigger><SelectValue placeholder="Seleccionar plan" /></SelectTrigger>
              <SelectContent>
                {plans.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Etapa del bebé</Label>
            <Select value={stage} onValueChange={(v) => setStage(v as BabyStage)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {stages.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Fecha próximo envío</Label>
            <Input type="date" value={nextShipmentDate} onChange={(e) => setNextShipmentDate(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={resetAndClose}>Cancelar</Button>
          <Button
            onClick={() => createMutation.mutate()}
            disabled={!userId || !planName || createMutation.isPending}
          >
            {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Crear suscripción
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
