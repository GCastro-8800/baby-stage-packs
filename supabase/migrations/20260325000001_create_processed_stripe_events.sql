-- Idempotency table for Stripe webhook events
-- Prevents duplicate processing when Stripe retries webhook delivery

CREATE TABLE public.processed_stripe_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  processed_at TIMESTAMPTZ DEFAULT now()
);

-- Index for cleanup of old events
CREATE INDEX idx_processed_stripe_events_processed_at
  ON public.processed_stripe_events (processed_at);

-- RLS: only service_role can access (no policies = blocked for anon/authenticated)
ALTER TABLE public.processed_stripe_events ENABLE ROW LEVEL SECURITY;
