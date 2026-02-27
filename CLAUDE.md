# CLAUDE.md — bebloo (Baby Stage Packs)

AI assistant guide for the bebloo codebase. Read this before making changes.

---

## Project Overview

**bebloo** is a subscription-based baby equipment rental service for parents of children aged 0–12 months. It operates on a stage-based model: equipment is curated by developmental stage (0–3m, 3–6m, 6–9m, 9–12m, 12m+, prenatal) and delivered as packs on a recurring subscription.

**Business model:** Monthly subscription tiers (Start €59/mo, Comfort €129/mo, Total Peace €149/mo) with stage-appropriate product deliveries.

**Target audience:** First-time parents in Spanish-speaking markets. The UX tone is deliberately calming and non-sales-driven.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 18.3.1 + TypeScript 5.8.3 |
| Build tool | Vite 5.4.19 (React SWC plugin) |
| Routing | React Router DOM 6.30.1 |
| UI components | shadcn/ui (Radix UI primitives) |
| Styling | Tailwind CSS 3.4.17 |
| Icons | Lucide React 0.462.0 |
| Server state | TanStack React Query 5.83.0 |
| Forms | React Hook Form 7.61.1 + Zod 3.25.76 |
| Backend/DB | Supabase (PostgreSQL + Auth + Edge Functions) |
| Payments | Stripe (via Edge Functions) |
| Date utilities | date-fns 3.6.0 (Spanish locale) |
| Notifications | Sonner 1.7.4 |
| Charts | Recharts 2.15.4 |
| Dark mode | next-themes 0.3.0 |

---

## Repository Structure

```
/
├── src/
│   ├── App.tsx                 # Root: providers, router, all routes
│   ├── main.tsx                # React 18 entry point
│   ├── index.css               # Global styles
│   ├── pages/                  # 19 page components (one per route)
│   ├── components/
│   │   ├── ui/                 # shadcn/ui primitives (40+ components)
│   │   ├── admin/              # Admin panel components
│   │   ├── auth/               # ProtectedRoute, AdminRoute, form fields
│   │   ├── catalog/            # Product catalog display
│   │   ├── configurator/       # Pack configurator flow
│   │   ├── dashboard/          # Authenticated user dashboard
│   │   ├── onboarding/         # Onboarding multi-step flow
│   │   ├── packs/              # Pack display components
│   │   └── settings/           # Account settings
│   ├── hooks/                  # 13 custom React hooks
│   ├── data/                   # Static data + recommendation engine
│   ├── integrations/
│   │   ├── supabase/           # Supabase client + auto-generated DB types
│   │   └── lovable/            # Lovable.dev platform integration
│   ├── lib/                    # Utility functions (cn(), etc.)
│   ├── types/                  # TypeScript interfaces (baby.ts)
│   └── assets/                 # Images and static media
├── supabase/
│   ├── config.toml             # Supabase project config (ID: okxfhhbqxsxtdlneliax)
│   ├── migrations/             # 19+ SQL migration files
│   └── functions/              # 6 Deno Edge Functions
├── docs/                       # Product docs (design, flows, roadmap)
├── public/                     # Static assets (served as-is)
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── eslint.config.js
└── components.json             # shadcn/ui config
```

---

## Development Commands

```bash
npm run dev          # Start dev server at localhost:8080
npm run build        # Production build → /dist
npm run build:dev    # Development mode build
npm run lint         # ESLint on all files
npm run preview      # Preview production build locally
```

**Note:** Both `package-lock.json` (npm) and `bun.lockb` (bun) exist. Use `npm` unless the team specifies otherwise.

---

## Routing

All routes are defined in `src/App.tsx`. The pattern is:

- **Public routes:** `/`, `/auth`, `/privacidad`, `/condiciones`, `/quienes-somos`, `/configurador`, `/catalogo`, `/mi-seleccion`, `/checkout/success`
- **Protected routes** (require auth): `/onboarding`, `/app`, `/app/settings`
- **Admin routes**: `/admin/login`, `/admin`
- **Redirects:** `/packs/:packId*` all redirect to `/configurador`
- **Catch-all:** `*` → `NotFound`

Add new routes **above** the `*` catch-all route. Never remove the catch-all.

---

## Authentication

