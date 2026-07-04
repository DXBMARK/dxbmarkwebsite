# Data Model: Payment Events, Billing States & Integration Jobs

This document outlines the conceptual database entities, fields, relationships, and lifecycle states using Managed PostgreSQL and Drizzle ORM.

---

## 1. Schema Definitions (Conceptual)

### Table: `stripe_webhook_events`
Logs received Stripe events to ensure signature validation history and event audit logs.
- `id` (Serial, Primary Key)
- `stripe_event_id` (Varchar, Unique Index): Extracted from the webhook payload. Ensures idempotency.
- `event_type` (Varchar): e.g. `checkout.session.completed`, `invoice.paid`.
- `object_id` (Varchar, Index): Reference to the underlying Stripe object (e.g. `in_123`, `cs_123`).
- `object_type` (Varchar): e.g. `invoice`, `checkout.session`.
- `livemode` (Boolean): Identifies if the event was generated in production or test mode.
- `payload_hash` (Char(64)): SHA-256 hash of the raw body payload. We do not store raw payloads to prevent PII exposure.
- `processing_status` (Enum): `received`, `processing`, `processed`, `ignored`, `failed`, `duplicate`.
- `error_message` (Text): Logs errors if event routing or processing fails.
- `received_at` (Timestamp): Record creation timestamp.

---

### Table: `billing_states`
Tracks current subscription and billing statuses mapped from incoming Stripe events.
- `id` (Serial, Primary Key)
- `provider` (Enum): `stripe` (Default), `zoho`.
- `provider_customer_id` (Varchar, Index): Stripe customer ID (e.g. `cus_123`).
- `provider_subscription_id` (Varchar, Unique Index): Stripe subscription ID (e.g. `sub_123`).
- `customer_email_hash` (Char(64), Index): SHA-256 hash of the customer email for GDPR compliance.
- `state` (Enum):
  - `trialing`
  - `active`
  - `past_due`
  - `unpaid`
  - `cancel_pending`
  - `canceled`
  - `paused`
  - `incomplete`
  - `incomplete_expired`
  - `unknown`
- `current_period_end` (Timestamp): Expiration timestamp for the current paid term.
- `last_event_id` (Varchar): References the latest processed `stripe_event_id`.
- `updated_at` (Timestamp): Last modification timestamp.

---

### Table: `integration_jobs`
Tracks asynchronous tasks triggered by payment events, such as syncs with Zoho Books.
- `id` (Serial, Primary Key)
- `source_event_id` (Varchar): ID of the verified payment event.
- `job_type` (Varchar): e.g., `zoho_invoice_sync`.
- `status` (Enum): `pending`, `processing`, `completed`, `failed`, `dead_letter`.
- `attempts` (Integer): Current execution attempt count (max 5).
- `next_attempt_at` (Timestamp): Timestamp for the next scheduled retry.
- `last_error` (Text): Logs execution failure reasons.
- `created_at` (Timestamp)

---

## 2. Event & State Lifecycles

### Stripe Subscription States Mapping

| Stripe Event | Stripe Status Field | Internal billing_states.state |
| :--- | :--- | :--- |
| `customer.subscription.created` | `status = trialing` | `trialing` |
| `customer.subscription.created` | `status = active` | `active` |
| `customer.subscription.updated` | `cancel_at_period_end = true` | `cancel_pending` |
| `customer.subscription.updated` | `status = past_due` | `past_due` |
| `customer.subscription.updated` | `status = unpaid` | `unpaid` |
| `customer.subscription.updated` | `status = paused` | `paused` |
| `customer.subscription.deleted` | any | `canceled` |
| `customer.subscription.updated` | `status = incomplete` | `incomplete` |
| `customer.subscription.updated` | `status = incomplete_expired` | `incomplete_expired` |

### Webhook Event Processing States
- **received**: Webhook raw body parsed, signature verified, and event row inserted.
- **processing**: Signature validated, routing initialized, and target handler active.
- **processed**: Event successfully executed by handler and logged without errors.
- **ignored**: Valid event type received but not configured for billing updates (e.g. log-only mode).
- **failed**: Handler encountered an exception; error logged.
- **duplicate**: Event ID already exists in the store; raw response bypassed with 200 OK.
