
-- Block direct inserts on user_roles (only the handle_new_user trigger should create roles)
CREATE POLICY "Block direct role inserts"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (false);

-- Block role updates
CREATE POLICY "Block role updates"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (false);

-- Block role deletions
CREATE POLICY "Block role deletions"
ON public.user_roles
FOR DELETE
TO authenticated
USING (false);
