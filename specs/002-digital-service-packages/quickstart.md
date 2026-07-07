# Quickstart: Local Checkout Session Validation Guide

This guide details the setup and validation of the API route `/api/checkout/session`.

---

## 1. Environment Variable Documentation

The server resolves Stripe Price IDs from environment variables. Do not modify `.env` or `.env.local` files in Phase 1. When configuring environment variables for staging/testing later, ensure the following variables are defined:

```bash
# Package Price IDs
STRIPE_PRICE_PACKAGE_WEBSITE_LAUNCH_USD=price_test_xxxx
STRIPE_PRICE_PACKAGE_BUSINESS_PRESENCE_USD=price_test_xxxx
STRIPE_PRICE_PACKAGE_GROWTH_SETUP_USD=price_test_xxxx
STRIPE_PRICE_PACKAGE_COMMERCE_STARTER_AED=price_test_xxxx

# Add-on Price IDs (USD)
STRIPE_PRICE_ADDON_DOMAIN_USD=price_test_xxxx
STRIPE_PRICE_ADDON_EMAIL_USD=price_test_xxxx
STRIPE_PRICE_ADDON_MAINTENANCE_USD=price_test_xxxx
STRIPE_PRICE_ADDON_WHATSAPP_USD=price_test_xxxx
STRIPE_PRICE_ADDON_CHAT_USD=price_test_xxxx
STRIPE_PRICE_ADDON_ANALYTICS_USD=price_test_xxxx
STRIPE_PRICE_ADDON_EXTRAPAGE_USD=price_test_xxxx
STRIPE_PRICE_ADDON_EXTRASECTION_USD=price_test_xxxx
STRIPE_PRICE_ADDON_REVISION_USD=price_test_xxxx
STRIPE_PRICE_ADDON_URGENT_USD=price_test_xxxx
STRIPE_PRICE_ADDON_LOGO_USD=price_test_xxxx
STRIPE_PRICE_ADDON_SEO_USD=price_test_xxxx
STRIPE_PRICE_ADDON_GEO_USD=price_test_xxxx
STRIPE_PRICE_ADDON_AEO_USD=price_test_xxxx
STRIPE_PRICE_ADDON_BUNDLE_USD=price_test_xxxx
STRIPE_PRICE_ADDON_CONTENT_USD=price_test_xxxx

# Add-on Price IDs (AED)
STRIPE_PRICE_ADDON_DOMAIN_AED=price_test_xxxx
STRIPE_PRICE_ADDON_EMAIL_AED=price_test_xxxx
STRIPE_PRICE_ADDON_MAINTENANCE_AED=price_test_xxxx
STRIPE_PRICE_ADDON_WHATSAPP_AED=price_test_xxxx
STRIPE_PRICE_ADDON_CHAT_AED=price_test_xxxx
STRIPE_PRICE_ADDON_ANALYTICS_AED=price_test_xxxx
STRIPE_PRICE_ADDON_EXTRAPAGE_AED=price_test_xxxx
STRIPE_PRICE_ADDON_EXTRASECTION_AED=price_test_xxxx
STRIPE_PRICE_ADDON_REVISION_AED=price_test_xxxx
STRIPE_PRICE_ADDON_URGENT_AED=price_test_xxxx
STRIPE_PRICE_ADDON_LOGO_AED=price_test_xxxx
STRIPE_PRICE_ADDON_SEO_AED=price_test_xxxx
STRIPE_PRICE_ADDON_GEO_AED=price_test_xxxx
STRIPE_PRICE_ADDON_AEO_AED=price_test_xxxx
STRIPE_PRICE_ADDON_BUNDLE_AED=price_test_xxxx
STRIPE_PRICE_ADDON_CONTENT_AED=price_test_xxxx
STRIPE_PRICE_ADDON_PRODUCTUPLOAD_AED=price_test_xxxx
STRIPE_PRICE_ADDON_ADDITIONALMAINT_AED=price_test_xxxx
```

---

## 2. Local Verification Setup

1. **Verify server runs locally**:
   ```bash
   npm run dev
   ```

2. **Trigger Mock API Calls using cURL (Phase 3)**:

   - **Scenario A**: Valid base package checkout request:
     ```bash
     curl -X POST http://localhost:3000/api/checkout/session \
       -H "Content-Type: application/json" \
       -d '{"offerId": "website-launch", "addonIds": []}'
     ```
     *Expected*: Returns `200 OK` with `{ url: "https://checkout.stripe.com/..." }`. If the env var is missing, returns `500 Server Error`.

   - **Scenario B**: Valid package + allowed add-ons:
     ```bash
     curl -X POST http://localhost:3000/api/checkout/session \
       -H "Content-Type: application/json" \
       -d '{"offerId": "website-launch", "addonIds": ["domain-purchase", "business-email"]}'
     ```
     *Expected*: Returns `200 OK` with redirect link.

   - **Scenario C**: Invalid package ID:
     ```bash
     curl -X POST http://localhost:3000/api/checkout/session \
       -H "Content-Type: application/json" \
       -d '{"offerId": "invalid-package-id", "addonIds": []}'
     ```
     *Expected*: Returns `400 Bad Request` with `{ error: "Invalid package ID" }`.

   - **Scenario D**: Disallowed add-on for selected package:
     ```bash
     curl -X POST http://localhost:3000/api/checkout/session \
       -H "Content-Type: application/json" \
       -d '{"offerId": "website-launch", "addonIds": ["product-upload"]}'
     ```
     *Expected*: Returns `400 Bad Request` with `{ error: "Add-on not allowed for this package" }`.

   - **Scenario E**: Missing payload parameters:
     ```bash
     curl -X POST http://localhost:3000/api/checkout/session \
       -H "Content-Type: application/json" \
       -d '{}'
     ```
     *Expected*: Returns `400 Bad Request` with Zod validation details.
