CREATE TABLE public.user_selections (
  user_id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  product_ids text[] NOT NULL DEFAULT '{}',
  durations jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_selections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own selection"
  ON public.user_selections FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own selection"
  ON public.user_selections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own selection"
  ON public.user_selections FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own selection"
  ON public.user_selections FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER update_user_selections_updated_at
  BEFORE UPDATE ON public.user_selections
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.profiles ADD COLUMN questionnaire_answers jsonb;