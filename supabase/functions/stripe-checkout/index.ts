import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2";
import { getCorsHeaders, handleCors } from "../_shared/cors.ts";

// ── Server-side product catalog (single source of truth for prices) ──
const PRODUCT_PRICES: Record<string, { name: string; prices: Record<number, number> }> = {
  "bugaboo-fox-3":        { name: "Bugaboo Fox 3",            prices: { 1: 70, 3: 67, 6: 60, 12: 48, 24: 34 } },
  "bugaboo-donkey-3":     { name: "Bugaboo Donkey 3",         prices: { 1: 90, 3: 86, 6: 77, 12: 62, 24: 43 } },
  "bugaboo-dragonfly":    { name: "Bugaboo Dragonfly",        prices: { 1: 80, 3: 76, 6: 68, 12: 55, 24: 38 } },
  "joolz-aer-2":          { name: "Joolz Aer 2",             prices: { 1: 75, 3: 71, 6: 64, 12: 51, 24: 36 } },
  "babyzen-yoyo3":        { name: "Babyzen YOYO3",           prices: { 1: 55, 3: 52, 6: 47, 12: 38, 24: 26 } },
  "stokke-sleepi-mini":   { name: "Stokke Sleepi Mini",      prices: { 1: 60, 3: 57, 6: 51, 12: 34, 24: 24 } },
  "moises-mimbre":        { name: "Moisés de mimbre",         prices: { 1: 50, 3: 48, 6: 43, 12: 34, 24: 24 } },
  "trona-stokke-tripp-trapp": { name: "Stokke Tripp Trapp",  prices: { 1: 45, 3: 43, 6: 38, 12: 31, 24: 22 } },
  "trona-bugaboo-giraffe": { name: "Bugaboo Giraffe",        prices: { 1: 50, 3: 48, 6: 43, 12: 34, 24: 24 } },
  "babybjorn-bliss":      { name: "BabyBjörn Bliss/Balance", prices: { 1: 40, 3: 38, 6: 34, 12: 27, 24: 19 } },
  "bugaboo-giraffe-hamaca": { name: "Bugaboo Giraffe Hamaca", prices: { 1: 40, 3: 38, 6: 34, 12: 27, 24: 19 } },
  "nuna-leaf-grow":       { name: "Nuna LEAF Grow",           prices: { 1: 45, 3: 43, 6: 38, 12: 31, 24: 22 } },
  
  "babybjorn-harmony":    { name: "BabyBjörn Harmony",       prices: { 1: 45, 3: 43, 6: 38, 12: 31, 24: 22 } },
  "ergobaby-omni":        { name: "Ergobaby Omni",            prices: { 1: 40, 3: 38, 6: 34, 12: 27, 24: 19 } },
  "boba-wrap":            { name: "Boba Wrap",                prices: { 1: 25, 3: 24, 6: 21, 12: 17, 24: 12 } },
  "cambiador":            { name: "Cambiador de mimbre",      prices: { 1: 35, 3: 33, 6: 30, 12: 24, 24: 17 } },
};

const ALLOWED_MONTHS = [1, 3, 6, 12, 24];

interface CartItem {
  productId: string;
  months: number;
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

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

    // Build line items — one-time payment, full commitment upfront
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => {
      const product = PRODUCT_PRICES[item.productId];
      if (!product) {
        throw new Error(`Unknown product: ${item.productId}`);
      }
      if (!ALLOWED_MONTHS.includes(item.months)) {
        throw new Error(`Invalid duration: ${item.months}. Allowed: ${ALLOWED_MONTHS.join(", ")}`);
      }
      const pricePerMonth = product.prices[item.months];
      if (pricePerMonth == null) {
        throw new Error(`No price for product ${item.productId} at ${item.months} months`);
      }

      const totalPrice = pricePerMonth * item.months;
      const periodLabel = item.months === 1 ? "1 mes" : `${item.months} meses`;

      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: `${product.name} (${periodLabel})`,
            description: `${pricePerMonth}€/mes × ${item.months} = ${totalPrice}€`,
            metadata: {
              bebloo_product_id: item.productId,
              commitment_months: String(item.months),
            },
          },
          unit_amount: Math.round(totalPrice * 100),
        },
        quantity: 1,
      };
    });

    const origin = req.headers.get("origin") || "https://www.bebloo.es";

    // Build metadata with commitment details and price details per product
    const commitmentDetails = items.map((i) => `${i.productId}:${i.months}`);
    const priceDetails = items.map((i) => {
      const product = PRODUCT_PRICES[i.productId];
      return `${i.productId}:${product.prices[i.months]}`;
    });

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: lineItems,
      mode: "payment",
      locale: "es",
      billing_address_collection: "auto",
      shipping_address_collection: { allowed_countries: ["ES"] },
      phone_number_collection: { enabled: true },
      custom_text: {
        shipping_address: {
          message: "Necesitamos tu dirección y teléfono para coordinar la entrega y la recogida del kit.",
        },
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/mi-seleccion`,
      metadata: {
        user_id: user.id,
        item_count: String(items.length),
        product_ids: items.map((i) => i.productId).join(","),
        product_names: items.map((i) => {
          const product = PRODUCT_PRICES[i.productId];
          return product?.name ?? i.productId;
        }).join("|"),
        commitment_details: commitmentDetails.join(","),
        price_details: priceDetails.join(","),
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("stripe-checkout error:", error);
    return new Response(JSON.stringify({ error: "Error al procesar el pago. Inténtalo de nuevo." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
