import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type ShipmentStatus = Database["public"]["Enums"]["shipment_status"];

const statusFlow: ShipmentStatus[] = ["scheduled", "packed", "shipped", "delivered"];

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-800 border-blue-200",
  packed: "bg-purple-100 text-purple-800 border-purple-200",
  shipped: "bg-orange-100 text-orange-800 border-orange-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
};

const statusLabels: Record<string, string> = {
  scheduled: "Programado",
  packed: "Empaquetado",
  shipped: "Enviado",
  delivered: "Entregado",
};

export function ShipmentsTab() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-shipments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shipments")
        .select("*")
        .order("scheduled_date", { ascending: false });
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
  });

  const advanceStatus = useMutation({
    mutationFn: async ({ id, newStatus }: { id: string; newStatus: ShipmentStatus }) => {
      const updates: Record<string, unknown> = { status: newStatus };
      if (newStatus === "shipped") updates.shipped_date = new Date().toISOString().split("T")[0];
      if (newStatus === "delivered") updates.delivered_date = new Date().toISOString().split("T")[0];

      const { error } = await supabase.from("shipments").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-shipments"] });
      toast.success("Estado actualizado");
    },
    onError: () => toast.error("Error al actualizar"),
  });

  const getNextStatus = (current: ShipmentStatus): ShipmentStatus | null => {
    const idx = statusFlow.indexOf(current);
    return idx < statusFlow.length - 1 ? statusFlow[idx + 1] : null;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuario</TableHead>
            <TableHead>Etapa</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha programada</TableHead>
            <TableHead>Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                No hay envíos
              </TableCell>
            </TableRow>
          )}
          {data?.map((shipment) => {
            const next = getNextStatus(shipment.status);
            return (
              <TableRow key={shipment.id}>
                <TableCell className="font-medium">{shipment.user_name}</TableCell>
                <TableCell>{shipment.stage}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusColors[shipment.status]}>
                    {statusLabels[shipment.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(shipment.scheduled_date), "d MMM yyyy", { locale: es })}
                </TableCell>
                <TableCell>
                  {next ? (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={advanceStatus.isPending}
                      onClick={() => advanceStatus.mutate({ id: shipment.id, newStatus: next })}
                    >
                      <ArrowRight className="h-3 w-3 mr-1" />
                      {statusLabels[next]}
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground">Completado</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
