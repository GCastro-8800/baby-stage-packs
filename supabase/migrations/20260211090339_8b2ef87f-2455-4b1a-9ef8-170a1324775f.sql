-- Defense-in-depth: revoke SELECT from anon on leads table
-- RLS already blocks reads, but this removes the privilege entirely
REVOKE SELECT ON public.leads FROM anon;
