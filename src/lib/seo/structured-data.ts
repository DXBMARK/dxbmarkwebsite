import type { FAQItem } from "@/content/faqs/contact-faq";
import type { LegalDocument } from "@/content/legal";
import {
  HOME_DESCRIPTION,
  ROOT_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  SOCIAL_PROFILE_URLS,
  absoluteUrl,
} from "@/lib/seo/site";

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const organizationNode = {
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: SITE_NAME,
  url: SITE_URL,
  description: ROOT_DESCRIPTION,
  email: "info@dxbmark.com",
  sameAs: SOCIAL_PROFILE_URLS,
  address: {
    "@type": "PostalAddress",
    streetAddress: "30 N Gould St, Ste R",
    addressLocality: "Sheridan",
    addressRegion: "WY",
    postalCode: "82801",
    addressCountry: "US",
  },
};

const websiteNode = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: SITE_NAME,
  url: SITE_URL,
  publisher: {
    "@id": ORGANIZATION_ID,
  },
};

const buildWebPageNode = ({
  path,
  name,
  description,
  type = "WebPage",
}: {
  path: string;
  name: string;
  description: string;
  type?: string;
}) => {
  const url = absoluteUrl(path);

  return {
    "@type": type,
    "@id": `${url}#webpage`,
    name,
    url,
    description,
    isPartOf: {
      "@id": WEBSITE_ID,
    },
    publisher: {
      "@id": ORGANIZATION_ID,
    },
  };
};

export const buildHomeJsonLd = () => ({
  "@context": "https://schema.org",
  "@graph": [
    organizationNode,
    websiteNode,
    {
      ...buildWebPageNode({
        path: "/",
        name: "Software, SaaS, Cloud & Automation Systems",
        description: HOME_DESCRIPTION,
      }),
      about: [
        { "@type": "Thing", name: "Custom software development" },
        { "@type": "Thing", name: "SaaS platform development" },
        { "@type": "Thing", name: "Web application development" },
        { "@type": "Thing", name: "Automation systems" },
        { "@type": "Thing", name: "Cloud infrastructure" },
        { "@type": "Thing", name: "Managed hosting" },
        { "@type": "Thing", name: "Technical consulting" },
      ],
    },
  ],
});

const contactPointNodes = [
  {
    "@type": "ContactPoint",
    "@id": `${SITE_URL}/contact#general-contact`,
    contactType: "general inquiries",
    email: "info@dxbmark.com",
    url: absoluteUrl("/contact"),
    availableLanguage: ["English", "Arabic"],
  },
  {
    "@type": "ContactPoint",
    "@id": `${SITE_URL}/contact#sales-contact`,
    contactType: "sales",
    email: "sales@dxbmark.com",
    url: absoluteUrl("/contact"),
    availableLanguage: ["English", "Arabic"],
  },
  {
    "@type": "ContactPoint",
    "@id": `${SITE_URL}/contact#support-contact`,
    contactType: "customer support",
    telephone: "+971505121583",
    email: "support@dxbmark.com",
    areaServed: ["AE", "EG", "US", "GB"],
    availableLanguage: ["English", "Arabic"],
    url: absoluteUrl("/contact"),
  },
  {
    "@type": "ContactPoint",
    "@id": `${SITE_URL}/contact#legal-contact`,
    contactType: "legal",
    email: "legal@dxbmark.com",
    url: absoluteUrl("/contact"),
    availableLanguage: ["English", "Arabic"],
  },
  {
    "@type": "ContactPoint",
    "@id": `${SITE_URL}/contact#privacy-contact`,
    contactType: "privacy",
    email: "privacy@dxbmark.com",
    url: absoluteUrl("/contact"),
    availableLanguage: ["English", "Arabic"],
  },
  {
    "@type": "ContactPoint",
    "@id": `${SITE_URL}/contact#billing-contact`,
    contactType: "billing",
    email: "billing@dxbmark.com",
    url: absoluteUrl("/contact"),
    availableLanguage: ["English", "Arabic"],
  },
];

const formatFaqAnswer = (item: FAQItem) => {
  const bullets = item.bullets?.length ? item.bullets.join("; ") : "";

  return [item.answer, bullets, item.closing].filter(Boolean).join(" ");
};

