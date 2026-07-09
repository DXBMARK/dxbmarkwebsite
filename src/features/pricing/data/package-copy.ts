// This file contains frontend-safe marketing and UX copy only. It must not contain official prices, currency conversion, Stripe IDs, or checkout logic.
//
// Future pricing display strategy (pricingDisplayMode: "stripe_synced") will retrieve dynamic prices
// from the server resolved from Stripe's API catalog.

import { PackageCopy, AddonCopy } from "../types";

export const ADDONS_COPY: AddonCopy[] = [
  // Website Setup Category
  {
    id: "domain-purchase",
    name: "Domain Connection",
    description: "Register a new custom domain or connect your existing one.",
    pricingDisplayMode: "placeholder",
    category: "website_setup",
  },
  {
    id: "business-email",
    name: "Professional Email Setup",
    description: "Set up professional email mailboxes (e.g. Google or Zoho).",
    pricingDisplayMode: "placeholder",
    category: "website_setup",
  },
  {
    id: "website-maintenance",
    name: "Website Maintenance",
    description: "Monthly security updates and content corrections.",
    pricingDisplayMode: "placeholder",
    category: "website_setup",
  },

  // Google Category
  {
    id: "google-business-profile",
    name: "Google Business Profile Setup",
    description: "Set up a complete Google Business Profile to improve local visibility across Google Maps and Search. Verification and ranking are subject to Google’s process. Product catalog upload is not included.",
    pricingDisplayMode: "placeholder",
    category: "google",
  },
  {
    id: "google-analytics-tag-setup",
    name: "Google Analytics / Google Tag Setup",
    description: "Connect Google Analytics, Google Tag, and Search Console foundations to measure site activity.",
    pricingDisplayMode: "placeholder",
    category: "google",
  },

  // Search Category
  {
    id: "basic-seo-setup",
    name: "Basic SEO Setup",
    description: "Website SEO foundation with clean URL structures and title/meta tags.",
    pricingDisplayMode: "placeholder",
    category: "search",
  },
  {
    id: "advanced-seo-pack",
    name: "Advanced SEO Pack",
    description: "Structured metadata, schema markup, and speed index tuning.",
    pricingDisplayMode: "placeholder",
    category: "search",
  },
  {
    id: "geo-setup",
    name: "Basic GEO Setup",
    description: "Prepare site content and entity signals for AI search discovery and generative search engines.",
    pricingDisplayMode: "placeholder",
    category: "search",
  },
  {
    id: "aeo-setup",
    name: "Basic AEO Setup",
    description: "Structure page content into direct-answer FAQ formats for AI search summaries.",
    pricingDisplayMode: "placeholder",
    category: "search",
  },
  {
    id: "search-visibility-bundle",
    name: "Search Visibility Bundle",
    description: "Combined visibility package covering Advanced SEO, GEO, and AEO.",
    pricingDisplayMode: "placeholder",
    category: "search",
  },

  // Contact Tools Category
  {
    id: "whatsapp-integration",
    name: "WhatsApp Capture",
    description: "Click-to-chat WhatsApp button floating on your pages.",
    pricingDisplayMode: "placeholder",
    category: "contact_tools",
  },
  {
    id: "chat-widget",
    name: "Live Chat Widget",
    description: "Interactive chat widget setup (e.g. Tawk.to or Crisp).",
    pricingDisplayMode: "placeholder",
    category: "contact_tools",
  },

  // Content Category
  {
    id: "content-writing",
    name: "Copywriting / Content",
    description: "Professional editing or copywriting for all your pages.",
    pricingDisplayMode: "placeholder",
    category: "content",
  },
  {
    id: "logo-intro-video",
    name: "Logo Intro Video Asset",
    description: "A 5-second animated video intro of your brand logo.",
    pricingDisplayMode: "placeholder",
    category: "content",
  },

  // Extra Services Category
  {
    id: "extra-page",
    name: "Extra Business Page",
    description: "Additional structured page to showcase more features.",
    pricingDisplayMode: "placeholder",
    category: "extra_services",
  },
  {
    id: "extra-section",
    name: "Extra Layout Section",
    description: "Custom layout block added to your page design.",
    pricingDisplayMode: "placeholder",
    category: "extra_services",
  },
  {
    id: "extra-revision-round",
    name: "Extra Revision Round",
    description: "Additional feedback round during the design phase.",
    pricingDisplayMode: "placeholder",
    category: "extra_services",
  },
  {
    id: "urgent-delivery",
    name: "Urgent Express Delivery",
    description: "Fast-track development and deploy within 72 hours.",
    pricingDisplayMode: "placeholder",
    category: "extra_services",
  },

  // Commerce Category
  {
    id: "extra-products",
    name: "Extra Catalog Products",
    description: "Upload and format extra products in WooCommerce store.",
    pricingDisplayMode: "placeholder",
    category: "commerce",
  },
  {
    id: "extra-maintenance",
    name: "Extra Maintenance Check",
    description: "On-demand maintenance session for WP core updates.",
    pricingDisplayMode: "placeholder",
    category: "commerce",
  },

  // Commerce Starter Setup specific relationship items
  {
    id: "domain-first-year",
    name: "Domain Connection",
    description: "Year 1 custom domain connection setup.",
    pricingDisplayMode: "placeholder",
    category: "website_setup",
  },
  {
    id: "hosting-first-year",
    name: "Managed WP Hosting",
    description: "Year 1 managed hosting connection.",
    pricingDisplayMode: "placeholder",
    category: "website_setup",
  },
  {
    id: "payment-gateway-setup",
    name: "Payment Gateway Setup Assistance",
    description: "Setup assistance to link payment gateways (e.g. Stripe).",
    pricingDisplayMode: "placeholder",
    category: "commerce",
  },
  {
    id: "maintenance-checkups-first-year",
    name: "WP Core Maintenance & Checkups",
    description: "WP engine security checkups during Year 1.",
    pricingDisplayMode: "placeholder",
    category: "website_setup",
  },
];

