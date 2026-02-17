import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, stripe-signature",
};

// Plan ID to display name mapping
const PLAN_NAMES: Record<string, string> = {
  start: "BEBLOO Start",
  comfort: "BEBLOO Comfort",
  "total-peace": "BEBLOO Total Peace",
};

async function verifyStripeSignature(
  payload: string,
  sigHeader: string,
  secret: string
): Promise<boolean> {
  const parts = sigHeader.split(",");
  const timestamp = parts
    .find((p) => p.startsWith("t="))
    ?.replace("t=", "");
  const signatures = parts
    .filter((p) => p.startsWith("v1="))
    .map((p) => p.replace("v1=", ""));

  if (!timestamp || signatures.length === 0) return false;

  // Check timestamp tolerance (5 minutes)
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

  return signatures.some((sig) => sig === expectedSig);
}

Deno.serve(async (req) => {
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

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata?.user_id;
      const planId = session.metadata?.plan_id;
      const selectedItems = session.metadata?.selected_items
        ? JSON.parse(session.metadata.selected_items)
        : [];

      if (!userId || !planId) {
        console.error("Missing metadata in checkout session");
        return new Response("Missing metadata", { status: 400 });
      }

      const planName = PLAN_NAMES[planId] || planId;

      // Calculate first shipment date (7 days from now)
      const shipmentDate = new Date();
      shipmentDate.setDate(shipmentDate.getDate() + 7);
      const scheduledDate = shipmentDate.toISOString().split("T")[0];

      // Create subscription
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

      // Create first shipment
      const { error: shipError } = await serviceClient
        .from("shipments")
        .insert({
          subscription_id: subscription.id,
          user_id: userId,
          status: "scheduled",
          stage: "prenatal",
          scheduled_date: scheduledDate,
          items: selectedItems.map((item: string) => ({
            key: item,
            name: item.split("::")[1] || item,
          })),
        });

      if (shipError) {
        console.error("Error creating shipment:", shipError);
      }

      console.log(
        `Subscription created for user ${userId}, plan ${planName}`
      );
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      const customerId = subscription.customer;

      // Find user by stripe_customer_id
      const { data: profile } = await serviceClient
        .from("profiles")
        .select("id")
        .eq("stripe_customer_id", customerId)
        .single();

      if (profile) {
        // Cancel all active subscriptions for this user
        await serviceClient
          .from("subscriptions")
          .update({ status: "cancelled" })
          .eq("user_id", profile.id)
          .eq("status", "active");

        console.log(`Subscription cancelled for user ${profile.id}`);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Webhook handler failed", { status: 500 });
  }
});
