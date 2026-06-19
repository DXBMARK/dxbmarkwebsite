export interface LegalDocument {
  title: string;
  eyebrow: string;
  slug: string;
  href: string;
  filename: string;
  description: string;
  version: string;
  effectiveDate: string;
  lastUpdated: string;
  showInFooter: boolean;
  iconName:
    | "FileText"
    | "ShieldCheck"
    | "Lock"
    | "Database"
    | "RefreshCcw"
    | "Cookie"
    | "Truck"
    | "Building2"
    | "Server"
    | "Shield"
    | "LifeBuoy"
    | "Copyright";
}

export const LEGAL_VERSION = "1.0";
export const LEGAL_EFFECTIVE_DATE = "June 01, 2026";
export const LEGAL_LAST_UPDATED = "June 01, 2026";

export const LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    title: "Terms of Service",
    eyebrow: "AGREEMENT",
    slug: "terms-of-service",
    href: "/legal/terms-of-service",
    filename: "01_TERMS_OF_SERVICE_v1.md",
    description: "Terms and conditions for utilizing the DXBMARK LLC website, portals, systems, and engineering services.",
    version: LEGAL_VERSION,
    effectiveDate: LEGAL_EFFECTIVE_DATE,
    lastUpdated: LEGAL_LAST_UPDATED,
    showInFooter: true,
    iconName: "FileText",
  },
  {
    title: "Acceptable Use Policy",
    eyebrow: "COMPLIANCE",
    slug: "acceptable-use",
    href: "/legal/acceptable-use",
    filename: "02_ACCEPTABLE_USE_POLICY_v1.md",
    description: "Acceptable usage standards for our SaaS hosting environments, APIs, and systems.",
    version: LEGAL_VERSION,
    effectiveDate: LEGAL_EFFECTIVE_DATE,
    lastUpdated: LEGAL_LAST_UPDATED,
    showInFooter: true,
    iconName: "ShieldCheck",
  },
  {
    title: "Privacy Policy",
    eyebrow: "PRIVACY",
    slug: "privacy-policy",
    href: "/legal/privacy-policy",
    filename: "03_PRIVACY_POLICY_v1.md",
    description: "Our policy regarding data privacy, user rights, data collection, and processing protocols.",
    version: LEGAL_VERSION,
    effectiveDate: LEGAL_EFFECTIVE_DATE,
    lastUpdated: LEGAL_LAST_UPDATED,
    showInFooter: true,
    iconName: "Lock",
  },
  {
    title: "Data Processing Agreement",
    eyebrow: "GDPR",
    slug: "data-processing-agreement",
    href: "/legal/data-processing-agreement",
    filename: "04_DATA_PROCESSING_AGREEMENT_v1.md",
    description: "DPA rules, GDPR alignment, subprocessing standards, and personal data management policies.",
    version: LEGAL_VERSION,
    effectiveDate: LEGAL_EFFECTIVE_DATE,
    lastUpdated: LEGAL_LAST_UPDATED,
    showInFooter: true,
    iconName: "Database",
  },
  {
    title: "Refund & Cancellation",
    eyebrow: "BILLING",
    slug: "refund-cancellation",
    href: "/legal/refund-cancellation",
    filename: "05_REFUND_CANCELLATION_POLICY_v1.md",
    description: "Refund criteria, cancellations, project termination rules, and billing modifications.",
    version: LEGAL_VERSION,
    effectiveDate: LEGAL_EFFECTIVE_DATE,
    lastUpdated: LEGAL_LAST_UPDATED,
    showInFooter: true,
    iconName: "RefreshCcw",
  },
  {
    title: "Cookie Policy",
    eyebrow: "TRACKING",
    slug: "cookie-policy",
    href: "/legal/cookie-policy",
    filename: "06_COOKIE_POLICY_v1.md",
    description: "Detailed information about cookie tags, local storage trackers, and analytical logs we run.",
    version: LEGAL_VERSION,
    effectiveDate: LEGAL_EFFECTIVE_DATE,
    lastUpdated: LEGAL_LAST_UPDATED,
    showInFooter: true,
    iconName: "Cookie",
  },
  {
    title: "Delivery & Fulfillment",
    eyebrow: "LOGISTICS",
    slug: "delivery-fulfillment",
    href: "/legal/delivery-fulfillment",
    filename: "07_DELIVERY_AND_FULFILLMENT_POLICY_v1.md",
    description: "Service delivery timelines, software handover steps, cloud deployment stages, and client approvals.",
    version: LEGAL_VERSION,
    effectiveDate: LEGAL_EFFECTIVE_DATE,
    lastUpdated: LEGAL_LAST_UPDATED,
    showInFooter: false,
    iconName: "Truck",
  },
  {
    title: "Company Information",
    eyebrow: "IDENTITY",
    slug: "company-information",
    href: "/legal/company-information",
    filename: "08_LEGAL_NOTICE_COMPANY_INFORMATION_v1.md",
    description: "Official legal registry details, corporate address, agent records, and contact options.",
    version: LEGAL_VERSION,
    effectiveDate: LEGAL_EFFECTIVE_DATE,
    lastUpdated: LEGAL_LAST_UPDATED,
    showInFooter: false,
    iconName: "Building2",
  },
  {
    title: "Subprocessors",
    eyebrow: "INFRASTRUCTURE",
    slug: "subprocessors",
    href: "/legal/subprocessors",
    filename: "09_SUBPROCESSOR_LIST_v1.md",
    description: "Authorized third-party processor services, cloud hosting nodes, and system sub-contractors.",
    version: LEGAL_VERSION,
    effectiveDate: LEGAL_EFFECTIVE_DATE,
    lastUpdated: LEGAL_LAST_UPDATED,
    showInFooter: false,
    iconName: "Server",
  },
  {
    title: "Security Statement",
    eyebrow: "SECURITY",
    slug: "security-statement",
    href: "/legal/security-statement",
    filename: "10_SECURITY_STATEMENT_v1.md",
    description: "Infrastructure safety, API encryptions, server protections, and data backup security reviews.",
    version: LEGAL_VERSION,
    effectiveDate: LEGAL_EFFECTIVE_DATE,
    lastUpdated: LEGAL_LAST_UPDATED,
    showInFooter: false,
    iconName: "Shield",
  },
  {
    title: "SLA & Support",
    eyebrow: "SUPPORT",
    slug: "sla-support",
    href: "/legal/sla-support",
    filename: "11_SLA_SUPPORT_POLICY_v1.md",
    description: "Systems availability agreements, response parameters, ticket routes, and support hours.",
    version: LEGAL_VERSION,
    effectiveDate: LEGAL_EFFECTIVE_DATE,
    lastUpdated: LEGAL_LAST_UPDATED,
    showInFooter: false,
    iconName: "LifeBuoy",
  },
  {
    title: "DMCA Policy",
    eyebrow: "COPYRIGHT",
    slug: "dmca-policy",
    href: "/legal/dmca-policy",
    filename: "12_DMCA_COPYRIGHT_COMPLAINTS_POLICY_v1.md",
    description: "DMCA compliance, copyright notices, takedown steps, and copyright reporting procedures.",
    version: LEGAL_VERSION,
    effectiveDate: LEGAL_EFFECTIVE_DATE,
    lastUpdated: LEGAL_LAST_UPDATED,
    showInFooter: false,
    iconName: "Copyright",
  },
];
