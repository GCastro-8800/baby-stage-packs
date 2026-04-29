// schedule-pickup
// Public endpoint (no JWT). Validates a pickup token from the email link
// and lets the user choose a date + time window.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders, handleCors } from "../_shared/cors.ts";

const SITE_URL = "https://bebloo.es";

async function verifyHmacToken(token: string, secret: string): Promise<{ subscriptionId: string; userId: string } | null> {
  try {
    const [b64, sigHex] = token.split(".");
    if (!b64 || !sigHex) return null;
    const payload = atob(b64.padEnd(b64.length + (4 - (b64.length % 4)) % 4, "="));
    const [subscriptionId, userId, expiresAt] = payload.split(".");
    if (!subscriptionId || !userId || !expiresAt) return null;
    if (new Date(expiresAt).getTime() < Date.now()) return null;

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
    const expectedHex = Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
    if (expectedHex.length !== sigHex.length) return null;
    let diff = 0;
    for (let i = 0; i < expectedHex.length; i++) diff |= expectedHex.charCodeAt(i) ^ sigHex.charCodeAt(i);
    if (diff !== 0) return null;
    return { subscriptionId, userId };
  } catch {
    return null;
  }
}

interface RequestBody {
  action: "validate" | "schedule";
  subscriptionId: string;
  token: string;
  pickupDate?: string; // YYYY-MM-DD
  pickupWindow?: string; // e.g. "10:00-13:00"
}

function formatEsDate(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;
  const corsHeaders = getCorsHeaders(req);

  try {
    const body = (await req.json()) as RequestBody;
    if (!body.action || !body.subscriptionId || !body.token) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const secret = Deno.env.get("PICKUP_TOKEN_SECRET");
    if (!secret) throw new Error("Pickup signing secret is not configured");
    const verified = await verifyHmacToken(body.token, secret);
    if (!verified || verified.subscriptionId !== body.subscriptionId) {
      return new Response(JSON.stringify({ error: "Invalid or expired token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Confirm token is in DB and not used
    const { data: tokenRow } = await supabase
      .from("pickup_tokens")
      .select("id, used_at, expires_at")
      .eq("token", body.token)
      .maybeSingle();
    if (!tokenRow) {
      return new Response(JSON.stringify({ error: "Token not recognised" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Load subscription
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("id, user_id, status, pickup_status, pickup_scheduled_date, pickup_window")
      .eq("id", body.subscriptionId)
      .maybeSingle();
    if (!sub) {
      return new Response(JSON.stringify({ error: "Subscription not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (body.action === "validate") {
      return new Response(JSON.stringify({
        ok: true,
        subscription: {
          id: sub.id,
          status: sub.status,
          pickupStatus: sub.pickup_status,
          pickupDate: sub.pickup_scheduled_date,
          pickupWindow: sub.pickup_window,
        },
        tokenUsed: !!tokenRow.used_at,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // action === "schedule"
    if (!body.pickupDate || !body.pickupWindow) {
      return new Response(JSON.stringify({ error: "pickupDate and pickupWindow required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (tokenRow.used_at) {
      return new Response(JSON.stringify({ error: "Token already used" }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (sub.status !== "expired") {
      return new Response(JSON.stringify({ error: "Subscription not expired" }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Update subscription
    const { error: upErr } = await supabase
      .from("subscriptions")
      .update({
        pickup_status: "scheduled",
        pickup_scheduled_date: body.pickupDate,
        pickup_window: body.pickupWindow,
      })
      .eq("id", sub.id);
    if (upErr) throw upErr;

    // Mark token used
    await supabase.from("pickup_tokens").update({ used_at: new Date().toISOString() }).eq("id", tokenRow.id);

    // Send confirmation
    await supabase.functions.invoke("send-multichannel-notification", {
      body: {
        userId: sub.user_id,
        subscriptionId: sub.id,
        templateKey: "pickup-confirmed",
        idempotencyKey: `pickup-confirmed-${sub.id}`,
        data: {
          pickupDate: formatEsDate(body.pickupDate),
          pickupWindow: body.pickupWindow,
        },
      },
    });

    return new Response(JSON.stringify({
      ok: true,
      pickupDate: body.pickupDate,
      pickupWindow: body.pickupWindow,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[schedule-pickup] Error", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
