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
    description: "Forms, CRM, email, payments, cloud, support, and reporting systems.",
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
  // Source Systems (Left side)
  {
    id: "source-forms",
    label: "WordPress",
    description: "Capture qualified leads and CMS forms via WordPress.",
    icon: "wordpress",
    group: "source",
  },
  {
    id: "source-crm",
    label: "CRM Systems",
    description: "Connect HubSpot, Salesforce, Zoho, and other customer relationship management platforms.",
    icon: "crm",
    group: "source",
    expandable: true,
    subNodes: [
      {
        id: "hubspot",
        label: "HubSpot",
        description: "Sync contact pipelines, company logs, and customer status with HubSpot.",
        icon: "hubspot",
      },
      {
        id: "salesforce",
        label: "Salesforce",
        description: "Sync enterprise accounts and pipelines with Salesforce.",
        icon: "salesforce",
      },
      {
        id: "zoho",
        label: "Zoho CRM",
        description: "Process pipeline workflows and lead records with Zoho.",
        icon: "zoho",
      },
    ],
  },
  {
    id: "source-email",
    label: "Gmail",
    description: "Listen for incoming message events, alerts, and triggers via Gmail.",
    icon: "email",
    group: "source",
  },
  {
    id: "source-outlook",
    label: "Microsoft",
    description: "Sync enterprise calendar events, email triggers, and cloud files with Microsoft 365.",
    icon: "microsoft",
    group: "source",
  },
  {
    id: "source-shopify",
    label: "Shopify Commerce",
    description: "Sync checkout logs, customer carts, and order status in Shopify.",
    icon: "shopify",
    group: "source",
  },
  {
    id: "source-payments",
    label: "Payments Gateway",
    description: "Connect payment processing and transaction verification providers.",
    icon: "payments",
    group: "source",
    expandable: true,
    subNodes: [
      {
        id: "stripe",
        label: "Stripe",
        description: "Payment processing, subscription renewals, and billing hooks.",
        icon: "stripe",
      },
      {
        id: "paypal",
        label: "PayPal",
        description: "Verify digital transactions and payment states on PayPal.",
        icon: "paypal",
      },
      {
        id: "paymob",
        label: "Paymob",
        description: "Accept regional credit cards and mobile wallets via Paymob.",
        icon: "paymob",
      },
      {
        id: "tabby",
        label: "Tabby BNPL",
        description: "Offer split payment installments and BNPL solutions with Tabby.",
        icon: "tabby",
      },
    ],
  },

  // Destination Systems (Right side)
  {
    id: "dest-dashboards",
    label: "Google Analytics",
    description: "Ingest client tracking statistics and custom conversion parameters.",
    icon: "analytics",
    group: "destination",
  },
  {
    id: "dest-tickets",
    label: "Slack Alerts",
    description: "Dispatch instant channel messages and notifications to Slack.",
    icon: "slack",
    group: "destination",
  },
  {
    id: "dest-data",
    label: "Google Sheets",
    description: "Export daily operation reports, analytics, and spreadsheets.",
    icon: "sheets",
    group: "destination",
  },
  {
    id: "dest-notifications",
    label: "Notion Workspace",
    description: "Log clean client database items and sync project boards in Notion.",
    icon: "docs",
    group: "destination",
  },
  {
    id: "dest-records",
    label: "WhatsApp CRM",
    description: "Trigger customer support messages and transactional alerts on WhatsApp.",
    icon: "whatsapp",
    group: "destination",
  },
  {
    id: "dest-reports",
    label: "Telegram Bot",
    description: "Dispatch automated operational alerts and logs to Telegram channels.",
    icon: "telegram",
    group: "destination",
  },
];
