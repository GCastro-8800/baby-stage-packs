import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CheckCircle2, Send } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  scheduled: "Programada",
  completed: "Completada",
  cancelled: "Cancelada",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  scheduled: "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-muted text-muted-foreground border-border",
};

export function PickupsTab() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<string>("all");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-pickups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("id, user_id, status, end_date, pickup_status, pickup_scheduled_date, pickup_window, updated_at")
        .in("status", ["expired", "active"])
        .order("end_date", { ascending: true, nullsFirst: false });
      if (error) throw error;

      const userIds = [...new Set(data.map((s) => s.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, phone")
        .in("id", userIds);
      const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);
      return data
        .filter((s) => s.pickup_status !== "pending" || s.status === "expired")
        .map((s) => ({
          ...s,
          user_name: profileMap.get(s.user_id)?.full_name || "Sin nombre",
          phone: profileMap.get(s.user_id)?.phone || null,
        }));
    },
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    if (filter === "all") return data;
    return data.filter((d) => d.pickup_status === filter);
  }, [data, filter]);

  const markCompleted = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("subscriptions")
        .update({ pickup_status: "completed" })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pickups"] });
      toast.success("Recogida marcada como completada");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const resendLink = useMutation({
    mutationFn: async (subscriptionId: string) => {
      const { error } = await supabase.functions.invoke("process-expired-subscriptions", {
        body: { resendFor: subscriptionId },
      });
      if (error) throw error;
    },
    onSuccess: () => toast.success("Enlace de recogida reenviado"),
    onError: (e: Error) => toast.error(e.message),
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
      <div className="flex items-center justify-between">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="pending">Pendientes</SelectItem>
            <SelectItem value="scheduled">Programadas</SelectItem>
            <SelectItem value="completed">Completadas</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">{filtered.length} recogidas</p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Fin de servicio</TableHead>
              <TableHead>Fecha recogida</TableHead>
              <TableHead>Franja</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No hay recogidas en este estado
                </TableCell>
              </TableRow>
            )}
            {filtered.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">
                  <div>{row.user_name}</div>
                  {row.phone && <div className="text-xs text-muted-foreground">{row.phone}</div>}
                </TableCell>
                <TableCell>
                  {row.end_date ? format(new Date(row.end_date + "T00:00:00"), "d MMM yyyy", { locale: es }) : "—"}
                </TableCell>
                <TableCell>
                  {row.pickup_scheduled_date
                    ? format(new Date(row.pickup_scheduled_date + "T00:00:00"), "d MMM yyyy", { locale: es })
                    : "—"}
                </TableCell>
                <TableCell>{row.pickup_window || "—"}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={STATUS_COLORS[row.pickup_status]}>
                    {STATUS_LABELS[row.pickup_status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {row.pickup_status === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={resendLink.isPending}
                        onClick={() => resendLink.mutate(row.id)}
                      >
                        <Send className="h-3 w-3 mr-1" />
                        Reenviar
                      </Button>
                    )}
                    {row.pickup_status === "scheduled" && (
                      <Button
                        size="sm"
                        disabled={markCompleted.isPending}
                        onClick={() => markCompleted.mutate(row.id)}
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Recogida ok
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