- Auth state is managed by `useAuth()` hook via `AuthProvider` in `App.tsx`.
- `ProtectedRoute` wraps authenticated pages. It accepts a `skipOnboardingCheck` prop (used for `/onboarding`).
- `AdminRoute` wraps admin pages and checks admin role via `useAdminRole()`.
- Supabase Auth supports email/password and Google OAuth.
- The Lovable cloud auth package (`@lovable.dev/cloud-auth-js`) is present for platform-level integration.

---

## Key Custom Hooks

| Hook | Purpose |
|---|---|
| `useAuth()` | Auth state, signUp, signIn, signOut, OAuth |
| `useBabyStage()` | Calculate baby age and developmental stage from birth/due date |
| `useSubscription()` | Fetch active subscriptions, shipments, feedback |
| `useChildren()` | CRUD for user's children profiles |
| `usePackSelections()` | Module-level store for pack product selections |
| `useSelection()` | Track per-session product selections |
| `useChat()` | Streaming AI chat (calls `/functions/v1/chat` Edge Function) |
| `useAnalytics()` | Track events to `analytics_events` table |
| `useLeadCapture()` | Email capture → `leads` table |
| `useAdminRole()` | Check if current user has admin permissions |
| `use-mobile()` | Mobile breakpoint detection |
| `use-toast()` | Toast notification helpers |

---

## Database Schema (Supabase)

Tables (from `src/integrations/supabase/types.ts`):

| Table | Purpose |
|---|---|
| `profiles` | User profiles (name, birth date, onboarding status, avatar) |
| `children` | Children per user (name, situation, due/birth dates) |
| `subscriptions` | Active subs (plan name, status, current stage) |
| `shipments` | Delivery records (status, stage, dates, items JSON) |
| `feedback` | Product ratings (`useful` / `not_useful`) + comments |
| `leads` | Email captures for marketing |
| `analytics_events` | Event tracking (type, data, session ID) |
| `admin_credentials` | Admin login (hashed password) |

**Important:** `src/integrations/supabase/types.ts` is auto-generated from the Supabase schema. Do not hand-edit it — regenerate via Supabase CLI if the schema changes.

---

## Edge Functions (Supabase)

Located in `supabase/functions/`. All are Deno-based:

| Function | Purpose | Auth |
|---|---|---|
| `chat` | AI assistant (streaming, rate-limited 10 req/hr/IP, Spanish) | Public |
| `stripe-checkout` | Create Stripe checkout session | Bearer token required |
| `stripe-webhook` | Handle Stripe payment events | Stripe signature |
| `send-confirmation-email` | Transactional emails | Public |
| `admin-login` | Verify admin credentials | Public |
| `set-admin-password` | Initial admin password setup | Public |

`verify_jwt` is disabled on most Edge Functions (configured in `supabase/config.toml`).

---

## Static Data Files

Located in `src/data/`:

- `packStages.ts` — Pack configurations with equipment options per stage
- `packsByStage.ts` — Stage-specific pack definitions
- `productCatalog.ts` — Full product catalog (60+ products across 5 categories)
- `planEquipment.ts` — Equipment category definitions
- `recommendationEngine.ts` — Personalization algorithm

Product categories: `Movilidad` (strollers), `Descanso` (sleep), `Porteo` (carriers), `Alimentacion` (feeding), `Extras`.

---

## UI & Component Conventions

### shadcn/ui
- All primitive UI components live in `src/components/ui/`. Do not modify them directly.
- Use `cn()` from `src/lib/utils.ts` for conditional class merging (combines `clsx` + `tailwind-merge`).
- Import from `@/components/ui/...` using the path alias.

### Path Alias
`@/` maps to `./src/`. Always use this alias for imports within `src/`.

### Tailwind
- Custom colors are defined in `tailwind.config.ts`: `trust-badge`, `pricing-highlight`, warm/mint section variants.
- Custom animations: `accordion-down`, `accordion-up`, `fade-up`, `marquee`.
- The `2xl` breakpoint is capped at `1200px`.
- Dark mode is via CSS class (`dark`), managed by `next-themes`.

### TypeScript
- `noImplicitAny: false` and `strictNullChecks: false` — the project uses loose type checking.
- Type definitions for domain objects (Stage, Situation, Child, etc.) are in `src/types/baby.ts`.

