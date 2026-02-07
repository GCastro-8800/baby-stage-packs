-- Add INSERT policy so new users can create their own profile record during signup
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);