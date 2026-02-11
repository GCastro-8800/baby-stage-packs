

# Plan: Corregir los 3 problemas de seguridad nivel "warn"

## Resumen
Se van a aplicar correcciones reales a los 3 problemas de seguridad en lugar de ignorarlos.

---

## Problema 1: RLS Policy Always True (INSERT sin restricciones)
**Riesgo:** Las tablas `leads` y `analytics_events` permiten INSERT con `WITH CHECK (true)`, lo que significa que cualquier cliente puede insertar datos arbitrarios sin validacion.

**Solucion:** Crear triggers de validacion en la base de datos que:
- En `leads`: validen que el email tenga formato correcto y que `plan` no este vacio
- En `analytics_events`: validen que `event_type` sea uno de los tipos permitidos y limiten el tamano de `event_data` para evitar abuso

---

## Problema 2: Exposicion de emails en tabla `leads`
**Riesgo:** Si la politica de bloqueo de lectura se desactiva accidentalmente, los emails quedarian expuestos.

**Solucion:** Anadir una capa extra de proteccion:
- Crear un trigger que valide el formato del email antes de insertar
- Confirmar que los permisos de SELECT estan revocados para `anon` (ya hecho) y tambien revocar para `authenticated` como defensa adicional

---

## Problema 3: Datos de analytics pueden revelar patrones de usuario
**Riesgo:** El campo `event_data` acepta cualquier JSON, lo que podria usarse para almacenar datos sensibles o abusar del almacenamiento.

**Solucion:**
- Crear un trigger de validacion que limite el tamano del JSON de `event_data` (max 2KB)
- Validar que `event_type` sea un valor de una lista predefinida
- Revocar SELECT de `authenticated` tambien en `analytics_events`

---

## Detalles tecnicos

### Migracion SQL

```sql
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
```

### Cambios en codigo
No se requieren cambios en el codigo frontend. Los datos enviados ya cumplen con las validaciones que se van a crear.

### Actualizacion de findings
Se eliminaran los 3 findings del dashboard de seguridad una vez aplicados los fixes.

