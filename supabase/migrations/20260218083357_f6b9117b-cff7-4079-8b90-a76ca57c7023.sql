
-- Create children table
CREATE TABLE public.children (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT,
  situation TEXT NOT NULL CHECK (situation IN ('expecting', 'born')),
  due_date DATE,
  birth_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view own children"
ON public.children FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own children"
ON public.children FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own children"
ON public.children FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own children"
ON public.children FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all children"
ON public.children FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Updated_at trigger
CREATE TRIGGER update_children_updated_at
BEFORE UPDATE ON public.children
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Max 5 children per user validation trigger
CREATE OR REPLACE FUNCTION public.enforce_max_children()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF (SELECT count(*) FROM public.children WHERE user_id = NEW.user_id) >= 5 THEN
    RAISE EXCEPTION 'Maximum of 5 children per user allowed';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_enforce_max_children
BEFORE INSERT ON public.children
FOR EACH ROW
EXECUTE FUNCTION public.enforce_max_children();

-- Migrate existing data from profiles to children
INSERT INTO public.children (user_id, situation, due_date, birth_date, is_active)
SELECT
  id,
  parent_situation,
  baby_due_date,
  baby_birth_date,
  true
FROM public.profiles
WHERE parent_situation IS NOT NULL
  AND (baby_due_date IS NOT NULL OR baby_birth_date IS NOT NULL);
