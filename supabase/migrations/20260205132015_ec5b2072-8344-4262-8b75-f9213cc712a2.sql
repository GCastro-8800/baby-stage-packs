-- Add onboarding columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_first_child boolean,
ADD COLUMN IF NOT EXISTS parent_situation text;

-- Add check constraint for parent_situation
ALTER TABLE public.profiles
ADD CONSTRAINT check_parent_situation 
CHECK (parent_situation IS NULL OR parent_situation IN ('expecting', 'born'));