// process-expired-subscriptions
// Daily cron: find subscriptions whose end_date has passed, mark them as
// expired + pickup pending, and send the "service ended → schedule pickup"
// notification with a one-shot HMAC token link.

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
  const cronSecret = Deno.env.get("CRON_SECRET") ?? Deno.env.get("STRIPE_WEBHOOK_SECRET");
  const providedCronSecret = req.headers.get("x-cron-secret");
  if (cronSecret && providedCronSecret && timingSafeEqual(providedCronSecret, cronSecret)) {
    return true;
  }

  const authHeader = req.headers.get("Authorization");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (anonKey && authHeader === `Bearer ${anonKey}`) {
    return true;
  }

  return false;
}


async function makeHmacToken(subscriptionId: string, userId: string, secret: string): Promise<string> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);
  const payload = `${subscriptionId}.${userId}.${expiresAt.toISOString()}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  const sigHex = Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${btoa(payload).replace(/=/g, "")}.${sigHex}`;
}

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;
  const corsHeaders = getCorsHeaders(req);

  try {
    const isCronAuthorized = authorizeCronRequest(req);
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const resendFor = typeof body?.resendFor === "string" ? body.resendFor : null;

    if (!isCronAuthorized && !resendFor) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const secret = Deno.env.get("PICKUP_TOKEN_SECRET") ?? Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!secret) throw new Error("Pickup signing secret is not configured");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const authHeader = req.headers.get("Authorization");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      resendFor && authHeader?.startsWith("Bearer ") && anonKey
        ? anonKey
        : serviceRoleKey!,
      resendFor && authHeader?.startsWith("Bearer ")
        ? { global: { headers: { Authorization: authHeader } } }
        : undefined,
    );

    if (resendFor && authHeader?.startsWith("Bearer ") && anonKey) {
      const token = authHeader.replace("Bearer ", "");
      const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
      if (claimsError || !claimsData?.claims?.sub) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const adminClient = createClient(
        Deno.env.get("SUPABASE_URL")!,
        serviceRoleKey!,
      );
      const { data: hasRole, error: roleError } = await adminClient.rpc("has_role", {
        _user_id: claimsData.claims.sub,
        _role: "admin",
      });
      if (roleError || !hasRole) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const today = new Date().toISOString().slice(0, 10);
    let expiredQuery = supabase
      .from("subscriptions")
      .select("id, user_id, end_date")
      .eq("status", "active");

    if (resendFor) {
      expiredQuery = expiredQuery.eq("id", resendFor);
    } else {
      expiredQuery = expiredQuery.lte("end_date", today);
    }

    const { data: expired, error } = await expiredQuery;

    if (error) {
      console.error("[process-expired] Query error", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let processed = 0;
    for (const sub of expired ?? []) {
      // Update status
      const nextStatus = resendFor ? { pickup_status: "pending" } : { status: "expired", pickup_status: "pending" };
      const { error: upErr } = await supabase
        .from("subscriptions")
        .update(nextStatus)
        .eq("id", sub.id);
      if (upErr) {
        console.error("[process-expired] Update error", upErr);
        continue;
      }

      // Generate pickup token (also persisted for audit)
      const token = await makeHmacToken(sub.id, sub.user_id, secret);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);
      await supabase.from("pickup_tokens").insert({
        token,
        user_id: sub.user_id,
        subscription_id: sub.id,
        expires_at: expiresAt.toISOString(),
      });

      // Fetch product names from latest shipment
      const { data: shipments } = await supabase
        .from("shipments")
        .select("items")
        .eq("subscription_id", sub.id)
        .order("scheduled_date", { ascending: false })
        .limit(1);
      const items = (shipments?.[0]?.items as any[]) ?? [];
      const products = items.map((i) => ({ name: i?.name ?? i?.key ?? "Producto" }));

      const pickupSchedulerUrl = `${SITE_URL}/recogida/${sub.id}?token=${encodeURIComponent(token)}`;

      await supabase.functions.invoke("send-multichannel-notification", {
        body: {
          userId: sub.user_id,
          subscriptionId: sub.id,
          templateKey: "service-ended-pickup",
          idempotencyKey: resendFor ? `pickup-link-resend-${sub.id}-${Date.now()}` : `expired-${sub.id}`,
          data: {
            pickupSchedulerUrl,
            renewUrl: `${SITE_URL}/configurador`,
            products,
          },
        },
      });
      processed++;
    }

    return new Response(JSON.stringify({ ok: true, processed, mode: resendFor ? "resend" : "cron" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[process-expired] Error", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
