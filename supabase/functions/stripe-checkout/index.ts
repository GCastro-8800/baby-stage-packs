import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface CartItem {
  productId: string;
  productName: string;
  months: number;
  pricePerMonth: number; // in euros (e.g. 67)
}

function stripeInterval(months: number): { interval: "month" | "year"; interval_count: number; multiplier: number } {
  switch (months) {
    case 1:  return { interval: "month", interval_count: 1, multiplier: 1 };
    case 3:  return { interval: "month", interval_count: 3, multiplier: 3 };
    case 6:  return { interval: "month", interval_count: 6, multiplier: 6 };
    case 12: return { interval: "year",  interval_count: 1, multiplier: 12 };
    case 24: return { interval: "year",  interval_count: 2, multiplier: 24 };
    default: return { interval: "month", interval_count: months, multiplier: months };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
  );

  try {
    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated");

    // Parse cart items
    const { items } = (await req.json()) as { items: CartItem[] };
    if (!items || items.length === 0) {
      throw new Error("No items in cart");
    }

    // Init Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Get or create customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId: string | undefined;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Build line items with inline price_data (recurring monthly)
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => {
      const { interval, interval_count, multiplier } = stripeInterval(item.months);
      const periodLabel = item.months === 1 ? "1 mes" : `${item.months} meses`;
      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: `${item.productName} (${periodLabel})`,
            metadata: {
              bebloo_product_id: item.productId,
              commitment_months: String(item.months),
            },
          },
          unit_amount: Math.round(item.pricePerMonth * multiplier * 100),
          recurring: { interval: interval as "month" | "year", interval_count },
        },
        quantity: 1,
      };
    });

    const origin = req.headers.get("origin") || "";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: lineItems,
      mode: "subscription",
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/seleccion`,
      metadata: {
        user_id: user.id,
        item_count: String(items.length),
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("stripe-checkout error:", error);
    const msg = error instanceof Error ? error.message : "Internal error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
