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

- [x] T004 Create UI copy definitions and details listing under `src/features/pricing/data/package-copy.ts`
- [x] T005 Implement the `DigitalServicePackagesSection` component under `src/features/pricing/components/`
- [x] T006 [P] Implement the `ServicePackageCard` component
- [x] T007 [P] Implement the `PackageDetailModal` component including the legal & payment acknowledgement checklist
- [x] T008 [P] Implement the `PackageAddonsSelector` component (shows only approved optional add-ons, no client total calculations, no prices, no currency conversion, and approved customer-facing category labels only)
- [x] T009 Add the Digital Service Packages section to `src/app/page.tsx`
- [x] T010 [P] Validate that UI compiles and has zero console warnings/errors
- [x] T011 Verify accessibility compliance (contrast, keyboard navigation, esc to close modal)
- [x] T011_UXF Phase 2F: wide modal UX redesign and optional add-on tabs

**Checkpoint**: UI is interactive. Packages render on desktop/mobile and selection updates state correctly.

---

## Phase 2C — Commercial Package Strategy & Stripe Pricing Blueprint

**Purpose**: Define the official commercial parameters and pricing models before any Stripe setup.

- [x] T011A Define final package list and features
- [x] T011B Define final included / required / optional items and mapping rules
- [x] T011C Define renewal rules and customer billing lifecycles
- [x] T011D Research market pricing targets and propose pricing ladder
- [x] T011E Define Stripe Product and Price mappings structure
- [x] T011F Obtain explicit owner approval on commercial plan before Stripe setup

---

## Phase 2L — Commercial Strategy v2 and Package Offer Architecture

**Purpose**: Update the business model, visibility classifications, and product mapping before pricing research.

- [x] T011L Update commercial-strategy.md with owner-approved business decisions
- [x] T011M Update stripe-pricing-blueprint.md with offer architecture and add-on mappings
- [x] T011N Confirm no official prices are introduced before pricing research
- [x] T011O Prepare for UAE/Egypt market pricing research

---

## Phase 2M — UAE Market Pricing Research & Pricing Ladder

**Purpose**: Research local market pricing and define proposed pricing ranges before Stripe Dashboard setup.

- [ ] T011P Research UAE competitor pricing for landing pages, business websites, ecommerce websites, SEO, hosting, and add-ons
- [ ] T011Q Research Egypt competitor pricing direction as a later-market reference
- [ ] T011R Compare DXBMARK packages against cheap-market, mid-market, and premium-affordable positioning
- [ ] T011S Propose pricing ladder for base packages
- [ ] T011T Propose pricing logic for add-ons
- [ ] T011U Define which products are direct checkout vs proposal-first after pricing review
- [ ] T011V Produce owner approval checklist for final Stripe prices

---

## Phase 2D — Stripe Dashboard Setup

**Purpose**: Create and configure Stripe Products and Prices in the Stripe dashboard.

- [ ] T011G Create Stripe Products corresponding to approved packages and add-ons
- [ ] T011H Create Stripe Prices in USD (test mode)
- [ ] T011I Configure adaptive or local pricing in Stripe dashboard if approved
- [ ] T011J Map Stripe Price IDs to environment variables in local configuration
- [ ] T011K Verify Stripe test-mode product/price keys are resolved correctly by server resolver

---

## Phase 3: Stripe Test Checkout Backend

**Purpose**: Implement server-side validation and initiate the Stripe checkout session.

- [ ] T012 Implement payload validation logic in `src/server/billing/checkout-validation.ts` (verifies offerId, addonRules, required/included/optional relationships, and trusted Stripe Price env key availability)
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