export const buildContactJsonLd = (faqs: FAQItem[]) => ({
  "@context": "https://schema.org",
  "@graph": [
    organizationNode,
    websiteNode,
    {
      ...buildWebPageNode({
        path: "/contact",
        name: "Contact DXBMARK LLC",
        description:
          "Contact DXBMARK LLC for software development, SaaS platforms, cloud infrastructure, automation, integrations, and technical consulting.",
        type: "ContactPage",
      }),
      mainEntity: contactPointNodes.map((node) => ({ "@id": node["@id"] })),
    },
    ...contactPointNodes,
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/contact#faq`,
      mainEntity: faqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: formatFaqAnswer(item),
        },
      })),
    },
  ],
});

type BreadcrumbItem = {
  name: string;
  path: string;
};

const buildBreadcrumbNode = (items: BreadcrumbItem[], id: string) => ({
  "@type": "BreadcrumbList",
  "@id": id,
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

export const buildLegalDocumentJsonLd = (doc: LegalDocument) => {
  const url = absoluteUrl(doc.href);

  return {
    "@context": "https://schema.org",
    "@graph": [
      websiteNode,
      {
        ...buildWebPageNode({
          path: doc.href,
          name: `${doc.title} | ${SITE_NAME}`,
          description: doc.description,
        }),
        datePublished: doc.effectiveDate,
        dateModified: doc.lastUpdated,
        breadcrumb: {
          "@id": `${url}#breadcrumb`,
        },
      },
      buildBreadcrumbNode(
        [
          { name: "Home", path: "/" },
          { name: "Legal", path: "/legal" },
          { name: doc.title, path: doc.href },
        ],
        `${url}#breadcrumb`
      ),
    ],
  };
};

export const buildServicesJsonLd = () => {
  const url = absoluteUrl("/services");
  
  const servicesList = [
    {
      "@type": "Service",
      "name": "Web & SaaS Applications",
      "description": "Custom web applications, SaaS platforms, dashboards, portals, and eCommerce systems built around real business workflows.",
      "provider": { "@id": ORGANIZATION_ID }
    },
    {
      "@type": "Service",
      "name": "Business Websites",
      "description": "Company websites, WordPress builds, landing pages, and content systems designed to communicate clearly and convert better.",
      "provider": { "@id": ORGANIZATION_ID }
    },
    {
      "@type": "Service",
      "name": "Business Systems & Portals",
      "description": "Internal tools, client portals, admin dashboards, booking flows, and business systems that organize daily operations.",
      "provider": { "@id": ORGANIZATION_ID }
    },
    {
      "@type": "Service",
      "name": "Cloud & Managed Hosting",
      "description": "Deployment, hosting, monitoring, backups, server setup, and infrastructure support for reliable digital operations.",
      "provider": { "@id": ORGANIZATION_ID }
    },
    {
      "@type": "Service",
      "name": "Automation & Workflows",
      "description": "Process automation, notifications, handoffs, integrations, and internal workflows that reduce manual work and improve speed.",
      "provider": { "@id": ORGANIZATION_ID }
    },
    {
      "@type": "Service",
      "name": "Integrations & APIs",
      "description": "Connect CRMs, payments, analytics, messaging, cloud tools, and internal systems through clean API and webhook workflows.",
      "provider": { "@id": ORGANIZATION_ID }
    },
    {
      "@type": "Service",
      "name": "Technical Consulting",
      "description": "System reviews, product planning, architecture guidance, and practical next-step recommendations before you build.",
      "provider": { "@id": ORGANIZATION_ID }
    },
    {
      "@type": "Service",
      "name": "Dashboards & Admin Systems",
      "description": "Operational dashboards, reporting panels, admin interfaces, and management systems designed for visibility and control.",
      "provider": { "@id": ORGANIZATION_ID }
    }
  ];

  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationNode,
      websiteNode,
      {
        ...buildWebPageNode({
          path: "/services",
          name: `Software Development, SaaS, Cloud & Automation Services | ${SITE_NAME}`,
          description: "Explore DXBMARK LLC services for custom software development, SaaS platforms, business websites, cloud infrastructure, managed hosting, automation workflows, integrations, dashboards, portals, and technical consulting.",
        }),
        "breadcrumb": {
          "@id": `${url}#breadcrumb`
        },
        "hasPart": servicesList.map((service, index) => ({
          "@id": `${url}#service-${index}`,
          ...service
        }))
      },
      buildBreadcrumbNode(
        [
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" }
        ],
        `${url}#breadcrumb`
      ),
      ...servicesList.map((service, index) => ({
        "@context": "https://schema.org",
        "@id": `${url}#service-${index}`,
        ...service
      }))
    ]
  };
};

