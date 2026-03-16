

## Plan: Fix Stripe checkout "User not authenticated" error

### Problem
When clicking "Pagar con tarjeta", the `stripe-checkout` edge function returns a 500 error because the user's auth token isn't being passed or is invalid. The function requires authentication but the checkout dialog doesn't verify the user is logged in before calling it.

### Changes

**1. `src/components/configurator/CheckoutOptionsDialog.tsx`**
- Import `useAuth` hook
- Before invoking `stripe-checkout`, check if `user` exists
- If not authenticated, show a toast message and redirect to `/auth` with a return URL
- This prevents the edge function from being called without a valid session

**2. `src/pages/PackCheckout.tsx`** (same fix)
- Add auth check before calling `stripe-checkout`
- Redirect to login if not authenticated

### Why this happens
The Selection and Catalog pages are accessible without login. When an unauthenticated user clicks "Pagar con tarjeta", `supabase.functions.invoke` sends the request without an Authorization header, causing the edge function to fail.

