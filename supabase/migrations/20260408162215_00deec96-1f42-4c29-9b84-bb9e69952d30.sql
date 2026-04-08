
CREATE OR REPLACE FUNCTION public.get_inactive_customers(_months integer DEFAULT 6)
RETURNS TABLE (
  id uuid,
  full_name text,
  last_activity timestamptz,
  last_status text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.id,
    p.full_name,
    GREATEST(MAX(s.updated_at), MAX(sh.delivered_date::timestamptz)) AS last_activity,
    (
      SELECT sub.status::text
      FROM subscriptions sub
      WHERE sub.user_id = p.id
      ORDER BY sub.updated_at DESC
      LIMIT 1
    ) AS last_status
  FROM profiles p
  LEFT JOIN subscriptions s ON s.user_id = p.id
  LEFT JOIN shipments sh ON sh.user_id = p.id
  WHERE NOT EXISTS (
    SELECT 1 FROM subscriptions
    WHERE user_id = p.id AND status = 'active'
  )
  GROUP BY p.id
  HAVING GREATEST(MAX(s.updated_at), MAX(sh.delivered_date::timestamptz)) < now() - make_interval(months => _months)
     OR GREATEST(MAX(s.updated_at), MAX(sh.delivered_date::timestamptz)) IS NULL
$$;