---

## Design System & Tone

This is critical — the design philosophy must be preserved in all UI work.

### Emotional Tone
The brand feel is: **warm, calm, expert, reassuring**. Every screen should feel like "a soft morning at home with your sleeping baby."

**Anti-patterns to avoid:**
- Urgency language ("last chance", "buy now")
- Clinical/cold aesthetic
- Infinite catalog lists with filters
- Aggressive red alerts or badges

### Colors (from design-guidelines.md)
- Primary: `#E6DCD0` (warm beige, baby-skin tone)
- Accent: `#D4A5A5` (muted dusty rose)
- Background: `#FCFAF7` (butter white)
- Text primary: `#1F1F1F`
- Text secondary: `#5C5853` (warm gray)
- Border: `#EAE3DA`
- Semantic colors are soft (no pure reds): Success `#A4D4AE`, Warning `#F5C6AA`, Error `#E7A3A3`

### Typography
- H1: 40–44px, weight 600, serif
- Body: 16–18px, 1.55–1.65 line-height, weight 400–450
- Short paragraphs (2–3 lines max), prefer bullets

### Motion
- Micro-interactions: 150–200ms
- Screen transitions/drawers: 220–300ms
- Easing: `ease-in-out`

### Copy/Microcopy (Spanish)
- Short sentences. No repeated exclamation marks.
- Avoid: "optimize", "maximize", "convert"
- Prefer: "te acompañamos", "está resuelto", "puedes cambiarlo cuando quieras"
- Error messages should never blame the user: "No es tu culpa. Probemos de nuevo."

### Layout Rules
- One primary action per screen
- Mobile-first, single column
- 8pt grid system
- Cards: 16–20px border radius; Buttons: pill shape (999px)
- Low density — never cramped
- Max 72ch for reading text (editorial width)

---

## Accessibility Requirements
- Single `H1` per page
- Semantic landmarks: `header`, `main`, `nav`, `footer`
- AA+ contrast on all text
- Logical tab order; visible focus (2px outline, calm color)
- Use `aria-label` on icon-only buttons, `aria-labelledby` on drawers/modals
- State indicators use both text + icon (never color alone)

---

## Adding New Features

1. **New page:** Create in `src/pages/`, add route in `src/App.tsx` above the `*` catch-all.
2. **New component:** Place in the appropriate subfolder under `src/components/`. Use shadcn/ui primitives where possible.
3. **New hook:** Add to `src/hooks/` with `use` prefix. Follow the pattern in existing hooks.
4. **New DB table:** Write a migration file in `supabase/migrations/` and regenerate `src/integrations/supabase/types.ts`.
5. **New Edge Function:** Add to `supabase/functions/`, configure in `config.toml`.

---

## Environment Variables

```
VITE_SUPABASE_URL=https://okxfhhbqxsxtdlneliax.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<anon key>
VITE_SUPABASE_PROJECT_ID=okxfhhbqxsxtdlneliax
```

Only `VITE_` prefixed variables are exposed to the frontend bundle by Vite. Never put secrets in `VITE_` vars.

---

## Common Gotchas

- **Routing:** Spanish URL slugs are used (`/configurador`, `/catalogo`, `/mi-seleccion`, `/privacidad`, `/condiciones`, `/quienes-somos`). Keep these consistent.
- **Types file:** `src/integrations/supabase/types.ts` is auto-generated — do not manually edit it.
- **Pack selection state:** `usePackSelections` uses a module-level store (not React Context), so it persists across renders but resets on page refresh.
- **Admin auth:** Admin login is separate from user auth and goes through the `admin-login` Edge Function, not Supabase Auth directly.
- **Date locale:** Use `date-fns` with the `es` (Spanish) locale for any date formatting shown to users.
- **No test suite:** There are no automated tests. Validate changes manually in the dev server.

---

## Documentation

Additional context in `docs/`:
- `app-flow-pages-and-roles.md` — Site map, user roles, primary journeys, flow integrity rules
- `Design-guidelines.md` — Full design system (tone, typography, color, motion, accessibility)
- `Implementation-plan.md` — Technical roadmap and feature milestones
- `Masterplan.md` — High-level product strategy and vision
