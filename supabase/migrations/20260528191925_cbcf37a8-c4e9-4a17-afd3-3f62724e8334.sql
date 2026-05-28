CREATE OR REPLACE FUNCTION public.get_user_subscription_overview()
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_subscription jsonb;
  v_shipments jsonb;
  v_feedback jsonb;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object(
      'subscription', NULL,
      'shipments', '[]'::jsonb,
      'feedback', '[]'::jsonb
    );
  END IF;

  SELECT to_jsonb(s.*)
  INTO v_subscription
  FROM public.subscriptions s
  WHERE s.user_id = v_user_id
    AND s.status IN ('active','expired','paused')
  ORDER BY s.updated_at DESC
  LIMIT 1;

  SELECT COALESCE(jsonb_agg(to_jsonb(sh.*) ORDER BY sh.scheduled_date DESC), '[]'::jsonb)
  INTO v_shipments
  FROM public.shipments sh
  WHERE sh.user_id = v_user_id;

  SELECT COALESCE(jsonb_agg(to_jsonb(f.*)), '[]'::jsonb)
  INTO v_feedback
  FROM public.feedback f
  WHERE f.user_id = v_user_id;

  RETURN jsonb_build_object(
    'subscription', v_subscription,
    'shipments', v_shipments,
    'feedback', v_feedback
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_user_subscription_overview() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_user_subscription_overview() TO authenticated;