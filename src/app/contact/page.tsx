import type { Metadata } from "next";
import ContactSection from "@/components/contact/ContactSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { contactFaqs } from "@/content/faqs/contact-faq";
import { buildContactJsonLd } from "@/lib/seo/structured-data";
import { createPageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = createPageMetadata({
  title: { absolute: "Contact DXBMARK LLC | Software, SaaS, Cloud & Automation" },
  description:
    "Contact DXBMARK LLC for software development, SaaS platforms, cloud infrastructure, automation, integrations, and technical consulting.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd data={buildContactJsonLd(contactFaqs)} />
      <ContactSection />
    </>
  );
}
