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
      'apikey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9reGZoaGJxeHN4dGRsbmVsaWF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NDY0NzQsImV4cCI6MjA4NDQyMjQ3NH0.gQdOai1uop_H15LjJPD8IaP4S5V3shzdxjxCP0UJK94',
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
      'apikey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9reGZoaGJxeHN4dGRsbmVsaWF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NDY0NzQsImV4cCI6MjA4NDQyMjQ3NH0.gQdOai1uop_H15LjJPD8IaP4S5V3shzdxjxCP0UJK94',
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
      'apikey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9reGZoaGJxeHN4dGRsbmVsaWF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NDY0NzQsImV4cCI6MjA4NDQyMjQ3NH0.gQdOai1uop_H15LjJPD8IaP4S5V3shzdxjxCP0UJK94',
      'X-Cron-Secret', (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'cron_secret' LIMIT 1)
    ),
    body := jsonb_build_object('trigger', 'cron', 'time', now())
  );
  $job$
);