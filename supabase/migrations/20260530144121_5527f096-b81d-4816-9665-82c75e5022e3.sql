DO $$
DECLARE
  v_cron_secret_id uuid;
BEGIN
  SELECT id INTO v_cron_secret_id FROM vault.secrets WHERE name = 'cron_secret';
  IF v_cron_secret_id IS NULL THEN
    PERFORM vault.create_secret(
      '138140a8d4fcdde22baa99af97976975b7ff427705bf6c2a850fa1fd22b3f44a',
      'cron_secret',
      'Secreto compartido para autenticar invocaciones de pg_cron a edge functions (rotado)'
    );
  ELSE
    PERFORM vault.update_secret(
      v_cron_secret_id,
      '138140a8d4fcdde22baa99af97976975b7ff427705bf6c2a850fa1fd22b3f44a',
      'cron_secret',
      'Secreto compartido para autenticar invocaciones de pg_cron a edge functions (rotado)'
    );
  END IF;
END $$;