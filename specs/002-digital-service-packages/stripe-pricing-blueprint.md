# Stripe Pricing Blueprint: DXBMARK Digital Service Packages

This document defines the proposed Stripe Product and Price structure, metadata standards, environment variable mappings, and the owner approval gate for the Digital Service Packages checkout system.

---

## 1. Stripe Product & Price Architecture

Only payable base packages and separately billable add-ons require Stripe Products/Prices. Included scope items are represented in package rules and metadata, not necessarily as Stripe Products. Prices will be mapped as one-time or recurring items in USD (base currency).

### 1.1 Base Packages (Stripe Products)

| Product Name | Stripe Product ID (Proposed) | Pricing Type | Billing Type | Env Variable Key |
| :--- | :--- | :--- | :--- | :--- |
| **Website Launch** | `prod_website_launch` | One-Time | Flat Fee | `STRIPE_PRICE_PACKAGE_WEBSITE_LAUNCH_USD` |
| **Business Presence** | `prod_business_presence` | One-Time | Flat Fee | `STRIPE_PRICE_PACKAGE_BUSINESS_PRESENCE_USD` |
| **Growth Setup** | `prod_growth_setup` | One-Time | Flat Fee | `STRIPE_PRICE_PACKAGE_GROWTH_SETUP_USD` |
| **Commerce Starter Setup** | `prod_commerce_starter_setup` | One-Time | Flat Fee | `STRIPE_PRICE_PACKAGE_COMMERCE_STARTER_USD` |

### 1.2 Setup & Add-on Items (Stripe Products)

| Product Name | Stripe Product ID (Proposed) | Pricing Type | Env Variable Key |
| :--- | :--- | :--- | :--- |
| **Domain Purchase / Connection** | `prod_addon_domain_purchase` | One-Time | `STRIPE_PRICE_ADDON_DOMAIN_PURCHASE_USD` |
| **Business Email Setup** | `prod_addon_business_email` | One-Time | `STRIPE_PRICE_ADDON_BUSINESS_EMAIL_USD` |
| **Website Maintenance** | `prod_addon_website_maintenance` | Future recurring candidate (Not approved for initial launch) | `STRIPE_PRICE_ADDON_WEBSITE_MAINTENANCE_USD` |
| **WhatsApp Integration** | `prod_addon_whatsapp_integration` | One-Time | `STRIPE_PRICE_ADDON_WHATSAPP_INTEGRATION_USD` |
| **Chat Widget Setup** | `prod_addon_chat_widget` | One-Time | `STRIPE_PRICE_ADDON_CHAT_WIDGET_USD` |
| **Google Business Profile Setup** | `prod_addon_google_business_profile` | One-Time | `STRIPE_PRICE_ADDON_GOOGLE_BUSINESS_PROFILE_USD` |
| **Google Analytics / Google Tag Setup** | `prod_addon_google_analytics_tag_setup` | One-Time | `STRIPE_PRICE_ADDON_GOOGLE_ANALYTICS_TAG_SETUP_USD` |
| **Basic SEO Setup** | `prod_addon_basic_seo_setup` | One-Time | `STRIPE_PRICE_ADDON_BASIC_SEO_SETUP_USD` |
| **Extra Page** | `prod_addon_extra_page` | One-Time | `STRIPE_PRICE_ADDON_EXTRA_PAGE_USD` |
| **Extra Section** | `prod_addon_extra_section` | One-Time | `STRIPE_PRICE_ADDON_EXTRA_SECTION_USD` |
| **Extra Revision Round** | `prod_addon_extra_revision` | One-Time | `STRIPE_PRICE_ADDON_EXTRA_REVISION_ROUND_USD` |
| **Urgent Delivery** | `prod_addon_urgent_delivery` | One-Time | `STRIPE_PRICE_ADDON_URGENT_DELIVERY_USD` |
| **Logo Intro Video** | `prod_addon_logo_intro` | One-Time | `STRIPE_PRICE_ADDON_LOGO_INTRO_VIDEO_USD` |
| **Advanced SEO Pack** | `prod_addon_advanced_seo_pack` | One-Time | `STRIPE_PRICE_ADDON_ADVANCED_SEO_PACK_USD` |
| **Basic GEO Setup** | `prod_addon_geo_setup` | One-Time | `STRIPE_PRICE_ADDON_GEO_SETUP_USD` |
| **Basic AEO Setup** | `prod_addon_aeo_setup` | One-Time | `STRIPE_PRICE_ADDON_AEO_SETUP_USD` |
| **Search Visibility Bundle** | `prod_addon_search_visibility_bundle` | One-Time | `STRIPE_PRICE_ADDON_SEARCH_VISIBILITY_BUNDLE_USD` |
| **Content Writing** | `prod_addon_content_writing` | One-Time | `STRIPE_PRICE_ADDON_CONTENT_WRITING_USD` |
| **Extra Products (eCommerce)** | `prod_addon_extra_products` | One-Time | `STRIPE_PRICE_ADDON_EXTRA_PRODUCTS_USD` |
| **Extra Maintenance Check-up** | `prod_addon_extra_maintenance` | One-Time | `STRIPE_PRICE_ADDON_EXTRA_MAINTENANCE_USD` |

