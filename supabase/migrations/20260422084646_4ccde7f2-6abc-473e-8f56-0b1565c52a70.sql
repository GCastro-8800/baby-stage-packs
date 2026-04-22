
-- 1. profiles: phone + preferences
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS notification_preferences JSONB NOT NULL DEFAULT '{"email":true,"whatsapp":true,"sms":true}'::jsonb;

-- Validation: phone must be E.164 if present
CREATE OR REPLACE FUNCTION public.validate_profile_phone()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.phone IS NOT NULL AND NEW.phone !~ '^\+[1-9][0-9]{6,14}$' THEN
    RAISE EXCEPTION 'Phone must be in E.164 format (e.g. +34600000000)';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_profile_phone_trigger ON public.profiles;
CREATE TRIGGER validate_profile_phone_trigger
  BEFORE INSERT OR UPDATE OF phone ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.validate_profile_phone();

-- 2. subscriptions: lifecycle fields
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS end_date DATE,
  ADD COLUMN IF NOT EXISTS pickup_status TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS pickup_scheduled_date DATE,
  ADD COLUMN IF NOT EXISTS pickup_window TEXT;

-- Add 'expired' to subscription_status enum if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumlabel = 'expired'
      AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'subscription_status')
  ) THEN
    ALTER TYPE public.subscription_status ADD VALUE 'expired';
  END IF;
END$$;

-- Validate pickup_status values
CREATE OR REPLACE FUNCTION public.validate_pickup_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.pickup_status NOT IN ('pending','scheduled','completed','cancelled') THEN
    RAISE EXCEPTION 'Invalid pickup_status: %', NEW.pickup_status;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_pickup_status_trigger ON public.subscriptions;
CREATE TRIGGER validate_pickup_status_trigger
  BEFORE INSERT OR UPDATE OF pickup_status ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.validate_pickup_status();

-- Backfill end_date for existing subscriptions (created_at + 3 months default)
UPDATE public.subscriptions
SET end_date = (created_at + INTERVAL '3 months')::date
WHERE end_date IS NULL;

-- Index for cron job efficiency
CREATE INDEX IF NOT EXISTS idx_subscriptions_status_end_date
  ON public.subscriptions(status, end_date);

CREATE INDEX IF NOT EXISTS idx_subscriptions_pickup_status
  ON public.subscriptions(pickup_status)
  WHERE pickup_status IN ('pending','scheduled');

-- 3. multichannel_notification_log
CREATE TABLE IF NOT EXISTS public.multichannel_notification_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  subscription_id UUID,
  channel TEXT NOT NULL,        -- 'email' | 'whatsapp' | 'sms'
  template_key TEXT NOT NULL,   -- e.g. 'service-ending-14'
  status TEXT NOT NULL,         -- 'sent' | 'failed' | 'skipped' | 'suppressed'
  idempotency_key TEXT,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_multichannel_idempotency
  ON public.multichannel_notification_log(idempotency_key, channel)
  WHERE idempotency_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_multichannel_user_created
  ON public.multichannel_notification_log(user_id, created_at DESC);

ALTER TABLE public.multichannel_notification_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages notification log"
  ON public.multichannel_notification_log
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admins can read notification log"
  ON public.multichannel_notification_log
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can read own notification log"
  ON public.multichannel_notification_log
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 4. pickup_tokens: HMAC tokens for pickup scheduling without login
CREATE TABLE IF NOT EXISTS public.pickup_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id UUID NOT NULL,
  user_id UUID NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pickup_tokens_token ON public.pickup_tokens(token);
CREATE INDEX IF NOT EXISTS idx_pickup_tokens_subscription ON public.pickup_tokens(subscription_id);

ALTER TABLE public.pickup_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages pickup tokens"
  ON public.pickup_tokens
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admins can read pickup tokens"
  ON public.pickup_tokens
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
