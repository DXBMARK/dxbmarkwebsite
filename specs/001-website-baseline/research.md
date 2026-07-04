# Technical Research: Architectural Decisions & Tradeoffs

This research document analyzes the key infrastructure selections for the DXBMARK website payment readiness and event stores, providing rationales and rejected alternatives.

---

## ADR 01: Database & Access Layer (Event Store)

- **Selected Option**: Managed PostgreSQL (Neon / Supabase) + Drizzle ORM.
- **Rationale**:
  - PostgreSQL is fully compatible with serverless architecture when using connection pooling (such as Neon's Serverless Driver or Supabase connection pools).
  - Drizzle ORM provides maximum type-safety, has zero-latency footprint at runtime (unlike heavy ORMs), and generates clear SQL migrations.
- **Alternatives Considered & Rejected**:
  - *cPanel Shared MySQL*: Rejected due to resource limits, unstable serverless connection handling, and security risks.
  - *Prisma ORM*: Rejected due to large bundle size causing slower Cold Start times on serverless functions.
  - *Direct SQL Client (raw mysql2)*: Rejected because it lacks compile-time type validation for our schema updates.

---

## ADR 02: Asynchronous Background Job System

- **Selected Option**: Upstash QStash.
- **Rationale**:
  - QStash is an HTTP-based serverless message queue. It requires no persistent worker running, which aligns perfectly with Vercel's Serverless environment.
  - It offers a generous free tier of 1,000 messages per day (ideal for development and initial testing) and a simple pay-as-you-go tier ($1 per 100K messages) with no monthly minimums.
  - Supports automated retries, delayed delivery, and Dead-Letter Queueing (DLQ).
- **Alternatives Considered & Rejected**:
  - *Vercel Queues + Cron*: Queues require Vercel Pro ($20/month per seat), and the Hobby tier only supports one cron job run per day, which prevents immediate failed job recovery.
  - *Inngest*: A powerful event pipeline, but requires a complex setup and starts at a higher fixed monthly cost.
  - *cPanel Cron Workers*: Increases system maintenance burden and carries high execution reliability risks.

---

## ADR 03: Stripe API Key Strategy

- **Selected Option**: Restricted API Keys (rk_*) configured with minimum read-only permissions.
- **Rationale**:
  - Follows the Least Privilege security principle.
  - Phase 1 only requires local signature verification (using the Webhook Signing Secret). In future phases, reading invoice metadata or subscription status requires only `Read` access to invoices, customers, and subscriptions.
  - Restricted keys minimize damage if credentials are leaked, as they cannot initiate payouts, modify account details, or execute write operations.
- **Alternatives Considered & Rejected**:
  - *Stripe Secret Keys (sk_*)*: Rejected as the default. Standard secret keys carry full write and account management access, presenting a high risk in production.

---

## ADR 04: Observability, Alerting, & Log Sanitization

- **Selected Option**: Sentry for real-time error tracking + Sanitized Server Console Logs.
- **Rationale**:
  - Sentry has native Next.js support, a Vercel integration, and robust issue alerting.
  - Allows us to immediately detect runtime errors in webhook handlers or background queues without logging sensitive customer data.
- **Security Configuration**:
  - `sendDefaultPii` MUST be set to `false`.
  - Sentry's `beforeSend` hook MUST filter and redact credit card patterns, API keys, webhook signing secrets, raw payload bodies, and Zoho tokens.
  - Standard Vercel Server console logs serve only as a secondary log layer, structured to log safe event IDs and processing durations.
