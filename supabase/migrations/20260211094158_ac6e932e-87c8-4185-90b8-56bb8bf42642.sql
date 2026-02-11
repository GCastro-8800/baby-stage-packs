
-- Revoke SELECT from anon on all sensitive tables (defense-in-depth)
REVOKE SELECT ON public.leads FROM anon;
REVOKE SELECT ON public.analytics_events FROM anon;
REVOKE SELECT ON public.profiles FROM anon;
REVOKE SELECT ON public.user_roles FROM anon;

-- Also revoke from authenticated on profiles and user_roles where not needed publicly
-- (profiles and user_roles already have proper RLS, but belt-and-suspenders)
REVOKE SELECT ON public.profiles FROM authenticated;
REVOKE SELECT ON public.user_roles FROM authenticated;
