
# Next Steps for bebloo

Based on your implementation plan and what's already built, here's what to tackle next, ordered by impact:

---

## 1. Subscription Management (Phase 7) -- Highest Priority

This is the **core of the app experience** for logged-in users. Right now `/app` shows a dashboard, but the full subscription lifecycle isn't implemented yet.

### What to build:
- **Current subscription status block**: Show active plan, current stage (0-3m, 3-6m, etc.), and a calming "Todo bajo control" message
- **Next shipment block**: Clear date, shipment status (scheduled / packed / shipped / delivered), and a "Cambiar fecha" action
- **Current pack contents**: Collapsible list of items in the active pack
- **Quick feedback**: Simple 1-2 tap feedback per item ("Me sirvio" / "No me encajo") with optional short text
- **Soft actions**: Pause subscription, reschedule delivery

### Database tables needed:
- `subscriptions` (user_id, status, current_stage, next_shipment_date)
- `shipments` (subscription_id, status, scheduled_date, shipped_date)
- `feedback` (user_id, shipment_id, item_key, rating, comment)

---

## 2. Testimonials Page (Phase 8) -- Quick Win

A standalone `/stories` page with real parent stories in a warm, Moleskine-style card grid.

### What to build:
- Card grid with photo + quote + baby age context
- Simple filter by stage (0-3m, 3-6m, etc.)
- Subtle CTA linking to relevant pack ("Ver el pack de esta etapa")
- Seed data with 4-6 sample testimonials

---

## 3. Admin Panel (Phase 9) -- Operational Need

A minimal internal admin to manage real operations when pilots start.

### What to build:
- Protected `/admin` route (role-based, only for admin users)
- View all subscriptions and their statuses
- View upcoming shipments and update their status
- View captured leads

---

## Recommended Order

1. **Subscription tables + RLS** (database foundation)
2. **Subscription UI on /app** (the core user experience)
3. **Testimonials page** (quick win, adds social proof)
4. **Admin panel** (needed before pilot launch)

---

## Technical Notes

- All new tables will need RLS policies scoped to `auth.uid()`
- Subscription and shipment tables will reference user IDs from the existing `profiles` table (no FK to `auth.users`)
- Feedback table will use a composite key of shipment_id + item_key
- Admin access will leverage the existing `user_roles` table
