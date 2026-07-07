# Research: Digital Service Packages & Stripe Catalog Mapping

This document details the pricing model, catalog architecture, UX structure, and Stripe configurations chosen for the feature.

---

## 1. Catalog Architecture Decisions

### Decision: In-Memory Server-Side Catalog using Map Lookups
- **Selected**: Hardcoded Map-based catalog in `src/server/billing/package-catalog.ts`.
- **Rationale**: The package catalog is small and static. Storing it in the Postgres database introduces overhead and maintenance requirements (migrations, seeding, admin UI) for changes that are rare. Using `Map.get(id)` and explicit switch statements ensures clean, warning-free lookup operations that completely bypass object injection lint warnings (`security/detect-object-injection`).
- **Alternatives Considered**: Direct bracket notation object lookup. Rejected because it triggers object injection warnings in linting.

### Decision: Stable String IDs with Display Price Labels
- **Selected**: Package ID (e.g. `website-launch`) and Add-on ID (e.g. `domain-purchase`) as the sole API payloads.
- **Rationale**: Binds client and server cleanly without sharing pricing numbers. The frontend only displays copy labels (`displayPriceLabel` for packages, and `displayPriceLabelUsd`/`displayPriceLabelAed` for addons), keeping checkout calculations completely server-side.

---

## 2. Stripe Checkout Integration Pattern

### Decision: Stripe Checkout Session API (Server-side)
- **Selected**: Next.js API route `/api/checkout/session` using the `stripe` Node.js SDK (Phase 3).
- **Rationale**: Pre-built Stripe Checkout reduces security risks (no custom credit card inputs, fully compliant). Running session creation server-side allows us to hide the Stripe Restricted Key (`STRIPE_RESTRICTED_KEY`) from the client.
- **Stripe Mode & Config**: Use explicit server-side test-mode configuration and trusted Stripe Price IDs resolved from environment variables. Never accept mode, amount, currency, or Price IDs from the client. If a required environment variable is missing, the server fails closed with a controlled server error.

---

## 3. UI/UX Structure and Styling

- **Design Language**: Standard dark premium system with glassmorphism and subtle radial glow cards as defined in DESIGN.md.
- **Font Stack**: Naru Sans for copy/body text and Utopia for prominent headings.
- **Add-on Configuration**: Multi-select checklist with allowed items.
- **Legal and Payment Acknowledgement**: Before checkout, modal presents a required acknowledgement:
  *“By continuing, you confirm that you reviewed the package scope, exclusions, third-party fees, and DXBMARK’s Terms and Refund Policy.”*
- **No Client Calculations**: Client does not calculate totals or submit prices. Price and currency values are managed strictly by Stripe Checkout from server-resolved Price IDs.
