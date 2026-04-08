import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders } from "../_shared/cors.ts";

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[MAKE-INACTIVE-CUSTOMERS] ${step}${detailsStr}`);
};

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Authenticate via x-make-apikey header
  const apiKey = req.headers.get("x-make-apikey");
  const expectedKey = Deno.env.get("MAKE_WEBHOOK_SECRET");

  if (!expectedKey) {
    console.error("MAKE_WEBHOOK_SECRET not configured");
    return new Response(
      JSON.stringify({ error: "Server configuration error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }

  if (!apiKey || apiKey !== expectedKey) {
    logStep("Unauthorized request");
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
    );
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    // Optional: allow custom inactivity threshold via query param (default 6 months)
    const url = new URL(req.url);
    const monthsParam = url.searchParams.get("months");
    const inactiveMonths = Math.min(Math.max(parseInt(monthsParam || "6", 10) || 6, 1), 24);

    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - inactiveMonths);
    const cutoffISO = cutoffDate.toISOString().split("T")[0];

    logStep("Query parameters", { inactiveMonths, cutoffDate: cutoffISO });

    // Get suppressed emails to exclude
    const { data: suppressedRows } = await supabase
      .from("suppressed_emails")
      .select("email");

    const suppressedEmails = new Set(
      (suppressedRows || []).map((r: { email: string }) => r.email.toLowerCase())
    );

    // Find users with subscriptions but none currently active
    // and whose last activity was before the cutoff
    const { data: allSubs, error: subError } = await supabase
      .from("subscriptions")
      .select("user_id, status, plan_name, created_at, updated_at");

    if (subError) {
      console.error("Error querying subscriptions:", subError);
      return new Response(
        JSON.stringify({ error: "Database query error" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    if (!allSubs || allSubs.length === 0) {
      logStep("No subscriptions found");
      return new Response(
        JSON.stringify({ inactive_customers: [], count: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Group by user_id
    const userMap = new Map<string, {
      hasActive: boolean;
      lastActivityDate: string;
      lastPlanName: string;
    }>();

    for (const sub of allSubs) {
      const existing = userMap.get(sub.user_id);
      const subDate = sub.updated_at || sub.created_at;

      if (!existing) {
        userMap.set(sub.user_id, {
          hasActive: sub.status === "active",
          lastActivityDate: subDate,
          lastPlanName: sub.plan_name,
        });
      } else {
        if (sub.status === "active") existing.hasActive = true;
        if (subDate > existing.lastActivityDate) {
          existing.lastActivityDate = subDate;
          existing.lastPlanName = sub.plan_name;
        }
      }
    }

    // Also check shipments for last activity
    const userIds = Array.from(userMap.keys());
    const { data: shipments } = await supabase
      .from("shipments")
      .select("user_id, delivered_date, scheduled_date, updated_at")
      .in("user_id", userIds);

    for (const ship of shipments || []) {
      const shipDate = ship.delivered_date || ship.updated_at || ship.scheduled_date;
      const existing = userMap.get(ship.user_id);
      if (existing && shipDate > existing.lastActivityDate) {
        existing.lastActivityDate = shipDate;
      }
    }

    // Filter: no active sub + last activity before cutoff
    const inactiveUserIds = Array.from(userMap.entries())
      .filter(([_, data]) => !data.hasActive && data.lastActivityDate < cutoffISO)
      .map(([userId]) => userId);

    if (inactiveUserIds.length === 0) {
      logStep("No inactive customers found");
      return new Response(
        JSON.stringify({ inactive_customers: [], count: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Get profiles for these users
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", inactiveUserIds);

    // Get emails from auth (service role)
    const inactiveCustomers: Array<{
      email: string;
      full_name: string | null;
      last_activity_date: string;
      last_plan_name: string;
    }> = [];

    for (const userId of inactiveUserIds) {
      const { data: authUser } = await supabase.auth.admin.getUserById(userId);
      if (!authUser?.user?.email) continue;

      const email = authUser.user.email.toLowerCase();

      // Skip suppressed emails
      if (suppressedEmails.has(email)) continue;

      const profile = (profiles || []).find((p: { id: string }) => p.id === userId);
      const userData = userMap.get(userId)!;

      inactiveCustomers.push({
        email,
        full_name: profile?.full_name || null,
        last_activity_date: userData.lastActivityDate,
        last_plan_name: userData.lastPlanName,
      });
    }

    logStep("Inactive customers found", { count: inactiveCustomers.length });

    return new Response(
      JSON.stringify({
        inactive_customers: inactiveCustomers,
        count: inactiveCustomers.length,
        cutoff_date: cutoffISO,
        months_inactive: inactiveMonths,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("[MAKE-INACTIVE-CUSTOMERS] ERROR:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