export const PACKAGES_COPY: PackageCopy[] = [
  {
    id: "website-launch",
    name: "Website Launch",
    description: "A single-page / landing page package for businesses that need a fast official online presence.",
    pricingDisplayMode: "placeholder",
    basePricingCurrency: "USD",
    bestFit: "Best for startups, solopreneurs & initial validation",
    outcome: "Launch a clean landing page fast",
    benefits: [
      "Optimized single-page responsive structure",
      "Immediate WhatsApp & Call capture hooks",
      "Fast deployment and search setup"
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
    pricingDisplayMode: "placeholder",
    basePricingCurrency: "USD",
    bestFit: "Best for professional services, clinics & local agencies",
    outcome: "Build trust with a structured website",
    benefits: [
      "Multi-page architecture for key brand topics",
      "Analytics readiness for traffic insights",
      "Structured SEO layouts for service visibility"
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
    pricingDisplayMode: "placeholder",
    basePricingCurrency: "USD",
    bestFit: "Best for active marketing campaigns & client capture",
    outcome: "Prepare your site for leads and campaigns",
    benefits: [
      "Up to 6 conversion-centric brand pages",
      "Advanced scheduling & lead capture flows",
      "Ready for custom integrations & campaigns"
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
    pricingDisplayMode: "placeholder",
    basePricingCurrency: "USD",
    bestFit: "Best for retail shops launching their first digital store",
    outcome: "Start selling with a controlled store setup",
    benefits: [
      "WordPress + WooCommerce setup with up to 10 products",
      "Year 1 Domain & Managed Hosting fully included",
      "Integrated secure payment gateways & checkout"
    ],
    scope: [
      "WordPress + WooCommerce setup",
      "Theme-based build",
      "Up to 5 core pages",
      "Basic shop structure",
      "Up to 10 products uploaded",
    ],
    exclusions: [
      "Payment gateway transaction fees are charged directly by the gateway and not included",
      "Shipping/delivery vendor account setup & fees are excluded",
      "Large product catalogs require custom data migration scopes",
      "Marketplace or multi-vendor features are excluded",
      "Daily store management & product updates are excluded",
    ],
  },
];
