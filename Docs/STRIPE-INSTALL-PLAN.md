# STRIPE-INSTALL-PLAN.md

## DXBMARK LLC Stripe Core Webhook Integration Plan

Status: Draft v1.0
Owner: DXBMARK LLC
Primary stack: Next.js App Router, TypeScript, Vercel-ready deployment
Current business model: DXBMARK sells its own services through Zoho Books invoices, Stripe-supported payment flows, invoices, checkout, subscriptions, payment links, and customer portal.
Explicitly out of scope: Stripe Connect, marketplace, connected accounts, seller onboarding, application fees.

---

## 1. Final objective

Build a secure, maintainable, production-ready Stripe Core Webhook foundation for DXBMARK LLC that:

1. Receives Stripe webhook events at a dedicated Next.js App Router endpoint.
2. Verifies Stripe webhook signatures using the raw request body.
3. Stores webhook metadata safely in an idempotent event store.
4. Routes events through a separate webhook router, not directly inside route.ts.
5. Logs only necessary operational metadata.
6. Avoids storing card data, full billing address, secrets, webhook raw payload, or sensitive payment details.
7. Supports future actions through integration jobs without blocking the Stripe webhook response.
8. Prepares a clear Billing State Machine for future subscriptions and customer portal workflows.
9. Keeps Zoho integration decoupled from webhook handling.
10. Keeps PayPal as a future TODO, not part of the Stripe foundation.

---

## 2. Confirmed project facts

- Framework: Next.js
- Routing: App Router
- App directory: src/app
- Correct webhook route: src/app/api/stripe/webhook/route.ts
- No current API routes
- No current database
- No current customer login or dashboard
- No current Stripe SDK installed
- No current Stripe env vars
- Primary payment flow today: Zoho Books invoices connected to Stripe
- Possible later payment flow: direct Stripe-hosted links or checkout for selected services
- Webhook phase 1 behaviour: logging and event store only, no destructive business actions

---

## 3. Architecture decision

### Decision

Use a modular monolith structure inside the current Next.js project.

### Reason

The current scope does not require a separate service or microservice. A clean internal server module gives the project enough separation without adding operational complexity.

### Target flow

Stripe Webhook
  -> Next.js route.ts
  -> Raw body extraction
  -> Signature verification
  -> Event metadata extraction
  -> Idempotency check
  -> Store event
  -> Route event to handler
  -> Optional integration job creation
  -> Return 200 quickly

Future async flow:

Integration Worker / Scheduled Job
  -> Read pending integration jobs
  -> Send to Zoho or another provider
  -> Retry safely
  -> Log result
  -> Mark job completed or failed

---

## 4. Recommended project structure

```text
src/
  app/
    api/
      stripe/
        webhook/
          route.ts

  server/
    env.ts

    stripe/
      v1/
        client.ts
        config.ts
        constants.ts
        event-types.ts
        logger.ts
        sanitize.ts
        state-machine.ts
        webhook-router.ts
        webhook-security.ts
        handlers/
          checkout.ts
          invoices.ts
          payment-intents.ts
          subscriptions.ts
          customers.ts
          refunds.ts
          disputes.ts
        store/
          webhook-event-store.ts
          integration-job-store.ts
        types.ts

    payments/
      core/
        payment-event.ts
        payment-provider.ts
      providers/
        stripe/
          README.md
        paypal/
          TODO.md

  db/
    migrations/
      0001_stripe_webhook_events.sql
      0002_billing_state.sql
      0003_integration_jobs.sql
```

### Rule

`route.ts` must stay thin. It must not contain business logic, Zoho calls, subscription rules, invoice logic, or PayPal logic.

---

## 5. Environment variables

### .env.example

```bash
STRIPE_SECRET_KEY=
STRIPE_RESTRICTED_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_ACCOUNT_ID=acct_1Te5cl8Txkr3y6yT
STRIPE_WEBHOOK_TOLERANCE_SECONDS=300
STRIPE_WEBHOOK_LOG_LEVEL=info
DATABASE_URL=
WEBHOOK_PROCESSING_MODE=log_only
```

### Rules

- Never commit real keys.
- Never paste `sk_`, `rk_`, or `whsec_` into chat, logs, tickets, screenshots, or documentation.
- Use Vercel Environment Variables for production.
- Use `.env.local` only for local development.
- Use a secrets vault if the backend is moved outside Vercel.
- Keep test and live variables separate.

---

## 6. API key strategy

### Preferred

Use a Restricted API Key where Stripe permissions support the required server actions.

### Required research before final key decision

Create a key permission matrix before implementation:

