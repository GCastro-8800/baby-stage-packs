import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function LeadsTab() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

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
            <TableHead>Email</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Código postal</TableHead>
            <TableHead>Productos</TableHead>
            <TableHead>Fecha</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                No hay leads capturados
              </TableCell>
            </TableRow>
          )}
          {data?.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell className="font-medium">{lead.email}</TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">{lead.plan}</Badge>
              </TableCell>
              <TableCell>{lead.postal_code || "—"}</TableCell>
              <TableCell className="max-w-[200px] truncate text-xs">
                {lead.selected_products?.join(", ") || "—"}
              </TableCell>
              <TableCell>
                {lead.created_at
                  ? format(new Date(lead.created_at), "d MMM yyyy", { locale: es })
                  : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
