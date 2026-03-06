

## What comes next

Based on the current state, the Stripe checkout flow creates sessions correctly with dynamic billing intervals, but several critical pieces are missing to complete the end-to-end subscription lifecycle:

### Current gaps

1. **Webhook not operational**: The `stripe-webhook` edge function exists but the `STRIPE_WEBHOOK_SECRET` is not configured. Additionally, the webhook expects `plan_id` in session metadata, but the checkout function sends `item_count` instead -- so even if triggered, it would fail.

2. **No subscription verification**: There is no `check-subscription` function. After payment, the app has no way to know the user is subscribed. The dashboard relies on the `subscriptions` table, which only gets populated by the webhook (which doesn't work yet).

3. **No customer portal**: Users have no way to manage, cancel, or update their subscription after subscribing.

### Recommended next steps (in order)

**Step 1 -- Fix and activate the webhook**
- Add the `STRIPE_WEBHOOK_SECRET` secret
- Update `stripe-webhook/index.ts` to match the metadata the checkout function actually sends (`user_id`, `item_count`, cart items)
- Store selected products in the `subscriptions` and `shipments` tables correctly
- Configure webhook URL in Stripe dashboard (the user would need to do this)

**Step 2 -- Create `check-subscription` function**
- Query Stripe for active subscriptions by user email
- Return subscription status, product details, and end date
- Integrate into the frontend: call on login, page load, and periodically
- Update dashboard to reflect real subscription state

**Step 3 -- Create `customer-portal` function**
- Allow users to manage billing, cancel, or update payment methods via Stripe's Customer Portal
- Add a "Gestionar suscripcion" button in the dashboard/settings

### Which to tackle first?

The webhook is the most critical -- without it, payments succeed in Stripe but nothing happens in your database. I would recommend starting there.