| Component | Required Stripe action | Read | Write | Key type candidate |
|---|---:|---:|---:|---|
| Webhook verification | Verify signature locally | No | No | Webhook secret only |
| Event metadata logging | Use event object from webhook payload | No | No | No API key needed |
| Retrieve invoice later | invoices.retrieve | Yes | No | Restricted key |
| Retrieve customer later | customers.retrieve | Yes | No | Restricted key |
| Retrieve subscription later | subscriptions.retrieve | Yes | No | Restricted key |
| Create checkout later | checkout.sessions.create | No | Yes | Restricted key if supported |
| Customer portal later | billingPortal.sessions.create | No | Yes | Restricted key if supported |

### Production rule

If a restricted key cannot support a required SDK call, use the minimum viable secret key access inside server-only code and protect it through environment variables, secret rotation, audit logging, and strict access control.

---

## 7. Database recommendation

### Recommended production approach

Use a managed MySQL database, not shared cPanel MySQL, for webhook event storage if webhooks become business-critical.

Recommended options:

1. PlanetScale-compatible MySQL, if acceptable for your deployment model.
2. Managed MySQL from a reputable cloud provider.
3. Neon or Supabase Postgres if you later accept PostgreSQL, but current preference is MySQL.

### cPanel shared hosting assessment

Shared cPanel MySQL is acceptable only for low-risk logs or non-critical data. It is not recommended for production-grade payment event processing because:

- resource limits are usually shared and unpredictable
- long-running jobs can be killed or throttled
- queue workers are harder to run reliably
- secret management is weaker than managed cloud platforms
- observability and alerting are limited
- scaling is poor
- deployment rollback is weaker

### Final decision for phase 1

If no DB is ready, implement the code structure and schema files first, but keep production webhook processing in `log_only` mode until the database is configured and validated.

---

## 8. MySQL schema draft

### 0001_stripe_webhook_events.sql

