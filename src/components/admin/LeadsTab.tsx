import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Mail, ShoppingBag, TrendingUp, Send } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type Lead = {
  id: string;
  email: string;
  plan: string;
  postal_code: string | null;
  selected_products: string[] | null;
  created_at: string | null;
  recovery_email_1_sent_at: string | null;
  recovery_email_2_sent_at: string | null;
  converted_at: string | null;
};

export function LeadsTab() {
  const { data, isLoading } = useQuery<Lead[]>({
    queryKey: ["admin-leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Lead[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const leads = data ?? [];
  const now = Date.now();
  const monthAgo = now - 30 * 24 * 60 * 60 * 1000;
  const thisMonth = leads.filter(
    (l) => l.created_at && new Date(l.created_at).getTime() >= monthAgo,
  );
  const totalCaptured = thisMonth.length;
  const recovery1Sent = thisMonth.filter((l) => l.recovery_email_1_sent_at).length;
  const recovery2Sent = thisMonth.filter((l) => l.recovery_email_2_sent_at).length;
  const converted = leads.filter((l) => l.converted_at).length;
  const totalLeads = leads.length;
  const conversionRate = totalLeads > 0 ? Math.round((converted / totalLeads) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<Mail className="h-4 w-4" />}
          label="Captados (últimos 30 días)"
          value={totalCaptured}
        />
        <MetricCard
          icon={<TrendingUp className="h-4 w-4" />}
          label="Tasa de conversión total"
          value={`${conversionRate}%`}
          hint={`${converted} / ${totalLeads}`}
        />
        <MetricCard
          icon={<Send className="h-4 w-4" />}
          label="Rescates enviados (30d)"
          value={`${recovery1Sent} + ${recovery2Sent}`}
          hint="día 1 + día 4"
        />
        <MetricCard
          icon={<ShoppingBag className="h-4 w-4" />}
          label="Conversiones totales"
          value={converted}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>CP</TableHead>
              <TableHead>Productos</TableHead>
              <TableHead>Rescate</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No hay leads capturados
                </TableCell>
              </TableRow>
            )}
            {leads.map((lead) => {
              const recoveryStr = [
                lead.recovery_email_1_sent_at ? "1" : "·",
                lead.recovery_email_2_sent_at ? "2" : "·",
              ].join(" ");
              return (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{lead.plan}</Badge>
                  </TableCell>
                  <TableCell>{lead.postal_code || "—"}</TableCell>
                  <TableCell className="max-w-[180px] truncate text-xs">
                    {lead.selected_products?.join(", ") || "—"}
                  </TableCell>
                  <TableCell className="text-xs font-mono">{recoveryStr}</TableCell>
                  <TableCell>
                    {lead.converted_at ? (
                      <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/20 border-emerald-500/30">
                        Cliente
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Pendiente</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {lead.created_at
                      ? format(new Date(lead.created_at), "d MMM yyyy", { locale: es })
                      : "—"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          {icon}
          <span>{label}</span>
        </div>
        <div className="text-2xl font-serif font-semibold">{value}</div>
        {hint && <div className="text-[11px] text-muted-foreground mt-0.5">{hint}</div>}
      </CardContent>
    </Card>
  );
}
