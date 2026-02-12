
-- Table for admin-specific passwords (separate from normal auth)
CREATE TABLE public.admin_credentials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS and block ALL access (only service role can read/write)
ALTER TABLE public.admin_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Block all access" ON public.admin_credentials
  FOR ALL USING (false);

-- Trigger to enforce max 2 admin credentials
CREATE OR REPLACE FUNCTION public.enforce_max_admin_credentials()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF (SELECT count(*) FROM public.admin_credentials) >= 2 THEN
    RAISE EXCEPTION 'Maximum of 2 admin credentials allowed';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER check_max_admin_credentials
  BEFORE INSERT ON public.admin_credentials
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_max_admin_credentials();
