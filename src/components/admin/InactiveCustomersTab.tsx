import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Users } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const MONTH_OPTIONS = [
  { value: "1", label: "1 mes" },
  { value: "3", label: "3 meses" },
  { value: "6", label: "6 meses" },
  { value: "12", label: "12 meses" },
];

interface InactiveCustomer {
  id: string;
  full_name: string | null;
  last_activity: string | null;
  last_status: string | null;
}

export function InactiveCustomersTab() {
  const [months, setMonths] = useState("6");

  const { data: customers, isLoading } = useQuery({
    queryKey: ["inactive-customers", months],
    queryFn: async () => {
      const { data, error } = await supabase.rpc(
        "get_inactive_customers" as never,
        { _months: parseInt(months) } as never
      );
      if (error) throw error;
      return (data as unknown as InactiveCustomer[]) ?? [];
    },
  });

  const exportCSV = () => {
    if (!customers?.length) return;
    const headers = ["Nombre", "Última actividad", "Estado"];
    const rows = customers.map((c) => [
      c.full_name ?? "Sin nombre",
      c.last_activity
        ? format(new Date(c.last_activity), "dd/MM/yyyy", { locale: es })
        : "Sin actividad",
      statusLabel(c.last_status),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clientes-inactivos-${months}m.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Sin actividad en los últimos
          </span>
          <Select value={months} onValueChange={setMonths}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTH_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={exportCSV}
          disabled={!customers?.length}
        >
          <Download className="h-4 w-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          Cargando…
        </p>
      ) : !customers?.length ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          No hay clientes inactivos en este rango.
        </p>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {customers.length} cliente{customers.length !== 1 ? "s" : ""}{" "}
            inactivo{customers.length !== 1 ? "s" : ""}
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Última actividad</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">
                    {c.full_name ?? "Sin nombre"}
                  </TableCell>
                  <TableCell>
                    {c.last_activity
                      ? format(new Date(c.last_activity), "dd MMM yyyy", {
                          locale: es,
                        })
                      : "Sin actividad"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={c.last_status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
}

function statusLabel(status: string | null): string {
  switch (status) {
    case "paused":
      return "Pausada";
    case "cancelled":
      return "Cancelada";
    default:
      return "Sin suscripción";
  }
}

function StatusBadge({ status }: { status: string | null }) {
  const label = statusLabel(status);
  const variant =
    status === "paused"
      ? "secondary"
      : status === "cancelled"
        ? "destructive"
        : "outline";
  return <Badge variant={variant}>{label}</Badge>;
}
