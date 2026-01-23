# Stripe Production Setup

## 1. Stripe Dashboard Setup

### Create Product & Price
1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → Products
2. Click **Add product**
3. Fill in:
   - Name: `LazyBill Pro`
   - Description: `Unbegrenzte Kunden, Rechnungen und Firmen`
4. Add a price:
   - Pricing model: Standard
   - Price: `10.00 EUR`
   - Billing period: Monthly
5. Save and copy the **Price ID** (starts with `price_`)

### Create Webhook Endpoint
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click **Add endpoint**
3. Endpoint URL: `https://YOUR_DOMAIN/api/auth/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)

## 2. Environment Variables

### Convex Environment
Set these in the Convex Dashboard → Settings → Environment Variables:

```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Vercel/Production Environment
Add the same variables to your deployment platform.

## 3. Test the Integration

1. Log in to the app
2. Go to **Account → Billing** (Abrechnung)
3. Click **Upgrade to Pro**
4. Use Stripe test card: `4242 4242 4242 4242`
5. Complete checkout
6. Verify subscription is active

## 4. Going Live

1. Switch from test keys (`sk_test_`) to live keys (`sk_live_`)
2. Create a new webhook endpoint for production domain
3. Update all environment variables with production values
4. Test with a real payment

## Current Test Values (Sandbox)

```
STRIPE_SECRET_KEY=sk_test_51SsOzwFKebOu6Ddv659I0ESFpCScngX09cSSojeMRssvLnTvlgEbHQavSLUQNhxInWhhPFuH9ba5SEJMBaiRH3aA00OHb6AhJI
STRIPE_PRO_PRICE_ID=price_1SsP1LFKebOu6DdvBUVpG6vv
STRIPE_WEBHOOK_SECRET=whsec_... (get from Stripe CLI or Dashboard)
```

## Local Testing with Stripe CLI

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local
stripe listen --forward-to localhost:5173/api/auth/stripe/webhook

# Copy the webhook signing secret from the output
```
