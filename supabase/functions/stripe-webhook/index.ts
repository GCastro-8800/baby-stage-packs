import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders, handleCors } from "../_shared/cors.ts";

async function verifyStripeSignature(
  payload: string,
  sigHeader: string,
  secret: string
): Promise<boolean> {
  const parts = sigHeader.split(",");
  const timestamp = parts.find((p) => p.startsWith("t="))?.replace("t=", "");
  const signatures = parts
    .filter((p) => p.startsWith("v1="))
    .map((p) => p.replace("v1=", ""));

  if (!timestamp || signatures.length === 0) return false;

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp)) > 300) return false;

  const signedPayload = `${timestamp}.${payload}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(signedPayload)
  );
  const expectedSig = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return signatures.some((sig) => constantTimeEqual(sig, expectedSig));
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET not configured");
      return new Response("Webhook secret not configured", { status: 500 });
    }

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return new Response("Missing signature", { status: 400 });
    }

    const isValid = await verifyStripeSignature(body, signature, webhookSecret);
    if (!isValid) {
      console.error("Invalid webhook signature");
      return new Response("Invalid signature", { status: 400 });
    }

    const event = JSON.parse(body);

    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    console.log(`[WEBHOOK] Processing event: ${event.type}`);

    // Idempotency check — skip if already processed
    const { data: existing } = await serviceClient
      .from("processed_stripe_events")
      .select("id")
      .eq("event_id", event.id)
      .maybeSingle();

    if (existing) {
      console.log(`[WEBHOOK] Event ${event.id} already processed, skipping`);
      return new Response(JSON.stringify({ received: true, duplicate: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Record the event as processed before handling
    await serviceClient
      .from("processed_stripe_events")
      .insert({ event_id: event.id, event_type: event.type });

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata?.user_id;

      if (!userId) {
        console.error("Missing user_id in checkout session metadata");
        return new Response("Missing user_id", { status: 400 });
      }

      const itemCount = parseInt(session.metadata?.item_count || "0");
      const productIds = (session.metadata?.product_ids || "").split(",").filter(Boolean);
      const productNames = (session.metadata?.product_names || "").split("|").filter(Boolean);
      const commitmentDetails = (session.metadata?.commitment_details || "").split(",").filter(Boolean);

      // Parse commitment months per product
      const commitmentMap: Record<string, number> = {};
      for (const detail of commitmentDetails) {
        const [pid, months] = detail.split(":");
        if (pid && months) commitmentMap[pid] = parseInt(months);
      }

      // Build shipment items from metadata
      const shipmentItems = productIds.map((id: string, idx: number) => ({
        key: id,
        name: productNames[idx] || id,
        months: commitmentMap[id] || 3,
      }));

      console.log(`[WEBHOOK] One-time payment completed for user ${userId}, items: ${itemCount}`);

      // Store stripe_customer_id on profile if available
      if (session.customer) {
        const { error: profileError } = await serviceClient
          .from("profiles")
          .update({ stripe_customer_id: session.customer })
          .eq("id", userId);

        if (profileError) {
          console.error("Error updating profile stripe_customer_id:", profileError);
        }
      }

      // Calculate max commitment to set subscription end
      const maxMonths = Math.max(...Object.values(commitmentMap), 3);
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + maxMonths);

      // Calculate first shipment date (7 days from now)
      const shipmentDate = new Date();
      shipmentDate.setDate(shipmentDate.getDate() + 7);
      const scheduledDate = shipmentDate.toISOString().split("T")[0];

      // Create subscription record for internal tracking
      const planName = `Suscripción bebloo (${itemCount} producto${itemCount !== 1 ? "s" : ""})`;
      const { data: subscription, error: subError } = await serviceClient
        .from("subscriptions")
        .insert({
          user_id: userId,
          plan_name: planName,
          status: "active",
          current_stage: "prenatal",
          next_shipment_date: scheduledDate,
        })
        .select("id")
        .single();

      if (subError) {
        console.error("Error creating subscription:", subError);
        return new Response("Error creating subscription", { status: 500 });
      }

      // Create first shipment with product details
      const { error: shipError } = await serviceClient
        .from("shipments")
        .insert({
          subscription_id: subscription.id,
          user_id: userId,
          status: "scheduled",
          stage: "prenatal",
          scheduled_date: scheduledDate,
          items: shipmentItems,
        });

      if (shipError) {
        console.error("Error creating shipment:", shipError);
      }

      console.log(`[WEBHOOK] Subscription ${subscription.id} created for user ${userId} (paid upfront)`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Webhook handler failed", { status: 500 });
  }
});
