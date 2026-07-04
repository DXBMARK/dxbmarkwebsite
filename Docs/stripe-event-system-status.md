# Stripe Event System Stabilization & Truth Layer Status

## Current Status
The Stripe event system integration has been successfully hardened and stabilized. It features a complete truth-layer mapping inside the database, cryptographically validated webhooks, idempotency guards, and reliable async dispatching via Upstash QStash.

---

## Architecture & Flow

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   Stripe CLI /  │ ────> │ Stripe Webhook  │ ────> │   Neon DB       │
│  Stripe Service │       │ (/api/stripe/   │       │ (stripe_webhook_│
└─────────────────┘       │   webhook)      │       │     events)     │
                          └────────┬────────┘       └─────────────────┘
                                   │
                                   │ (non-blocking dispatch)
                                   ▼
                          ┌─────────────────┐       ┌─────────────────┐
                          │ Upstash QStash  │ ────> │ process-event   │
                          │   Scheduler     │       │ (/api/stripe/   │
                          └─────────────────┘       │  process-event) │
                                                    └────────┬────────┘
                                                             │
                                                             ▼
                                                    ┌─────────────────┐
                                                    │  State Machine  │
                                                    │ (Business logic)│
                                                    └─────────────────┘
```

1. **Stripe** dispatches cryptographically signed payloads to `/api/stripe/webhook`.
2. The **Webhook Route** performs signature verification, logs initial status, checks database availability, and writes to `stripe_webhook_events` to enforce idempotency.
3. The **QStash Publisher** receives event metadata asynchronously and schedules a delivery payload to the `/api/stripe/process-event` queue processing route.
4. **Queue Processor Route** validates the schema, transitions the status of the event inside the database via the **State Machine**, and triggers logic hooks.

---

## Completed Implementations

### 1. Webhook Protection Layer
* **Universal Crash Wrapper**: Any uncaught exception in the webhook route is caught and logged, returning a safe controlled response instead of crashing with an HTTP 500.
* **Database Health Gate**: The database connection is validated using a lightweight `SELECT 1` query (`checkDatabaseConnection()`) before trying to persist the event. If the database is down:
  * In `strict` mode: returns `503 Service Unavailable` allowing Stripe to retry.
  * In `degraded` mode: returns `200` with `processed: false` and `reason: "db_unavailable"`.
* **Signature Guard**: If the signature header is missing or cryptographically invalid, returns `400 Bad Request`.
* **Idempotency Guard**: Event persistence handles duplication checks on the database level using `stripe_event_id` unique constraints.

### 2. Database & Schema Verification (Neon Integration)
* Neon database configured in `.env.local` with the development AWS region instance.
* Applied migrations:
  * `0000_stripe_webhook_tables.sql`: Scaffolds the tables `stripe_webhook_events`, `billing_states`, and `integration_jobs`.
  * `0001_extend_stripe_webhook_events.sql`: Extends `stripe_webhook_events` with truth-layer tracking columns: `webhook_status`, `db_status`, `queue_status`, and missing `retry_count`.

### 3. Queue Dispatch (Upstash QStash)
* `QSTASH_URL`, `QSTASH_TOKEN`, and signing keys populated in `.env.local`.
* Dynamic configuration loaded via `env.ts`.
* Non-blocking queue publish dispatches successfully, and asynchronously logs `queue_status` as `sent` or `failed` in the database.

---

## Event Routing Profile

### Supported Events
These events are persisted to the database and published to the QStash processing queue:
* `payment_intent.succeeded`
* `payment_intent.payment_failed`
* `payment_intent.created`
* `invoice.paid`
* `invoice.payment_failed`
* `charge.succeeded`
* `charge.failed`
* `refund.created`

### Ignored/Skipped Events
Any Stripe event types not explicitly listed in the supported set (e.g. `customer.created`, `subscription.updated`) bypass database storage and are acknowledged directly with `200 OK` using the log tag `[STRIPE WEBHOOK SKIPPED - UNSUPPORTED EVENT]`.

---

## Production Deployment Notes & Security
* **Secret Rotation**: Before going live, all mock/test keys (like `STRIPE_WEBHOOK_SECRET`, `STRIPE_SECRET_KEY`, and `QSTASH_TOKEN`) must be rotated with production-grade secrets via Vercel or environment control panels.
* **Strict Mode Enforcement**: `WEBHOOK_MODE` should be set to `strict` in production to ensure DB issues properly notify Stripe (with a `503` code) to trigger automated retries.
* **Serverless Scale**: Database transactions use serverless-safe connections. The retry counter is incremented atomically using a single `UPDATE ... RETURNING` statement to avoid locking contentions.

---

## Pending Work Before T027
- [x] Webhook layer stabilization
- [x] Database schema migrations applied to Dev/Neon
- [x] QStash publisher setup and integration
- [x] End-to-end local validation passing
- [ ] Connect webhook to live production Stripe environment endpoints (requires public domain mapping)
