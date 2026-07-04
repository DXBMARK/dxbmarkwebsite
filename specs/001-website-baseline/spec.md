# Feature Specification: DXBMARK Website Baseline & Payment Readiness

**Feature Branch**: `001-website-baseline`

**Created**: 2026-07-01

**Status**: Draft

**Input**: User description: "Establish a baseline specification for the DXBMARK website, covering core pages, branding, compliance, and payment infrastructure readiness."

## Clarifications

### Session 2026-07-01
- Q: What is the preferred technical choice for the database and ORM layer in production? → A: Managed PostgreSQL (Supabase/Neon) + Drizzle ORM.
- Q: What is the preferred background job and queue mechanism for async work (Zoho/Stripe)? → A: Upstash QStash (Serverless HTTP-based queue).
- Q: What is the scope of Stripe webhook integration in Phase 1? → A: Log-only verified webhook processing and event logging to the database (no direct customer state alterations).
- Q: What is the priority mapping of payment models for DXBMARK? → A: Immediate: Zoho Books invoices connected to Stripe. Near-term: One-off Stripe Checkout and Stripe Payment Links. Future: Stripe subscriptions for recurring services. Phase 1 remains log-only webhook processing.
- Q: What is the source of truth for financial and accounting data? → A: Zoho Books is the absolute source of truth. DXBMARK database only stores webhook event metadata, event IDs, billing state mappings, integration job records, and external references (Stripe/Zoho IDs). It must not store full invoice items, card details, or raw webhook payloads.
- Q: What is the preferred key strategy for calling Stripe APIs? → A: Restricted API Key (rk_*) configured with minimum read-only permissions for required resources (invoices, customers, subscriptions) to satisfy least privilege principles.
- Q: What is the preferred observability, logging, and alerting strategy? → A: Sentry is the primary tool for real-time error tracking and alerting (with sendDefaultPii=false and strict beforeSend filters). Vercel logs serve as secondary operational logs.

---

## User Scenarios & Testing

### User Story 1 — Company Presence & Core Visitor Flow (Priority: P1)
As a prospective client visiting the DXBMARK website, I want to view clear information about DXBMARK’s technical services (software engineering, SaaS, cloud infrastructure, booking/CRM systems), read official legal disclosures, and securely submit a contact inquiry so I can initiate a project discussion.

**Why this priority**: Core website utility. Delivering company positioning and generating sales leads is the primary business requirement of the web asset.

**Independent Test**: Can be fully tested by navigating the landing page, clicking legal/footer links, and submitting the contact form to confirm lead capture without any payment features active.

**Acceptance Scenarios**:
1. **Given** a visitor navigates to the landing page, **When** they scroll through the service presentation blocks, **Then** they see DXBMARK's technical service descriptions styled with the brand color `#f97e1a` and Utica/Inter fonts.
2. **Given** a visitor wants to inquire about services, **When** they fill out and submit the contact form with valid details, **Then** the form captures the request securely and shows a user-friendly success confirmation.
3. **Given** a visitor is on any page, **When** they scroll to the bottom, **Then** they see compliant company info for DXBMARK LLC (Wyoming registered) and links to the legal pages.

---

### User Story 2 — Brand Consistency, SEO, and Consent Compliance (Priority: P2)
As a visitor or search engine crawler, I want the website to load rapidly, render properly on all devices, request cookie consent, and include proper SEO metadata so the site ranks well and protects visitor privacy.

**Why this priority**: Protects brand reputation, search engine discoverability, and data compliance.

**Independent Test**: Can be fully tested using accessibility auditors (A11y/WCAG), SEO metadata checkers, cookie consent toggle verification, and lighthouse-based speed tests.

**Acceptance Scenarios**:
1. **Given** a first-time visitor lands on the site, **When** the page loads, **Then** a non-intrusive cookie consent banner is displayed requesting preference selection.
2. **Given** an audit tool scans the website, **When** checking heading structures and images, **Then** there is exactly one `<h1>` per page, semantic HTML5 elements are used, and images include descriptive `alt` tags.
3. **Given** a search engine indexes the site, **When** it parses the HTML head, **Then** it finds unique, descriptive title tags, meta descriptions, and sitemap indicators.

---

### User Story 3 — Future Payment Infrastructure & Webhook Readiness (Priority: P3)
As a client of DXBMARK paying for services via Zoho Books or direct invoices, I want the website system to process payment updates securely in the background using Stripe webhooks, ensuring billing states are correctly tracked without exposing server-side credentials or blocking the webhook client response.

