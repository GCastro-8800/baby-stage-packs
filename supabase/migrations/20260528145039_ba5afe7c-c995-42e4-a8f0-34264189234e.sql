
CREATE TABLE IF NOT EXISTS public.rate_limit_buckets (
  key text PRIMARY KEY,
  window_start timestamptz NOT NULL DEFAULT now(),
  count integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.rate_limit_buckets TO service_role;

ALTER TABLE public.rate_limit_buckets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages rate limit buckets"
  ON public.rate_limit_buckets
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS rate_limit_buckets_window_start_idx
  ON public.rate_limit_buckets (window_start);

CREATE OR REPLACE FUNCTION public.check_rate_limit(
  _key text,
  _max integer,
  _window_seconds integer
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_now timestamptz := now();
  v_count integer;
  v_window_start timestamptz;
BEGIN
  INSERT INTO public.rate_limit_buckets AS rlb (key, window_start, count, updated_at)
  VALUES (_key, v_now, 1, v_now)
  ON CONFLICT (key) DO UPDATE
    SET
      count = CASE
        WHEN rlb.window_start < v_now - make_interval(secs => _window_seconds) THEN 1
        ELSE rlb.count + 1
      END,
      window_start = CASE
        WHEN rlb.window_start < v_now - make_interval(secs => _window_seconds) THEN v_now
        ELSE rlb.window_start
      END,
      updated_at = v_now
  RETURNING count, window_start INTO v_count, v_window_start;

  RETURN jsonb_build_object(
    'limited', v_count > _max,
    'count', v_count,
    'retry_after', GREATEST(0, _window_seconds - EXTRACT(EPOCH FROM (v_now - v_window_start))::int)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.check_rate_limit(text, integer, integer) TO service_role;

CREATE OR REPLACE FUNCTION public.cleanup_rate_limit_buckets()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.rate_limit_buckets
  WHERE window_start < now() - interval '24 hours';
$$;

GRANT EXECUTE ON FUNCTION public.cleanup_rate_limit_buckets() TO service_role;
