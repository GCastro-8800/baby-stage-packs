
-- Restore SELECT for authenticated on tables where users need to read their own data
-- RLS policies properly restrict access to own records only
GRANT SELECT ON public.profiles TO authenticated;
GRANT SELECT ON public.user_roles TO authenticated;