**Why this priority**: Prepares the website for fully automated invoicing, subscriptions, and client portals while keeping payment keys and states secure.

**Independent Test**: Verified by mocking and forwarding Stripe webhook events (checkout success, invoice payments, subscription changes) using Stripe CLI and confirming state updates are recorded in the event store.

**Acceptance Scenarios**:
1. **Given** a client completes a payment through a Zoho Books invoice or Stripe Checkout link, **When** Stripe sends a webhook signature-verified event, **Then** the system records it in a persistent event store and returns a success status code to Stripe within timeout limits.
2. **Given** a Stripe subscription state changes to `past_due` or `unpaid`, **When** the webhook is received, **Then** the internal billing state machine updates the subscription record to match.
3. **Given** a webhook event requires a Zoho update, **When** the event is successfully written, **Then** the Zoho Books integration job is queued asynchronously to avoid blocking the webhook response.

---

## Requirements

### Functional Requirements

#### Core Website & Content
- **FR-001**: The landing page MUST present DXBMARK LLC's services (software engineering, SaaS, cloud, managed hosting, web systems, automation, IT consultancy).
- **FR-002**: The website footer MUST present official company registration details (DXBMARK LLC, Wyoming-registered, USA, with UAE-based operations) and a centered watermark signature "DXBMARK".
- **FR-003**: The website MUST include accessible, dynamically rendered legal documents (Privacy Policy, Terms of Service, Refund Policy).
- **FR-004**: The contact form MUST validate user inputs before submission and safely sanitize lead data.
- **FR-005**: The website MUST show a cookie consent banner for new users, storing the selection state in the browser.

#### Security & Environment
- **FR-006**: All Stripe private keys, webhook signing secrets, and Zoho API credentials MUST remain server-side and never leak into client code. Stripe integration SHOULD utilize a Restricted API Key (rk_*) instead of a standard root Secret Key (sk_*) where permissions allow.
- **FR-007**: The application MUST validate all environment variables at startup using a Zod schema via `src/server/env.ts`.
- **FR-008**: Webhook processing MUST cryptographically verify signatures using raw body payloads before processing events.

#### Payment Readiness
- **FR-009**: Stripe MUST be the only approved production payment gateway for processing transactions.
- **FR-010**: Payments MUST prioritize Zoho Books invoices connected to Stripe as the immediate payment model, with near-term support for one-off Stripe Checkout and Stripe Payment Links, and future support for Stripe subscriptions.
- **FR-011**: Client-side redirect pages (e.g., `/success`) MUST NOT be treated as proof of payment. Payment validation MUST rely on server-side webhook confirmation.
- **FR-012**: Webhook processing MUST be idempotent, rejecting duplicate event IDs.
- **FR-013**: The system MUST map subscription states to the following internal billing state machine:
  - `trialing`
  - `active`
  - `past_due`
  - `unpaid`
  - `cancel_pending`
  - `canceled`
  - `paused`
  - `incomplete`
  - `incomplete_expired`
- **FR-014**: Processing slow third-party workflows (such as Zoho Books sync or client emails) MUST be decoupled from raw webhook acknowledgment to prevent timeouts.
- **FR-015**: The database layer for payment event logging and billing state machine storage MUST use a managed PostgreSQL provider (e.g., Supabase or Neon) integrated via Drizzle ORM as decided in ADR 01.
- **FR-016**: The asynchronous background job and queueing infrastructure MUST use Upstash QStash to process Stripe events and Zoho Books sync tasks as decided in ADR 02.
- **FR-017**: The Phase 1 payment webhook implementation MUST run in log-only and event store audit mode, verifying events and recording metadata without executing state-altering operations on active accounts or triggering client notifications.
- **FR-018**: Zoho Books MUST be treated as the absolute financial and accounting source of truth. The local database MUST NOT act as a parallel ledger or store full invoice line-items, credit card details, or raw webhook payloads, restricting local storage to event IDs, billing states, job logs, and references to external objects (Stripe/Zoho IDs).
- **FR-019**: Real-time error tracking and alerting for webhook, background queue, and application failures MUST integrate Sentry with strict PII filtering rules (sendDefaultPii=false and beforeSend redaction of credit cards, secrets, raw payloads, and tokens) as decided in ADR 04.

---

### Non-Functional Requirements

