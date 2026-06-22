"use client";

import * as React from "react";
import {
  SiWordpress,
  SiHubspot,
  SiGmail,
  SiShopify,
  SiStripe,
  SiPaypal,
  SiSlack,
  SiGoogleanalytics,
  SiNotion,
  SiGooglesheets,
  SiTelegram,
  SiWhatsapp,
  SiSalesforce,
  SiZoho,
} from "react-icons/si";
import { FaCreditCard } from "react-icons/fa";
import { LuGlobe, LuCable, LuRoute, LuWorkflow, LuNetwork } from "react-icons/lu";

type Props = {
  name: string;
  className?: string;
};

// Official Microsoft logo representation (4 colored squares)
const MicrosoftSvg = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 23 23" fill="currentColor" className={className} preserveAspectRatio="xMidYMid meet">
    <rect x="0" y="0" width="11" height="11" fill="#F25022" />
    <rect x="12" y="0" width="11" height="11" fill="#7FBA00" />
    <rect x="0" y="12" width="11" height="11" fill="#00A4EF" />
    <rect x="12" y="12" width="11" height="11" fill="#FFB900" />
  </svg>
);

// Official Paymob slanted double-curve vector representation
const PaymobSvg = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="currentColor" className={className} preserveAspectRatio="xMidYMid meet">
    {/* Left slanted segment */}
    <path d="M43.5 26.5C40.5 26.5 38 29 37.5 32L26 73.5C25.5 75.5 27 77.5 29 77.5H35C38 77.5 40.5 75 41 72L50.5 38H60.5C62.5 38 64 36.5 64 34.5V30C64 28 62.5 26.5 60.5 26.5H43.5Z" />
    {/* Right curved segment */}
    <path d="M49.5 35.5C49.5 33.5 51 32 53 32H72.5C81 32 87 38 85.5 46C83.5 57 73.5 67 62 67H53.5C51.5 67 50 65.5 50.5 63.5L52.5 55.5C53 53.5 54.5 52 56.5 52H62C67.5 52 72 48.5 73 43C73.5 39 71 35.5 66.5 35.5H53C51 35.5 49.5 35.5 49.5 35.5Z" />
  </svg>
);

// Recognizable Tabby logo representation
const TabbySvg = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} preserveAspectRatio="xMidYMid meet">
    <rect x="1" y="1" width="22" height="22" rx="6" fill="#33FFCC" />
    <path d="M9 6v3H7v3h2v6c0 1.66 1.34 3 3 3h3v-3h-3v-6h3V9h-3V6H9z" fill="#000000" />
  </svg>
);

export function IntegrationBrandIcon({ name, className }: Props) {
  const map: Record<string, React.ComponentType<{ className?: string }>> = {
    wordpress: SiWordpress,
    crm: LuNetwork,
    hubspot: SiHubspot,
    email: SiGmail,
    microsoft: MicrosoftSvg,
    shopify: SiShopify,
    payments: FaCreditCard, // Payments category uses generic credit card
    stripe: SiStripe,
    paypal: SiPaypal,
    paymob: PaymobSvg,
    tabby: TabbySvg,
    salesforce: SiSalesforce,
    zoho: SiZoho,
    slack: SiSlack,
    telegram: SiTelegram,
    whatsapp: SiWhatsapp,
    analytics: SiGoogleanalytics,
    sheets: SiGooglesheets,
    docs: SiNotion,
    connect: LuCable,
    route: LuRoute,
    automate: LuWorkflow,
  };

  const Icon = map[name] || LuGlobe;
  return <Icon className={className} aria-hidden="true" />;
}

// Brand color helper mapping (solved contrast issues for dark backgrounds)
export const brandColors: Record<string, string> = {
  wordpress: "#FFFFFF", // WordPress white on dark background contrast
  crm: "var(--color-accent-primary)",
  hubspot: "#FF7A59",
  email: "#EA4335",
  microsoft: "#FFFFFF", // High-contrast Microsoft white on dark background
  shopify: "#7AB55C",
  payments: "var(--color-accent-primary)",
  stripe: "#635BFF",
  paypal: "#009CDE",
  paymob: "#005CFF",
  tabby: "#33FFCC",
  salesforce: "#00A1E0",
  zoho: "#FFFFFF", // High-contrast white for Zoho
  slack: "#FFFFFF",
  telegram: "#229ED9",
  whatsapp: "#25D366",
  analytics: "#FF9F00",
  sheets: "#0F9D58",
  docs: "#FFFFFF",
  connect: "var(--color-accent-primary)",
  route: "var(--color-accent-primary)",
  automate: "var(--color-accent-secondary)",
};
