"use client";

import * as React from "react";
import { Container } from "../ui/layout";
import { NAV_LINKS } from "@/content/navigation";
import { LEGAL_DOCUMENTS } from "@/content/legal";
import { Mail } from "lucide-react";
import { CookieSettingsButton } from "./CookieSettingsButton";

// Services Footer Links
const SERVICES_FOOTER_LINKS = [
  { label: "Web Design", href: "/services/web-design" },
  { label: "Web / SaaS Applications", href: "/services/web-saas-applications" },
  { label: "Automations & Workflows", href: "/services/automations-workflows" },
  { label: "Integrations", href: "/services/integrations" },
  { label: "Cloud & Hosting", href: "/services/cloud-hosting" },
  { label: "Technical Consulting", href: "/services/technical-consulting" },
];

export function Footer() {
  const currentYear = 2026;

  // Render only top 6 legal links + "More legal documents" link
  const footerLegalLinks = LEGAL_DOCUMENTS.filter((doc) => doc.showInFooter);

  return (
    <footer 
      className="w-full border-t border-border-soft-val bg-[#0a101d] py-16 text-text-muted-gray shadow-[0_-10px_30px_-5px_rgba(249,126,26,0.05)]"
      aria-label="DXBMARK footer"
    >
      <Container className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
        {/* Brand Column (Wider - Spans 2 columns on large screens) */}
        <div className="flex flex-col gap-6 lg:col-span-2 text-left">
          <div className="flex items-center gap-1.5 font-sans text-2xl font-black tracking-tight text-text-main">
            DXB<span className="text-brand-primary">MARK</span>
            <span className="h-2.5 w-2.5 rounded-full bg-brand-primary animate-pulse" />
          </div>
          
          <p className="text-xs font-bold tracking-widest text-brand-primary uppercase">
            BUILD. SCALE. RUN.
          </p>
          
          <p className="font-body text-sm text-text-sub leading-relaxed max-w-sm">
            Technology and digital systems company for SaaS, software, cloud infrastructure, automation, and business platforms.
          </p>

          <div className="flex flex-col gap-3">
            {/* Email Badge */}
            <a 
              href="mailto:info@dxbmark.com" 
              className="inline-flex items-center gap-2 text-sm text-text-sub hover:text-brand-primary transition-colors max-w-max"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              <span>info@dxbmark.com</span>
            </a>

            {/* Google Reviews Badge */}
            <a 
              href="https://g.page/r/CeDd6_H58zunEAE/review" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 rounded-radius-default border border-border-soft-val bg-white/5 px-3 py-1.5 text-xs text-text-sub hover:text-brand-primary hover:border-brand-primary/50 transition-all max-w-max"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/icons/google-g-logo.svg" alt="G" className="h-4 w-4" onError={(e) => {
                e.currentTarget.style.display = "none";
                const fallback = document.getElementById("google-g-fallback");
                if (fallback) fallback.style.display = "inline";
              }} />
              <span id="google-g-fallback" style={{ display: "none" }} className="font-bold text-brand-primary">G</span>
              <span>Google Reviews</span>
              <span className="text-brand-secondary font-medium">★★★★★ Rate Us</span>
            </a>
          </div>
        </div>

        {/* Navigate Column */}
        <div className="flex flex-col gap-4 text-left">
          <h4 className="font-sans text-sm font-bold text-text-main uppercase tracking-wider">
            Navigate
          </h4>
          <nav className="flex flex-col gap-2.5 font-label text-sm text-text-sub">
            {NAV_LINKS.map((link) => (
              <a 
                key={link.href} 
                href={link.href}
                className="hover:text-brand-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Services Column */}
        <div className="flex flex-col gap-4 text-left">
          <h4 className="font-sans text-sm font-bold text-text-main uppercase tracking-wider">
            Services
          </h4>
          <nav className="flex flex-col gap-2.5 font-body text-sm text-text-sub">
            {SERVICES_FOOTER_LINKS.map((link) => (
              <a 
                key={link.href} 
                href={link.href}
                className="hover:text-brand-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Legal Column */}
        <div className="flex flex-col gap-4 text-left">
          <h4 className="font-sans text-sm font-bold text-text-main uppercase tracking-wider">
            Legal
          </h4>
          <nav className="flex flex-col gap-2.5 font-body text-xs text-text-sub grid grid-cols-1 gap-y-2">
            {footerLegalLinks.map((link) => (
              <a 
                key={link.href} 
                href={link.href}
                className="hover:text-brand-primary transition-colors"
              >
                {link.title}
              </a>
            ))}
            <CookieSettingsButton />
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a 
              href="/legal"
              className="hover:text-brand-primary transition-colors font-bold text-text-main mt-1 block"
            >
              More legal documents &rarr;
            </a>
          </nav>
        </div>
      </Container>

      {/* Bottom Bar Divider */}
      <hr className="my-12 border-border-soft-val max-w-[1200px] mx-auto" />

      {/* Bottom Bar Container */}
      <Container className="flex flex-col items-center justify-center text-center gap-6">
        {/* Social Icons Centered in Circular Glass Buttons */}
        <div className="flex items-center justify-center gap-4">
          <a 
            href="https://linkedin.com/company/dxbmark" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="LinkedIn"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border-soft-val bg-white/5 text-text-muted-gray hover:bg-brand-glow hover:text-brand-primary hover:border-brand-primary/30 transition-all"
          >
            <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
          <a 
            href="https://github.com/dxbmark" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="GitHub"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border-soft-val bg-white/5 text-text-muted-gray hover:bg-brand-glow hover:text-brand-primary hover:border-brand-primary/30 transition-all"
          >
            <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
          </a>
          <a 
            href="https://wa.me/message/U3YIQY6245GWD1" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="WhatsApp"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border-soft-val bg-white/5 text-text-muted-gray hover:bg-brand-glow hover:text-brand-primary hover:border-brand-primary/30 transition-all"
          >
            <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </a>
          <a 
            href="https://www.instagram.com/dxbmarkllc" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="Instagram"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border-soft-val bg-white/5 text-text-muted-gray hover:bg-brand-glow hover:text-brand-primary hover:border-brand-primary/30 transition-all"
          >
            <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
          <a 
            href="https://www.facebook.com/dxbmark" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="Facebook"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border-soft-val bg-white/5 text-text-muted-gray hover:bg-brand-glow hover:text-brand-primary hover:border-brand-primary/30 transition-all"
          >
            <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </a>
        </div>

        {/* Copyright centered below */}
        <p className="font-body text-xs text-text-muted-gray">
          &copy; {currentYear} DXBMARK LLC. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
