# Tasks: DXBMARK Website Baseline & Stripe Payment Readiness

**Input**: Design documents from `/specs/001-website-baseline/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Unit tests for webhook signature validation, event routing, and idempotency are mandatory.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and environment verification

- [X] T001 Install latest Stripe SDK package dependency
- [X] T002 Configure local linting and typecheck configurations
- [X] T003 [P] Add environment variables to `.env.local` for local CLI forwarding

**Checkpoint**: Setup complete - packages installed and environment schema ready.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Define environment variable validation rules in `src/server/env.ts` using Zod schema
- [X] T005 [P] Setup Sentry configuration and add `beforeSend` sanitization filters in `sentry.server.config.ts`
- [X] T006 [P] Create PostgreSQL database schema migrations for Stripe Webhook Events (`stripe_webhook_events`) and Billing States (`billing_states`) under `src/db/migrations/` using Drizzle ORM
- [X] T007 Initialize Stripe server-side restricted client wrapper in `src/server/stripe/v1/client.ts`
- [X] T008 Implement security and signature check utilities in `src/server/stripe/v1/webhook-security.ts`

**Checkpoint**: Foundation ready - schema, env validation, security utilities, and server-side client wrapper are prepared for local validation.

---

## Phase 3: User Story 1 - Company Presence & Core Visitor Flow (Priority: P1) 🎯 MVP

**Goal**: Deliver service landing page structure, contact form submissions, and compliance disclosures.

**Independent Test**: Complete navigation on localhost:3000, verify legal documents, and test contact submissions.

### Implementation for User Story 1

- [X] T009A [US1] Inspect the existing component structure and confirm whether src/components/* paths already exist before creating or modifying components. Reuse existing files where possible and avoid unnecessary new folders.
- [X] T009 [P] [US1] Update landing page layouts for service blocks in `src/app/page.tsx`
- [X] T010 [P] [US1] Configure header and footer watermark styling inside `src/components/layout/footer.tsx`
- [X] T011 [US1] Create service presentations styling and responsive components in `src/components/home/Services.tsx`
- [X] T012 [P] [US1] Implement input fields validation in contact form component `src/components/contact/ContactForm.tsx`
- [X] T013 [US1] Bind contact submission endpoints to lead ingestion utilities in `src/app/api/contact/route.ts`
- [X] T014 [P] [US1] Populate and style privacy policy and refund terms in `src/content/legal-documents/`

**Checkpoint**: User Story 1 is functional. Visitor flows and lead capture work.

---

## Phase 4: User Story 2 - Brand Consistency, SEO, and Consent Compliance (Priority: P2)

**Goal**: Establish WCAG AA accessibility, meta properties tags, sitemap logic, and cookie consent checks.

**Independent Test**: Verify metadata tags on routes and run accessibility checklist on landing page.

### Implementation for User Story 2

- [X] T015 [P] [US2] Style cookie consent banner in `src/components/common/CookieConsent.tsx`
- [X] T016 [US2] Integrate cookie verification hooks inside `src/app/layout.tsx`
- [X] T017 [P] [US2] Configure metadata tags and OpenGraph configurations inside `src/app/metadata.ts`
- [X] T018 [US2] Update sitemap generation rules in `src/app/sitemap.ts` to include legal routes
- [X] T019 [US2] Adjust colors, targets, and alt tags for WCAG compliance in `src/app/globals.css`

**Checkpoint**: User Story 2 complete. SEO and accessibility requirements are met.

---

## Phase 5: User Story 3 - Future Payment Infrastructure & Webhook Readiness (Priority: P3)

**Goal**: Webhook HTTP endpoint signature verification, event idempotency store, and log-only routing.

**Independent Test**: Forward mocked events using Stripe CLI and inspect database logs for duplicate rejection.

### Tests for User Story 3

- [X] T020 [P] [US3] Create unit tests for webhook signature validation in `src/server/stripe/v1/tests/signature.test.ts`
- [X] T021 [P] [US3] Create integration tests for duplicate event rejection in `src/server/stripe/v1/tests/idempotency.test.ts`
- [X] T022 [US3] Create unit tests for subscription billing state mapping logic in `src/server/stripe/v1/tests/state-machine.test.ts`

### Implementation for User Story 3

- [X] T023 [US3] Create the webhook API route handler in `src/app/api/stripe/webhook/route.ts` extracting raw body
- [X] T024 [P] [US3] Implement event store repository in `src/server/stripe/v1/event-store.ts` using Drizzle
- [X] T025 [P] [US3] Implement QStash async event queue and process-event route
- [X] T026 [US3] Implement Stripe webhook failure store, retry orchestration, and dead-letter classification
- [X] T027 [US3] Write log-only checkout event handler in `src/server/stripe/v1/handlers/checkout.ts`
- [X] T028 [US3] Write log-only subscription event handler in `src/server/stripe/v1/handlers/subscription.ts`
- [ ] T029 [US3] Write log-only invoice event handler in `src/server/stripe/v1/handlers/invoices.ts`
- [ ] T030 [US3] Scaffold inactive QStash job queue table schema `src/db/migrations/0003_integration_jobs.sql`
- [ ] T031 [US3] Add Sentry error capture calls to webhook route processing in `src/app/api/stripe/webhook/route.ts`

**Checkpoint**: User Story 3 complete. Local Stripe CLI mocks confirm 200 OK signature validation.

---

## Phase 5B: Runtime Validation Layer v3 (Live Production Behavior)

**Purpose**: Prove real end-to-end behavior — not connectivity, but actual write/read/process verification.

- [X] T038A [P] Create `.specify/runtime-validation/types.ts` — ValidationResult type
- [X] T038B [P] Create `.specify/runtime-validation/validators/neon.validator.ts` — real DB write + read + cleanup
- [X] T038C [P] Create `.specify/runtime-validation/validators/qstash.validator.ts` — real publish to QStash
- [X] T038D [P] Create `.specify/runtime-validation/validators/stripe.validator.ts` — real Stripe API call
- [X] T038E [P] Create `.specify/runtime-validation/validators/sentry.validator.ts` — real Sentry error capture
- [X] T038F Create `.specify/runtime-validation/gates/db-transaction.gate.ts` — idempotency + cleanup verification
- [X] T038G Create `.specify/runtime-validation/gates/queue-flow.gate.ts` — QStash publish + latency gate
- [X] T038H Create `.specify/runtime-validation/gates/stripe-flow.gate.ts` — Stripe API auth + format gate
- [X] T038I Create `.specify/runtime-validation/report.builder.ts` — structured report formatter
- [X] T038J Create `.specify/runtime-validation/runner.ts` — orchestrator with score engine + kill switch
- [X] T038K Add `validate:runtime` script to `package.json`

**Checkpoint v1**: `npm run validate:runtime` runs, all gates pass, score = 100 (equal weights).

### Phase 5B Hardening (RV3 v3.1 — Correctness Model)

- [X] T039A Fix weighted scoring system — Stripe=40, Neon=30, QStash=20, Sentry=10
- [X] T039B SKIP = penalty (50% of weight in SAFE/CI, 0% in STRICT)
- [X] T039C Add RunMode (STRICT/CI/SAFE) with threshold enforcement via CLI flags
- [X] T039D Neon try/finally cleanup guarantee — no orphan rows even on crash
- [X] T039E Neon test namespace isolation — prefix rv3_neon_test_ + orphan sweep

**Checkpoint v2**: SAFE mode = 90/100 ✅ READY | STRICT mode = 90/100 ❌ NOT READY (Sentry placeholder blocks).

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Release verification, build gates, and production deployments

- [ ] T032 [P] Verify type checks by running `npm run typecheck`
- [ ] T033 [P] Verify linting rules by running `npm run lint`
- [ ] T034 Run production build checks via `npm run build`
- [ ] T035 [P] Audit git commits to confirm no secret keys are tracked in commit histories
- [ ] T036 Set Stripe environment variables in Vercel project settings dashboard
- [ ] T036A Validate the deployed webhook endpoint over HTTPS before registering it in the Stripe Dashboard.
- [ ] T037 Register production HTTPS webhook endpoint inside Stripe account dashboard

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion.
  - P1 (User Story 1) and P2 (User Story 2) can run in parallel.
  - P3 (User Story 3) should start after P1/P2 elements are mapped.
- **Polish (Phase 6)**: Depends on all user stories being complete.

### Parallel Opportunities

- Setup tasks T002 and T003 can run in parallel.
- Foundational tasks T005, T006, and T007 can run in parallel.
- Landing page updates (T009) and footer watermark styles (T010) can run in parallel.
- Webhook testing files T020 and T021 can run in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories).
3. Complete Phase 3: User Story 1 (Landing page structure & Contact flow).
4. **STOP and VALIDATE**: Verify landing page layout and contact submissions.

### Incremental Delivery

1. Foundation ready.
2. Deploy User Story 1 (MVP site with contact leads).
3. Deploy User Story 2 (SEO and accessibility audit upgrades).
4. Deploy User Story 3 (Inactive payment logging and local Stripe listener).
