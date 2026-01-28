-- Fix PUBLIC_DATA_EXPOSURE: Block all reads on leads table
CREATE POLICY "Block all reads" 
ON public.leads 
FOR SELECT 
TO public
USING (false);

-- Fix MISSING_RLS: Block all updates on leads table
CREATE POLICY "Prevent lead updates" 
ON public.leads 
FOR UPDATE 
TO public
USING (false);

-- Fix MISSING_RLS: Block all deletes on leads table
CREATE POLICY "Prevent lead deletion" 
ON public.leads 
FOR DELETE 
TO public
USING (false);