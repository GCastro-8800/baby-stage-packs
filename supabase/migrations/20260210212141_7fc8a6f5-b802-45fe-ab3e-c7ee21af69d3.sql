
-- Add user_id and selected_products columns to leads table
ALTER TABLE public.leads 
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN selected_products text[];

-- Update RLS: allow authenticated users to insert leads with their own user_id
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.leads;

CREATE POLICY "Allow inserts with optional user_id" 
ON public.leads 
FOR INSERT 
WITH CHECK (
  user_id IS NULL OR user_id = auth.uid()
);
