# Feature Specification: Digital Service Packages + Secure Test Checkout

**Feature Branch**: `002-digital-service-packages`

**Created**: 2026-07-07

**Status**: Draft

**Input**: User description: "Build a small, controlled Digital Service Packages feature on the homepage as the first pricing/payment experience before the full Pricing page."

---

## User Scenarios & Testing

### User Story 1 — Package Presentation and Detail Modal (Priority: P1)
As a visitor browsing the DXBMARK homepage, I want to see clearly structured service packages so I can understand the digital services offered, view their scope/exclusions, configure optional add-ons, and see a summary of my selection including a required legal acknowledgement before redirecting to checkout.

**Why this priority**: Core user interface. Before checking out, users must be able to explore the offerings, configure their selection, and see an accurate summary of their options.

**Independent Test**: Can be tested on localhost by rendering the homepage, checking mobile responsive layout, opening the modal for each package, clicking checkbox add-ons, and validating that the price summary and exclusions display accurately.

**Acceptance Scenarios**:
1. **Given** a visitor is on the DXBMARK homepage, **When** they scroll to the "Digital Service Packages" section, **Then** they see cards for:
   - Website Launch (From $150, One-time setup)
   - Business Presence (From $250, One-time setup)
   - Growth Setup (From $400, One-time setup)
   - Commerce Starter Setup (From AED 2200, One-time setup)
2. **Given** a visitor is on the packages section, **When** they click "View Package" on a package card, **Then** a detail modal opens showing the scope, exclusions, and a checklist of optional allowed add-ons.
3. **Given** the detail modal is open, **When** the user toggle-selects add-ons, **Then** the selection summary updates dynamically to show the display labels of the selected options.
4. **Given** the detail modal is open, **When** the user looks at the checkout button, **Then** they see a required legal and payment acknowledgement message:
   *“By continuing, you confirm that you reviewed the package scope, exclusions, third-party fees, and DXBMARK’s Terms and Refund Policy.”*
5. **Given** the detail modal is open, **When** the user clicks "Close" or presses the `Escape` key, **Then** the modal closes and focus returns to the initiating card button.

---

### User Story 2 — Secure Test-Mode Stripe Checkout (Priority: P2)
As a prospective client interested in purchasing a digital package, I want to click "Continue to Secure Checkout" to be securely redirected to Stripe-hosted Checkout in test mode so I can complete a dummy payment.

**Why this priority**: Establishes the payment workflow safely using Stripe Checkout.

**Independent Test**: Can be tested by filling a package configuration, clicking checkout, and verifying a successful redirect to a `checkout.stripe.com` test-mode page with the correct base package and add-ons represented.

**Acceptance Scenarios**:
1. **Given** a user is in the Package Detail Modal with a package selected, **When** they click "Continue to Secure Checkout", **Then** the client sends a `POST` request to `/api/checkout/session` containing only the `offerId` and selected `addonIds`.
2. **Given** the API route receives a checkout request, **When** it validates the inputs against the trusted server catalog and confirms environment Price IDs are present, **Then** it creates a Stripe session and returns the checkout URL to the client.
3. **Given** the API route receives a checkout request, **When** a required environment Price ID is missing, **Then** it fails closed returning a controlled server error (e.g. `500 Internal Server Error`).
4. **Given** the user is redirected to Stripe Checkout, **When** they complete or cancel the payment, **Then** Stripe redirects them back to the website's success or cancel landing pages (e.g. `/checkout/success` or `/checkout/cancel`).

---

### User Story 3 — Webhook Log-only Auditing (Priority: P3)
As a system administrator, I want Stripe webhook events for packages (such as `checkout.session.completed`) to be verified and logged in the local database without triggering automated fulfillment or third-party CRM syncs.

**Why this priority**: Ensures webhook events are recorded cleanly in the audit log for billing reconciliation before automating email delivery or Zoho syncing.

**Independent Test**: Forwarding test webhook events using Stripe CLI and confirming database rows are written to `stripe_webhook_events` with `processed` status and no secondary automation occurs.

**Acceptance Scenarios**:
1. **Given** a successful Stripe package checkout event, **When** the Stripe webhook endpoint receives `checkout.session.completed`, **Then** the event signature is verified, recorded in the `stripe_webhook_events` store, and acknowledged with a `200 OK`.
2. **Given** a processed checkout event, **When** checking system logs, **Then** there is NO Zoho CRM, Zoho Books, or SMTP mail fulfillment triggered during this phase.

---

## Requirements

### Functional Requirements

#### Pricing Authority & Catalog
- **FR-001**: Client-facing price text is ONLY a display label (e.g., `displayPriceLabel` and `displayBillingLabel`). The client components MUST NOT perform numeric calculations or calculate totals.
- **FR-002**: The server-side catalog is the absolute source of truth for checkout line items and currencies. Final payable amounts MUST come from Stripe Checkout using Stripe Price IDs resolved from environment variables.
- **FR-003**: The type model for packages and add-ons MUST define:
  - `displayPriceLabel: string` (for Packages)
  - `displayPriceLabelUsd?: string` and `displayPriceLabelAed?: string` (for Add-ons)
  - `displayBillingLabel?: string`
  - `currencyGroup: "USD" | "AED" | "BOTH"`
  - `stripePriceEnvKey: string` (for Packages)
  - `stripePriceEnvKeyUsd?: string` and `stripePriceEnvKeyAed?: string` (for Add-ons)
- **FR-004**: The catalog boundary MUST separate frontend copy and server catalog:
  - Frontend components MUST NOT import from `src/server`, `src/db`, or `src/integrations`.
  - The client payload submitted to the API route MUST only contain `offerId` (string) and `addonIds` (string[]).
- **FR-005**: USD packages (USD currency group) and AED packages (AED currency group) MUST NOT mix checkout line items. All line items in a checkout session must share the same currency.
- **FR-006**: Each package MUST define allowed add-ons. The server MUST validate the submitted `addonIds` and reject disallowed or mismatched add-ons with `400 Bad Request`.
- **FR-007**: Before checkout redirection, the modal UI MUST present the concise acknowledgement:
  *“By continuing, you confirm that you reviewed the package scope, exclusions, third-party fees, and DXBMARK’s Terms and Refund Policy.”*

#### Stripe Security & Environments
- **FR-008**: The Stripe checkout integration MUST operate in test mode only.
- **FR-009**: The server-side API route MUST resolve Price IDs dynamically from environment variables. No Stripe Price IDs (live or test) may be hardcoded in executable code or fallback logic.
- **FR-010**: If a required Stripe Price ID environment variable is missing during checkout session creation, the server MUST fail closed with a controlled server error.
- **FR-011**: Phase 1 MUST NOT modify `.env`, `.env.local`, or Vercel environment configurations. Required env keys may only be documented in `quickstart.md`.
- **FR-012**: No `eslint-disable` comments are permitted. All dynamic lookups and environment lookups must use safe type guards, Map lookups, or explicit switch statements.

---

## Success Criteria

- **SC-001**: Homepage renders packages cleanly with zero console warnings or dynamic calculation errors.
- **SC-002**: The detail modal displays exact scope, exclusions, and allowed add-ons matching the package currency group.
- **SC-003**: Checkout API rejects mixed currency items or disallowed add-ons.
- **SC-004**: Webhook audit logs record events with signature validation and zero fulfillment triggers.
