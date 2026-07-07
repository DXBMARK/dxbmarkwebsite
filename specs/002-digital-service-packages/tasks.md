# Tasks: Digital Service Packages + Secure Test Checkout

**Input**: Design documents from `/specs/002-digital-service-packages/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Organization**: Tasks are grouped by phase to align with sequential review gates.

---

## Phase 1: SpecKit Foundation & Server Catalog

**Purpose**: Establish the trusted catalog types and pricing schema.

- [x] T001 Define package and add-on TypeScript types in `src/server/billing/types.ts`
- [x] T002 Implement the static Map-based pricing catalog mapping IDs to Price Env Keys in `src/server/billing/package-catalog.ts`
- [x] T003 Verify compilation and lint safety of the billing catalog files (no eslint-disable comments)

**Checkpoint**: Phase 1 complete. Types and catalog are established as the single source of truth.

---

## Phase 2: Homepage UI + Modal UX

**Purpose**: Design the frontend digital packages presentation cards and interactive details modal.

- [ ] T004 Create UI copy definitions and details listing under `src/features/pricing/data/package-copy.ts`
- [ ] T005 Implement the `DigitalServicePackagesSection` component under `src/features/pricing/components/`
- [ ] T006 [P] Implement the `ServicePackageCard` component
- [ ] T007 [P] Implement the `PackageDetailModal` component including the legal & payment acknowledgement checklist
- [ ] T008 [P] Implement the `PackageAddonsSelector` component (shows only allowed add-ons, no client total calculations, displays labels matching selected package currency)
- [ ] T009 Add the Digital Service Packages section to `src/app/page.tsx`
- [ ] T010 [P] Validate that UI compiles and has zero console warnings/errors
- [ ] T011 Verify accessibility compliance (contrast, keyboard navigation, esc to close modal)

**Checkpoint**: UI is interactive. Packages render on desktop/mobile and selection updates state correctly.

---

## Phase 3: Stripe Test Checkout Backend

**Purpose**: Implement server-side validation and initiate the Stripe checkout session.

- [ ] T012 Implement payload validation logic in `src/server/billing/checkout-validation.ts` (verifies offerId, allowed addonIds, currency groups)
- [ ] T013 Create API route at `src/app/api/checkout/session/route.ts` to receive payload, validate, and create Stripe Checkout session (fails closed with a controlled 500 error if any required Price ID env key is missing)
- [ ] T014 Connect frontend modal checkout CTA to POST `/api/checkout/session`
- [ ] T015 Verify successful redirect behavior to Stripe Checkout test-mode page
- [ ] T016 Verify redirect callbacks (success/cancel pages) return cleanly to client routes

**Checkpoint**: Secure test-mode checkout end-to-end flow is fully verified.

---

## Phase 4: QA, Security, Regression & Production Readiness Gate

**Purpose**: Full regression checks, validation scripts, and security reviews before staging.

- [ ] T017 Run TypeScript type-checking using `npm run typecheck`
- [ ] T018 Run code formatting and lint verification via `npm run lint`
- [ ] T019 Run Next.js production build using `npm run build`
- [ ] T020 Run runtime validation script via `npm run validate:runtime`
- [ ] T021 Perform regression audit verifying webhook files, DB files, and Zoho logic remain untouched
- [ ] T022 Confirm no Stripe secrets are exposed in frontend client bundles
- [ ] T023 Run end-to-end checkout event simulations and confirm webhook records them in DB logs

**Checkpoint**: Verification checks complete and validated. Ready for test user review.
