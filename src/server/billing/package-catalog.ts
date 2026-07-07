import { Package, Addon } from "./types";

/**
 * Static Package Catalog definition using Map to ensure safe, type-safe lookup.
 * Contains display labels, environment variable mappings, scopes, exclusions, and allowed add-ons.
 * Executable catalog code contains env key names only, not dummy price IDs.
 */

const PACKAGES_LIST: Package[] = [
  {
    id: "website-launch",
    name: "Website Launch",
    description: "A single-page / landing page package for businesses that need a fast official online presence.",
    displayPriceLabel: "From $150",
    displayBillingLabel: "One-time setup",
    currencyGroup: "USD",
    stripePriceEnvKey: "STRIPE_PRICE_PACKAGE_WEBSITE_LAUNCH_USD",
    allowedAddons: [
      "domain-purchase",
      "business-email",
      "website-maintenance",
      "whatsapp-integration",
      "chat-widget",
      "analytics-setup",
      "extra-section",
      "extra-revision-round",
      "urgent-delivery",
      "logo-intro-video",
      "advanced-seo",
      "geo",
      "aeo",
      "search-visibility-bundle",
      "content-writing",
    ],
    scope: [
      "1-page professional landing page",
      "Fully mobile responsive structure",
      "Contact / WhatsApp CTA integration",
      "Basic on-page SEO setup",
      "Initial design and content setup",
      "Deployment and launch support",
    ],
    exclusions: [
      "Custom domain and professional email are optional add-ons",
      "Additional post-delivery revisions require separate round fees",
      "No dynamic database features or complex user portal sections",
    ],
  },
  {
    id: "business-presence",
    name: "Business Presence",
    description: "A multi-page business website package for companies that need a more credible official presence.",
    displayPriceLabel: "From $250",
    displayBillingLabel: "One-time setup",
    currencyGroup: "USD",
    stripePriceEnvKey: "STRIPE_PRICE_PACKAGE_BUSINESS_PRESENCE_USD",
    allowedAddons: [
      "domain-purchase",
      "business-email",
      "website-maintenance",
      "whatsapp-integration",
      "chat-widget",
      "analytics-setup",
      "extra-page",
      "extra-section",
      "extra-revision-round",
      "urgent-delivery",
      "logo-intro-video",
      "advanced-seo",
      "geo",
      "aeo",
      "search-visibility-bundle",
      "content-writing",
    ],
    scope: [
      "Up to 4 structured business pages (e.g. Home, About, Services, Contact)",
      "Stronger content hierarchy and layout structure",
      "All Website Launch essentials",
      "Basic analytics readiness integration",
      "SEO-ready page structures",
      "Deployment and launch setup",
    ],
    exclusions: [
      "Custom domain and professional email are optional add-ons",
      "Post-delivery content additions are subject to revision round fees",
    ],
  },
  {
    id: "growth-setup",
    name: "Growth Setup",
    description: "An expanded multi-page business website package for businesses that need stronger conversion and growth readiness.",
    displayPriceLabel: "From $400",
    displayBillingLabel: "One-time setup",
    currencyGroup: "USD",
    stripePriceEnvKey: "STRIPE_PRICE_PACKAGE_GROWTH_SETUP_USD",
    allowedAddons: [
      "domain-purchase",
      "business-email",
      "website-maintenance",
      "whatsapp-integration",
      "chat-widget",
      "analytics-setup",
      "extra-page",
      "extra-section",
      "extra-revision-round",
      "urgent-delivery",
      "logo-intro-video",
      "advanced-seo",
      "geo",
      "aeo",
      "search-visibility-bundle",
      "content-writing",
    ],
    scope: [
      "Up to 6 pages with a strong layout focus",
      "Conversion-focused design blocks and callouts",
      "All Business Presence essentials",
      "WhatsApp and structured lead capture setup",
      "Advanced growth add-ons availability",
      "Deployment and launch support",
    ],
    exclusions: [
      "Not custom software (No SaaS dashboards, custom portals, or automated workflows)",
      "Does not include custom client database integrations",
    ],
  },
  {
    id: "commerce-starter-setup",
    name: "Commerce Starter Setup",
    description: "A limited starter eCommerce setup for businesses that need a controlled online store foundation.",
    displayPriceLabel: "From AED 2200",
    displayBillingLabel: "One-time setup",
    currencyGroup: "AED",
    stripePriceEnvKey: "STRIPE_PRICE_PACKAGE_COMMERCE_STARTER_AED",
    allowedAddons: [
      "domain-purchase",
      "business-email",
      "website-maintenance",
      "whatsapp-integration",
      "chat-widget",
      "analytics-setup",
      "extra-page",
      "extra-section",
      "extra-revision-round",
      "urgent-delivery",
      "logo-intro-video",
      "advanced-seo",
      "geo",
      "aeo",
      "search-visibility-bundle",
      "content-writing",
      "product-upload",
      "additional-maintenance",
    ],
    scope: [
      "WordPress + WooCommerce base installation",
      "Standard theme-based responsive design configuration",
      "Up to 5 core storefront pages (e.g. Shop, Cart, Checkout, etc.)",
      "Up to 10 initial products uploaded",
      "Assistance setting up 1 payment gateway",
      "Assistance setting up 1 shipping calculation configuration",
      "Custom domain and hosting included for the first year",
      "3 maintenance check-ups during the first year",
      "Basic launch support",
    ],
    exclusions: [
      "Payment gateway fees (Stripe/PayPal charges) are excluded",
      "Shipping/delivery vendor account fees are excluded",
      "Store content/copywriting is not included (can be selected as add-on)",
      "Large product catalog uploads are excluded",
      "Multi-vendor/marketplace extensions are excluded",
      "Daily product or inventory management is excluded",
    ],
  },
];

