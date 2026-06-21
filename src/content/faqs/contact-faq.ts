export type FAQLink = {
  label: string;
  href: string;
};

export type FAQItem = {
  id: string;
  question: string;
  answer: string;
  bullets?: string[];
  closing?: string;
  links?: FAQLink[];
};

export const contactFaqs: FAQItem[] = [
  {
    id: '01',
    question: 'Will you help solve my business problem?',
    answer: 'We start by understanding the core challenge before proposing any technical implementation or custom services.',
    bullets: [
      'Business goal identification',
      'Operational workflow review',
      'Technical gap identification',
      'Practical recommendations'
    ],
    closing: 'If we are not the right fit for your project, we will tell you directly.'
  },
  {
    id: '02',
    question: 'Do I need a full technical brief before contacting you?',
    answer: 'No. A brief outline of what you want to build, improve, automate, or resolve is enough to start. We will help define the requirements.',
    bullets: [
      'Business goal',
      'Current system or website',
      'Timeline',
      'Main challenge'
    ]
  },
  {
    id: '03',
    question: 'What happens after I submit the contact form?',
    answer: 'Our team reviews your inquiry, routes it to the correct department, and responds with the next practical step, usually within one business day.',
    bullets: [
      'Review request',
      'Route to the right team',
      'Reply with next step',
      'Ask for missing details if needed'
    ]
  },
  {
    id: '04',
    question: 'Can you improve an existing website, system, or workflow?',
    answer: 'Yes. We review existing applications, cloud configurations, integrations, and hosting setups to determine the most cost-effective path forward.',
    bullets: [
      'Audit current setup',
      'Identify friction',
      'Recommend optimize / rebuild / integrate',
      'Prioritize quick wins'
    ]
  },
  {
    id: '05',
    question: 'What type of projects can you handle?',
    answer: 'We deliver software engineering, SaaS platforms, cloud infrastructure, managed hosting, web systems, portals, CRM integrations, and automation workflows.',
    bullets: [
      'Websites and web apps',
      'SaaS and portals',
      'Automation and workflows',
      'Cloud, hosting, integrations'
    ]
  },
  {
    id: '06',
    question: 'How do we handle customer data?',
    answer: 'We use customer information only for agreed service purposes.',
    bullets: [
      'Service delivery',
      'Support',
      'Billing and security',
      'Project operations'
    ],
    closing: 'We do not sell personal data or use it for unrelated marketing.',
    links: [
      {
        label: 'Read the Privacy Policy.',
        href: '/legal/privacy-policy'
      }
    ]
  },
  {
    id: '07',
    question: 'Do we train AI on client data?',
    answer: 'No. We do not use client personal, payment, confidential project, production, or customer-owned business data to train public AI models.',
    closing: 'AI-assisted workflows must follow the applicable agreement, privacy rules, security requirements, and customer authorization.',
    links: [
      {
        label: 'Security Statement',
        href: '/legal/security-statement'
      },
      {
        label: 'Privacy Policy',
        href: '/legal/privacy-policy'
      }
    ]
  },
  {
    id: '08',
    question: 'Do you have a refund or cancellation policy?',
    answer: 'Yes. Refund and cancellation terms depend on the service type, payment stage, and the written agreement.',
    bullets: [
      'Depends on service type',
      'Depends on project stage',
      'Written agreement controls',
      'Started work may be non-refundable'
    ],
    closing: 'Custom project deposits, setup, onboarding, discovery, and development fees may be non-refundable once work has started, unless required by law or agreed otherwise.',
    links: [
      {
        label: 'Read the Refund and Cancellation Policy.',
        href: '/legal/refund-cancellation'
      }
    ]
  }
];
