
-- Subscription status enum
CREATE TYPE public.subscription_status AS ENUM ('active', 'paused', 'cancelled');

-- Shipment status enum
CREATE TYPE public.shipment_status AS ENUM ('scheduled', 'packed', 'shipped', 'delivered');

-- Baby stage enum
CREATE TYPE public.baby_stage AS ENUM ('prenatal', '0-3m', '3-6m', '6-12m', '12-18m', '18-24m');

-- Subscriptions table
CREATE TABLE public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  status subscription_status NOT NULL DEFAULT 'active',
  plan_name TEXT NOT NULL DEFAULT 'esencial',
  current_stage baby_stage NOT NULL DEFAULT 'prenatal',
  next_shipment_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
  ON public.subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- Only system/admin can insert subscriptions (no direct user insert)
CREATE POLICY "Admins can manage all subscriptions"
  ON public.subscriptions FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Shipments table
CREATE TABLE public.shipments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id UUID NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  status shipment_status NOT NULL DEFAULT 'scheduled',
  stage baby_stage NOT NULL,
  scheduled_date DATE NOT NULL,
  shipped_date DATE,
  delivered_date DATE,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own shipments"
  ON public.shipments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all shipments"
  ON public.shipments FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_shipments_updated_at
  BEFORE UPDATE ON public.shipments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Feedback table
CREATE TABLE public.feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  shipment_id UUID NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
  item_key TEXT NOT NULL,
  rating TEXT NOT NULL CHECK (rating IN ('useful', 'not_useful')),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (shipment_id, item_key)
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own feedback"
  ON public.feedback FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own feedback"
  ON public.feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own feedback"
  ON public.feedback FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all feedback"
  ON public.feedback FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));