const ADDONS_LIST: Addon[] = [
  {
    id: "domain-purchase",
    name: "Domain Purchase / Connection",
    displayPriceLabelUsd: "$20",
    displayPriceLabelAed: "AED 75",
    displayBillingLabel: "per year",
    currencyGroup: "BOTH",
    stripePriceEnvKeyUsd: "STRIPE_PRICE_ADDON_DOMAIN_USD",
    stripePriceEnvKeyAed: "STRIPE_PRICE_ADDON_DOMAIN_AED",
  },
  {
    id: "business-email",
    name: "Business Email Setup",
    displayPriceLabelUsd: "$5",
    displayPriceLabelAed: "AED 18",
    displayBillingLabel: "per user / month",
    currencyGroup: "BOTH",
    stripePriceEnvKeyUsd: "STRIPE_PRICE_ADDON_EMAIL_USD",
    stripePriceEnvKeyAed: "STRIPE_PRICE_ADDON_EMAIL_AED",
  },
  {
    id: "website-maintenance",
    name: "Website Maintenance",
    displayPriceLabelUsd: "$30",
    displayPriceLabelAed: "AED 110",
    displayBillingLabel: "per month",
    currencyGroup: "BOTH",
    stripePriceEnvKeyUsd: "STRIPE_PRICE_ADDON_MAINTENANCE_USD",
    stripePriceEnvKeyAed: "STRIPE_PRICE_ADDON_MAINTENANCE_AED",
  },
  {
    id: "whatsapp-integration",
    name: "WhatsApp Integration",
    displayPriceLabelUsd: "$15",
    displayPriceLabelAed: "AED 55",
    displayBillingLabel: "one-time",
    currencyGroup: "BOTH",
    stripePriceEnvKeyUsd: "STRIPE_PRICE_ADDON_WHATSAPP_USD",
    stripePriceEnvKeyAed: "STRIPE_PRICE_ADDON_WHATSAPP_AED",
  },
  {
    id: "chat-widget",
    name: "Chat Widget Setup",
    displayPriceLabelUsd: "$15",
    displayPriceLabelAed: "AED 55",
    displayBillingLabel: "one-time",
    currencyGroup: "BOTH",
    stripePriceEnvKeyUsd: "STRIPE_PRICE_ADDON_CHAT_USD",
    stripePriceEnvKeyAed: "STRIPE_PRICE_ADDON_CHAT_AED",
  },
  {
    id: "analytics-setup",
    name: "Analytics Setup",
    displayPriceLabelUsd: "$25",
    displayPriceLabelAed: "AED 90",
    displayBillingLabel: "one-time",
    currencyGroup: "BOTH",
    stripePriceEnvKeyUsd: "STRIPE_PRICE_ADDON_ANALYTICS_USD",
    stripePriceEnvKeyAed: "STRIPE_PRICE_ADDON_ANALYTICS_AED",
  },
  {
    id: "extra-page",
    name: "Extra Page",
    displayPriceLabelUsd: "$50",
    displayPriceLabelAed: "AED 180",
    displayBillingLabel: "per page",
    currencyGroup: "BOTH",
    stripePriceEnvKeyUsd: "STRIPE_PRICE_ADDON_EXTRAPAGE_USD",
    stripePriceEnvKeyAed: "STRIPE_PRICE_ADDON_EXTRAPAGE_AED",
  },
  {
    id: "extra-section",
    name: "Extra Section",
    displayPriceLabelUsd: "$30",
    displayPriceLabelAed: "AED 110",
    displayBillingLabel: "per section",
    currencyGroup: "BOTH",
    stripePriceEnvKeyUsd: "STRIPE_PRICE_ADDON_EXTRASECTION_USD",
    stripePriceEnvKeyAed: "STRIPE_PRICE_ADDON_EXTRASECTION_AED",
  },
  {
    id: "extra-revision-round",
    name: "Extra Revision Round",
    displayPriceLabelUsd: "$40",
    displayPriceLabelAed: "AED 150",
    displayBillingLabel: "per round",
    currencyGroup: "BOTH",
    stripePriceEnvKeyUsd: "STRIPE_PRICE_ADDON_REVISION_USD",
    stripePriceEnvKeyAed: "STRIPE_PRICE_ADDON_REVISION_AED",
  },
  {
    id: "urgent-delivery",
    name: "Urgent Delivery",
    displayPriceLabelUsd: "$100",
    displayPriceLabelAed: "AED 370",
    displayBillingLabel: "one-time",
    currencyGroup: "BOTH",
    stripePriceEnvKeyUsd: "STRIPE_PRICE_ADDON_URGENT_USD",
    stripePriceEnvKeyAed: "STRIPE_PRICE_ADDON_URGENT_AED",
  },
  {
    id: "logo-intro-video",
    name: "Logo Intro Video",
    displayPriceLabelUsd: "$35",
    displayPriceLabelAed: "AED 130",
    displayBillingLabel: "one-time",
    currencyGroup: "BOTH",
    stripePriceEnvKeyUsd: "STRIPE_PRICE_ADDON_LOGO_USD",
    stripePriceEnvKeyAed: "STRIPE_PRICE_ADDON_LOGO_AED",
  },
  {
    id: "advanced-seo",
    name: "Advanced SEO",
    displayPriceLabelUsd: "$120",
    displayPriceLabelAed: "AED 440",
    displayBillingLabel: "one-time",
    currencyGroup: "BOTH",
    stripePriceEnvKeyUsd: "STRIPE_PRICE_ADDON_SEO_USD",
    stripePriceEnvKeyAed: "STRIPE_PRICE_ADDON_SEO_AED",
  },
  {
    id: "geo",
    name: "GEO (Generative Engine Optimization)",
    displayPriceLabelUsd: "$80",
    displayPriceLabelAed: "AED 290",
    displayBillingLabel: "one-time",
    currencyGroup: "BOTH",
    stripePriceEnvKeyUsd: "STRIPE_PRICE_ADDON_GEO_USD",
    stripePriceEnvKeyAed: "STRIPE_PRICE_ADDON_GEO_AED",
  },
  {
    id: "aeo",
    name: "AEO (Answer Engine Optimization)",
    displayPriceLabelUsd: "$80",
    displayPriceLabelAed: "AED 290",
    displayBillingLabel: "one-time",
    currencyGroup: "BOTH",
    stripePriceEnvKeyUsd: "STRIPE_PRICE_ADDON_AEO_USD",
    stripePriceEnvKeyAed: "STRIPE_PRICE_ADDON_AEO_AED",
  },
  {
    id: "search-visibility-bundle",
    name: "Search Visibility Bundle",
    displayPriceLabelUsd: "$200",
    displayPriceLabelAed: "AED 730",
    displayBillingLabel: "one-time",
    currencyGroup: "BOTH",
    stripePriceEnvKeyUsd: "STRIPE_PRICE_ADDON_BUNDLE_USD",
    stripePriceEnvKeyAed: "STRIPE_PRICE_ADDON_BUNDLE_AED",
  },
  {
    id: "content-writing",
    name: "Content Writing / Copy Improvement",
    displayPriceLabelUsd: "$150",
    displayPriceLabelAed: "AED 550",
    displayBillingLabel: "one-time",
    currencyGroup: "BOTH",
    stripePriceEnvKeyUsd: "STRIPE_PRICE_ADDON_CONTENT_USD",
    stripePriceEnvKeyAed: "STRIPE_PRICE_ADDON_CONTENT_AED",
  },
  {
    id: "product-upload",
    name: "Product Upload (eCommerce)",
    displayPriceLabelAed: "AED 180",
    displayBillingLabel: "one-time",
    currencyGroup: "AED",
    stripePriceEnvKeyAed: "STRIPE_PRICE_ADDON_PRODUCTUPLOAD_AED",
  },
  {
    id: "additional-maintenance",
    name: "Additional Maintenance Check-up",
    displayPriceLabelAed: "AED 90",
    displayBillingLabel: "per check-up",
    currencyGroup: "AED",
    stripePriceEnvKeyAed: "STRIPE_PRICE_ADDON_ADDITIONALMAINT_AED",
  },
];

