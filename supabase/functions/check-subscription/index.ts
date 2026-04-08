import { createClient } from "npm:@supabase/supabase-js@2";
import { getCorsHeaders, handleCors } from "../_shared/cors.ts";

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No autorizado" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } =
      await supabaseClient.auth.getUser(token);
    if (userError || !userData.user?.email) {
      console.error("Auth error:", userError);
      return new Response(
        JSON.stringify({ error: "No autorizado" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }
    const user = userData.user;
    logStep("User authenticated", { userId: user.id, email: user.email });

    const { data: subscriptions, error: subError } = await supabaseClient
      .from("subscriptions")
      .select("id, status, plan_name, created_at, next_shipment_date")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1);

    if (subError) {
      console.error("Error querying subscriptions:", subError);
      return new Response(
        JSON.stringify({ error: "Error al consultar suscripción" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    const hasActiveSub = subscriptions && subscriptions.length > 0;

    if (hasActiveSub) {
      const sub = subscriptions[0];
      logStep("Active subscription found", { subscriptionId: sub.id, plan: sub.plan_name });

      return new Response(
        JSON.stringify({
          subscribed: true,
          plan_name: sub.plan_name,
          next_shipment_date: sub.next_shipment_date,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    logStep("No active subscription found");
    return new Response(
      JSON.stringify({ subscribed: false }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("[CHECK-SUBSCRIPTION] ERROR:", error);
    return new Response(
      JSON.stringify({ error: "Error inesperado. Inténtalo de nuevo." }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
