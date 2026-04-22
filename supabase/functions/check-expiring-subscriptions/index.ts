// check-expiring-subscriptions
// Daily cron: warn users 14, 7, and 1 days before subscription end_date.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders, handleCors } from "../_shared/cors.ts";

const REMINDER_DAYS = [14, 7, 1] as const;

function formatEsDate(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;
  const corsHeaders = getCorsHeaders(req);

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const summary: Record<number, number> = { 14: 0, 7: 0, 1: 0 };

    for (const days of REMINDER_DAYS) {
      const target = new Date(today);
      target.setUTCDate(target.getUTCDate() + days);
      const targetIso = target.toISOString().slice(0, 10);

      const { data: subs, error } = await supabase
        .from("subscriptions")
        .select("id, user_id, end_date")
        .eq("status", "active")
        .eq("end_date", targetIso);

      if (error) {
        console.error("[check-expiring] Query error", error);
        continue;
      }

      for (const sub of subs ?? []) {
        // Fetch latest shipment for product names
        const { data: shipments } = await supabase
          .from("shipments")
          .select("items")
          .eq("subscription_id", sub.id)
          .order("scheduled_date", { ascending: false })
          .limit(1);
        const items = (shipments?.[0]?.items as any[]) ?? [];
        const products = items.map((i) => ({ name: i?.name ?? i?.key ?? "Producto" }));

        await supabase.functions.invoke("send-multichannel-notification", {
          body: {
            userId: sub.user_id,
            subscriptionId: sub.id,
            templateKey: `service-ending-${days}`,
            idempotencyKey: `expire-${sub.id}-${days}`,
            data: {
              endDate: formatEsDate(sub.end_date),
              renewUrl: "https://bebloo.es/configurador",
              products,
            },
          },
        });
        summary[days] = (summary[days] ?? 0) + 1;
      }
    }

    console.log("[check-expiring] Summary", summary);
    return new Response(JSON.stringify({ ok: true, summary }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[check-expiring] Error", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
