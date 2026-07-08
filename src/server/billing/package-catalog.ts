import { Package, Addon } from "./types";
import { getAddonRulesForPackage } from "@/features/pricing/data/package-rules";

/**
 * This file contains server-side package eligibility and Stripe mapping rules.
 * DXBMARK controls package rules here, while Stripe remains the only official source of truth for payable prices.
 * Do not import this file into client components.
 */

const PACKAGES_LIST: Package[] = [
  {
    id: "website-launch",
    name: "Website Launch",
    description: "A single-page / landing page package for businesses that need a fast official online presence.",
    stripePriceEnvKey: "STRIPE_PRICE_PACKAGE_WEBSITE_LAUNCH_USD",
    addonRules: getAddonRulesForPackage("website-launch"),
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
    stripePriceEnvKey: "STRIPE_PRICE_PACKAGE_BUSINESS_PRESENCE_USD",
    addonRules: getAddonRulesForPackage("business-presence"),
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
    stripePriceEnvKey: "STRIPE_PRICE_PACKAGE_GROWTH_SETUP_USD",
    addonRules: getAddonRulesForPackage("growth-setup"),
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
    stripePriceEnvKey: "STRIPE_PRICE_PACKAGE_COMMERCE_STARTER_USD",
    addonRules: getAddonRulesForPackage("commerce-starter-setup"),
    scope: [
      "WordPress + WooCommerce setup",
      "Theme-based build",
      "Up to 5 core pages",
      "Basic shop structure",
      "Up to 10 products uploaded",
      "Domain (first year included, separate renewal required)",
      "Hosting (first year included, separate renewal required)",
      "3 maintenance check-ups during the first year",
    ],
    exclusions: [
      "Payment gateway fees are not included",
      "Stripe, PayPal, or local gateway charges are not included",
      "Shipping/delivery vendor fees are not included",
      "Large product catalogs are not included",
      "Marketplace or multi-vendor setup is not included",
      "Daily product/store management is not included",
    ],
  },
];

