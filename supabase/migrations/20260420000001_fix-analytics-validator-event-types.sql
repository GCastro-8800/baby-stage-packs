-- Sync validate_analytics_insert() with all event types declared in useAnalytics.ts.
-- The previous version (20260213181253) was missing 9 types added later, causing
-- silent insert failures for: pack_stage_click, pack_stage_next, product_deselect_*,
-- recommendation_view, product_swap, product_add, product_remove.
-- Also drops the orphaned validate_analytics_event() function created in 20260216102316
-- that was never attached to any trigger.
CREATE OR REPLACE FUNCTION public.validate_analytics_insert()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
DECLARE
  allowed_types text[] := ARRAY[
    'page_view','cta_click','pricing_click','modal_open',
    'lead_captured','plan_detail_view','contact_click',
    'equipment_selection','plan_upgrade_click','checkout_start',
    'pack_stage_click','pack_stage_next',
    'product_deselect_attempt','product_deselect_confirmed','product_deselect_cancelled',
    'recommendation_view','product_swap','product_add','product_remove'
  ];
BEGIN
  IF NEW.event_type IS NULL OR NOT (NEW.event_type = ANY(allowed_types)) THEN
    RAISE EXCEPTION 'Invalid event_type: %', NEW.event_type;
  END IF;
  IF NEW.event_data IS NOT NULL AND length(NEW.event_data::text) > 2048 THEN
    RAISE EXCEPTION 'event_data too large';
  END IF;
  RETURN NEW;
END;
$$;

DROP FUNCTION IF EXISTS public.validate_analytics_event();