---

## 2. Currency Strategy & Adaptive Pricing

- **USD Base Currency**: All environment variables and base prices are configured in USD.
- **No Client Currency Conversion**: To comply with DXBMARK's pricing constitution, the website frontend must never compute currency exchange rates or perform multiplications.
- **Stripe Adaptive Pricing (Future Phase)**: Future support for local currencies (AED, EUR, etc.) will leverage Stripe's dynamic multi-currency Presentment or localized Price IDs mapped on the server, avoiding any hardcoded currency mappings in the frontend code.

---

## 3. Metadata Standards & Webhook Integrity

To ensure clean processing and reconciliation on successful checkout events, the Stripe Checkout Session payload must include structured metadata:

```json
{
  "metadata": {
    "offerId": "commerce-starter-setup",
    "addonIds": "domain-purchase,website-maintenance",
    "checkout_source": "dxbmark_homepage_packages"
  }
}
```

This metadata will be read by the Stripe webhook processing router to audit sales and verify purchases against catalog definitions.

---

## 4. Promotion & Coupon Rules (Future Phase)

- No promotional discounts or coupon integrations are implemented in the initial launch phase.
- Future promotional discount validation will occur exclusively server-side during Stripe Checkout Session generation by applying Stripe Coupon IDs resolved from environment variables.

---

## 5. Owner Approval Gate (Stripe Setup Prerequisites)

Before setting up Products and Prices in the Stripe dashboard, the DXBMARK owner must explicitly sign off on the following:

- [ ] **Package Names & Copy**: Website Launch, Business Presence, Growth Setup, Commerce Starter Setup.
- [ ] **Scopes & Exclusions**: Included features and strict boundaries detailed in the `commercial-strategy.md`.
- [ ] **Included/Required/Optional Relationships**: The package-addon dependency structure defined in `package-rules.ts`.
- [ ] **Billing Terms & Renewal Policies**: First-year limits and client renewal responsibilities.
- [ ] **Stripe Price Ranges**: Approved USD price figures for all base tiers and add-ons.
- [ ] **Environment Variable Mappings**: The naming and structure of `STRIPE_PRICE_*` configuration keys.

---

### CRITICAL SECURITY RULE

> **Do not write live Stripe Price IDs or secret keys to any code files or `.env` files.** Price IDs must be resolved dynamically from the runtime environment.

---

## 6. Taxonomy & Cloud Infrastructure Notes

- **Add-on Classification**: Domain Connection, Professional Email Setup, and Website Maintenance are classified under the **Infrastructure** category. Google Analytics / Google Tag Setup is categorized under **Measurement**. These are distinct operational/utility services, and must not be grouped under SEO.
- **Cloud & Infrastructure Setup**: Custom cloud deployments (e.g. AWS, GCP, custom Vercel/Cloudflare enterprise pipelines, database clustering) are out-of-scope for standard homepage checkout packages and are treated as separate custom proposals. No Stripe catalog Products/Prices are created for custom cloud architectures in this blueprint.
