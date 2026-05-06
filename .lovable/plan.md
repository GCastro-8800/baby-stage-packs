## Buscador de productos + captura de "lo que buscan"

Sí, es una idea muy buena: añade fricción cero al usuario y, además, te genera **datos de demanda real** (qué piden las familias que aún no tenemos).

### Qué se añade

**1. Buscador en `/catalogo` (Catalog.tsx)**
- Input con icono de lupa, sticky bajo el header.
- Placeholder: *"Busca un producto: cuna, mochila, hamaca…"*
- Filtra `PRODUCT_CATALOG` por `name`, `description`, `brand` y `category` (match parcial, case-insensitive, sin acentos).
- Convive con el filtro de categorías existente (se combinan).
- Al escribir, se ocultan las secciones por etapa que queden vacías.

**2. Estado vacío con captura de lead**
Cuando la búsqueda no devuelve resultados, en lugar de "0 productos" mostramos una tarjeta cálida:

> **"No encontramos «{término}» todavía."**
> Cuéntanos qué producto te haría falta y lo valoramos para próximas selecciones. Si lo añadimos, te avisamos.
>
> [ Email (opcional) ] [ Notas: marca, modelo… ]
> **Botón:** *Avísame si lo añadimos*

- Email validado con `zod` (igual patrón que el resto del proyecto).
- Tracking analítico: nuevo evento `product_search_no_results` con `{ query, has_email }`.
- Persistencia: tabla nueva `product_requests` (ver técnico).

**3. Microcopy y tono**
- Sin "lo sentimos" ni disculpas largas (Bebloo evita victimismo).
- Frase clave: *"Curamos la selección con cuidado, así que aún no tenemos todo. Tu pista nos ayuda."*

### Detalle técnico

- **Componente nuevo:** `src/components/catalog/CatalogSearchBar.tsx` (input + clear).
- **Componente nuevo:** `src/components/catalog/ProductRequestCard.tsx` (estado vacío + form).
- **Lógica de búsqueda:** helper `normalize(str)` que hace `toLowerCase` + `normalize("NFD").replace(/\p{Diacritic}/gu, "")`.
- **Migración Supabase** (tabla nueva):
  ```sql
  create table public.product_requests (
    id uuid primary key default gen_random_uuid(),
    query text not null,
    email text,
    notes text,
    user_id uuid,
    user_agent text,
    referrer text,
    created_at timestamptz not null default now()
  );
  alter table public.product_requests enable row level security;
  -- Insert público (con o sin user)
  create policy "Anyone can submit product requests"
    on public.product_requests for insert
    to anon, authenticated
    with check (
      length(query) between 1 and 120
      and (email is null or email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$')
      and (notes is null or length(notes) <= 500)
    );
  -- Solo admin lee
  create policy "Admins can read product requests"
    on public.product_requests for select
    to authenticated
    using (has_role(auth.uid(), 'admin'));
  -- Sin update/delete (igual patrón que `leads`)
  ```
- **Analytics:** añadir `product_search_no_results` y `product_request_submitted` al array permitido del trigger `validate_analytics_event` (otra migración).
- **Sin email automático** en esta primera versión: solo guardamos. Más adelante podemos disparar un `acknowledge` por Resend si quieres.

### Lo que NO se toca
- Configurador (`/configurador`) y `PackStageProducts` siguen igual: el buscador vive en el catálogo, que es donde el usuario explora libre.
- No se cambia el flujo de selección/precios.

### Resultado para Bebloo
- Catálogo más usable en móvil (363px) sin scroll infinito.
- Pipeline de "demanda no atendida" → input directo para decidir qué producto incorporar.
- Puedes consultar peticiones desde el panel admin (`SELECT query, count(*) FROM product_requests GROUP BY 1 ORDER BY 2 DESC`).

¿Lo arranco así, o prefieres que el buscador esté también dentro del configurador (paso 4) además de en el catálogo?
