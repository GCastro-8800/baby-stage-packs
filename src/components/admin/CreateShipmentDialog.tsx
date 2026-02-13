import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { plansEquipment } from "@/data/planEquipment";
import type { Database } from "@/integrations/supabase/types";

type BabyStage = Database["public"]["Enums"]["baby_stage"];

const stages: { value: BabyStage; label: string }[] = [
  { value: "prenatal", label: "Prenatal" },
  { value: "0-3m", label: "0-3 meses" },
  { value: "3-6m", label: "3-6 meses" },
  { value: "6-12m", label: "6-12 meses" },
  { value: "12-18m", label: "12-18 meses" },
  { value: "18-24m", label: "18-24 meses" },
];

interface ShipmentItem {
  key: string;
  name: string;
  brand: string;
  model: string;
  category: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateShipmentDialog({ open, onOpenChange }: Props) {
  const queryClient = useQueryClient();
  const [subscriptionId, setSubscriptionId] = useState("");
  const [stage, setStage] = useState<BabyStage>("0-3m");
  const [scheduledDate, setScheduledDate] = useState("");
  const [selectedItems, setSelectedItems] = useState<ShipmentItem[]>([]);

  const { data: activeSubs, isLoading } = useQuery({
    queryKey: ["admin-active-subs-for-shipment"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });
      if (error) throw error;

      const userIds = [...new Set(data.map((s) => s.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", userIds);
      const profileMap = new Map(profiles?.map((p) => [p.id, p.full_name]) || []);

      return data.map((s) => ({
        ...s,
        user_name: profileMap.get(s.user_id) || "Sin nombre",
      }));
    },
    enabled: open,
  });

  const selectedSub = activeSubs?.find((s) => s.id === subscriptionId);
  const planData = selectedSub ? plansEquipment.find((p) => p.id === selectedSub.plan_name) : null;

  const toggleItem = (category: string, brand: string, model: string) => {
    const key = `${category}-${brand}-${model}`;
    const exists = selectedItems.find((i) => i.key === key);
    if (exists) {
      setSelectedItems(selectedItems.filter((i) => i.key !== key));
    } else {
      setSelectedItems([...selectedItems, { key, name: `${brand} ${model}`, brand, model, category }]);
    }
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!selectedSub) throw new Error("No subscription selected");
      const { error } = await supabase.from("shipments").insert({
        subscription_id: subscriptionId,
        user_id: selectedSub.user_id,
        stage,
        scheduled_date: scheduledDate,
        items: selectedItems as unknown as Database["public"]["Tables"]["shipments"]["Insert"]["items"],
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-shipments"] });
      toast.success("Envío creado");
      resetAndClose();
    },
    onError: () => toast.error("Error al crear el envío"),
  });

  const resetAndClose = () => {
    setSubscriptionId("");
    setStage("0-3m");
    setScheduledDate("");
    setSelectedItems([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo envío</DialogTitle>
          <DialogDescription>Crea un envío para una suscripción activa.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Suscripción</Label>
            {isLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Cargando...
              </div>
            ) : (
              <Select value={subscriptionId} onValueChange={(v) => { setSubscriptionId(v); setSelectedItems([]); }}>
                <SelectTrigger><SelectValue placeholder="Seleccionar suscripción" /></SelectTrigger>
                <SelectContent>
                  {activeSubs?.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.user_name} — {s.plan_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="space-y-2">
            <Label>Etapa</Label>
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
            <Label>Fecha programada</Label>
            <Input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
          </div>
          {planData && (
            <div className="space-y-3">
              <Label>Items del envío</Label>
              {planData.equipment.map((cat) => (
                <div key={cat.category} className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{cat.category}</p>
                  {cat.options.map((opt) => {
                    const key = `${cat.category}-${opt.brand}-${opt.model}`;
                    const checked = selectedItems.some((i) => i.key === key);
                    return (
                      <label key={key} className="flex items-center gap-2 text-sm cursor-pointer py-1">
                        <Checkbox checked={checked} onCheckedChange={() => toggleItem(cat.category, opt.brand, opt.model)} />
                        <span>{opt.brand} {opt.model}</span>
                      </label>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={resetAndClose}>Cancelar</Button>
          <Button
            onClick={() => createMutation.mutate()}
            disabled={!subscriptionId || !scheduledDate || createMutation.isPending}
          >
            {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Crear envío
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