const PACKAGES_MAP = new Map<string, Package>(PACKAGES_LIST.map((p) => [p.id, p]));
const ADDONS_MAP = new Map<string, Addon>(ADDONS_LIST.map((a) => [a.id, a]));

/**
 * Safely resolves an environment variable by key using a static switch statement
 * to avoid dynamic object injection warnings.
 */
function getEnvValue(key: string): string | undefined {
  switch (key) {
    case "STRIPE_PRICE_PACKAGE_WEBSITE_LAUNCH_USD":
      return process.env.STRIPE_PRICE_PACKAGE_WEBSITE_LAUNCH_USD;
    case "STRIPE_PRICE_PACKAGE_BUSINESS_PRESENCE_USD":
      return process.env.STRIPE_PRICE_PACKAGE_BUSINESS_PRESENCE_USD;
    case "STRIPE_PRICE_PACKAGE_GROWTH_SETUP_USD":
      return process.env.STRIPE_PRICE_PACKAGE_GROWTH_SETUP_USD;
    case "STRIPE_PRICE_PACKAGE_COMMERCE_STARTER_AED":
      return process.env.STRIPE_PRICE_PACKAGE_COMMERCE_STARTER_AED;
    case "STRIPE_PRICE_ADDON_DOMAIN_USD":
      return process.env.STRIPE_PRICE_ADDON_DOMAIN_USD;
    case "STRIPE_PRICE_ADDON_DOMAIN_AED":
      return process.env.STRIPE_PRICE_ADDON_DOMAIN_AED;
    case "STRIPE_PRICE_ADDON_EMAIL_USD":
      return process.env.STRIPE_PRICE_ADDON_EMAIL_USD;
    case "STRIPE_PRICE_ADDON_EMAIL_AED":
      return process.env.STRIPE_PRICE_ADDON_EMAIL_AED;
    case "STRIPE_PRICE_ADDON_MAINTENANCE_USD":
      return process.env.STRIPE_PRICE_ADDON_MAINTENANCE_USD;
    case "STRIPE_PRICE_ADDON_MAINTENANCE_AED":
      return process.env.STRIPE_PRICE_ADDON_MAINTENANCE_AED;
    case "STRIPE_PRICE_ADDON_WHATSAPP_USD":
      return process.env.STRIPE_PRICE_ADDON_WHATSAPP_USD;
    case "STRIPE_PRICE_ADDON_WHATSAPP_AED":
      return process.env.STRIPE_PRICE_ADDON_WHATSAPP_AED;
    case "STRIPE_PRICE_ADDON_CHAT_USD":
      return process.env.STRIPE_PRICE_ADDON_CHAT_USD;
    case "STRIPE_PRICE_ADDON_CHAT_AED":
      return process.env.STRIPE_PRICE_ADDON_CHAT_AED;
    case "STRIPE_PRICE_ADDON_ANALYTICS_USD":
      return process.env.STRIPE_PRICE_ADDON_ANALYTICS_USD;
    case "STRIPE_PRICE_ADDON_ANALYTICS_AED":
      return process.env.STRIPE_PRICE_ADDON_ANALYTICS_AED;
    case "STRIPE_PRICE_ADDON_EXTRAPAGE_USD":
      return process.env.STRIPE_PRICE_ADDON_EXTRAPAGE_USD;
    case "STRIPE_PRICE_ADDON_EXTRAPAGE_AED":
      return process.env.STRIPE_PRICE_ADDON_EXTRAPAGE_AED;
    case "STRIPE_PRICE_ADDON_EXTRASECTION_USD":
      return process.env.STRIPE_PRICE_ADDON_EXTRASECTION_USD;
    case "STRIPE_PRICE_ADDON_EXTRASECTION_AED":
      return process.env.STRIPE_PRICE_ADDON_EXTRASECTION_AED;
    case "STRIPE_PRICE_ADDON_REVISION_USD":
      return process.env.STRIPE_PRICE_ADDON_REVISION_USD;
    case "STRIPE_PRICE_ADDON_REVISION_AED":
      return process.env.STRIPE_PRICE_ADDON_REVISION_AED;
    case "STRIPE_PRICE_ADDON_URGENT_USD":
      return process.env.STRIPE_PRICE_ADDON_URGENT_USD;
    case "STRIPE_PRICE_ADDON_URGENT_AED":
      return process.env.STRIPE_PRICE_ADDON_URGENT_AED;
    case "STRIPE_PRICE_ADDON_LOGO_USD":
      return process.env.STRIPE_PRICE_ADDON_LOGO_USD;
    case "STRIPE_PRICE_ADDON_LOGO_AED":
      return process.env.STRIPE_PRICE_ADDON_LOGO_AED;
    case "STRIPE_PRICE_ADDON_SEO_USD":
      return process.env.STRIPE_PRICE_ADDON_SEO_USD;
    case "STRIPE_PRICE_ADDON_SEO_AED":
      return process.env.STRIPE_PRICE_ADDON_SEO_AED;
    case "STRIPE_PRICE_ADDON_GEO_USD":
      return process.env.STRIPE_PRICE_ADDON_GEO_USD;
    case "STRIPE_PRICE_ADDON_GEO_AED":
      return process.env.STRIPE_PRICE_ADDON_GEO_AED;
    case "STRIPE_PRICE_ADDON_AEO_USD":
      return process.env.STRIPE_PRICE_ADDON_AEO_USD;
    case "STRIPE_PRICE_ADDON_AEO_AED":
      return process.env.STRIPE_PRICE_ADDON_AEO_AED;
    case "STRIPE_PRICE_ADDON_BUNDLE_USD":
      return process.env.STRIPE_PRICE_ADDON_BUNDLE_USD;
    case "STRIPE_PRICE_ADDON_BUNDLE_AED":
      return process.env.STRIPE_PRICE_ADDON_BUNDLE_AED;
    case "STRIPE_PRICE_ADDON_CONTENT_USD":
      return process.env.STRIPE_PRICE_ADDON_CONTENT_USD;
    case "STRIPE_PRICE_ADDON_CONTENT_AED":
      return process.env.STRIPE_PRICE_ADDON_CONTENT_AED;
    case "STRIPE_PRICE_ADDON_PRODUCTUPLOAD_AED":
      return process.env.STRIPE_PRICE_ADDON_PRODUCTUPLOAD_AED;
    case "STRIPE_PRICE_ADDON_ADDITIONALMAINT_AED":
      return process.env.STRIPE_PRICE_ADDON_ADDITIONALMAINT_AED;
    default:
      return undefined;
  }
}

