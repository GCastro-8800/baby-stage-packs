-- Replace permissive false-policies on user_roles with RESTRICTIVE policies
-- to make role table mutations impossible to bypass via additional permissive policies.

DROP POLICY IF EXISTS "Block anon role inserts" ON public.user_roles;
DROP POLICY IF EXISTS "Block direct role inserts" ON public.user_roles;
DROP POLICY IF EXISTS "Block role updates" ON public.user_roles;
DROP POLICY IF EXISTS "Block role deletions" ON public.user_roles;

CREATE POLICY "Restrict role inserts"
ON public.user_roles
AS RESTRICTIVE
FOR INSERT
TO anon, authenticated
WITH CHECK (false);

CREATE POLICY "Restrict role updates"
ON public.user_roles
AS RESTRICTIVE
FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "Restrict role deletions"
ON public.user_roles
AS RESTRICTIVE
FOR DELETE
TO anon, authenticated
USING (false);
