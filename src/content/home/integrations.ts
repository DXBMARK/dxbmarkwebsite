export type IntegrationSubNode = {
  id: string;
  label: string;
  description: string;
  icon: string;
};

export type IntegrationTileItem = {
  id: string;
  label: string;
  description: string;
  icon: string;
  group: "source" | "destination";
  expandable?: boolean;
  subNodes?: IntegrationSubNode[];
};

export type IntegrationFeatureItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export const integrationFeatures: IntegrationFeatureItem[] = [
  {
    id: "connect-tools",
    title: "Connect tools",
    description:
      "Connect forms, CRM, email, payments, cloud, support, and reporting tools into one operating layer.",
    icon: "connect",
  },
  {
    id: "route-data",
    title: "Route data",
    description: "Move the right information between systems with fewer manual handoffs.",
    icon: "route",
  },
  {
    id: "automate-actions",
    title: "Automate actions",
    description: "Trigger follow-ups, notifications, records, and operational tasks.",
    icon: "automate",
  },
];

export const integrationTiles: IntegrationTileItem[] = [
  // Left side / Sources
  {
    id: "source-hubspot",
    label: "HubSpot",
    description: "Sync leads, contacts, and pipeline activity with HubSpot.",
    icon: "hubspot",
    group: "source",
  },
  {
    id: "source-zapier",
    label: "Zapier",
    description: "Connect apps, automate triggers, and move data between tools.",
    icon: "zapier",
    group: "source",
  },
  {
    id: "source-shopify",
    label: "Shopify",
    description: "Capture orders, carts, and customer commerce events from Shopify.",
    icon: "shopify",
    group: "source",
  },
  {
    id: "source-paypal",
    label: "PayPal",
    description: "Route payment confirmations, transaction states, and customer billing signals from PayPal.",
    icon: "paypal",
    group: "source",
  },
  {
    id: "source-cloud",
    label: "Cloud",
    description: "Connect hosted apps, cloud services, and website events.",
    icon: "cloud",
    group: "source",
  },

  // Right side / Destinations
  {
    id: "dest-stripe",
    label: "Stripe",
    description: "Process payments, billing events, and subscription workflows with Stripe.",
    icon: "stripe",
    group: "destination",
  },
  {
    id: "dest-analytics",
    label: "Google Analytics",
    description: "Track conversions, reporting, and analytics performance.",
    icon: "analytics",
    group: "destination",
  },
  {
    id: "dest-slack",
    label: "Slack",
    description: "Send team notifications and operational alerts into Slack.",
    icon: "slack",
    group: "destination",
  },
  {
    id: "dest-whatsapp",
    label: "WhatsApp",
    description: "Send customer notifications and workflow-driven WhatsApp messages.",
    icon: "whatsapp",
    group: "destination",
  },
  {
    id: "dest-telegram",
    label: "Telegram",
    description: "Dispatch automated alerts, bot messages, and operations updates.",
    icon: "telegram",
    group: "destination",
  },
];
