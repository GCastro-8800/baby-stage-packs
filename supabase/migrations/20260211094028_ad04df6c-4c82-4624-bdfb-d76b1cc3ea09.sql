
-- 1. Validacion de inserts en leads
CREATE OR REPLACE FUNCTION public.validate_lead_insert()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
BEGIN
  IF NEW.email IS NULL OR NEW.email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  IF NEW.plan IS NULL OR trim(NEW.plan) = '' THEN
    RAISE EXCEPTION 'Plan is required';
  END IF;
  IF length(NEW.email) > 255 THEN
    RAISE EXCEPTION 'Email too long';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validate_lead_insert
  BEFORE INSERT ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.validate_lead_insert();

-- 2. Validacion de inserts en analytics_events
CREATE OR REPLACE FUNCTION public.validate_analytics_insert()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
DECLARE
  allowed_types text[] := ARRAY[
    'page_view','cta_click','pricing_click','modal_open',
    'lead_captured','plan_detail_view','contact_click',
    'equipment_selection','plan_upgrade_click'
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

CREATE TRIGGER trg_validate_analytics_insert
  BEFORE INSERT ON public.analytics_events
  FOR EACH ROW EXECUTE FUNCTION public.validate_analytics_insert();

-- 3. Defense-in-depth: revoke SELECT from authenticated too
REVOKE SELECT ON public.leads FROM authenticated;
REVOKE SELECT ON public.analytics_events FROM authenticated;