```sql
CREATE TABLE stripe_webhook_events (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  stripe_event_id VARCHAR(255) NOT NULL,
  event_type VARCHAR(255) NOT NULL,
  object_id VARCHAR(255) NULL,
  object_type VARCHAR(100) NULL,
  livemode BOOLEAN NOT NULL,
  api_version VARCHAR(100) NULL,
  account_id VARCHAR(255) NULL,
  payload_hash CHAR(64) NULL,
  processing_status ENUM('received','processing','processed','ignored','failed','duplicate') NOT NULL DEFAULT 'received',
  handler_name VARCHAR(255) NULL,
  error_code VARCHAR(100) NULL,
  error_message VARCHAR(1000) NULL,
  received_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  processed_at DATETIME(3) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_stripe_event_id (stripe_event_id),
  KEY idx_event_type_received_at (event_type, received_at),
  KEY idx_processing_status_received_at (processing_status, received_at),
  KEY idx_object_id (object_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 0002_billing_state.sql

```sql
CREATE TABLE billing_states (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  provider ENUM('stripe','zoho','paypal') NOT NULL DEFAULT 'stripe',
  provider_customer_id VARCHAR(255) NULL,
  provider_subscription_id VARCHAR(255) NULL,
  provider_invoice_id VARCHAR(255) NULL,
  customer_email_hash CHAR(64) NULL,
  state ENUM(
    'trialing',
    'active',
    'past_due',
    'unpaid',
    'cancel_pending',
    'canceled',
    'paused',
    'incomplete',
    'incomplete_expired',
    'unknown'
  ) NOT NULL DEFAULT 'unknown',
  cancel_at_period_end BOOLEAN NULL,
  current_period_end DATETIME(3) NULL,
  last_stripe_event_id VARCHAR(255) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_provider_subscription (provider, provider_subscription_id),
  KEY idx_state_updated_at (state, updated_at),
  KEY idx_customer_email_hash (customer_email_hash)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 0003_integration_jobs.sql

```sql
CREATE TABLE integration_jobs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  source_provider ENUM('stripe','zoho','paypal') NOT NULL DEFAULT 'stripe',
  target_provider ENUM('zoho','internal','email','paypal') NOT NULL DEFAULT 'internal',
  source_event_id VARCHAR(255) NOT NULL,
  job_type VARCHAR(255) NOT NULL,
  status ENUM('pending','processing','completed','failed','dead_letter') NOT NULL DEFAULT 'pending',
  attempts INT UNSIGNED NOT NULL DEFAULT 0,
  max_attempts INT UNSIGNED NOT NULL DEFAULT 5,
  next_attempt_at DATETIME(3) NULL,
  last_error_message VARCHAR(1000) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_target_source_job (target_provider, source_event_id, job_type),
  KEY idx_status_next_attempt (status, next_attempt_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 9. Event list for Stripe Core Phase

### Required initial events

```text
checkout.session.completed
checkout.session.expired
payment_intent.succeeded
payment_intent.payment_failed
invoice.finalized
invoice.paid
invoice.payment_failed
invoice.upcoming
customer.created
customer.updated
customer.subscription.created
customer.subscription.updated
customer.subscription.deleted
charge.refunded
charge.dispute.created
```

### Handler behaviour in phase 1

All handlers must:

- receive typed event metadata
- log safe metadata
- mark event processed or ignored
- avoid external API calls unless explicitly enabled
- avoid Zoho calls
- avoid PayPal calls
- avoid customer emails
- avoid entitlement changes

---

## 10. Billing State Machine

### Supported internal states

```text
trialing
active
past_due
unpaid
cancel_pending
canceled
paused
incomplete
incomplete_expired
unknown
```

### Initial mapping draft

| Stripe source | Condition | Internal state |
|---|---|---|
| customer.subscription.created | status = trialing | trialing |
| customer.subscription.created | status = active | active |
| customer.subscription.updated | cancel_at_period_end = true | cancel_pending |
| customer.subscription.updated | status = past_due | past_due |
| customer.subscription.updated | status = unpaid | unpaid |
| customer.subscription.updated | pause_collection exists | paused |
| customer.subscription.deleted | any | canceled |
| customer.subscription.updated | status = incomplete | incomplete |
| customer.subscription.updated | status = incomplete_expired | incomplete_expired |

### Phase 1 rule

Create the mapping code and tests, but do not use it to grant or revoke access because the site has no customer login or dashboard.

---

## 11. Logging policy

### Log allowed

```text
stripe_event_id
event_type
livemode
api_version
object_id
object_type
handler_name
processing_status
duration_ms
error_code
safe error message
```

### Do not log

```text
card details
full billing address
full customer address
secret keys
webhook secret
raw payload
full customer profile
full invoice PDF content
payment method full details
```

### Legal alignment

Only retain operational data that is necessary for security, fraud prevention, compliance, debugging, accounting reconciliation, and service delivery. Retention must match the published DXBMARK legal policies.

---

## 12. Security controls

1. Verify every webhook signature.
2. Use raw request body.
3. Reject missing signature.
4. Reject invalid signature.
5. Never parse JSON before signature verification.
6. Return safe errors only.
7. Add rate limiting if endpoint abuse appears.
8. Consider Stripe IP allowlisting if deployment platform supports it reliably.
9. Keep endpoint HTTPS only in production.
10. Use secret rotation procedure.
11. Add pre-commit secret scanning.
12. Add CI secret scanning.
13. Keep webhook processing idempotent.
14. Store only safe metadata.
15. Keep environment variables server-only.

---

## 13. Testing strategy

### Local validation

```bash
npm install stripe
npm run lint
npm run typecheck
npm run test
npm run build
stripe login
stripe listen --events checkout.session.completed,checkout.session.expired,payment_intent.succeeded,payment_intent.payment_failed,invoice.finalized,invoice.paid,invoice.payment_failed,customer.created,customer.updated,customer.subscription.created,customer.subscription.updated,customer.subscription.deleted,charge.refunded,charge.dispute.created --forward-to localhost:3000/api/stripe/webhook
```

### Trigger examples

```bash
stripe trigger payment_intent.succeeded
stripe trigger payment_intent.payment_failed
stripe trigger checkout.session.completed
stripe trigger invoice.paid
stripe trigger invoice.payment_failed
```

### Required unit tests

- missing signature returns 400
- invalid signature returns 400
- valid event returns 200
- unknown event returns 200 and ignored status
- duplicate event is not processed twice
- event store unique constraint works
- handler failure is logged safely
- no raw payload is stored
- no secret appears in logs
- billing state mapping works

---

## 14. Build and validation gates

### Gate 0: Planning gate

Pass conditions:

- STRIPE-INSTALL-PLAN.md approved
- out-of-scope confirmed
- DB decision confirmed
- event list confirmed
- key strategy confirmed

### Gate 1: Structure gate

Pass conditions:

- folder structure created
- no runtime Stripe calls yet
- no secrets added
- lint passes
- typecheck passes
- build passes

### Gate 2: Stripe SDK gate

Pass conditions:

- latest stripe package installed
- stripe client is server-only
- env validation added
- no client imports of stripe SDK
- no payment_method_types hardcoded

### Gate 3: Webhook verification gate

Pass conditions:

- route uses request.text()
- route reads stripe-signature header
- constructEvent is used
- invalid signature test passes
- local Stripe CLI test passes

### Gate 4: Event store gate

Pass conditions:

- migrations created
- unique stripe_event_id enforced
- duplicate event test passes
- safe metadata only
- payload hash only, no raw payload

### Gate 5: Router and handlers gate

Pass conditions:

- route.ts has no business logic
- event router handles all approved event types
- unknown events are ignored safely
- handler tests pass
- logging sanitization passes

### Gate 6: Production readiness gate

Pass conditions:

- Vercel env vars set
- live webhook destination configured
- test mode and live mode separated
- production endpoint HTTPS verified
- no secrets in git history
- build passes after env configuration
- rollback plan documented

---

## 15. Implementation phases

### Phase 0: SpecKit foundation

Create:

```text
.specify/memory/constitution.md
specs/stripe-core-webhook/spec.md
specs/stripe-core-webhook/plan.md
specs/stripe-core-webhook/research.md
specs/stripe-core-webhook/data-model.md
specs/stripe-core-webhook/contracts/events.md
specs/stripe-core-webhook/quickstart.md
specs/stripe-core-webhook/tasks.md
specs/stripe-core-webhook/checklists/security.md
```

### Phase 1: Project structure preparation

- Create directories.
- Add README placeholders.
- Add TODO files for future Zoho and PayPal adapters.
- Add constants and event type declarations.
- No Stripe API call yet.

### Phase 2: Environment and SDK

- Install latest `stripe` package.
- Add env schema validation.
- Create server-only Stripe client.
- Add safe config module.
- Add key validation without printing key values.

### Phase 3: Webhook route and verification

- Create route.ts.
- Use raw request body.
- Verify signature.
- Return 400 on invalid requests.
- Return 200 on valid ignored events.

### Phase 4: Event store and idempotency

- Add DB migrations.
- Add store interface.
- Add MySQL implementation.
- Add no-op implementation for local setup if DB is unavailable.
- Enforce unique stripe_event_id.

### Phase 5: Event router and handlers

- Add router.
- Add handler files.
- Handle all approved event types in log-only mode.
- Add Billing State Machine mapping.
- Add integration job placeholder.

### Phase 6: Local Stripe CLI testing

- Configure local listener.
- Trigger test events.
- Validate DB entries.
- Validate duplicate event behaviour.
- Validate logs.

### Phase 7: Vercel production setup

- Add environment variables.
- Deploy.
- Configure Stripe webhook destination.
- Validate live endpoint with test mode first.
- Move to live when ready.

### Phase 8: Future enhancements

- Zoho worker.
- Admin-only internal event viewer.
- Alerting for failed webhook handling.
- Direct Stripe Checkout for selected services.
- Customer portal link generation.
- PayPal provider adapter.

---

## 16. Webhook endpoint configuration

### Test endpoint

```text
https://www.dxbmark.com/api/stripe/webhook
```

### Dashboard settings

- Events from: Your account
- Payload style: Snapshot
- API version: Latest stable available in Dashboard
- Description: DXBMARK Core Webhook - Stripe account events

### Events to select

```text
checkout.session.completed
checkout.session.expired
payment_intent.succeeded
payment_intent.payment_failed
invoice.finalized
invoice.paid
invoice.payment_failed
invoice.upcoming
customer.created
customer.updated
customer.subscription.created
customer.subscription.updated
customer.subscription.deleted
charge.refunded
charge.dispute.created
```

---

## 17. Rollback plan

If production issues appear:

1. Disable the webhook destination in Stripe Dashboard.
2. Roll back the Vercel deployment to the previous stable deployment.
3. Preserve database event logs for investigation.
4. Rotate keys only if a leak or unauthorized access is suspected.
5. Re-enable webhook only after local and staging validation pass.

---

## 18. Open decisions before implementation

1. Final database host for MySQL.
2. ORM or DB access layer: Prisma, Drizzle, Kysely, or direct mysql2.
3. Whether Vercel remains the webhook runtime or webhook backend moves to a separate server.
4. Restricted key permission matrix after checking Stripe Dashboard options.
5. Retention period for webhook metadata based on DXBMARK legal policies.

---

## 19. Final recommendation

Use the current Next.js project on Vercel for the first Stripe webhook foundation. Use managed MySQL for production event storage. Do not use shared cPanel as the primary payment event backend. Keep cPanel only for non-critical hosting or legacy assets if needed.

Implement Stripe in log-only mode first. Add business actions only after event storage, idempotency, tests, logging, and production validation are complete.
