# Codebase Review: bebloo (Baby Stage Packs)

**Date:** 2026-03-17
**Reviewer:** Claude (automated codebase analysis)

---

## 1. Overall Summary

**Overall Quality: 6.5/10** — Solid foundation with modern tooling (React 18, Vite, Supabase, React Query, shadcn/ui) and good separation of concerns. Critical data model inconsistencies, security gaps in Edge Functions, and technical debt in static data management need attention before production scaling.

### Strengths

- Clean component architecture with proper hook-based logic extraction
- Strong Row-Level Security (RLS) policies and database-level validation triggers
- No XSS vulnerabilities — React's safe rendering used consistently throughout
- Well-configured build system (Vite + SWC)
- Good accessibility fundamentals (semantic HTML, heading hierarchy, form labels)
- Stripe signature verification with constant-time comparison (webhook)
- Input validation with Zod on forms, server-side whitelist validation on Edge Functions

### Weaknesses

- Critical stage enum mismatch between app types and database schema
- Wildcard CORS on all Edge Functions
- Equipment/pricing data duplicated across 3+ files with no single source of truth
- In-memory-only rate limiting that resets on cold starts
- No automated tests, no dependency auditing, loose TypeScript config

---

## 2. Issues by Severity

### CRITICAL

| # | Area | Issue | Location |
|---|------|-------|----------|
| 1 | Data Model | Stage enum mismatch: App defines `"6-9m" \| "9-12m" \| "12m+"` but DB defines `"6-12m" \| "12-18m" \| "18-24m"`. Persisting stage data will silently fail or corrupt records. | `src/types/baby.ts` vs `supabase/migrations/` |
| 2 | Security | Wildcard CORS (`*`) on all 8 Edge Functions allows any website to call endpoints. Combined with public functions (chat, email, admin-login), enables CSRF and API abuse. | All `supabase/functions/*/index.ts` |
| 3 | Security | No Stripe webhook idempotency: replayed webhooks create duplicate subscriptions and shipments. Stripe can retry events multiple times. | `supabase/functions/stripe-webhook/index.ts` |

### HIGH

| # | Area | Issue | Location |
|---|------|-------|----------|
| 4 | Security | In-memory rate limiting resets on function cold starts. Distributed attacks bypass limits entirely. | `supabase/functions/chat/index.ts`, `send-confirmation-email/index.ts` |
| 5 | Data | Equipment data duplicated across `packStages.ts`, `planEquipment.ts`, and `productCatalog.ts` with conflicting prices and no reconciliation. | `src/data/` |
| 6 | Performance | `useSubscription` makes 3 separate queries (subscription, shipments, feedback) that could be 1 joined query or RPC call. | `src/hooks/useSubscription.ts` |
| 7 | Security | No CAPTCHA or abuse prevention on public endpoints (admin-login, chat, lead capture). Brute-force attacks possible. | Edge Functions |
| 8 | State | `useToast` memory leak: `state` in the useEffect dependency array causes listener add/remove on every state change, accumulating stale listeners. | `src/hooks/use-toast.ts` |

### MEDIUM

| # | Area | Issue | Location |
|---|------|-------|----------|
| 9 | Logic | Recommendation engine unreachable code: the porteo branch `!hasSome` condition is never true due to prior branching logic. | `src/data/recommendationEngine.ts:46-49` |
| 10 | Logic | Recommendation engine ignores `dueDate` entirely — a parent due in 1 week gets the same recommendations as one due in 6 months. | `src/data/recommendationEngine.ts` |
| 11 | Type Safety | JSON fields untyped: `shipments.items` and `analytics_events.event_data` have no runtime validation. Corrupt JSON causes silent failures. | `src/hooks/useSubscription.ts` |
| 12 | Security | No audit logging: admin actions (password changes, subscription creation) are not logged. Cannot track who made changes. | Edge Functions |
| 13 | Performance | `useStripeSubscription` polls every 60s even when user is idle. Battery drain on mobile. | `src/hooks/useStripeSubscription.ts` |
| 14 | Data | Two unreconciled pricing models: `precio_en_pack` (pack-based) vs `pricePerMonth` (rental-based) with no documentation. | `src/data/packStages.ts` vs `productCatalog.ts` |
| 15 | Accessibility | Missing `aria-label`/`aria-expanded` on icon-only expand/collapse buttons. | `src/components/dashboard/` |
| 16 | Security | Profiles baby_* fields still present after migration to `children` table — data redundancy. | DB schema |
| 17 | Robustness | Non-null assertions (`!`) in recommendation engine. Crashes silently if product ID removed from catalog. | `src/data/recommendationEngine.ts` |

### LOW

| # | Area | Issue | Location |
|---|------|-------|----------|
| 18 | Lint | Unused variables not detected — `@typescript-eslint/no-unused-vars` is off. | `eslint.config.js` |
| 19 | DX | No dependency auditing (no Dependabot, no `npm audit` in CI). | Project config |
| 20 | Data | Unsplash placeholder images in `packsByStage.ts`. | `src/data/packsByStage.ts` |
| 21 | UX | `useSelection` localStorage failure is silent — state resets to defaults with no notification. | `src/hooks/useSelection.ts` |
| 22 | Performance | `usePackSelections` recalculates prices on every render with no memoization. | `src/hooks/usePackSelections.ts` |
| 23 | Auth | No session timeout or re-authentication flow for long-lived sessions. | Auth architecture |

