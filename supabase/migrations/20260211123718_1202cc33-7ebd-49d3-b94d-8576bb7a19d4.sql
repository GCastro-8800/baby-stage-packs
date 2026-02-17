
-- Allow admins to read all leads
CREATE POLICY "Admins can read all leads"
ON public.leads FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Also allow admins to read all profiles (needed for joining user names in admin views)
CREATE POLICY "Admins can read all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
