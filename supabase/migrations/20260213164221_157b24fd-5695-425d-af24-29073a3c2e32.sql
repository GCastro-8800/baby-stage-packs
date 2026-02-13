
ALTER TABLE public.profiles ADD COLUMN stripe_customer_id text;

CREATE UNIQUE INDEX idx_profiles_stripe_customer_id ON public.profiles (stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;