---

## 3. Detailed Analysis

### 3.1 Backend (Edge Functions)

**Architecture:** 8 Deno-based Edge Functions handling auth, payments, chat, and email. All use `verify_jwt = false` in config, requiring manual JWT validation per function.

**Security strengths:**
- Bcrypt password hashing for admin credentials
- Stripe webhook HMAC-SHA256 signature verification with constant-time comparison
- Server-side product price catalog (prevents client-side price manipulation)
- HTML escaping in confirmation email function
- Database-level constraints (max 2 admins, max 5 children, email format triggers)

**Security concerns:**
- All functions use `Access-Control-Allow-Origin: *`
- Rate limiting stored in-memory (resets on cold start)
- IP detection falls back to "unknown" if headers missing (all requests share one bucket)
- No CAPTCHA on public endpoints
- Admin-login has no constant-time comparison for bcrypt (unlike webhook)
- Service role key in all functions means a compromised function has full DB access

**Error handling:** Generally good with appropriate HTTP status codes (400/401/429/500). Stripe webhook has inconsistent error states where 500 is returned but processing may continue partially.

### 3.2 Database Schema

**Strengths:**
- Proper foreign key constraints with cascade deletes
- Enum types for statuses and stages
- Row-Level Security on all sensitive tables
- Triggers for automatic validation and timestamp updates
- Role-based access control via `user_roles` table

**Weaknesses:**
- No audit table for change tracking
- No soft deletes (historical data lost on cascades)
- No payment reconciliation table
- `profiles.baby_*` fields redundant after `children` table migration
- Stage enum values don't match app-level type definitions

### 3.3 Frontend Architecture

**Component structure:** Well-organized with atomic UI layer (shadcn/ui), domain components grouped by feature (auth, configurator, dashboard, admin), and pages as route-level compositions.

**State management (hybrid approach):**
- Context: Auth state (`useAuth`)
- React Query: Server data (`useChildren`, `useSubscription`, `useAdminRole`, `useStripeSubscription`)
- Module store: Pack selections (`usePackSelections` via `useSyncExternalStore`)
- localStorage: Product selections (`useSelection`)

**React Query usage:**
- Default QueryClient with no global configuration
- User ID as cache key pattern: `["entity", user?.id]`
- Conditional enabling with `enabled: !!user`
- Mutations invalidate related queries on success
- No optimistic updates anywhere

**Performance concerns:**
- 3 separate queries in `useSubscription` instead of 1 joined query
- 60s polling in `useStripeSubscription` even when idle
- No memoization in `usePackSelections` price calculations
- Chat messages accumulate unbounded in memory

### 3.4 UI/UX & Accessibility

**Positive patterns:**
- Mobile-first responsive design with consistent `md:` breakpoint pattern
- Semantic HTML landmarks used throughout
- Single H1 per page with proper heading hierarchy
- Form labels properly associated with inputs
- `encodeURIComponent()` used for dynamic URLs (WhatsApp links)
- Spanish locale used consistently for user-facing content

**Gaps:**
- Some icon-only buttons lack `aria-label`
- Loading states missing `aria-busy` attributes
- Status indicators use color alone in some components
- No explicit focus management in multi-step configurator flow

### 3.5 Static Data & Recommendation Engine

**Data duplication:** Equipment exists in `packStages.ts`, `planEquipment.ts`, and `productCatalog.ts` with different price fields (`precio_en_pack` vs `pricePerMonth`) and inconsistent stage naming ("Etapa 0" vs "0-3m" vs "prenatal").

**Recommendation engine:** Simple branching algorithm with sound core logic but has an unreachable code path in the porteo (carrying) branch, ignores `dueDate` entirely, and uses unsafe non-null assertions (`!`).

---

## 4. Recommendations (Priority Order)

### Week 1 — Critical/Blocking

1. **Fix stage enum mismatch** — Create bidirectional mapping between app and DB stage values, or align the DB enum
2. **Restrict CORS origins** — Replace `*` with actual domains on all Edge Functions
3. **Add Stripe webhook idempotency** — Store processed event IDs in a `processed_events` table

### Week 2 — High Impact

4. **Consolidate equipment data** — Single `products.ts` source of truth; derive pack compositions from it
5. **Fix `useToast` listener leak** — Remove `state` from useEffect dependency array
6. **Move rate limiting to persistent storage** — Use Supabase table or external store

### Week 3 — Quality & Performance

7. **Combine subscription queries** — Create Supabase RPC or use nested select
8. **Fix recommendation engine** — Address unreachable code, add `dueDate` processing, replace `!` assertions
9. **Add JSON field validation** — Zod schemas for `shipments.items`

### Week 4 — Hardening

10. **Add audit logging** — `audit_log` table for admin actions
11. **Enable stricter ESLint rules** — `no-unused-vars` as warning
12. **Add dependency auditing** — `npm audit` in CI or Dependabot
13. **Accessibility improvements** — `aria-label` on interactive elements, `aria-busy` on loading states