const ADDONS_LIST: Addon[] = [
  {
    id: "domain-purchase",
    name: "Domain Purchase / Connection",
    stripePriceEnvKeyUsd: "STRIPE_PRICE_ADDON_DOMAIN_USD",
  },
  {
    id: "business-email",
    name: "Business Email Setup",
    stripePriceEnvKeyUsd: "STRIPE_PRICE_ADDON_EMAIL_USD",
  },
  {
    id: "website-maintenance",
    name: "Website Maintenance",
    stripePriceEnvKeyUsd: "STRIPE_PRICE_ADDON_MAINTENANCE_USD",
  },
  {
    id: "whatsapp-integration",
    name: "WhatsApp Integration",
    stripePriceEnvKeyUsd: "STRIPE_PRICE_ADDON_WHATSAPP_USD",
  },
  {
    id: "chat-widget",
    name: "Chat Widget Setup",
    stripePriceEnvKeyUsd: "STRIPE_PRICE_ADDON_CHAT_USD",
  },
  {
    id: "analytics-setup",
    name: "Analytics Setup",
    stripePriceEnvKeyUsd: "STRIPE_PRICE_ADDON_ANALYTICS_USD",
  },
  {
    id: "extra-page",
    name: "Extra Page",
    stripePriceEnvKeyUsd: "STRIPE_PRICE_ADDON_EXTRAPAGE_USD",
  },
  {
    id: "extra-section",
    name: "Extra Section",
    stripePriceEnvKeyUsd: "STRIPE_PRICE_ADDON_EXTRASECTION_USD",
  },
  {
    id: "extra-revision-round",
    name: "Extra Revision Round",
    stripePriceEnvKeyUsd: "STRIPE_PRICE_ADDON_REVISION_USD",
  },
  {
    id: "urgent-delivery",
    name: "Urgent Delivery",
    stripePriceEnvKeyUsd: "STRIPE_PRICE_ADDON_URGENT_USD",
  },
  {
    id: "logo-intro-video",
    name: "Logo Intro Video",
    stripePriceEnvKeyUsd: "STRIPE_PRICE_ADDON_LOGO_USD",
  },
  {
    id: "advanced-seo",
    name: "Advanced SEO",
    stripePriceEnvKeyUsd: "STRIPE_PRICE_ADDON_SEO_USD",
  },
  {
    id: "geo",
    name: "GEO (Generative Engine Optimization)",
    stripePriceEnvKeyUsd: "STRIPE_PRICE_ADDON_GEO_USD",
  },
  {
    id: "aeo",
    name: "AEO (Answer Engine Optimization)",
    stripePriceEnvKeyUsd: "STRIPE_PRICE_ADDON_AEO_USD",
  },
  {
    id: "search-visibility-bundle",
    name: "Search Visibility Bundle",
    stripePriceEnvKeyUsd: "STRIPE_PRICE_ADDON_BUNDLE_USD",
  },
  {
    id: "content-writing",
    name: "Content Writing / Copy Improvement",
    stripePriceEnvKeyUsd: "STRIPE_PRICE_ADDON_CONTENT_USD",
  },
  // Commerce Starter Setup specific items
  {
    id: "domain-first-year",
    name: "Domain (First Year Included)",
    stripePriceEnvKeyUsd: "STRIPE_PRICE_ADDON_DOMAIN_FIRST_YEAR_USD",
  },
  {
    id: "hosting-first-year",
    name: "Hosting (First Year Included)",
    stripePriceEnvKeyUsd: "STRIPE_PRICE_ADDON_HOSTING_FIRST_YEAR_USD",
  },
  {
    id: "payment-gateway-setup",
    name: "Payment Gateway Setup Assistance",
    stripePriceEnvKeyUsd: "STRIPE_PRICE_ADDON_GATEWAY_SETUP_USD",
  },
  {
    id: "maintenance-checkups-first-year",
    name: "3 Maintenance Check-ups (First Year Included)",
    stripePriceEnvKeyUsd: "STRIPE_PRICE_ADDON_MAINTENANCE_FIRST_YEAR_USD",
  },
  {
    id: "extra-products",
    name: "Extra Products (eCommerce)",
    stripePriceEnvKeyUsd: "STRIPE_PRICE_ADDON_EXTRA_PRODUCTS_USD",
  },
  {
    id: "extra-maintenance",
    name: "Extra Maintenance Check-up",
    stripePriceEnvKeyUsd: "STRIPE_PRICE_ADDON_EXTRA_MAINTENANCE_USD",
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
    case "STRIPE_PRICE_PACKAGE_COMMERCE_STARTER_USD":
      return process.env.STRIPE_PRICE_PACKAGE_COMMERCE_STARTER_USD;
    case "STRIPE_PRICE_ADDON_DOMAIN_USD":
      return process.env.STRIPE_PRICE_ADDON_DOMAIN_USD;
    case "STRIPE_PRICE_ADDON_EMAIL_USD":
      return process.env.STRIPE_PRICE_ADDON_EMAIL_USD;
    case "STRIPE_PRICE_ADDON_MAINTENANCE_USD":
      return process.env.STRIPE_PRICE_ADDON_MAINTENANCE_USD;
    case "STRIPE_PRICE_ADDON_WHATSAPP_USD":
      return process.env.STRIPE_PRICE_ADDON_WHATSAPP_USD;
    case "STRIPE_PRICE_ADDON_CHAT_USD":
      return process.env.STRIPE_PRICE_ADDON_CHAT_USD;
    case "STRIPE_PRICE_ADDON_ANALYTICS_USD":
      return process.env.STRIPE_PRICE_ADDON_ANALYTICS_USD;
    case "STRIPE_PRICE_ADDON_EXTRAPAGE_USD":
      return process.env.STRIPE_PRICE_ADDON_EXTRAPAGE_USD;
    case "STRIPE_PRICE_ADDON_EXTRASECTION_USD":
      return process.env.STRIPE_PRICE_ADDON_EXTRASECTION_USD;
    case "STRIPE_PRICE_ADDON_REVISION_USD":
      return process.env.STRIPE_PRICE_ADDON_REVISION_USD;
    case "STRIPE_PRICE_ADDON_URGENT_USD":
      return process.env.STRIPE_PRICE_ADDON_URGENT_USD;
    case "STRIPE_PRICE_ADDON_LOGO_USD":
      return process.env.STRIPE_PRICE_ADDON_LOGO_USD;
    case "STRIPE_PRICE_ADDON_SEO_USD":
      return process.env.STRIPE_PRICE_ADDON_SEO_USD;
    case "STRIPE_PRICE_ADDON_GEO_USD":
      return process.env.STRIPE_PRICE_ADDON_GEO_USD;
    case "STRIPE_PRICE_ADDON_AEO_USD":
      return process.env.STRIPE_PRICE_ADDON_AEO_USD;
    case "STRIPE_PRICE_ADDON_BUNDLE_USD":
      return process.env.STRIPE_PRICE_ADDON_BUNDLE_USD;
    case "STRIPE_PRICE_ADDON_CONTENT_USD":
      return process.env.STRIPE_PRICE_ADDON_CONTENT_USD;
    case "STRIPE_PRICE_ADDON_DOMAIN_FIRST_YEAR_USD":
      return process.env.STRIPE_PRICE_ADDON_DOMAIN_FIRST_YEAR_USD;
    case "STRIPE_PRICE_ADDON_HOSTING_FIRST_YEAR_USD":
      return process.env.STRIPE_PRICE_ADDON_HOSTING_FIRST_YEAR_USD;
    case "STRIPE_PRICE_ADDON_GATEWAY_SETUP_USD":
      return process.env.STRIPE_PRICE_ADDON_GATEWAY_SETUP_USD;
    case "STRIPE_PRICE_ADDON_MAINTENANCE_FIRST_YEAR_USD":
      return process.env.STRIPE_PRICE_ADDON_MAINTENANCE_FIRST_YEAR_USD;
    case "STRIPE_PRICE_ADDON_EXTRA_PRODUCTS_USD":
      return process.env.STRIPE_PRICE_ADDON_EXTRA_PRODUCTS_USD;
    case "STRIPE_PRICE_ADDON_EXTRA_MAINTENANCE_USD":
      return process.env.STRIPE_PRICE_ADDON_EXTRA_MAINTENANCE_USD;
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
 * Safely resolves the Stripe Price ID for an addon.
 * If the environment variable is not defined, returns undefined.
 */
export function resolveAddonPriceId(addonId: string): string | undefined {
  const addon = getAddon(addonId);
  if (!addon) return undefined;
  if (!addon.stripePriceEnvKeyUsd) return undefined;
  return getEnvValue(addon.stripePriceEnvKeyUsd);
}
