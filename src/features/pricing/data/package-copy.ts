// This file contains frontend-safe marketing and UX copy only. It must not contain official prices, currency conversion, Stripe IDs, or checkout logic.
//
// Future pricing display strategy (pricingDisplayMode: "stripe_synced") will retrieve dynamic prices
// from the server resolved from Stripe's API catalog.

import { PackageCopy, AddonCopy } from "../types";

export const ADDONS_COPY: AddonCopy[] = [
  {
    id: "domain-purchase",
    name: "Domain Purchase / Connection",
    pricingDisplayMode: "placeholder",
  },
  {
    id: "business-email",
    name: "Business Email Setup",
    pricingDisplayMode: "placeholder",
  },
  {
    id: "website-maintenance",
    name: "Website Maintenance",
    pricingDisplayMode: "placeholder",
  },
  {
    id: "whatsapp-integration",
    name: "WhatsApp Integration",
    pricingDisplayMode: "placeholder",
  },
  {
    id: "chat-widget",
    name: "Chat Widget Setup",
    pricingDisplayMode: "placeholder",
  },
  {
    id: "analytics-setup",
    name: "Analytics Setup",
    pricingDisplayMode: "placeholder",
  },
  {
    id: "extra-page",
    name: "Extra Page",
    pricingDisplayMode: "placeholder",
  },
  {
    id: "extra-section",
    name: "Extra Section",
    pricingDisplayMode: "placeholder",
  },
  {
    id: "extra-revision-round",
    name: "Extra Revision Round",
    pricingDisplayMode: "placeholder",
  },
  {
    id: "urgent-delivery",
    name: "Urgent Delivery",
    pricingDisplayMode: "placeholder",
  },
  {
    id: "logo-intro-video",
    name: "Logo Intro Video",
    pricingDisplayMode: "placeholder",
  },
  {
    id: "advanced-seo",
    name: "Advanced SEO",
    pricingDisplayMode: "placeholder",
  },
  {
    id: "geo",
    name: "GEO (Generative Engine Optimization)",
    pricingDisplayMode: "placeholder",
  },
  {
    id: "aeo",
    name: "AEO (Answer Engine Optimization)",
    pricingDisplayMode: "placeholder",
  },
  {
    id: "search-visibility-bundle",
    name: "Search Visibility Bundle",
    pricingDisplayMode: "placeholder",
  },
  {
    id: "content-writing",
    name: "Content Writing / Copy Improvement",
    pricingDisplayMode: "placeholder",
  },
  // Commerce Starter Setup specific items
  {
    id: "domain-first-year",
    name: "Domain (First Year Included)",
    pricingDisplayMode: "placeholder",
  },
  {
    id: "hosting-first-year",
    name: "Hosting (First Year Included)",
    pricingDisplayMode: "placeholder",
  },
  {
    id: "payment-gateway-setup",
    name: "Payment Gateway Setup Assistance",
    pricingDisplayMode: "placeholder",
  },
  {
    id: "maintenance-checkups-first-year",
    name: "3 Maintenance Check-ups (First Year Included)",
    pricingDisplayMode: "placeholder",
  },
  {
    id: "extra-products",
    name: "Extra Products (eCommerce)",
    pricingDisplayMode: "placeholder",
  },
  {
    id: "extra-maintenance",
    name: "Extra Maintenance Check-up",
    pricingDisplayMode: "placeholder",
  },
];

export const PACKAGES_COPY: PackageCopy[] = [
  {
    id: "website-launch",
    name: "Website Launch",
    description: "A single-page / landing page package for businesses that need a fast official online presence.",
    pricingDisplayMode: "placeholder",
    basePricingCurrency: "USD",
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
    pricingDisplayMode: "placeholder",
    basePricingCurrency: "USD",
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
    pricingDisplayMode: "placeholder",
    basePricingCurrency: "USD",
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
    pricingDisplayMode: "placeholder",
    basePricingCurrency: "USD",
    scope: [
      "WordPress + WooCommerce setup",
      "Theme-based build",
      "Up to 5 core pages",
      "Basic shop structure",
      "Up to 10 products uploaded",
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
