export type HomeService = {
  id: string;
  order: number;
  title: string;
  description: string;
  tags: string[];
  icon: "web-app" | "website" | "portal" | "cloud" | "automation" | "consulting";
  href: string;
};

export const homeServices: HomeService[] = [
  {
    id: "service-01",
    order: 1,
    title: "Web & SaaS Applications",
    description: "Custom web apps, SaaS platforms, dashboards, portals, and eCommerce systems built around real business workflows.",
    tags: ["SaaS", "Web Apps", "Dashboards"],
    icon: "web-app",
    href: "/contact"
  },
  {
    id: "service-02",
    order: 2,
    title: "Business Websites",
    description: "Company websites, WordPress builds, landing pages, and content systems designed to communicate clearly and convert better.",
    tags: ["Websites", "WordPress", "CMS"],
    icon: "website",
    href: "/contact"
  },
  {
    id: "service-03",
    order: 3,
    title: "Business Systems & Portals",
    description: "Internal tools, client portals, admin dashboards, booking flows, and business systems that organize daily operations.",
    tags: ["Portals", "Admin Tools", "Systems"],
    icon: "portal",
    href: "/contact"
  },
  {
    id: "service-04",
    order: 4,
    title: "Cloud & Managed Hosting",
    description: "Deployment, hosting, monitoring, backups, server setup, and infrastructure support for reliable digital operations.",
    tags: ["Cloud", "Hosting", "Monitoring"],
    icon: "cloud",
    href: "/contact"
  },
  {
    id: "service-05",
    order: 5,
    title: "Automation & Workflows",
    description: "Process automation, notifications, handoffs, and internal workflows that reduce manual work and improve operational speed.",
    tags: ["Automation", "Workflows", "Operations"],
    icon: "automation",
    href: "/contact"
  },
  {
    id: "service-06",
    order: 6,
    title: "Technical Consulting",
    description: "System reviews, product planning, architecture guidance, and practical next-step recommendations before you build.",
    tags: ["Planning", "Architecture", "Reviews"],
    icon: "consulting",
    href: "/contact"
  }
];
