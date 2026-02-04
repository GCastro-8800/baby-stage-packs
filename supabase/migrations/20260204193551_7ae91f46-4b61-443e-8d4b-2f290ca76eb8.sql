-- Block all SELECT operations on analytics_events table
-- This prevents public access to analytics data including session IDs, user agents, and behavioral data
CREATE POLICY "Block all reads" 
ON public.analytics_events 
FOR SELECT 
USING (false);

-- Also add UPDATE and DELETE protection like the leads table
CREATE POLICY "Prevent analytics updates" 
ON public.analytics_events 
FOR UPDATE 
USING (false);

CREATE POLICY "Prevent analytics deletion" 
ON public.analytics_events 
FOR DELETE 
USING (false);