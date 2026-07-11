# Stripe Pricing Blueprint: DXBMARK Digital Service Packages (v2)

This document defines the proposed Stripe Product and Price structure, classification standards, webhook requirements, and the expanded owner approval gate for the checkout and billing configuration.

---

## 1. Product Classification & Checkout Strategy

To protect delivery capacity and manage operations, services are classified into checkout profiles:

### 1.1 Direct Checkout Candidates
Suitable for instant self-service checkout where scope is fixed and pre-sales consultation is minimal:
- **Website Launch** (Entry package)

### 1.2 Proposal-First Candidates
Requires pre-sales review, configuration, and explicit proposal sign-off before invoice generation or payment collection:
- **Business Presence**
- **Growth Setup**
- **Commerce Starter Setup**

### 1.3 Future / Custom Proposal Services
Complex or large-scale architectures requiring tailored analysis and custom proposals:
- **Commerce Advanced / Commerce Expert**
- **Custom eCommerce Platform**
- **Shopify Store Setup**
- **Cloud & Infrastructure Setup**

---

## 2. Stripe Product & Price Architecture

Only payable base packages and separately billable add-ons require Stripe Products and Price IDs. Prices will be mapped as one-time or recurring items in USD (base currency) with blank/unset pricing placeholders until approved.

### 2.1 Base Packages (Stripe Products)

| Product Name | Stripe Product ID (Proposed) | Pricing Type | Billing Type | Env Variable Key |
| :--- | :--- | :--- | :--- | :--- |
| **Website Launch** | `prod_website_launch` | One-Time | Flat Fee | `STRIPE_PRICE_PACKAGE_WEBSITE_LAUNCH_USD` |
| **Business Presence** | `prod_business_presence` | One-Time | Flat Fee | `STRIPE_PRICE_PACKAGE_BUSINESS_PRESENCE_USD` |
| **Growth Setup** | `prod_growth_setup` | One-Time | Flat Fee | `STRIPE_PRICE_PACKAGE_GROWTH_SETUP_USD` |
| **Commerce Starter Setup** | `prod_commerce_starter_setup` | One-Time | Flat Fee | `STRIPE_PRICE_PACKAGE_COMMERCE_STARTER_USD` |

### 2.2 Setup & Add-on Items (Stripe Products)

| Product Name | Stripe Product ID (Proposed) | Pricing Type | Env Variable Key |
| :--- | :--- | :--- | :--- |
| **Basic Contact Form** | `prod_addon_basic_contact_form` | One-Time | `STRIPE_PRICE_ADDON_BASIC_CONTACT_FORM_USD` |
| **Tawk.to Chatbot Widget Setup** | `prod_addon_tawk_chatbot` | One-Time | `STRIPE_PRICE_ADDON_TAWK_CHATBOT_WIDGET_USD` |
| **Logo Intro Video HD 720p** | `prod_addon_logo_intro_hd` | One-Time | `STRIPE_PRICE_ADDON_LOGO_INTRO_HD_USD` |
| **Logo Intro Video FHD 1080p** | `prod_addon_logo_intro_fhd` | One-Time | `STRIPE_PRICE_ADDON_LOGO_INTRO_FHD_USD` |
| **Progressive Web App (PWA) Conversion** | `prod_addon_pwa_conversion` | One-Time | `STRIPE_PRICE_ADDON_PWA_CONVERSION_USD` |
| **Basic Legal Pages Pack** | `prod_addon_basic_legal_pages` | One-Time | `STRIPE_PRICE_ADDON_BASIC_LEGAL_PAGES_USD` |
| **Advanced Legal Pages Pack** | `prod_addon_advanced_legal_pages` | One-Time | `STRIPE_PRICE_ADDON_ADVANCED_LEGAL_PAGES_USD` |
| **Website Maintenance Checkup** | `prod_addon_maintenance_checkup` | One-Time | `STRIPE_PRICE_ADDON_MAINTENANCE_CHECKUP_USD` |
| **Google Business Profile Setup** | `prod_addon_google_business_profile` | One-Time | `STRIPE_PRICE_ADDON_GOOGLE_BUSINESS_PROFILE_USD` |
| **Google Analytics / Google Tag Setup** | `prod_addon_google_analytics_tag_setup` | One-Time | `STRIPE_PRICE_ADDON_GOOGLE_ANALYTICS_TAG_SETUP_USD` |
| **Basic SEO Setup** | `prod_addon_basic_seo_setup` | One-Time | `STRIPE_PRICE_ADDON_BASIC_SEO_SETUP_USD` |
| **Basic GEO Setup** | `prod_addon_geo_setup` | One-Time | `STRIPE_PRICE_ADDON_GEO_SETUP_USD` |
| **Basic AEO Setup** | `prod_addon_aeo_setup` | One-Time | `STRIPE_PRICE_ADDON_AEO_SETUP_USD` |
| **Advanced SEO Pack** | `prod_addon_advanced_seo_pack` | One-Time | `STRIPE_PRICE_ADDON_ADVANCED_SEO_PACK_USD` |
| **Search Visibility Bundle** | `prod_addon_search_visibility_bundle` | One-Time | `STRIPE_PRICE_ADDON_SEARCH_VISIBILITY_BUNDLE_USD` |
| **Domain Purchase / Connection** | `prod_addon_domain_purchase` | One-Time | `STRIPE_PRICE_ADDON_DOMAIN_PURCHASE_USD` |
| **Business Email Setup** | `prod_addon_business_email` | One-Time | `STRIPE_PRICE_ADDON_BUSINESS_EMAIL_USD` |
| **WhatsApp Integration** | `prod_addon_whatsapp_integration` | One-Time | `STRIPE_PRICE_ADDON_WHATSAPP_INTEGRATION_USD` |
| **Chat Widget Setup** | `prod_addon_chat_widget` | One-Time | `STRIPE_PRICE_ADDON_CHAT_WIDGET_USD` |
| **Content Writing** | `prod_addon_content_writing` | One-Time | `STRIPE_PRICE_ADDON_CONTENT_WRITING_USD` |
| **Extra Page** | `prod_addon_extra_page` | One-Time | `STRIPE_PRICE_ADDON_EXTRA_PAGE_USD` |
| **Extra Section** | `prod_addon_extra_section` | One-Time | `STRIPE_PRICE_ADDON_EXTRA_SECTION_USD` |
| **Extra Revision Round** | `prod_addon_extra_revision` | One-Time | `STRIPE_PRICE_ADDON_EXTRA_REVISION_ROUND_USD` |
| **Urgent Delivery** | `prod_addon_urgent_delivery` | One-Time | `STRIPE_PRICE_ADDON_URGENT_DELIVERY_USD` |
| **Extra Products** | `prod_addon_extra_products` | One-Time | `STRIPE_PRICE_ADDON_EXTRA_PRODUCTS_USD` |
| **Extra Maintenance Check-up** | `prod_addon_extra_maintenance` | One-Time | `STRIPE_PRICE_ADDON_EXTRA_MAINTENANCE_USD` |

