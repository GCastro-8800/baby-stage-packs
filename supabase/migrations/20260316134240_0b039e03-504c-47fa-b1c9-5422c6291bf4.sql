-- Revoke all privileges on admin_credentials from anon and authenticated roles
-- This table should only be accessed via service_role from edge functions
REVOKE ALL ON public.admin_credentials FROM anon, authenticated;