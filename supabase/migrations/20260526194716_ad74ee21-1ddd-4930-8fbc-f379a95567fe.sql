CREATE TABLE public.login_attempts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address text NOT NULL,
  attempted_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_login_attempts_ip_time ON public.login_attempts (ip_address, attempted_at DESC);

GRANT ALL ON public.login_attempts TO service_role;

ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;

-- No policies for anon/authenticated: only service_role (used by the edge function) can access.
-- This effectively denies access to all client-side roles.

CREATE OR REPLACE FUNCTION public.cleanup_old_login_attempts()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.login_attempts WHERE attempted_at < now() - interval '1 hour';
$$;