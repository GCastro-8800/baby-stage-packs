// send-multichannel-notification
// Sends a notification through all enabled channels for a user.
// Currently active channels: email + dashboard (logged via multichannel_notification_log).
// SMS / WhatsApp are stubbed: when Twilio is connected, fill in the TODO blocks.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders, handleCors } from "../_shared/cors.ts";

interface RequestBody {
  userId: string;
  templateKey: string;
  data?: Record<string, any>;
  subscriptionId?: string;
  idempotencyKey?: string;
  // Optional channel override (for admin triggers / testing)
  channelsOverride?: { email?: boolean; whatsapp?: boolean; sms?: boolean };
}

// Map templateKey -> email template name in registry
const EMAIL_TEMPLATE_MAP: Record<string, string> = {
  "service-ending-14": "service-ending-soon",
  "service-ending-7": "service-ending-soon",
  "service-ending-1": "service-ending-soon",
  "service-ended-pickup": "service-ended-pickup",
  "pickup-reminder": "pickup-reminder",
  "pickup-confirmed": "pickup-confirmed",
};

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;
  const corsHeaders = getCorsHeaders(req);

  try {
    const body = (await req.json()) as RequestBody;
    if (!body.userId || !body.templateKey) {
      return new Response(JSON.stringify({ error: "userId and templateKey are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Idempotency: skip if already logged with the same key
    if (body.idempotencyKey) {
      const { data: existing } = await supabase
        .from("multichannel_notification_log")
        .select("id")
        .eq("idempotency_key", body.idempotencyKey)
        .limit(1)
        .maybeSingle();
      if (existing) {
        console.log(`[multichannel] Skipping duplicate ${body.idempotencyKey}`);
        return new Response(JSON.stringify({ skipped: true, reason: "duplicate" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Fetch user profile + auth email
    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("full_name, phone, notification_preferences")
      .eq("id", body.userId)
      .maybeSingle();

    if (profileErr || !profile) {
      console.error("[multichannel] Profile not found", profileErr);
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: authUserData } = await supabase.auth.admin.getUserById(body.userId);
    const email = authUserData?.user?.email ?? null;

    const prefs = (profile.notification_preferences as any) ?? { email: true, whatsapp: true, sms: true };
    const channels = {
      email: body.channelsOverride?.email ?? prefs.email ?? true,
      whatsapp: body.channelsOverride?.whatsapp ?? prefs.whatsapp ?? true,
      sms: body.channelsOverride?.sms ?? prefs.sms ?? true,
    };

    const templateData = {
      ...(body.data ?? {}),
      customerName: body.data?.customerName ?? profile.full_name ?? undefined,
    };

    const results: Array<{ channel: string; status: string; error?: string }> = [];

    // -------- EMAIL --------
    if (channels.email && email) {
      // Check email suppression
      const { data: suppressed } = await supabase
        .from("suppressed_emails")
        .select("id")
        .eq("email", email)
        .limit(1)
        .maybeSingle();

      if (suppressed) {
        results.push({ channel: "email", status: "suppressed" });
        await supabase.from("multichannel_notification_log").insert({
          user_id: body.userId,
          subscription_id: body.subscriptionId ?? null,
          channel: "email",
          template_key: body.templateKey,
          status: "suppressed",
          idempotency_key: body.idempotencyKey ?? null,
        });
      } else {
        const emailTemplateName = EMAIL_TEMPLATE_MAP[body.templateKey];
        if (!emailTemplateName) {
          results.push({ channel: "email", status: "skipped", error: "no template mapping" });
        } else {
          // Pass daysLeft for service-ending-* templates
          const daysLeft = body.templateKey === "service-ending-14" ? 14
            : body.templateKey === "service-ending-7" ? 7
            : body.templateKey === "service-ending-1" ? 1
            : undefined;

          try {
            const { error: invokeErr } = await supabase.functions.invoke("send-transactional-email", {
              body: {
                templateName: emailTemplateName,
                recipientEmail: email,
                idempotencyKey: body.idempotencyKey
                  ? `${body.idempotencyKey}-email`
                  : `${body.templateKey}-${body.userId}-${Date.now()}`,
                templateData: { ...templateData, ...(daysLeft ? { daysLeft } : {}) },
              },
            });
            if (invokeErr) throw invokeErr;
            results.push({ channel: "email", status: "sent" });
            await supabase.from("multichannel_notification_log").insert({
              user_id: body.userId,
              subscription_id: body.subscriptionId ?? null,
              channel: "email",
              template_key: body.templateKey,
              status: "sent",
              idempotency_key: body.idempotencyKey ?? null,
            });
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            results.push({ channel: "email", status: "failed", error: msg });
            await supabase.from("multichannel_notification_log").insert({
              user_id: body.userId,
              subscription_id: body.subscriptionId ?? null,
              channel: "email",
              template_key: body.templateKey,
              status: "failed",
              error_message: msg,
              idempotency_key: body.idempotencyKey ?? null,
            });
          }
        }
      }
    }

    // -------- WHATSAPP (stub) --------
    if (channels.whatsapp && profile.phone) {
      // TODO: when Twilio is connected, send WhatsApp template here
      results.push({ channel: "whatsapp", status: "not_configured" });
      await supabase.from("multichannel_notification_log").insert({
        user_id: body.userId,
        subscription_id: body.subscriptionId ?? null,
        channel: "whatsapp",
        template_key: body.templateKey,
        status: "not_configured",
        idempotency_key: body.idempotencyKey ?? null,
      });
    }

    // -------- SMS (stub) --------
    if (channels.sms && profile.phone) {
      // TODO: when Twilio is connected, send SMS here
      results.push({ channel: "sms", status: "not_configured" });
      await supabase.from("multichannel_notification_log").insert({
        user_id: body.userId,
        subscription_id: body.subscriptionId ?? null,
        channel: "sms",
        template_key: body.templateKey,
        status: "not_configured",
        idempotency_key: body.idempotencyKey ?? null,
      });
    }

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[multichannel] Error", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
