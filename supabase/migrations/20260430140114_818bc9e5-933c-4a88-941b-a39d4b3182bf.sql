
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS recovery_email_1_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS recovery_email_2_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS converted_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_leads_email_lower ON public.leads (lower(email));
CREATE INDEX IF NOT EXISTS idx_leads_recovery1_pending ON public.leads (created_at) WHERE recovery_email_1_sent_at IS NULL AND converted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_leads_recovery2_pending ON public.leads (created_at) WHERE recovery_email_2_sent_at IS NULL AND converted_at IS NULL;
