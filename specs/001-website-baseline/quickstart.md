# Quickstart: Local Webhook Validation Guide

This guide details the local setup, environment configuration, and verification commands to test the Stripe webhook receiver using the Stripe CLI.

---

## 1. Prerequisites

- **Stripe CLI**: Installed on your development environment.
- **Node.js**: Next.js app running locally on `http://localhost:3000`.
- **Database**: PostgreSQL database configured (or local mock environment).

---

## 2. Environment Setup

Configure your local `.env.local` file with dummy test credentials. Do not commit actual keys.

```bash
STRIPE_RESTRICTED_KEY=rk_test_dummykeyvaluehere
STRIPE_WEBHOOK_SECRET=whsec_dummywebhooksecretforlocaltesting
STRIPE_ACCOUNT_ID=acct_1Te5cl8Txkr3y6yT
STRIPE_WEBHOOK_TOLERANCE_SECONDS=300
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/dxbmark
WEBHOOK_PROCESSING_MODE=log_only
```

---

## 3. Webhook Testing Steps

### Step 1: Start the Local Server
Run the Next.js development server:
```bash
npm run dev
```

### Step 2: Authenticate Stripe CLI
Log in to your Stripe developer dashboard via CLI:
```bash
stripe login
```

### Step 3: Forward Webhook Events
Listen for test events and forward them to your local endpoint:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
*Note*: The CLI output will display a local webhook signing secret (starting with `whsec_`). Copy this value and update your local `STRIPE_WEBHOOK_SECRET` environment variable.

### Step 4: Trigger Test Events
In a separate terminal panel, trigger Stripe test events:
```bash
# Trigger a successful payment intent
stripe trigger payment_intent.succeeded

# Trigger a completed checkout session
stripe trigger checkout.session.completed

# Trigger a failed invoice payment
stripe trigger invoice.payment_failed
```

---

## 4. Verification Checklists

- **Server Logs**: Confirm that the console prints event validation lines, execution durations, and event types (e.g. `checkout.session.completed - received`).
- **Database Logs**: Inspect the `stripe_webhook_events` table to verify records are logged with unique event IDs and that duplicated triggers are ignored with a `duplicate` status.
- **Error Redaction**: Verify that console outputs and Sentry exceptions do not print sensitive customer details (like full card numbers) or restricted key values.
