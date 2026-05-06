-- Tabla para capturar peticiones de productos no encontrados en el catálogo
CREATE TABLE public.product_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query text NOT NULL,
  email text,
  notes text,
  user_id uuid,
  user_agent text,
  referrer text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.product_requests ENABLE ROW LEVEL SECURITY;

-- Validación de longitud y email
CREATE OR REPLACE FUNCTION public.validate_product_request()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.query IS NULL OR length(trim(NEW.query)) < 1 OR length(NEW.query) > 120 THEN
    RAISE EXCEPTION 'Invalid query length';
  END IF;
  IF NEW.email IS NOT NULL AND NEW.email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  IF NEW.notes IS NOT NULL AND length(NEW.notes) > 500 THEN
    RAISE EXCEPTION 'Notes too long';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_product_request_trigger
BEFORE INSERT ON public.product_requests
FOR EACH ROW EXECUTE FUNCTION public.validate_product_request();

-- Cualquier visitante puede enviar una petición
CREATE POLICY "Anyone can submit product requests"
ON public.product_requests FOR INSERT
TO anon, authenticated
WITH CHECK ((user_id IS NULL) OR (user_id = auth.uid()));

-- Solo admin puede leer
CREATE POLICY "Admins can read product requests"
ON public.product_requests FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Bloquear updates y deletes (mismo patrón que leads)
CREATE POLICY "Block product request updates"
ON public.product_requests FOR UPDATE
USING (false);

CREATE POLICY "Block product request deletes"
ON public.product_requests FOR DELETE
USING (false);

-- Añadir nuevos eventos analíticos al validador
CREATE OR REPLACE FUNCTION public.validate_analytics_event()
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
    'product_search_no_results','product_request_submitted'
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