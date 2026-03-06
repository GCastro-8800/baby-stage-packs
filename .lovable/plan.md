

## Plan: Configure STRIPE_WEBHOOK_SECRET

Store the provided Stripe webhook signing secret (`whsec_Dmagi56JFSd8D94YNGXDwYiNrxEnkivi`) as a backend secret so the `stripe-webhook` Edge Function can verify incoming Stripe events.

### Changes

1. **Add secret** `STRIPE_WEBHOOK_SECRET` with the provided value using the secrets tool
2. **Verify** the webhook function works by testing it

No code changes needed — the `stripe-webhook` function already reads this secret from the environment.

