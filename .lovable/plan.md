

## Plan: Completar tareas pendientes de la semana actual

### Contexto
La tarea 1 (DNS/emails) está resuelta tras la migración a Resend. Quedan 3 tareas.

### Tarea 2 — Brandear emails de auth (~1-2h)
- Aplicar colores, logo y tono de bebloo a las 6 plantillas de email en `supabase/functions/_shared/email-templates/`
- Extraer paleta de `src/index.css` (primary, foreground, muted-foreground, radius)
- Subir logo al storage y añadirlo a cada plantilla
- Asegurar que todo el copy está en español y con el tono calmado de bebloo
- Redesplegar `auth-email-hook`

### Tarea 3 — Restringir CORS (~1h)
- Reemplazar `Access-Control-Allow-Origin: *` por los dominios reales en todas las Edge Functions:
  - `https://bebloo.lovable.app`
  - `https://www.bebloo.es`
  - `https://bebloo.es`
  - El preview URL de desarrollo
- Actualizar el archivo `supabase/functions/_shared/cors.ts` centralizado
- Redesplegar todas las funciones afectadas

### Tarea 4 — Reemplazar placeholders (~2-3h)
- Sustituir imágenes placeholder de Unsplash en `src/data/packsByStage.ts` y otros archivos de datos por fotos reales de producto
- Requiere que tú proporciones las imágenes reales de los productos/packs

### Orden sugerido
1. CORS (rápido, mejora seguridad inmediata)
2. Brandear emails (independiente, se puede probar con un registro)
3. Placeholders (depende de que tengas las imágenes listas)

### Detalles técnicos
- CORS: se modificará `_shared/cors.ts` para exportar un helper que valide el `Origin` contra una whitelist y devuelva el header correcto
- Emails: se usarán los estilos CSS del proyecto (HSL custom properties) convertidos a valores inline para email
- Se redesplegarán todas las Edge Functions modificadas