- **NFR-001 (Security)**: Private keys and API secrets MUST NOT be checked into version control.
- **NFR-002 (Performance)**: The core website landing page SHOULD achieve a Lighthouse performance score of 90+ on desktop.
- **NFR-003 (Accessibility)**: The website layout and interactive inputs MUST comply with WCAG 2.1 AA accessibility guidelines.
- **NFR-004 (SEO)**: Every page MUST contain a single descriptive `<h1>` element, semantic HTML structure, unique meta titles, and meta descriptions.
- **NFR-005 (Design Consistency)**: The UI elements, actions, and highlights MUST use the primary brand color `#f97e1a` and the Inter/Utopia font stacks.

---

## Success Criteria

- **SC-001**: 100% of website pages render with a consistent brand layout and color `#f97e1a`.
- **SC-002**: Webhook signature verification succeeds for all genuine Stripe payloads and fails 100% of invalid signatures.
- **SC-003**: 100% of duplicated webhook events are detected and ignored, ensuring zero duplicate processing.
- **SC-004**: The landing page achieves WCAG AA compliance with no automated accessibility failures.
- **SC-005**: All background integration actions are decoupled, ensuring the webhook response returns within the required platform timeout limits.

---

## Key Entities (Conceptual)

- **Lead Inquire**: Represents a client contact submission (Name, Email, Message, Service Interest, Created Date).
- **Payment Event**: Represents a payment-related webhook event logged for auditing and idempotency (Stripe Event ID, Event Type, Processing Status, Error Logs, Payload Hash, Received Timestamp).
- **Billing State**: Tracks a client's billing status mapped from Stripe events (Provider Customer ID, Provider Subscription ID, State, Current Period End, Last Event ID).
- **Integration Job**: Tracks slow external processes triggered by events (Source Event ID, Job Type, Job Status, Attempts Count, Error Logs).

---

## Assumptions

- **A-001**: Stripe keys and webhook secrets will be configured directly in Vercel's environment variables dashboard for production.
- **A-002**: The website is hosted on a platform (such as Vercel) that supports serverless function routing and raw body extraction.
- **A-003**: A persistent data store will be available before moving payment handling from logging-only to live operations.

---

## Edge Cases

- **Webhook Event Out-of-Order**: A subscription delete webhook is received before a subscription create webhook. The system must ignore updates that have a timestamp older than the current recorded state.
- **Failed Webhook Decoupling**: If the background worker fails to update Zoho Books, the raw webhook response must still return a success status to Stripe, and the job must be retried later.
- **Malformed Webhook Payloads**: Handlers must safely catch errors and log them without crashing the Next.js server.

---

## Out-of-Scope Items

- **Stripe Connect**: Multi-party marketplaces and seller onboarding are out of scope.
- **Alternative Payment Gateways**: Direct support for PayPal, cryptocurrency, or automated bank transfers is strictly out of scope.
- **Active Subscription Access Locking**: Active locking or granting of website dashboards is out of scope since the website currently has no login portal.

---

## Required ADRs Before Implementation Planning

- **ADR 01: Payment Event Store Database Provider**
  - *Context*: Idempotent event processing and logging require persistent storage.
  - *Decision*: The team has selected Managed PostgreSQL (Supabase/Neon) + Drizzle ORM.
- **ADR 02: Background Job and Retry Processing Provider**
  - *Context*: Asynchronous jobs (like Zoho invoice syncs) must not block webhook replies.
  - *Decision*: The team has selected Upstash QStash. It provides a serverless-friendly, HTTP-based queue with a generous free tier (1,000 requests/day) and low-cost pay-as-you-go pricing ($1/100K requests) to avoid fixed monthly expenses of Inngest or Vercel Pro upgrades. Other options like cPanel scheduled workers were rejected due to maintenance burden and operational risks.
- **ADR 03: Stripe API Key Strategy**
  - *Context*: Securing API actions requires managing Stripe access keys.
  - *Decision*: The team has selected Restricted API Keys (rk_*) configured with minimum read-only permissions for needed resources (invoices, customers, subscriptions) as the preferred security policy. General Secret Keys (sk_*) are rejected unless a required SDK action is strictly unsupported by restricted key permissions.
- **ADR 04: Observability and Logging Strategy for Payment Events**
  - *Context*: Failed webhooks need prompt debugging without logging sensitive customer cards.
  - *Decision*: The team has selected Sentry as the primary observability and error reporting tool, configured with sendDefaultPii=false and beforeSend filters to prevent logging payment details, secret keys, or raw payloads. Vercel server console logs serve as secondary operational logs only.

---

## Governance & Amendment Policy

This specification is validated against the DXBMARK Website Constitution (v1.1.0). Any deviation from core design, legal, or Stripe-only principles requires prior approval from the supervising developer.
