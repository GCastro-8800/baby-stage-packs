import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

let _client: ReturnType<typeof createClient> | null = null;

function getClient() {
  if (_client) return _client;
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) throw new Error("Missing Supabase env vars for rate limit");
  _client = createClient(url, key, { auth: { persistSession: false } });
  return _client;
}

export function getClientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

export interface RateLimitResult {
  limited: boolean;
  count: number;
  retryAfter: number; // seconds
}

/**
 * Persistent rate limiter backed by Supabase `rate_limit_buckets`.
 * Returns `limited: true` once the key exceeds `max` requests within `windowSeconds`.
 * Fails open (returns not-limited) on backend errors so requests are not blocked
 * by a database hiccup — errors are logged.
 */
export async function checkRateLimit(
  key: string,
  max: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  try {
    const supabase = getClient();
    const { data, error } = await supabase.rpc("check_rate_limit", {
      _key: key,
      _max: max,
      _window_seconds: windowSeconds,
    });
    if (error) {
      console.error("checkRateLimit RPC error:", error);
      return { limited: false, count: 0, retryAfter: 0 };
    }
    const d = data as { limited: boolean; count: number; retry_after: number };
    return { limited: !!d.limited, count: d.count ?? 0, retryAfter: d.retry_after ?? 0 };
  } catch (e) {
    console.error("checkRateLimit threw:", e);
    return { limited: false, count: 0, retryAfter: 0 };
  }
}
