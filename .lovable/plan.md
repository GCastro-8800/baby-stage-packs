

## Problem

When the user selects a 3-month commitment, the Stripe Checkout page shows "facturación mensual" (monthly billing) instead of billing every 3 months. This is because the edge function hardcodes `recurring: { interval: "month" }` regardless of the selected duration.

The user expects: if they commit to 3 months, they should be billed every 3 months (i.e., the total for 3 months upfront), not monthly.

## Solution

Update the `stripe-checkout` edge function to set the Stripe recurring interval based on the selected duration:

- **1 month** → `interval: "month"`, `interval_count: 1`
- **3 months** → `interval: "month"`, `interval_count: 3` (billed every 3 months)
- **6 months** → `interval: "month"`, `interval_count: 6`
- **12 months** → `interval: "year"`, `interval_count: 1`
- **24 months** → `interval: "year"`, `interval_count: 2`

The `unit_amount` will be adjusted to reflect the total for the billing period (e.g., for 3 months at 67€/month → 201€ every 3 months).

**Important caveat**: Stripe only supports `interval_count` up to certain limits (month max 12, year max 1 for subscriptions). So the mapping will be:

- 1 month → `month`, count 1, amount = pricePerMonth × 1
- 3 months → `month`, count 3, amount = pricePerMonth × 3
- 6 months → `month`, count 6, amount = pricePerMonth × 6
- 12 months → `month`, count 12, amount = pricePerMonth × 12
- 24 months → `month`, count 12, amount = pricePerMonth × 12 (two-year intervals not supported natively — we'll need to handle this differently, possibly as 12-month with a note, or bill yearly)

Actually, Stripe supports `interval: "year"` with `interval_count: 1` or `2`. So:

- 12 months → `year`, count 1, amount = pricePerMonth × 12
- 24 months → `year`, count 2, amount = pricePerMonth × 24

## Changes

### 1. Edge function `stripe-checkout/index.ts`
- Map `item.months` to the correct Stripe `interval` and `interval_count`
- Multiply `unit_amount` by the number of months in the billing period
- Update product name to include billing period (e.g., "Bugaboo Fox 3 (3 meses)")

### 2. UI description update in `CheckoutOptionsDialog.tsx`
- Change "suscripción mensual" to dynamically reflect the selected commitment period

## Technical Details

```text
months → Stripe mapping:
1  → interval: "month", interval_count: 1, amount: price × 1
3  → interval: "month", interval_count: 3, amount: price × 3
6  → interval: "month", interval_count: 6, amount: price × 6
12 → interval: "year",  interval_count: 1, amount: price × 12
24 → interval: "year",  interval_count: 2, amount: price × 24
```