/**
 * Safely fetches a Package from the catalog map.
 */
export function getPackage(packageId: string): Package | undefined {
  return PACKAGES_MAP.get(packageId);
}

/**
 * Safely fetches an Addon from the catalog map.
 */
export function getAddon(addonId: string): Addon | undefined {
  return ADDONS_MAP.get(addonId);
}

/**
 * Safely resolves the Stripe Price ID from environment variables based on the package and context.
 * If the environment variable is not defined, returns undefined (forces failure closed).
 */
export function resolvePackagePriceId(packageId: string): string | undefined {
  const pkg = getPackage(packageId);
  if (!pkg || !pkg.stripePriceEnvKey) return undefined;
  return getEnvValue(pkg.stripePriceEnvKey);
}

/**
 * Safely resolves the Stripe Price ID for an addon based on the selected package's currency context.
 * Require exact currency matches and do not fallback.
 * If the environment variable is not defined, returns undefined.
 */
export function resolveAddonPriceId(addonId: string, contextCurrency: "USD" | "AED"): string | undefined {
  const addon = getAddon(addonId);
  if (!addon) return undefined;

  if (contextCurrency === "AED") {
    if (addon.currencyGroup === "USD") return undefined;
    if (!addon.stripePriceEnvKeyAed) return undefined;
    return getEnvValue(addon.stripePriceEnvKeyAed);
  }

  if (contextCurrency === "USD") {
    if (addon.currencyGroup === "AED") return undefined;
    if (!addon.stripePriceEnvKeyUsd) return undefined;
    return getEnvValue(addon.stripePriceEnvKeyUsd);
  }

  return undefined;
}
