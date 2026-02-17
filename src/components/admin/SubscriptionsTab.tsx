import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Pause, Play, XCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { CreateSubscriptionDialog } from "./CreateSubscriptionDialog";
import type { Database } from "@/integrations/supabase/types";

type SubStatus = Database["public"]["Enums"]["subscription_status"];

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800 border-green-200",
  paused: "bg-yellow-100 text-yellow-800 border-yellow-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

const statusLabels: Record<string, string> = {
  active: "Activa",
  paused: "Pausada",
  cancelled: "Cancelada",
};

export function SubscriptionsTab() {
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-subscriptions"],
    queryFn: async () => {
      const { data: subs, error } = await supabase
        .from("subscriptions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;

      const userIds = [...new Set(subs.map((s) => s.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", userIds);

      const profileMap = new Map(profiles?.map((p) => [p.id, p.full_name]) || []);

      return subs.map((s) => ({
        ...s,
        user_name: profileMap.get(s.user_id) || "Sin nombre",
      }));
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: SubStatus }) => {
      const { error } = await supabase.from("subscriptions").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-subscriptions"] });
      toast.success("Estado actualizado");
    },
    onError: () => toast.error("Error al actualizar"),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Nueva suscripción
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Etapa</TableHead>
              <TableHead>Próximo envío</TableHead>
              <TableHead>Creada</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No hay suscripciones
                </TableCell>
              </TableRow>
            )}
            {data?.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell className="font-medium">{sub.user_name}</TableCell>
                <TableCell className="capitalize">{sub.plan_name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusColors[sub.status]}>
                    {statusLabels[sub.status] || sub.status}
                  </Badge>
                </TableCell>
                <TableCell>{sub.current_stage}</TableCell>
                <TableCell>
                  {sub.next_shipment_date
                    ? format(new Date(sub.next_shipment_date), "d MMM yyyy", { locale: es })
                    : "—"}
                </TableCell>
                <TableCell>
                  {format(new Date(sub.created_at), "d MMM yyyy", { locale: es })}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {sub.status === "active" && (
                      <>
                        <Button
                          size="sm" variant="outline"
                          disabled={updateStatus.isPending}
                          onClick={() => updateStatus.mutate({ id: sub.id, status: "paused" })}
                          title="Pausar"
                        >
                          <Pause className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm" variant="outline"
                          disabled={updateStatus.isPending}
                          onClick={() => updateStatus.mutate({ id: sub.id, status: "cancelled" })}
                          title="Cancelar"
                        >
                          <XCircle className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                    {sub.status === "paused" && (
                      <Button
                        size="sm" variant="outline"
                        disabled={updateStatus.isPending}
                        onClick={() => updateStatus.mutate({ id: sub.id, status: "active" })}
                        title="Reactivar"
                      >
                        <Play className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <CreateSubscriptionDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
