"use client";

import * as React from "react";
import {
  SiHubspot,
  SiZapier,
  SiShopify,
  SiStripe,
  SiPaypal,
  SiGoogleanalytics,
  SiTelegram,
  SiWhatsapp,
} from "react-icons/si";
import { LuCloud, LuCable, LuRoute, LuWorkflow, LuGlobe } from "react-icons/lu";

type Props = {
  name: string;
  className?: string;
};

const SlackSvg = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 122.8 122.8" className={className} preserveAspectRatio="xMidYMid meet">
    <path
      d="M27 77.2c0 7.8-6.3 14.1-14.1 14.1S-1.2 85-.9 77.2c0-7.8 6.3-14.1 14.1-14.1H27v14.1Z"
      fill="#E01E5A"
    />
    <path
      d="M34.1 77.2c0-7.8 6.3-14.1 14.1-14.1s14.1 6.3 14.1 14.1v35.4c0 7.8-6.3 14.1-14.1 14.1s-14.1-6.3-14.1-14.1V77.2Z"
      fill="#E01E5A"
    />
    <path
      d="M48.2 20.5c-7.8 0-14.1-6.3-14.1-14.1S40.4-7.7 48.2-7.4c7.8 0 14.1 6.3 14.1 14.1v14.1H48.2Z"
      fill="#36C5F0"
    />
    <path
      d="M48.2 27.6c7.8 0 14.1 6.3 14.1 14.1s-6.3 14.1-14.1 14.1H12.8c-7.8 0-14.1-6.3-14.1-14.1S5 27.6 12.8 27.6h35.4Z"
      fill="#36C5F0"
    />
    <path
      d="M95.8 41.7c0-7.8 6.3-14.1 14.1-14.1S124 33.9 123.7 41.7c0 7.8-6.3 14.1-14.1 14.1H95.8V41.7Z"
      fill="#2EB67D"
    />
    <path
      d="M88.7 41.7c0 7.8-6.3 14.1-14.1 14.1s-14.1-6.3-14.1-14.1V6.3c0-7.8 6.3-14.1 14.1-14.1S88.7-1.5 88.7 6.3v35.4Z"
      fill="#2EB67D"
    />
    <path
      d="M74.6 98.4c7.8 0 14.1 6.3 14.1 14.1s-6.3 14.1-14.1 14.1-14.1-6.3-14.1-14.1V98.4h14.1Z"
      fill="#ECB22E"
    />
    <path
      d="M74.6 91.3c-7.8 0-14.1-6.3-14.1-14.1s6.3-14.1 14.1-14.1H110c7.8 0 14.1 6.3 14.1 14.1s-6.3 14.1-14.1 14.1H74.6Z"
      fill="#ECB22E"
    />
  </svg>
);

export function IntegrationBrandIcon({ name, className }: Props) {
  const map: Record<string, React.ComponentType<{ className?: string }>> = {
    hubspot: SiHubspot,
    zapier: SiZapier,
    shopify: SiShopify,
    cloud: LuCloud,
    stripe: SiStripe,
    paypal: SiPaypal,
    analytics: SiGoogleanalytics,
    slack: SlackSvg,
    whatsapp: SiWhatsapp,
    telegram: SiTelegram,
    connect: LuCable,
    route: LuRoute,
    automate: LuWorkflow,
  };

  const Icon = map[name] || LuGlobe;
  return <Icon className={className} aria-hidden="true" />;
}

// Brand color helper mapping (solved contrast issues for dark backgrounds)
export const brandColors: Record<string, string> = {
  hubspot: "#FF7A59",
  zapier: "#FF4F00",
  shopify: "#7AB55C",
  cloud: "var(--color-accent-secondary)",
  stripe: "#635BFF",
  paypal: "#009CDE",
  analytics: "#FF9F00",
  slack: "var(--color-text-main)",
  whatsapp: "#25D366",
  telegram: "#229ED9",
  connect: "var(--color-accent-primary)",
  route: "var(--color-accent-primary)",
  automate: "var(--color-accent-secondary)",
};
