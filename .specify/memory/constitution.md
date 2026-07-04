<!--
Sync Impact Report
- Version change: 1.0.1 -> 1.1.0
- List of modified principles: 
  - Principle II: Clarified Stripe coverage including Stripe-hosted Checkout, Payment Links, Invoices, and Zoho Books.
  - Principle IV: Expanded status transitions to include detailed Stripe Billing and Subscription states.
  - Validation Gates: Added security and testing gates (webhook unit tests, Stripe CLI verification, secret scanning).
- Added sections: None
- Removed sections: None
- Templates requiring updates: None
- Follow-up TODOs: Decide on database provider (ADR 01) and background job system (ADR 02).
-->

# DXBMARK Website Constitution

## Core Principles

### Principle I: Legal and Compliance First
The project must remain fully aligned with the UAE/US/UK legal frameworks and company configurations of DXBMARK LLC. Legal content under `src/content/legal-documents/` must be dynamically rendered and updated through official legal templates only. Service description and invoices must accurately state pricing, refund, and company details.
*Rationale: Compliance with GDPR/DPA and regional regulations is critical to our licensing and customer trust.*

### Principle II: Official Payment Gateway (Stripe-Only)
Stripe is the official and only approved payment gateway for production payments, whether payments are initiated directly through the DXBMARK website, Stripe-hosted Checkout, Stripe Payment Links, Stripe Invoices, or Zoho Books invoices connected to Stripe. The project must not integrate alternative payment gateways (such as PayPal, cryptocurrency, or automated bank transfers) unless authorized by the project owner in a future architecture decision.
*Rationale: Sticking to a single payment processor simplifies PCI compliance, security audits, and financial reconciliation. Zoho is treated as an invoicing layer above Stripe.*

### Principle III: Server-Side Key Security
All Stripe secret keys, webhook signing secrets, and restricted API credentials must be kept strictly server-side. Under no circumstances may any private credentials be exposed to the client or checked into public source control. Environment variables must be validated using Zod via `src/server/env.ts`.
*Rationale: Exposure of secret keys compromises the payment account and financial data.*

### Principle IV: Webhook-Driven Source of Truth and Idempotency
Payment and billing status transitions must be verified server-side using cryptographic webhook signatures. Payment states include pending, paid, failed, refunded, cancelled, and disputed. Subscription states include trialing, active, past_due, unpaid, cancel_pending, canceled, paused, incomplete, and incomplete_expired. Client-side success redirect pages must never be the source of truth for payment success. Webhook processing must be fully idempotent.
*Rationale: Client-side states can be manipulated or interrupted; server-to-server callbacks are the only way to guarantee payment finality.*

### Principle V: Decoupled and Modular Next.js App Router Architecture
Webhook processing must be strictly server-side, signature-verified, and fully idempotent. API route handlers must remain thin: they must extract the raw body to verify the signature, acknowledge the webhook quickly to satisfy platform and Stripe timeout constraints, and route the event payload to modular handlers. Business logic, database updates, and external integrations must be decoupled and executed asynchronously.
*Rationale: Separation of concerns guarantees that webhook timeouts are avoided and external service failures do not block Stripe's callbacks.*

### Principle VI: Accessibility, Performance, and SEO Compliance
The website must maintain fast load times and correct semantic layout structures. High performance and accessibility (WCAG AA standard) are mandatory. SEO configurations, sitemap generators, and metadata properties must be maintained in sync with page additions.
*Rationale: High SEO visibility and user accessibility drive customer engagement.*

### Principle VII: Brand Identity and UI Consistency
The primary brand color `#f97e1a` must be applied consistently across all UI elements, layout panels, and buttons. Styling should align with tokens in `globals.css` using Tailwind CSS or standard Tailwind classes. Fonts must use the approved Inter/Utopia typographic stack.
*Rationale: A coherent brand identity builds customer confidence in a premium technical services firm.*

### Principle VIII: Non-Destructive Code Modifications & Reusability
The assistant must leverage existing project directories, files, configuration files, and tools before adding new ones. Destructive changes, folder relocations, or library updates require explicit developer approval.
*Rationale: Avoid code bloat and protect working legacy configurations.*

### Principle IX: Tool-Based Architectural Decisions
Before proposing architectural or implementation decisions for specialized fields (security, payment processing, compliance, SEO, testing), the assistant must inspect the most relevant available workspace files, official API documentations, or specialized workflows rather than guessing.
*Rationale: Reliable implementations depend on official, up-to-date documentation.*

## Architectural Constraints & Technical Standards

- **Next.js Version**: The project runs on Next.js 16.2.9 with React 19.2.4.
- **Routing Paradigm**: App Router is the exclusive routing mechanism. Pages Router is prohibited.
- **State Validation**: Environment variables must be validated on runtime startup via Zod validation inside `src/server/env.ts`.
- **Database Rules**: Payment event logging and idempotency require a persistent, reliable, production-grade data store. The exact provider and access layer must be decided through ADR 01.
- **Background Jobs**: Slow external integrations (such as Zoho Books) must be decoupled from raw webhook acknowledgment. The exact queue or background job system must be decided through ADR 02.

## Development Workflow & Verification Gates

- **Local Webhook Testing**: All webhook verification logic must be locally tested using the Stripe CLI to forward events before staging deployment.
- **Validation Gates**: Every pull request must pass the automated validation pipeline:
  1. TypeScript type-check (`npm run typecheck`)
  2. ESLint checks (`npm run lint`)
  3. Production build tests (`npm run build`)
  4. Unit tests for webhook verification, event routing, and idempotency
  5. Stripe CLI local webhook verification before production webhook registration
  6. Secret scan before deployment
- **Payment state audit logs**: Storing Stripe event logs and integration jobs must follow strict GDPR data sanitization and minimize retained user profile information.

## Governance

The DXBMARK project constitution is the primary source of rule authority. Any changes to key systems, styling, payment integrations, or compliance models must be proposed and agreed upon prior to code modification.

### Versioning and Amendment Policy
- **Semantic Versioning**: Increment the constitution version based on the scope of change:
  - MAJOR: Removal of core principles or introduction of alternative gateways.
  - MINOR: Additions or major expansions of specific rules (e.g. Stripe webhook handlers).
  - PATCH: Wording clarifications and non-functional typo fixes.
- **Review Requirement**: Any revision to the constitution must update the Sync Impact Report at the top of the file.

**Version**: 1.1.0 | **Ratified**: 2026-07-01 | **Last Amended**: 2026-07-01
