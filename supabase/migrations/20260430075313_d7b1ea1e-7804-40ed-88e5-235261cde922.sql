-- 1. Guardar CRON_SECRET y SERVICE_ROLE_KEY en Vault para usar desde pg_cron
DO $$
DECLARE
  v_cron_secret_id uuid;
  v_service_role_id uuid;
BEGIN
  SELECT id INTO v_cron_secret_id FROM vault.secrets WHERE name = 'cron_secret';
  IF v_cron_secret_id IS NULL THEN
    PERFORM vault.create_secret(
      '9b8cb69cd9f54482db445fc13c492ccb691e4d335ae852d030eefb732d84f4b4',
      'cron_secret',
      'Secreto compartido para autenticar invocaciones de pg_cron a edge functions'
    );
  ELSE
    UPDATE vault.secrets
    SET secret = '9b8cb69cd9f54482db445fc13c492ccb691e4d335ae852d030eefb732d84f4b4'
    WHERE id = v_cron_secret_id;
  END IF;
END $$;

-- 2. Re-programar los 3 jobs para usar X-Cron-Secret en lugar de Bearer anon
SELECT cron.unschedule('check-expiring-subscriptions-daily');
SELECT cron.unschedule('process-expired-subscriptions-daily');
SELECT cron.unschedule('send-pickup-reminders-daily');

SELECT cron.schedule(
  'check-expiring-subscriptions-daily',
  '0 9 * * *',
  $job$
  select net.http_post(
    url := 'https://okxfhhbqxsxtdlneliax.supabase.co/functions/v1/check-expiring-subscriptions',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'X-Cron-Secret', (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'cron_secret' LIMIT 1)
    ),
    body := jsonb_build_object('trigger', 'cron', 'time', now())
  );
  $job$
);

SELECT cron.schedule(
  'process-expired-subscriptions-daily',
  '0 10 * * *',
  $job$
  select net.http_post(
    url := 'https://okxfhhbqxsxtdlneliax.supabase.co/functions/v1/process-expired-subscriptions',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'X-Cron-Secret', (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'cron_secret' LIMIT 1)
    ),
    body := jsonb_build_object('trigger', 'cron', 'time', now())
  );
  $job$
);

SELECT cron.schedule(
  'send-pickup-reminders-daily',
  '0 11 * * *',
  $job$
  select net.http_post(
    url := 'https://okxfhhbqxsxtdlneliax.supabase.co/functions/v1/send-pickup-reminders',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'X-Cron-Secret', (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'cron_secret' LIMIT 1)
    ),
    body := jsonb_build_object('trigger', 'cron', 'time', now())
  );
  $job$
);

-- 3. Ampliar handle_new_user para enviar email de bienvenida vía pg_net
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $func$
DECLARE
  v_full_name text;
  v_service_role_key text;
BEGIN
  v_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name'
  );

  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    v_full_name,
    NEW.raw_user_meta_data->>'avatar_url'
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');

  -- Disparar email de bienvenida (no bloquea el signup si falla)
  BEGIN
    SELECT decrypted_secret INTO v_service_role_key
    FROM vault.decrypted_secrets
    WHERE name = 'email_queue_service_role_key'
    LIMIT 1;

    IF v_service_role_key IS NOT NULL AND NEW.email IS NOT NULL THEN
      PERFORM net.http_post(
        url := 'https://okxfhhbqxsxtdlneliax.supabase.co/functions/v1/send-transactional-email',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || v_service_role_key
        ),
        body := jsonb_build_object(
          'templateName', 'welcome',
          'recipientEmail', NEW.email,
          'idempotencyKey', 'welcome-' || NEW.id::text,
          'templateData', jsonb_build_object(
            'customerName', v_full_name,
            'configuratorUrl', 'https://bebloo.es/configurador'
          )
        )
      );
    END IF;
  EXCEPTION WHEN OTHERS THEN
    -- Nunca romper el alta por un fallo de email
    RAISE WARNING 'handle_new_user: welcome email enqueue failed: %', SQLERRM;
  END;

  RETURN NEW;
END;
$func$;