---

## 3. Currency and Pricing Authority

- **USD Base Currency**: All environment variables and base prices are configured in USD.
- **No Client Currency Conversion**: To comply with DXBMARK's pricing constitution, the website frontend must never compute currency exchange rates or perform multiplications.
- **Stripe Adaptive Pricing (Future Phase)**: Future support for local currencies (AED, EUR, etc.) will leverage Stripe's dynamic multi-currency Presentment or localized Price IDs mapped on the server, avoiding any hardcoded currency mappings in the frontend code.
- **Hosting & Domain Renewals**: Handled manually at first through Zoho/Stripe invoice links. No automatic subscriptions or recurring billing profiles are activated in the initial checkout system.

---

## 4. Metadata Standards & Webhook Integrity

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

---

## 5. Owner Approval Gate (Billing & Commercial Sign-off)

Before setting up Products and Prices in the Stripe dashboard, the DXBMARK owner must explicitly sign off on the following:

- [ ] **Market Focus**: UAE-first target market focus and language rollout strategy.
- [ ] **Package Scopes & Copy**: website-launch, business-presence, growth-setup, commerce-starter-setup.
- [ ] **Value Boosters**: The standard set of included tools (basic SEO, WhatsApp, staging subdomain, etc.).
- [ ] **Domain & Hosting Policy**: The domain cost ownership rules and high-performance server guidelines.
- [ ] **Support & Correction Policy**: The 7-day post-launch bugs policy and Commerce setup checkup terms.
- [ ] **Legal Pages Packs**: The draft packs configurations and legal compliance boundaries.
- [ ] **Proposal vs Checkout Workflow**: Direct checkout limits and Zoho manual invoice workflows.
- [ ] **Pricing Ranges**: Approved USD price figures for all base tiers and add-ons after final market research.
- [ ] **Stripe Products & Environment Variable Keys**: The mapping schema and configuration variables.

---

### CRITICAL SECURITY RULE

> **Do not write live Stripe Price IDs or secret keys to any code files or `.env` files.** Price IDs must be resolved dynamically from the runtime environment.

- **Stripe Dashboard Provisioning Gate**: Stripe Products and Prices must not be created or configured in the Stripe Dashboard until the Phase 2M pricing research has been approved by the owner inside [pricing-research.md](file:///Users/sunmarke/Downloads/untitled%20folder%202/dxbmark-website/specs/002-digital-service-packages/pricing-research.md).
