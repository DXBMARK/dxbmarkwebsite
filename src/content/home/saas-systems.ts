// SaaS Systems Section Content
// Section: Build Your System
// Position: After Integrations, before Tech Stack

export type SaasSystemId =
  | "saas-platforms"
  | "admin-dashboards"
  | "client-portals"
  | "workflow-automation"
  | "custom-systems";

export interface SaasSystemItem {
  id: SaasSystemId;
  /** Short title shown in the interactive list */
  title: string;
  /** One-line description shown expanded under the list item */
  description: string;
  /** Lucide icon name for the list item */
  icon: "layers" | "layout-dashboard" | "users" | "zap" | "wrench";
}

export const saasSystemItems: SaasSystemItem[] = [
  {
    id: "saas-platforms",
    title: "SaaS Platforms",
    description:
      "Build subscription platforms with users, roles, billing, analytics, and scalable workflows.",
    icon: "layers",
  },
  {
    id: "admin-dashboards",
    title: "Admin Dashboards",
    description:
      "Manage operations, data, orders, users, and reports from one secure control center.",
    icon: "layout-dashboard",
  },
  {
    id: "client-portals",
    title: "Client Portals",
    description:
      "Give clients a professional login area for requests, files, invoices, updates, and support.",
    icon: "users",
  },
  {
    id: "workflow-automation",
    title: "Workflow Automation",
    description:
      "Connect tools, trigger actions, reduce manual work, and keep business processes moving.",
    icon: "zap",
  },
  {
    id: "custom-systems",
    title: "Custom Business Systems",
    description:
      "Turn unique operational problems into reliable software tailored to your exact workflow.",
    icon: "wrench",
  },
];

export const saasSystemsContent = {
  badge: "SAAS SYSTEMS",
  headline: "Build Your System.",
  description:
    "From SaaS platforms to admin dashboards and client portals, DXBMARK builds custom systems that organize operations, connect data, and solve real business problems.",
  strategicLine:
    "For every business problem, we build the system behind the solution.",
  cta: {
    label: "Discuss your system →",
    href: "/contact",
  },
} as const;

// SaaS Systems Features Content
// Alternating feature showcase below main section
export const saasSystemFeatures = [
  {
    id: "dashboard-components",
    badge: "Dashboard Components",
    headline: "Real-Time Admin Interfaces Built for Your Operations",
    features: [
      {
        title: "Operations Control Centers",
        description:
          "Custom admin dashboards with live metrics, data tables, charts, user management, and role-based access control tailored to your business workflows.",
      },
      {
        title: "SaaS Platform Interfaces",
        description:
          "Build subscription platforms with billing dashboards, analytics panels, customer portals, and team collaboration tools — all under your brand.",
      },
    ],
  },
  {
    id: "data-visualization",
    badge: "Data & Analytics",
    headline: "Turn Your Business Data Into Visual Insights",
    features: [
      {
        title: "Charts, Graphs & KPI Cards",
        description:
          "Interactive data visualizations including area charts, bar graphs, donut charts, and real-time KPI cards that update live as your data changes.",
      },
      {
        title: "Tables, Filters & Export Tools",
        description:
          "Advanced data tables with sorting, filtering, search, pagination, and export capabilities. Connect to your database and display rich, actionable data.",
      },
    ],
  },
  {
    id: "system-capabilities",
    badge: "System Capabilities",
    headline: "Built for Scale, Designed for Control",
    features: [
      {
        title: "Real-Time Data Sync & Enterprise Security",
        description:
          "Live updates across all connected systems with role-based access control, encrypted data storage, audit logs, and compliance-ready infrastructure.",
      },
      {
        title: "Scalable Infrastructure & Advanced Analytics",
        description:
          "Built on modern cloud architecture that handles growth automatically. Turn operational data into insights with built-in reporting and custom dashboards.",
      },
    ],
  },
] as const;

// SaaS Systems Capabilities Content
// Heroicons-inspired feature list with dashboard visual
export const saasSystemCapabilities = {
  badge: "System Capabilities",
  headline: "Built for Scale, Designed for Control",
  description:
    "Every DXBMARK system is built with enterprise-grade infrastructure, real-time data synchronization, and modular architecture that grows with your business.",
  features: [
    {
      name: "Real-Time Data Sync",
      description:
        "Live updates across all connected systems. Changes propagate instantly so your team always works with the latest information.",
      icon: "bolt",
    },
    {
      name: "Enterprise Security",
      description:
        "Role-based access control, encrypted data storage, audit logs, and compliance-ready infrastructure protect your operations.",
      icon: "lock-closed",
    },
    {
      name: "Scalable Infrastructure",
      description:
        "Built on modern cloud architecture that handles growth automatically. Start small, scale to enterprise without rebuilding.",
      icon: "server",
    },
    {
      name: "Advanced Analytics",
      description:
        "Turn operational data into insights with built-in reporting, custom dashboards, and export tools for deeper analysis.",
      icon: "chart-bar",
    },
    {
      name: "Workflow Automation",
      description:
        "Connect systems, trigger actions, and eliminate manual work. Build custom automation that fits your exact process.",
      icon: "cog-6-tooth",
    },
    {
      name: "Cloud Deployment",
      description:
        "Hosted infrastructure, automatic backups, and zero-downtime updates. Focus on your business, not server management.",
      icon: "cloud-arrow-up",
    },
  ],
} as const;

// SaaS Systems Final CTA Content
// Large closing conversion block after all features
export const saasSystemFinalCTA = {
  badge: "SYSTEMS BUILT AROUND YOUR BUSINESS",
  quote: "For every business problem, we build the system behind the solution.",
  description:
    "DXBMARK turns scattered tools, manual processes, and disconnected data into reliable software systems built around your workflow.",
  primaryCTA: {
    label: "Discuss your system →",
    href: "/contact",
  },
  secondaryCTA: {
    label: "View services",
    href: "/services",
  },
} as const;
