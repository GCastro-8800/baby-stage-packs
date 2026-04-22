// send-pickup-reminders
// Daily cron: 7 days after expiration, remind users still in pickup_status='pending'.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders, handleCors } from "../_shared/cors.ts";

const SITE_URL = "https://bebloo.es";

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;
  const corsHeaders = getCorsHeaders(req);

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Find expired subscriptions still pending pickup whose end_date is >= 7 days ago
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    const cutoffIso = cutoff.toISOString().slice(0, 10);

    const { data: subs, error } = await supabase
      .from("subscriptions")
      .select("id, user_id, end_date")
      .eq("status", "expired")
      .eq("pickup_status", "pending")
      .lte("end_date", cutoffIso);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let sent = 0;
    for (const sub of subs ?? []) {
      // Find a still-valid token for this subscription
      const { data: tokenRow } = await supabase
        .from("pickup_tokens")
        .select("token, expires_at")
        .eq("subscription_id", sub.id)
        .is("used_at", null)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      const token = tokenRow?.token;
      const pickupSchedulerUrl = token
        ? `${SITE_URL}/recogida/${sub.id}?token=${encodeURIComponent(token)}`
        : `${SITE_URL}/app`;

      // Idempotency: weekly reminder (7-day bucket)
      const week = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
      await supabase.functions.invoke("send-multichannel-notification", {
        body: {
          userId: sub.user_id,
          subscriptionId: sub.id,
          templateKey: "pickup-reminder",
          idempotencyKey: `pickup-reminder-${sub.id}-${week}`,
          data: { pickupSchedulerUrl },
        },
      });
      sent++;
    }

    return new Response(JSON.stringify({ ok: true, sent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
