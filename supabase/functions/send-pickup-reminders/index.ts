// send-pickup-reminders
// Daily cron: 7 days after expiration, remind users still in pickup_status='pending'.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders, handleCors } from "../_shared/cors.ts";

const SITE_URL = "https://bebloo.es";


function timingSafeEqual(a: string, b: string): boolean {
  if (a.length != b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function authorizeCronRequest(req: Request): boolean {
  const cronSecret = Deno.env.get("CRON_SECRET");
  const providedCronSecret = req.headers.get("x-cron-secret");
  if (!cronSecret || !providedCronSecret) return false;
  return timingSafeEqual(providedCronSecret, cronSecret);
}


Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;
  const corsHeaders = getCorsHeaders(req);

  try {
    const isCronAuthorized = authorizeCronRequest(req);
    if (!isCronAuthorized) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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
