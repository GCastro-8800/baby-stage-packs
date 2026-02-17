
CREATE OR REPLACE FUNCTION public.validate_analytics_insert()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
DECLARE
  allowed_types text[] := ARRAY[
    'page_view','cta_click','pricing_click','modal_open',
    'lead_captured','plan_detail_view','contact_click',
    'equipment_selection','plan_upgrade_click','checkout_start'
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
$function$;
