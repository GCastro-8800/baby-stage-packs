// send-cart-recovery-emails
// Daily cron: send recovery emails 24h and 96h after lead capture if user hasn't converted.

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

interface LeadRow {
  id: string;
  email: string;
  user_id: string | null;
  selected_products: string[] | null;
  created_at: string;
}

async function userHasConverted(
  supabase: ReturnType<typeof createClient>,
  lead: LeadRow,
): Promise<boolean> {
  // 1) If lead has user_id, check subscriptions directly
  if (lead.user_id) {
    const { data } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("user_id", lead.user_id)
      .limit(1)
      .maybeSingle();
    if (data) return true;
  }
  // 2) Match by email via auth.users → subscriptions
  if (lead.email) {
    const { data: users } = await (supabase as any).auth.admin.listUsers({
      page: 1,
      perPage: 1,
      // listUsers does not support filter by email, so iterate small page if needed
    });
    // Fallback: manual lookup via profiles by joining auth users isn't available.
    // We use the admin API getUserByEmail when present.
    try {
      const { data } = await (supabase as any).auth.admin.getUserByEmail(lead.email);
      const userId = data?.user?.id;
      if (userId) {
        const { data: sub } = await supabase
          .from("subscriptions")
          .select("id")
          .eq("user_id", userId)
          .limit(1)
          .maybeSingle();
        if (sub) return true;
      }
    } catch {
      // ignore
    }
  }
  return false;
}

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;
  const corsHeaders = getCorsHeaders(req);

  try {
    if (!authorizeCronRequest(req)) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const now = Date.now();
    const ago24h = new Date(now - 24 * 60 * 60 * 1000).toISOString();
    const ago28h = new Date(now - 28 * 60 * 60 * 1000).toISOString();
    const ago96h = new Date(now - 96 * 60 * 60 * 1000).toISOString();
    const ago100h = new Date(now - 100 * 60 * 60 * 1000).toISOString();

    const summary = { day1Sent: 0, day1Skipped: 0, day4Sent: 0, day4Skipped: 0 };

    // ── Day-1 batch ──
    const { data: day1Leads, error: day1Err } = await supabase
      .from("leads")
      .select("id, email, user_id, selected_products, created_at")
      .is("recovery_email_1_sent_at", null)
      .is("converted_at", null)
      .lte("created_at", ago24h)
      .gte("created_at", ago28h);

    if (day1Err) console.error("[cart-recovery] day1 query error", day1Err);

    for (const lead of (day1Leads ?? []) as LeadRow[]) {
      // Suppression check
      const { data: suppressed } = await supabase
        .from("suppressed_emails")
        .select("email")
        .eq("email", lead.email)
        .maybeSingle();
      if (suppressed) {
        await supabase.from("leads").update({ recovery_email_1_sent_at: new Date().toISOString() }).eq("id", lead.id);
        summary.day1Skipped++;
        continue;
      }
      if (await userHasConverted(supabase, lead)) {
        await supabase.from("leads").update({ converted_at: new Date().toISOString() }).eq("id", lead.id);
        summary.day1Skipped++;
        continue;
      }

      try {
        await supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "cart-recovery-day-1",
            recipientEmail: lead.email,
            idempotencyKey: `cart-recovery-1-${lead.id}`,
            templateData: {
              resumeUrl: `${SITE_URL}/configurador`,
              productCount: lead.selected_products?.length ?? 0,
            },
          },
        });
        await supabase
          .from("leads")
          .update({ recovery_email_1_sent_at: new Date().toISOString() })
          .eq("id", lead.id);
        summary.day1Sent++;
      } catch (err) {
        console.error("[cart-recovery] day1 send error", lead.id, err);
      }
    }

    // ── Day-4 batch ──
    const { data: day4Leads, error: day4Err } = await supabase
      .from("leads")
      .select("id, email, user_id, selected_products, created_at")
      .is("recovery_email_2_sent_at", null)
      .is("converted_at", null)
      .lte("created_at", ago96h)
      .gte("created_at", ago100h);

    if (day4Err) console.error("[cart-recovery] day4 query error", day4Err);

    for (const lead of (day4Leads ?? []) as LeadRow[]) {
      const { data: suppressed } = await supabase
        .from("suppressed_emails")
        .select("email")
        .eq("email", lead.email)
        .maybeSingle();
      if (suppressed) {
        await supabase.from("leads").update({ recovery_email_2_sent_at: new Date().toISOString() }).eq("id", lead.id);
        summary.day4Skipped++;
        continue;
      }
      if (await userHasConverted(supabase, lead)) {
        await supabase.from("leads").update({ converted_at: new Date().toISOString() }).eq("id", lead.id);
        summary.day4Skipped++;
        continue;
      }

      try {
        await supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "cart-recovery-day-4",
            recipientEmail: lead.email,
            idempotencyKey: `cart-recovery-2-${lead.id}`,
            templateData: {
              resumeUrl: `${SITE_URL}/configurador`,
            },
          },
        });
        await supabase
          .from("leads")
          .update({ recovery_email_2_sent_at: new Date().toISOString() })
          .eq("id", lead.id);
        summary.day4Sent++;
      } catch (err) {
        console.error("[cart-recovery] day4 send error", lead.id, err);
      }
    }

    console.log("[cart-recovery] Summary", summary);
    return new Response(JSON.stringify({ ok: true, summary }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[cart-recovery] Error", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
