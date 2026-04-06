-- Fix 1: Block anon INSERT on user_roles (privilege escalation fix)
CREATE POLICY "Block anon role inserts"
ON public.user_roles
FOR INSERT
TO anon
WITH CHECK (false);

-- Fix 2: Block unauthenticated INSERT on subscriptions & add scoped policy for authenticated
CREATE POLICY "Block anon subscription inserts"
ON public.subscriptions
FOR INSERT
TO anon
WITH CHECK (false);

CREATE POLICY "Users can only insert own subscriptions"
ON public.subscriptions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);