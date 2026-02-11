-- Defense-in-depth: revoke SELECT from anon on analytics_events table
REVOKE SELECT ON public.analytics_events FROM anon;