# Data Model: Service Packages & Add-on Catalog

This document defines the TypeScript types and validation schemas for packages and add-ons.

---

## 1. Catalog TypeScript Types

### Base Types

```typescript
export interface Addon {
  id: string;
  name: string;
  displayPriceLabelUsd?: string;
  displayPriceLabelAed?: string;
  displayBillingLabel?: string;
  currencyGroup: "USD" | "AED" | "BOTH";
  stripePriceEnvKeyUsd?: string;
  stripePriceEnvKeyAed?: string;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  displayPriceLabel: string;
  displayBillingLabel?: string;
  currencyGroup: "USD" | "AED";
  stripePriceEnvKey: string;
  allowedAddons: string[];
  scope: string[];
  exclusions: string[];
}
```

---

## 2. API Schema Validation (Zod)

The checkout API route receives the selection and validates it (Phase 3):

```typescript
import { z } from "zod";

export const checkoutPayloadSchema = z.object({
  offerId: z.string({
    required_error: "offerId is required",
  }),
  addonIds: z.array(z.string()).default([]),
});

export type CheckoutPayload = z.infer<typeof checkoutPayloadSchema>;
```

---

## 3. Allowed Combinations & Rules

- **Currency Lock**: A checkout session cannot mix currencies. All items in the session must share the same currency. Since `commerce-starter-setup` is AED and all other packages are USD, the server must validate that currency mismatches do not occur.
- **Allowed Add-ons**: Add-on IDs submitted must exist in the selected package's `allowedAddons` array.
- **Add-on Exclusions**: Some add-ons are only applicable to specific packages:
  - `product-upload` is only allowed for `commerce-starter-setup`.
  - `domain-purchase` and `business-email` are allowed across all packages.
