-- Tighten analytics_events anon insert policy to only allow whitelisted event types
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.analytics_events;

CREATE POLICY "Allow anonymous inserts of valid events"
ON public.analytics_events
FOR INSERT
TO anon, authenticated
WITH CHECK (
  event_type IN (
    'page_view','cta_click','pricing_click','modal_open',
    'lead_captured','plan_detail_view','contact_click',
    'equipment_selection','plan_upgrade_click','checkout_start',
    'pack_stage_click','pack_stage_next',
    'product_deselect_attempt','product_deselect_confirmed','product_deselect_cancelled'
  )
  AND (event_data IS NULL OR length(event_data::text) <= 2048)
);

-- Restrict email-assets bucket public listing to logo files only
DROP POLICY IF EXISTS "Public read access for email assets" ON storage.objects;

CREATE POLICY "Public read access for email logos"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'email-assets'
  AND name LIKE 'logo-%'
);
