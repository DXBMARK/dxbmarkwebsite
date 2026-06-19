export interface NavLink {
  label: string;
  href: string;
  hasMegaMenu?: boolean;
}

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services", hasMegaMenu: true },
  { label: "Process", href: "/process" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export interface MegaMenuItem {
  title: string;
  description: string;
  href: string;
  iconName: "Monitor" | "Layers" | "GitBranch" | "Link2";
}

export const MEGA_MENU_ITEMS: MegaMenuItem[] = [
  {
    title: "Web Design",
    description: "Modern websites built for clarity, speed, trust, and conversion.",
    href: "/services/web-design",
    iconName: "Monitor",
  },
  {
    title: "Web / SaaS Applications",
    description: "Custom web platforms, dashboards, portals, and SaaS products.",
    href: "/services/web-saas-applications",
    iconName: "Layers",
  },
  {
    title: "Automations & Workflows",
    description: "Business process automation, internal workflows, and operational systems.",
    href: "/services/automations-workflows",
    iconName: "GitBranch",
  },
  {
    title: "Integrations",
    description: "API connections, third-party tools, CRM flows, and system integrations.",
    href: "/services/integrations",
    iconName: "Link2",
  },
];
