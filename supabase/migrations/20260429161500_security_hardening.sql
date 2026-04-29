-- Security hardening for pickup tokens, storage listing, and SECURITY DEFINER exposure

-- 1) Allow users to read only their own pickup tokens if needed by product flows
DO $$ BEGIN
  CREATE POLICY "Users can read own pickup tokens"
  ON public.pickup_tokens
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 2) Replace fragile user_roles insert blocker with explicit revokes at the table privilege layer
REVOKE INSERT, UPDATE, DELETE ON public.user_roles FROM anon, authenticated;
DROP POLICY IF EXISTS "Block anon role inserts" ON public.user_roles;
DROP POLICY IF EXISTS "Block direct role inserts" ON public.user_roles;

-- 3) Restrict execution of SECURITY DEFINER functions to the roles that actually need them
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.get_inactive_customers(integer) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.get_inactive_customers(integer) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) TO service_role;

REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) TO service_role;

REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) TO service_role;

REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.delete_email(text, bigint) TO service_role;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM public, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enforce_max_admin_credentials() FROM public, anon, authenticated;

-- 4) Prevent public bucket listing while keeping direct object fetches working for known paths
DROP POLICY IF EXISTS "Public read access for email assets" ON storage.objects;
CREATE POLICY "Public read specific email assets"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (
  bucket_id = 'email-assets'
  AND name = 'logo-bebloo.png'
);
