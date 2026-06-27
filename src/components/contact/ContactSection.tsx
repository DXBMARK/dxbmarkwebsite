"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { ArrowRight, Mail, Phone, Clock, MapPin, Star } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getCountries, getCountryCallingCode, parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js/max";

import GlobeWireframe from "@/components/ui/globe-wireframe";
import { SeparatorPro } from "@/components/ui/separator-pro";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/layout";
import { Glow } from "@/components/visual";
import { ContactFAQStack } from "@/components/contact/ContactFAQStack";

// Conditional Form Option Constants
const SERVICE_OPTIONS = [
  "Business Website",
  "Company / Corporate Site",
  "WordPress Website",
  "eCommerce Platform",
  "Web / SaaS Application",
  "Mobile App",
  "Custom Business System",
  "Automation & Workflow",
  "Integrations",
  "Sales & CRM Systems",
  "Analytics & Reporting",
  "Cloud & Hosting",
  "Maintenance & Support",
  "Technical Consulting",
  "Not Sure Yet",
  "Other"
];

const BUDGET_OPTIONS = [
  "Less than $3,000",
  "$3,000 – $5,000",
  "$5,000 – $10,000",
  "$10,000 – $25,000",
  "$25,000 – $50,000",
  "$50,000+",
  "Not sure yet"
];

const TIMELINE_OPTIONS = [
  "As soon as possible",
  "Within 1 month",
  "1–3 months",
  "3–6 months",
  "Flexible / Not sure"
];

const ATTRIBUTION_OPTIONS = [
  "Google Search",
  "Google Business Profile",
  "LinkedIn",
  "Facebook / Instagram",
  "Referral",
  "GitHub",
  "Existing Client",
  "Other"
];

const BUSINESS_AGE_OPTIONS = [
  "Less than 1 year",
  "1–3 years",
  "3–5 years",
  "5+ years"
];

const PRIVACY_REQUEST_OPTIONS = [
  "Access request",
  "Correction request",
  "Deletion request",
  "Data processing question",
  "Other"
];

const PRIORITY_OPTIONS = [
  "Normal",
  "High",
  "Urgent"
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLDivElement | null>(null);
  const hubRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);

  const [isDesktop, setIsDesktop] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Validation & notices state
  const [validationError, setValidationError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [routingNoticeVisible, setRoutingNoticeVisible] = useState(false);

  // Form base states
  const [messageType, setMessageType] = useState<string>("");
  const [preferredContactMethod, setPreferredContactMethod] = useState<string>("Email");
  const [preferredLanguage, setPreferredLanguage] = useState<string>("");

  // Contact Details states
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Linked phone and country validation states
  const [countryCode, setCountryCode] = useState<CountryCode>("AE");
  const [countryName, setCountryName] = useState("United Arab Emirates");
  const [callingCode, setCallingCode] = useState("+971");
  const [phoneE164, setPhoneE164] = useState("");
  const [phoneValidationType, setPhoneValidationType] = useState("");

  // Generate list of countries dynamically using libphonenumber-js and native display names
  const countriesList = useMemo(() => {
    const codes = getCountries();
    let displayNames: Intl.DisplayNames | null = null;
    try {
      displayNames = new Intl.DisplayNames(['en'], { type: 'region' });
    } catch {}

    const fallbackNames: Record<string, string> = {
      AE: "United Arab Emirates",
      EG: "Egypt",
      GB: "United Kingdom",
      US: "United States"
    };

    const list = codes.map(code => {
      let name = code as string;
      if (displayNames) {
        try {
          name = displayNames.of(code) || code;
        } catch {
          name = fallbackNames[code] || code;
        }
      } else {
        name = fallbackNames[code] || code;
      }
      
      let callingCodeVal = '';
      try {
        callingCodeVal = getCountryCallingCode(code);
      } catch {}
      
      // Flag emoji generator helper
      let emoji = '';
      try {
        const codePoints = code.toUpperCase().split('').map(char => 127397 + char.charCodeAt(0));
        emoji = String.fromCodePoint(...codePoints);
      } catch {}

      return {
        code: code as CountryCode,
        name,
        callingCode: callingCodeVal ? `+${callingCodeVal}` : '',
        emoji
      };
    }).filter(c => c.callingCode);

    // Pre-sort and pin key markets: AE, EG, GB, US
    const pinnedCodes: CountryCode[] = ['AE', 'EG', 'GB', 'US'];
    const pinned = list.filter(c => pinnedCodes.includes(c.code));
    pinned.sort((a, b) => pinnedCodes.indexOf(a.code) - pinnedCodes.indexOf(b.code));
    
    const others = list.filter(c => !pinnedCodes.includes(c.code));
    others.sort((a, b) => a.name.localeCompare(b.name));

    return [...pinned, ...others];
  }, []);

  // Validate phone number locally and normalize it
  // Some countries do not expose strict mobile type metadata. Server-side validation must repeat this check before production routing.
  const validatePhoneInput = (val: string, cc: CountryCode, callCode: string): boolean => {
    const trimmed = val.trim();
    if (!trimmed) {
      setPhoneE164("");
      setPhoneValidationType("");
      return false;
    }

    let searchVal = trimmed;
    // Prefix calling code if not already present
    if (!searchVal.startsWith('+') && !searchVal.startsWith(callCode)) {
      searchVal = `${callCode}${searchVal}`;
    } else if (!searchVal.startsWith('+') && searchVal.startsWith(callCode.replace('+', ''))) {
      searchVal = `+${searchVal}`;
    }

    try {
      const parsed = parsePhoneNumberFromString(searchVal, cc);
      if (!parsed || !parsed.isValid()) {
        setPhoneE164("");
        setPhoneValidationType("");
        return false;
      }

      const type = parsed.getType();
      const isValidType = type === "MOBILE" || type === "FIXED_LINE_OR_MOBILE";
      
      if (!isValidType) {
        setPhoneE164("");
        setPhoneValidationType("");
        return false;
      }

      setPhoneE164(parsed.number);
      setPhoneValidationType(type || "MOBILE");
      return true;
    } catch {
      setPhoneE164("");
      setPhoneValidationType("");
      return false;
    }
  };

  // Conditional fields states - New Project
  const [newProjectStep, setNewProjectStep] = useState<number>(0);
  const [hasWebsite, setHasWebsite] = useState<string | null>(null);
  const [businessAge, setBusinessAge] = useState<string | null>(null);
  const [websiteUrl, setWebsiteUrl] = useState<string>("");
  const [instagramHandle, setInstagramHandle] = useState<string>("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [budget, setBudget] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<string | null>(null);
  const [projectMessage, setProjectMessage] = useState<string>("");
  const [businessChallenge, setBusinessChallenge] = useState<string>("");
  const [attribution, setAttribution] = useState<string | null>(null);

  // Conditional fields states - Support Request
  const [isExistingClient, setIsExistingClient] = useState<string | null>(null);
  const [priority, setPriority] = useState<string | null>(null);

  // Conditional fields states - Privacy Request
  const [privacyRequestType, setPrivacyRequestType] = useState<string | null>(null);

  // Consent checkbox state
  const [consentAccepted, setConsentAccepted] = useState<boolean>(false);

  // Future Backend Payload Builder
  // Phase 2B is UI-only.
  // Future backend must validate all fields server-side.
  // Future email routing must use a DXBMARK-owned sender.
  // Customer email must be used as Reply-To, not From.
  // Future Turnstile token must be verified server-side before email sending, CRM routing, or storage.
  const buildContactPayload = () => {
    return {
      messageType,
      contact: {
        fullName,
        company,
        email,
        phone,
        countryCode,
        countryName,
        callingCode,
        phoneE164,
        phoneValidationType,
        preferredContactMethod,
        preferredLanguage,
      },
      routingTarget: routingTargets[messageType] || "info@dxbmark.com",
      projectDetails: {
        hasWebsite,
        businessAge,
        selectedServices,
        budget,
        timeline,
        attribution,
        websiteUrl: hasWebsite === "Yes" ? websiteUrl : "",
        instagramHandle,
        projectMessage,
        businessChallenge,
      },
      supportDetails: {
        isExistingClient,
        priority,
      },
      privacyDetails: {
        privacyRequestType,
      },
      consentAccepted,
      submittedAt: new Date().toISOString(),
    };
  };

  const routingTargets: Record<string, string> = {
    "New Project": "sales@dxbmark.com",
    "General Inquiry": "info@dxbmark.com",
    "Support Request": "support@dxbmark.com",
    "Complaint": "support@dxbmark.com",
    "Billing / Accounts": "accounts@dxbmark.com",
    "Privacy Request": "privacy@dxbmark.com",
    "Legal Matter": "legal@dxbmark.com",
    "Partnership / Collaboration": "sales@dxbmark.com",
  };

  useEffect(() => {
    const checkViewport = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkViewport();
    window.addEventListener("resize", checkViewport);
    
    const raf = requestAnimationFrame(() => {
      setMounted(true);
    });

    return () => {
      window.removeEventListener("resize", checkViewport);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        },
      );

      gsap.fromTo(
        hubRef.current,
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: hubRef.current,
            start: "top 85%",
          },
        },
      );

      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay: 0.18,
          ease: "power2.out",
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 85%",
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const canShowSecurityAndSubmit = (() => {
    if (messageType === "") return false;
    if (messageType === "New Project") {
      const isStep3 = newProjectStep === 3;
      const isWebsiteSelected = hasWebsite !== null;
      const isUrlOk = hasWebsite === "Yes" ? websiteUrl.trim() !== "" : true;
      const hasServices = selectedServices.length > 0;
      const hasMessage = projectMessage.trim() !== "";
      return isStep3 && isWebsiteSelected && isUrlOk && hasServices && hasMessage;
    }
    return true;
  })();

  const handleContinue = () => {
    const errors: Record<string, string> = {};

    // Validate current step fields
    if (newProjectStep === 0) {
      if (hasWebsite === null) {
        errors.hasWebsite = "Please select whether you have a website";
      }
      if (hasWebsite === "Yes" && !websiteUrl.trim()) {
        errors.websiteUrl = "Please enter your website URL or domain";
      }
      if (businessAge === null) {
        errors.businessAge = "Please select how many years you have been in business";
      }
    } else if (newProjectStep === 1) {
      if (selectedServices.length === 0) {
        errors.selectedServices = "Please select at least one service";
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors((prev) => ({ ...prev, ...errors }));
      return;
    }

    // If no errors for current step, clear step-related errors and go to next step
    setFormErrors((prev) => {
      const copy = { ...prev };
      if (newProjectStep === 0) {
        delete copy.hasWebsite;
        delete copy.websiteUrl;
        delete copy.businessAge;
      } else if (newProjectStep === 1) {
        delete copy.selectedServices;
      }
      return copy;
    });
    setNewProjectStep((prev) => prev + 1);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError(null);
    setFormErrors({});
    setRoutingNoticeVisible(false);

    const errors: Record<string, string> = {};

    // 1. Validate Section 1 Contact Details
    if (!fullName.trim()) {
      errors.fullName = "Full name is required";
    }
    if (!email.trim()) {
      errors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!phone.trim()) {
      errors.phone = "Phone number is required";
    } else {
      const isPhoneValid = validatePhoneInput(phone, countryCode, callingCode);
      if (!isPhoneValid) {
        errors.phone = "Please enter a valid mobile number for the selected country.";
      }
    }
    if (!countryCode) {
      errors.country = "Country / Region is required";
    }
    if (!preferredLanguage) {
      errors.preferredLanguage = "Preferred language is required";
    }

    // 2. Validate Section 2 Message Type
    if (!messageType) {
      errors.messageType = "Message type is required";
    }

    // 3. Validate Section 3 Conditional Details (if New Project)
    if (messageType === "New Project") {
      if (hasWebsite === null) {
        errors.hasWebsite = "Please select whether you have a website";
      }
      if (hasWebsite === "Yes" && !websiteUrl.trim()) {
        errors.websiteUrl = "Please enter your website URL or domain";
      }
      if (businessAge === null) {
        errors.businessAge = "Please select how many years you have been in business";
      }
      if (selectedServices.length === 0) {
        errors.selectedServices = "Please select at least one service";
      }
      if (!projectMessage.trim()) {
        errors.projectMessage = "Project details are required";
      }

      // If there are errors in previous steps, jump back to the first step containing an error
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        if (errors.hasWebsite || errors.businessAge || errors.websiteUrl) {
          setNewProjectStep(0);
        } else if (errors.selectedServices) {
          setNewProjectStep(1);
        } else if (errors.projectMessage) {
          setNewProjectStep(3);
        }
        return;
      }
    }

    // If there are errors in general contact fields, show them and stop
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // 4. Validate Consent
    if (!consentAccepted) {
      setValidationError("Please confirm the Terms of Service and Privacy Policy acknowledgement before continuing.");
      return;
    }

    const payload = buildContactPayload();
    console.debug("Form is backend-ready. Local payload built:", payload);

    setRoutingNoticeVisible(true);
  };

  // Local token-based UI styling classes
  const fieldClassName = "w-full rounded-radius-md border border-border-soft-val bg-white/[0.04] px-4 py-3 text-sm text-text-main placeholder:text-text-muted-gray/65 outline-none transition-all duration-200 focus:border-brand-primary/58 focus:bg-white/[0.08] focus:ring-4 focus:ring-brand-primary/10";
  const cardClassName = "rounded-radius-xl border border-border-soft-val bg-white/[0.03] p-6 shadow-shadow-card backdrop-blur-xl transition-all duration-300 hover:border-border-strong-val text-left flex flex-col justify-between";
  const labelClassName = "text-xs font-bold uppercase tracking-[0.18em] text-text-dark-gray mb-1.5 block text-left";
  
  const chipClassName = "px-4 py-2.5 rounded-radius-default border border-border-soft-val bg-white/[0.02] text-xs font-medium text-text-sub hover:bg-white/[0.06] hover:text-text-main focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all duration-200 cursor-pointer text-center";
  const activeChipClassName = "px-4 py-2.5 rounded-radius-default border border-brand-primary/60 bg-brand-primary/10 text-xs font-bold text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all duration-200 cursor-pointer text-center";
  
  const sectionWrapperClassName = "border border-border-soft-val/40 bg-white/[0.01] p-5 rounded-radius-xl mb-6 text-left flex flex-col gap-5";
  const sectionTitleClassName = "text-sm font-bold text-text-main border-b border-border-soft-val/30 pb-2 mb-2 uppercase tracking-wider";

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative min-h-screen w-full overflow-hidden bg-background-slate px-4 pt-32 pb-24 text-text-main sm:px-6 lg:px-8 sm:pb-28 lg:pb-32 scroll-mt-32"
    >
      <Glow className="absolute inset-0 z-0" aria-hidden="true" />

      <Container className="relative z-10">
        {/* 1. Contact Intro */}
        <div ref={headingRef} className="mx-auto mb-12 max-w-3xl text-center">
          <div className="hero-badge-elem mx-auto mb-5 relative z-0 bg-white/5 overflow-hidden p-px inline-flex items-center justify-center rounded-full transition duration-300">
            <div 
              className="absolute -left-1/2 -top-1/2 w-[200%] h-[200%] bg-no-repeat bg-[100%_50%] bg-[length:50%_30%] blur-[4px] animate-[spin_6s_linear_infinite]"
              style={{
                backgroundImage: "linear-gradient(to right, var(--color-accent-primary), var(--color-accent-secondary))",
                transformOrigin: "center",
              }}
              aria-hidden="true"
            />
            <div className="relative flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0d2130]/95 backdrop-blur-md border border-border-soft-val shadow-inner">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-primary animate-pulse shadow-[0_0_6px_var(--color-accent-primary)]" aria-hidden="true" />
              <span className="font-label text-[10px] font-bold text-text-main uppercase tracking-widest">
                GET IN TOUCH
              </span>
            </div>
          </div>

          <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-[4.25rem] font-black tracking-tight leading-[1.05]">
            <span className="block text-text-main">
              Let&apos;s Build
            </span>
            <span className="block mt-2 bg-gradient-to-r from-text-main via-brand-primary to-brand-secondary bg-clip-text text-transparent pb-1">
              Something Great.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl font-body text-xs sm:text-sm md:text-base text-text-sub leading-relaxed">
            Ready to start your project, ask a question, or reach the right department? Contact DXBMARK through the form below or use the direct channels provided. Most business inquiries are reviewed within one business day during operating hours, with consideration for time zone differences.
          </p>
        </div>

        {/* 2. Contact Hub Layout */}
        <div ref={hubRef} id="contact-hub" className="mx-auto mb-16 grid max-w-6xl grid-cols-1 items-stretch gap-8 lg:grid-cols-12 scroll-mt-32 pt-4">
          
          {/* Left: Contact info columns (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Card A: Phone & WhatsApp */}
            <div className={cardClassName}>
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <Phone className="h-5 w-5 text-brand-primary" aria-hidden="true" />
                  <h3 className="font-sans text-lg font-bold text-text-main">Phone & WhatsApp</h3>
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-text-dark-gray uppercase tracking-wider block mb-1">UAE Support</span>
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <a href="tel:+971505121583" className="font-label font-bold text-sm text-text-main hover:text-brand-primary transition-colors" aria-label="Call UAE Phone +971 50 512 1583">+971 50 512 1583</a>
                        <span className="text-[9px] px-2 py-0.5 rounded-radius-full font-bold uppercase tracking-wider bg-brand-primary/10 border border-brand-primary/20 text-brand-primary">
                          <a href="https://wa.me/971505121583" target="_blank" rel="noopener noreferrer" className="hover:underline" aria-label="Chat with UAE Support +971 50 512 1583 on WhatsApp">WhatsApp</a> & Calls
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <a href="tel:+971588931217" className="font-label font-bold text-sm text-text-main hover:text-brand-primary transition-colors" aria-label="Call UAE Phone +971 58 893 1217">+971 58 893 1217</a>
                        <span className="text-[9px] px-2 py-0.5 rounded-radius-full font-bold uppercase tracking-wider bg-white/5 border border-border-soft-val text-text-sub">Calls only</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-border-soft-val pt-3">
                    <span className="text-[10px] font-bold text-text-dark-gray uppercase tracking-wider block mb-1">Egypt Office</span>
                    <div className="flex flex-wrap items-center gap-2">
                      <a href="https://wa.me/201273574131" target="_blank" rel="noopener noreferrer" className="font-label font-bold text-sm text-text-main hover:text-brand-primary transition-colors" aria-label="Chat with Egypt Office +20 127 357 4131 on WhatsApp">+20 127 357 4131</a>
                      <span className="text-[9px] px-2 py-0.5 rounded-radius-full font-bold uppercase tracking-wider bg-brand-primary/10 border border-brand-primary/20 text-brand-primary">WhatsApp only</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card B: Hours of Operation */}
            <div className={cardClassName}>
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <Clock className="h-5 w-5 text-brand-primary" aria-hidden="true" />
                  <h3 className="font-sans text-lg font-bold text-text-main">Hours of Operation</h3>
                </div>
                <div className="flex flex-col gap-2 font-body text-sm text-text-sub">
                  <div className="flex justify-between border-b border-border-soft-val pb-2">
                    <span>Monday – Saturday</span>
                    <span className="font-bold text-text-main">09:00 – 18:00</span>
                  </div>
                  <div className="flex justify-between border-b border-border-soft-val pb-2">
                    <span>Sunday</span>
                    <span className="text-text-dark-gray font-bold">Closed</span>
                  </div>
                  <div className="pt-1">
                    <span className="text-xs text-text-dark-gray block">GST — Gulf Standard Time (UAE / GMT+4)</span>
                    <p className="text-[11px] text-text-muted-gray mt-1 leading-relaxed">Operating hours are listed in Gulf Standard Time.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card C: Registered Address */}
            <div className={cardClassName}>
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <MapPin className="h-5 w-5 text-brand-primary" aria-hidden="true" />
                  <h3 className="font-sans text-lg font-bold text-text-main">Registered Address</h3>
                </div>
                <div className="font-body text-sm text-text-sub leading-relaxed">
                  <p className="font-bold text-text-main">DXBMARK LLC</p>
                  <p>30 N Gould St, Ste R</p>
                  <p>Sheridan, Wyoming 82801</p>
                  <p>United States</p>
                  <div className="mt-3 pt-2 border-t border-border-soft-val space-y-1.5">
                    <p className="text-[11px] text-text-muted-gray leading-relaxed">
                      DXBMARK LLC is a remote-first digital services company. We provide support online by email and phone. We do not operate a public customer-facing office.
                    </p>
                    <p className="text-xs text-text-dark-gray italic">Wyoming LLC · Operating globally from UAE</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card D: Find Us Online & Google Review CTA */}
            <div className={cardClassName}>
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <Star className="h-5 w-5 text-brand-primary" aria-hidden="true" />
                  <h3 className="font-sans text-lg font-bold text-text-main">Find Us Online</h3>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2.5">
                    <a href="https://linkedin.com/company/dxbmark" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-2.5 rounded-radius-default bg-white/5 border border-border-soft-val text-text-sub hover:bg-brand-primary/10 hover:border-brand-primary/45 hover:text-text-main transition-all duration-300" aria-label="LinkedIn Profile">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </a>
                    <a href="https://share.google/ukdlkEaeQyY8yI51l" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-2.5 rounded-radius-default bg-white/5 border border-border-soft-val text-text-sub hover:bg-brand-primary/10 hover:border-brand-primary/45 hover:text-text-main transition-all duration-300" aria-label="Google Business Profile">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M13.365 2.83a9.25 9.25 0 0 1 4.744 2.089c.338.284.336.794.024 1.106l-1.616 1.616c-.312.312-.816.306-1.171.044a5.365 5.365 0 1 0 1.615 6.705h-3.91a.8.8 0 0 1-.8-.8V11.3a.8.8 0 0 1 .8-.8h7.493c.316 0 .61.186.681.495c.313 1.362-.125 3.246-.158 3.384l-.004.016c-.528 1.963-1.661 3.706-3.274 4.944a9.25 9.25 0 1 1-4.424-16.51"/>
                      </svg>
                    </a>
                    <a href="https://github.com/dxbmark" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-2.5 rounded-radius-default bg-white/5 border border-border-soft-val text-text-sub hover:bg-brand-primary/10 hover:border-brand-primary/45 hover:text-text-main transition-all duration-300" aria-label="GitHub Profile">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                      </svg>
                    </a>
                    <a href="https://www.facebook.com/dxbmark" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-2.5 rounded-radius-default bg-white/5 border border-border-soft-val text-text-sub hover:bg-brand-primary/10 hover:border-brand-primary/45 hover:text-text-main transition-all duration-300" aria-label="Facebook Profile">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    </a>
                    <a href="https://www.instagram.com/dxbmarkllc" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-2.5 rounded-radius-default bg-white/5 border border-border-soft-val text-text-sub hover:bg-brand-primary/10 hover:border-brand-primary/45 hover:text-text-main transition-all duration-300" aria-label="Instagram Profile">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    </a>
                  </div>
                  
                  <a href="https://g.page/r/CeDd6_H58zunEAE/review" target="_blank" rel="noopener noreferrer" className="group block p-3 rounded-radius-lg border border-brand-primary/20 bg-brand-primary/[0.02] hover:bg-brand-primary/[0.06] transition-all duration-300 text-left">
                    <div className="font-sans font-bold text-xs text-brand-primary">Review DXBMARK on Google</div>
                    <div className="font-body text-[11px] text-text-muted-gray mt-0.5 flex items-center gap-1">
                      <span className="text-yellow-500 font-sans" aria-hidden="true">★★★★★</span> Share your experience
                    </div>
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Right: Globe Operations Map (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-radius-xl border border-border-soft-val bg-white/[0.03] p-6 shadow-shadow-card backdrop-blur-xl transition-all duration-300 hover:border-border-strong-val relative overflow-hidden min-h-[280px]">
            {/* Globe container: pointer-events-auto for desktop interaction */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-auto" aria-hidden="true">
              <GlobeWireframe
                className="absolute left-1/2 top-1/2 aspect-square w-[115%] max-w-none -translate-x-1/2 -translate-y-1/2 text-brand-primary/60"
                variant="wireframesolid"
                autoRotate
                autoRotateSpeed={0.35}
                strokeWidth={0.55}
                graticuleOpacity={0.08}
                sphereOutlineWidth={1}
                rotateToLocation="dubai"
                enableInteraction={isDesktop}
              />
              {/* Decorative overlays must retain pointer-events-none to prevent blocking interaction */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background-slate via-background-slate/50 to-transparent" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--color-accent-glow),transparent_50%)]" />
            </div>

            <div className="relative z-10 flex flex-col justify-between h-full min-h-[220px] pointer-events-none">
              <div className="text-left pointer-events-auto">
                <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider bg-brand-primary/10 border border-brand-primary/20 px-2.5 py-1 rounded-radius-full inline-block mb-3">Global Operations</span>
                <h3 className="font-sans text-xl font-bold text-text-main">Worldwide Service</h3>
                <p className="mt-2 text-xs leading-relaxed text-text-muted-gray max-w-sm">
                  Providing custom engineering, automation, and managed hosting solutions to clients globally from our operations hub in the UAE.
                </p>
              </div>
              
              <div className="mt-auto pt-4 border-t border-border-soft-val/50 text-left bg-background-slate/60 backdrop-blur-sm p-3.5 rounded-radius-lg border border-border-soft-val pointer-events-auto">
                <p className="text-xs text-text-sub font-medium leading-relaxed">
                  Supporting businesses across UAE, Egypt, and international digital markets.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Card: Contact by Department (Full 12 cols span) */}
          <div className="lg:col-span-12 rounded-radius-xl border border-border-soft-val bg-white/[0.03] p-6 shadow-shadow-card backdrop-blur-xl transition-all duration-300 hover:border-border-strong-val text-left scroll-mt-32 pt-6">
            <div className="flex items-center gap-2.5 mb-4">
              <Mail className="h-5 w-5 text-brand-primary" aria-hidden="true" />
              <h3 className="font-sans text-lg font-bold text-text-main">Contact by Department</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { dept: "General", email: "info@dxbmark.com", desc: "General inquiries" },
                { dept: "Sales", email: "sales@dxbmark.com", desc: "Projects & pricing" },
                { dept: "Support", email: "support@dxbmark.com", desc: "Technical support" },
                { dept: "Accounts", email: "accounts@dxbmark.com", desc: "Billing & invoices" },
                { dept: "Privacy", email: "privacy@dxbmark.com", desc: "Data protection" },
                { dept: "Legal", email: "legal@dxbmark.com", desc: "Legal matters" }
              ].map(({ dept, email, desc }) => (
                <div key={email} className="p-3 rounded-radius-lg border border-border-soft-val bg-white/[0.01] hover:bg-white/[0.04] transition-colors duration-300">
                  <span className="text-[10px] font-bold text-text-dark-gray uppercase tracking-wider block mb-0.5">{dept}</span>
                  <a href={`mailto:${email}`} className="font-label font-bold text-xs text-brand-primary hover:underline block break-all" aria-label={`Email ${dept} department at ${email}`}>{email}</a>
                  <span className="text-[10px] text-text-muted-gray block mt-0.5">{desc}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 3. Send a Message Form */}
        <div
          ref={formRef}
          id="message-form"
          className="mx-auto max-w-6xl rounded-radius-xl border border-border-soft-val bg-white/[0.03] p-6 shadow-shadow-card backdrop-blur-xl sm:p-8 scroll-mt-32 pt-8"
        >
          <div className="text-left mb-6">
            <h2 className="text-2xl font-bold text-text-main">Send a message</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-text-muted-gray">
              Please fill in your details and select the nature of your request to continue.
            </p>
          </div>

          <SeparatorPro variant="dots" className="my-6" />

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Visual Section 1: Contact Details */}
            <div className={sectionWrapperClassName}>
              <h4 className={sectionTitleClassName}>1. Contact Details</h4>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="Full Name *">
                  <input
                    type="text"
                    name="fullName"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (formErrors.fullName) {
                        setFormErrors((prev) => {
                          const copy = { ...prev };
                          delete copy.fullName;
                          return copy;
                        });
                      }
                    }}
                    placeholder="Your name"
                    required
                    className={fieldClassName}
                  />
                  {formErrors.fullName && (
                    <span className="text-[11px] text-red-400 font-medium mt-1 block">
                      {formErrors.fullName}
                    </span>
                  )}
                </Field>

                <Field label="Company">
                  <input
                    type="text"
                    name="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Company name"
                    className={fieldClassName}
                  />
                </Field>

                <Field label="Email Address *">
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (formErrors.email) {
                        setFormErrors((prev) => {
                          const copy = { ...prev };
                          delete copy.email;
                          return copy;
                        });
                      }
                    }}
                    placeholder="you@company.com"
                    required
                    className={fieldClassName}
                  />
                  {formErrors.email && (
                    <span className="text-[11px] text-red-400 font-medium mt-1 block">
                      {formErrors.email}
                    </span>
                  )}
                </Field>

                <Field label="Country / Region *">
                  {!mounted ? (
                    <select className={fieldClassName} disabled>
                      <option className="bg-background-slate text-text-main">Loading regions...</option>
                    </select>
                  ) : (
                    <select
                      name="countryCode"
                      value={countryCode}
                      onChange={(e) => {
                        const code = e.target.value as CountryCode;
                        const selected = countriesList.find(c => c.code === code);
                        if (selected) {
                          setCountryCode(code);
                          setCountryName(selected.name);
                          setCallingCode(selected.callingCode);
                          
                          // Re-validate phone dynamically if it has value
                          if (phone.trim()) {
                            const isValid = validatePhoneInput(phone, code, selected.callingCode);
                            if (isValid) {
                              setFormErrors((prev) => {
                                const copy = { ...prev };
                                delete copy.phone;
                                return copy;
                              });
                            } else {
                              setFormErrors((prev) => ({
                                ...prev,
                                phone: "Please enter a valid mobile number for the selected country."
                              }));
                            }
                          }
                        }
                        
                        if (formErrors.country) {
                          setFormErrors((prev) => {
                            const copy = { ...prev };
                            delete copy.country;
                            return copy;
                          });
                        }
                      }}
                      className={fieldClassName}
                    >
                      <option value="" className="bg-background-slate text-text-main">Select Country / Region</option>
                      {countriesList.map((c) => (
                        <option key={c.code} value={c.code} className="bg-background-slate text-text-main">
                          {c.emoji} {c.name} ({c.callingCode})
                        </option>
                      ))}
                    </select>
                  )}
                  {formErrors.country && (
                    <span className="text-[11px] text-red-400 font-medium mt-1 block">
                      {formErrors.country}
                    </span>
                  )}
                </Field>

                <Field label="Phone Number *">
                  <input
                    type="tel"
                    name="phone"
                    value={phone}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPhone(val);
                      
                      // Validate dynamically as the user types
                      if (val.trim()) {
                        const isValid = validatePhoneInput(val, countryCode, callingCode);
                        if (isValid) {
                          setFormErrors((prev) => {
                            const copy = { ...prev };
                            delete copy.phone;
                            return copy;
                          });
                        }
                      } else {
                        setFormErrors((prev) => {
                          const copy = { ...prev };
                          delete copy.phone;
                          return copy;
                        });
                      }
                    }}
                    placeholder={`${callingCode} 50 000 0000`}
                    className={fieldClassName}
                  />
                  {formErrors.phone && (
                    <span className="text-[11px] text-red-400 font-medium mt-1 block">
                      {formErrors.phone}
                    </span>
                  )}
                </Field>

                <Field label="Preferred Contact Method *">
                  <select 
                    name="preferredContactMethod" 
                    required 
                    value={preferredContactMethod}
                    onChange={(e) => setPreferredContactMethod(e.target.value)}
                    className={fieldClassName}
                  >
                    <option value="Email" className="bg-background-slate text-text-main">Email</option>
                    <option value="Phone Call" className="bg-background-slate text-text-main">Phone Call</option>
                    <option value="WhatsApp" className="bg-background-slate text-text-main">WhatsApp</option>
                  </select>
                </Field>

                <Field label="Preferred Language *">
                  <select 
                    name="preferredLanguage" 
                    required 
                    value={preferredLanguage}
                    onChange={(e) => {
                      setPreferredLanguage(e.target.value);
                      if (formErrors.preferredLanguage) {
                        setFormErrors((prev) => {
                          const copy = { ...prev };
                          delete copy.preferredLanguage;
                          return copy;
                        });
                      }
                    }}
                    className={fieldClassName}
                  >
                    <option value="" className="bg-background-slate text-text-main">Select preferred language</option>
                    <option value="English" className="bg-background-slate text-text-main">English</option>
                    <option value="Arabic" className="bg-background-slate text-text-main">Arabic</option>
                    <option value="Either" className="bg-background-slate text-text-main">Either</option>
                  </select>
                  {formErrors.preferredLanguage && (
                    <span className="text-[11px] text-red-400 font-medium mt-1 block">
                      {formErrors.preferredLanguage}
                    </span>
                  )}
                </Field>
              </div>
            </div>

            {/* Visual Section 2: Message Routing */}
            <div className={sectionWrapperClassName}>
              <h4 className={sectionTitleClassName}>2. Message Routing</h4>
              <Field label="Message Type *">
                <select 
                  name="messageType" 
                  required 
                  value={messageType}
                  onChange={(e) => {
                    const val = e.target.value;
                    setMessageType(val);
                    setFormErrors({});
                    if (val !== "New Project") {
                      setNewProjectStep(0);
                    }
                  }}
                  className={fieldClassName}
                >
                  <option value="" className="bg-background-slate text-text-main">Select message type</option>
                  <option value="New Project" className="bg-background-slate text-text-main">New Project</option>
                  <option value="General Inquiry" className="bg-background-slate text-text-main">General Inquiry</option>
                  <option value="Support Request" className="bg-background-slate text-text-main">Support Request</option>
                  <option value="Complaint" className="bg-background-slate text-text-main">Complaint</option>
                  <option value="Billing / Accounts" className="bg-background-slate text-text-main">Billing / Accounts</option>
                  <option value="Privacy Request" className="bg-background-slate text-text-main">Privacy Request</option>
                  <option value="Legal Matter" className="bg-background-slate text-text-main">Legal Matter</option>
                  <option value="Partnership / Collaboration" className="bg-background-slate text-text-main">Partnership / Collaboration</option>
                </select>
                {messageType === "" && (
                  <span className="text-[11px] text-text-muted-gray/80 mt-1.5 block">
                    Select a message type to continue with the right form fields.
                  </span>
                )}
              </Field>
            </div>

            {/* Visual Section 3: Conditional Details */}
            {messageType !== "" && (
              <div className={sectionWrapperClassName}>
                <h4 className={sectionTitleClassName}>3. Conditional Details</h4>


              {/* Conditional Block: New Project */}
              {messageType === "New Project" && (
                <div className="flex flex-col gap-6 w-full">
                  
                  {/* Step Pills Progress Indicator */}
                  <div className="flex items-center justify-between gap-1 mb-2 border-b border-border-soft-val/30 pb-4">
                    {["Business", "Services", "Budget", "Details"].map((label, idx) => {
                      const isActive = newProjectStep === idx;
                      const isCompleted = newProjectStep > idx;
                      return (
                        <div key={label} className="flex-1 flex flex-col items-center gap-1.5">
                          <div className="flex items-center w-full">
                            <div className={`h-0.5 flex-1 ${idx === 0 ? "bg-transparent" : (isCompleted || isActive ? "bg-brand-primary/40" : "bg-white/5")}`} />
                            <div
                              className={`h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all duration-300 ${
                                isActive
                                  ? "bg-brand-primary text-white ring-4 ring-brand-primary/10"
                                  : isCompleted
                                  ? "bg-brand-primary/20 text-brand-primary border border-brand-primary/30"
                                  : "bg-white/5 text-text-dark-gray border border-border-soft-val"
                              }`}
                            >
                              {isCompleted ? "✓" : idx + 1}
                            </div>
                            <div className={`h-0.5 flex-1 ${idx === 3 ? "bg-transparent" : (isCompleted ? "bg-brand-primary/40" : "bg-white/5")}`} />
                          </div>
                          <span className={`text-[9px] font-bold uppercase tracking-wider ${isActive ? "text-brand-primary" : "text-text-dark-gray"}`}>
                            {label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Step 0: Business */}
                  {newProjectStep === 0 && (
                    <div className="flex flex-col gap-5 w-full">
                      <span className="text-xs font-bold text-brand-primary uppercase tracking-wide">About Your Business</span>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <span className={labelClassName}>Do you currently have a website? *</span>
                          <div className="flex gap-3">
                            {["Yes", "No"].map((opt) => {
                              const isActive = hasWebsite === opt;
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  aria-pressed={isActive}
                                  onClick={() => {
                                    setHasWebsite(opt);
                                    if (formErrors.hasWebsite) {
                                      setFormErrors((prev) => {
                                        const copy = { ...prev };
                                        delete copy.hasWebsite;
                                        return copy;
                                      });
                                    }
                                    if (opt !== "Yes") {
                                      setWebsiteUrl("");
                                    }
                                  }}
                                  className={isActive ? activeChipClassName : chipClassName}
                                >
                                  {isActive ? `✓ ${opt}` : opt}
                                </button>
                              );
                            })}
                          </div>
                          {formErrors.hasWebsite && (
                            <span className="text-[11px] text-red-400 font-medium mt-1 block">
                              {formErrors.hasWebsite}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <span className={labelClassName}>How many years have you been in business? *</span>
                          <div className="flex flex-wrap gap-2.5">
                            {BUSINESS_AGE_OPTIONS.map((opt) => {
                              const isActive = businessAge === opt;
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  aria-pressed={isActive}
                                  onClick={() => {
                                    setBusinessAge(opt);
                                    if (formErrors.businessAge) {
                                      setFormErrors((prev) => {
                                        const copy = { ...prev };
                                        delete copy.businessAge;
                                        return copy;
                                      });
                                    }
                                  }}
                                  className={isActive ? activeChipClassName : chipClassName}
                                >
                                  {isActive ? `✓ ${opt}` : opt}
                                </button>
                              );
                            })}
                          </div>
                          {formErrors.businessAge && (
                            <span className="text-[11px] text-red-400 font-medium mt-1 block">
                              {formErrors.businessAge}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {hasWebsite === "Yes" && (
                          <Field label="Website URL / Domain *">
                            <input
                              type="text"
                              name="websiteUrl"
                              value={websiteUrl}
                              onChange={(e) => {
                                setWebsiteUrl(e.target.value);
                                if (formErrors.websiteUrl) {
                                  setFormErrors((prev) => {
                                    const copy = { ...prev };
                                    delete copy.websiteUrl;
                                    return copy;
                                  });
                                }
                              }}
                              placeholder="https://example.com or example.com"
                              className={fieldClassName}
                            />
                            {formErrors.websiteUrl && (
                              <span className="text-[11px] text-red-400 font-medium mt-1 block">
                                {formErrors.websiteUrl}
                              </span>
                            )}
                            {/* Future backend normalization:
                                // If the submitted value has no protocol, backend can normalize it to https://...
                                // Final validation must happen server-side when backend routing is implemented. */}
                          </Field>
                        )}

                        <Field label="Instagram Handle (Optional)">
                          <input
                            type="text"
                            name="instagramHandle"
                            value={instagramHandle}
                            onChange={(e) => setInstagramHandle(e.target.value)}
                            placeholder="@username"
                            className={fieldClassName}
                          />
                        </Field>
                      </div>
                    </div>
                  )}

                  {/* Step 1: Services */}
                  {newProjectStep === 1 && (
                    <div className="flex flex-col gap-4 w-full">
                      <span className="text-xs font-bold text-brand-primary uppercase tracking-wide">Project Type & Services</span>

                      <div className="flex flex-col gap-2">
                        <span className={labelClassName}>What service are you interested in? (Select all that apply) *</span>
                        {/* Definitions for services references:
                            - Business Website: commercial website focused on services, leads, and customer conversion.
                            - Company / Corporate Site: formal company website for larger organizations with corporate pages, departments, governance, partners, careers, or institutional information. */}
                        <div className="flex flex-wrap gap-2">
                          {SERVICE_OPTIONS.map((opt) => {
                            const isActive = selectedServices.includes(opt);
                            return (
                              <button
                                key={opt}
                                type="button"
                                aria-pressed={isActive}
                                onClick={() => {
                                  setSelectedServices((prev) => {
                                    const next = prev.includes(opt) ? prev.filter((s) => s !== opt) : [...prev, opt];
                                    if (next.length > 0 && formErrors.selectedServices) {
                                      setFormErrors((errorsCopy) => {
                                        const copy = { ...errorsCopy };
                                        delete copy.selectedServices;
                                        return copy;
                                      });
                                    }
                                    return next;
                                  });
                                }}
                                className={isActive ? activeChipClassName : chipClassName}
                              >
                                {isActive ? `✓ ${opt}` : opt}
                              </button>
                            );
                          })}
                        </div>
                        {formErrors.selectedServices && (
                          <span className="text-[11px] text-red-400 font-medium mt-1 block">
                            {formErrors.selectedServices}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Budget */}
                  {newProjectStep === 2 && (
                    <div className="flex flex-col gap-5 w-full">
                      <span className="text-xs font-bold text-brand-primary uppercase tracking-wide">Budget & Timeline</span>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                          <span className={labelClassName}>Estimated Budget Range (Optional)</span>
                          <p className="text-[11px] text-text-muted-gray -mt-1 leading-relaxed">Budget ranges help us recommend the right delivery approach.</p>
                          <div className="flex flex-wrap gap-2">
                            {BUDGET_OPTIONS.map((opt) => {
                              const isActive = budget === opt;
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  aria-pressed={isActive}
                                  onClick={() => {
                                    setBudget(opt);
                                    if (formErrors.budget) {
                                      setFormErrors((prev) => {
                                        const copy = { ...prev };
                                        delete copy.budget;
                                        return copy;
                                      });
                                    }
                                  }}
                                  className={isActive ? activeChipClassName : chipClassName}
                                >
                                  {isActive ? `✓ ${opt}` : opt}
                                </button>
                              );
                            })}
                          </div>
                          {formErrors.budget && (
                            <span className="text-[11px] text-red-400 font-medium mt-1 block">
                              {formErrors.budget}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <span className={labelClassName}>Preferred Timeline (Optional)</span>
                          <p className="text-[11px] text-text-muted-gray -mt-1 leading-relaxed">Select when you want to kick off and launch.</p>
                          <div className="flex flex-wrap gap-2">
                            {TIMELINE_OPTIONS.map((opt) => {
                              const isActive = timeline === opt;
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  aria-pressed={isActive}
                                  onClick={() => setTimeline(opt)}
                                  className={isActive ? activeChipClassName : chipClassName}
                                >
                                  {isActive ? `✓ ${opt}` : opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Details */}
                  {newProjectStep === 3 && (
                    <div className="flex flex-col gap-5 w-full">
                      <span className="text-xs font-bold text-brand-primary uppercase tracking-wide">Project Details & Attribution</span>

                      <div className="grid grid-cols-1 gap-4">
                        <Field label="Tell us more about this project *">
                          <textarea
                            name="projectMessage"
                            rows={3}
                            value={projectMessage}
                            onChange={(e) => {
                              setProjectMessage(e.target.value);
                              if (formErrors.projectMessage) {
                                setFormErrors((prev) => {
                                  const copy = { ...prev };
                                  delete copy.projectMessage;
                                  return copy;
                                });
                              }
                            }}
                            required={messageType === "New Project" && newProjectStep === 3}
                            placeholder="Describe the project, its goals, timeline, and any key details."
                            className={`${fieldClassName} min-h-[112px] resize-none`}
                          />
                          {formErrors.projectMessage && (
                            <span className="text-[11px] text-red-400 font-medium mt-1 block">
                              {formErrors.projectMessage}
                            </span>
                          )}
                        </Field>

                        <Field label="What specific problems are you trying to solve? *">
                          <textarea
                            name="businessChallenge"
                            rows={2}
                            value={businessChallenge}
                            onChange={(e) => {
                              setBusinessChallenge(e.target.value);
                              if (formErrors.businessChallenge) {
                                setFormErrors((prev) => {
                                  const copy = { ...prev };
                                  delete copy.businessChallenge;
                                  return copy;
                                });
                              }
                            }}
                            required={messageType === "New Project" && newProjectStep === 3}
                            placeholder="Describe the core challenge or pain point you want to address."
                            className={`${fieldClassName} min-h-[96px] resize-none`}
                          />
                          {formErrors.businessChallenge && (
                            <span className="text-[11px] text-red-400 font-medium mt-1 block">
                              {formErrors.businessChallenge}
                            </span>
                          )}
                        </Field>
                      </div>

                      <div className="flex flex-col gap-2 border-t border-border-soft-val/30 pt-4 mt-2">
                        <span className={labelClassName}>How did you hear about DXBMARK? (Optional)</span>
                        <div className="flex flex-wrap gap-2">
                          {ATTRIBUTION_OPTIONS.map((opt) => {
                            const isActive = attribution === opt;
                            return (
                              <button
                                key={opt}
                                type="button"
                                aria-pressed={isActive}
                                onClick={() => setAttribution(opt)}
                                className={isActive ? activeChipClassName : chipClassName}
                              >
                                {isActive ? `✓ ${opt}` : opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step Navigation Buttons */}
                  <div className="flex items-center justify-between border-t border-border-soft-val/30 pt-4 mt-2">
                    <div>
                      {newProjectStep > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setNewProjectStep((prev) => prev - 1);
                            setFormErrors({});
                          }}
                          className="px-4 py-2 rounded-radius-default border border-border-soft-val bg-white/5 text-xs font-bold uppercase tracking-wider text-text-sub hover:bg-white/10 hover:text-text-main transition-colors duration-200"
                        >
                          Back
                        </button>
                      )}
                    </div>
                    <div>
                      {newProjectStep < 3 && (
                        <button
                          type="button"
                          onClick={handleContinue}
                          className="px-5 py-2.5 rounded-radius-default bg-brand-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-primary/95 transition-all duration-200"
                        >
                          Continue
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* Conditional Block: General Inquiry */}
              {messageType === "General Inquiry" && (
                <div className="flex flex-col gap-5 w-full">
                  <Field label="Subject *">
                    <input
                      type="text"
                      name="generalSubject"
                      placeholder="Reason for inquiry"
                      required={messageType === "General Inquiry"}
                      className={fieldClassName}
                    />
                  </Field>
                  <Field label="Message *">
                    <textarea
                      name="generalMessage"
                      rows={4}
                      required={messageType === "General Inquiry"}
                      placeholder="Tell us how we can help."
                      className={`${fieldClassName} h-32 resize-none`}
                    />
                  </Field>
                </div>
              )}

              {/* Conditional Block: Support Request */}
              {messageType === "Support Request" && (
                <div className="flex flex-col gap-5 w-full">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <span className={labelClassName}>Existing Client? *</span>
                      <div className="flex gap-3">
                        {["Yes", "No"].map((opt) => {
                          const isActive = isExistingClient === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              aria-pressed={isActive}
                              onClick={() => setIsExistingClient(opt)}
                              className={isActive ? activeChipClassName : chipClassName}
                            >
                              {isActive ? `✓ ${opt}` : opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <Field label="Service Affected *">
                      <input
                        type="text"
                        name="supportService"
                        placeholder="SaaS platform, hosting, database, etc."
                        required={messageType === "Support Request"}
                        className={fieldClassName}
                      />
                    </Field>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className={labelClassName}>Priority Level *</span>
                    <div className="flex gap-3">
                      {PRIORITY_OPTIONS.map((opt) => {
                        const isActive = priority === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            aria-pressed={isActive}
                            onClick={() => setPriority(opt)}
                            className={isActive ? activeChipClassName : chipClassName}
                          >
                            {isActive ? `✓ ${opt}` : opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Field label="Subject *">
                    <input
                      type="text"
                      name="supportSubject"
                      placeholder="Brief description of the problem"
                      required={messageType === "Support Request"}
                      className={fieldClassName}
                    />
                  </Field>

                  <Field label="Message / Incident Details *">
                    <textarea
                      name="supportMessage"
                      rows={4}
                      required={messageType === "Support Request"}
                      placeholder="Describe the support request or issue you are facing."
                      className={`${fieldClassName} h-32 resize-none`}
                    />
                  </Field>
                </div>
              )}

              {/* Conditional Block: Complaint */}
              {messageType === "Complaint" && (
                <div className="flex flex-col gap-5 w-full">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Field label="Related Service *">
                      <input
                        type="text"
                        name="complaintService"
                        placeholder="Name of affected service"
                        required={messageType === "Complaint"}
                        className={fieldClassName}
                      />
                    </Field>
                    <Field label="Complaint Category *">
                      <input
                        type="text"
                        name="complaintCategory"
                        placeholder="Billing, delay, technical issue, etc."
                        required={messageType === "Complaint"}
                        className={fieldClassName}
                      />
                    </Field>
                  </div>
                  <Field label="Incident Details *">
                    <textarea
                      name="complaintDetails"
                      rows={4}
                      required={messageType === "Complaint"}
                      placeholder="Provide incident details."
                      className={`${fieldClassName} h-32 resize-none`}
                    />
                  </Field>
                  <Field label="Preferred Resolution *">
                    <textarea
                      name="complaintResolution"
                      rows={3}
                      required={messageType === "Complaint"}
                      placeholder="Describe your preferred resolution."
                      className={`${fieldClassName} h-24 resize-none`}
                    />
                  </Field>
                </div>
              )}

              {/* Conditional Block: Billing / Accounts */}
              {messageType === "Billing / Accounts" && (
                <div className="flex flex-col gap-5 w-full">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Field label="Invoice / Account Reference *">
                      <input
                        type="text"
                        name="billingRef"
                        placeholder="INV-2026-XXXX"
                        required={messageType === "Billing / Accounts"}
                        className={fieldClassName}
                      />
                    </Field>
                    <Field label="Billing Topic *">
                      <input
                        type="text"
                        name="billingTopic"
                        placeholder="Refunds, invoice discrepancy, payment method, etc."
                        required={messageType === "Billing / Accounts"}
                        className={fieldClassName}
                      />
                    </Field>
                  </div>
                  <Field label="Message *">
                    <textarea
                      name="billingMessage"
                      rows={4}
                      required={messageType === "Billing / Accounts"}
                      placeholder="Describe your billing query."
                      className={`${fieldClassName} h-32 resize-none`}
                    />
                  </Field>
                </div>
              )}

              {/* Conditional Block: Privacy Request */}
              {messageType === "Privacy Request" && (
                <div className="flex flex-col gap-5 w-full">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <span className={labelClassName}>Request Type *</span>
                      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2.5">
                        {PRIVACY_REQUEST_OPTIONS.map((opt) => {
                          const isActive = privacyRequestType === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              aria-pressed={isActive}
                              onClick={() => setPrivacyRequestType(opt)}
                              className={isActive ? activeChipClassName : chipClassName}
                            >
                              {isActive ? `✓ ${opt}` : opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <Field label="Related Email Address *">
                      <input
                        type="email"
                        name="privacyEmail"
                        placeholder="you@company.com"
                        required={messageType === "Privacy Request"}
                        className={fieldClassName}
                      />
                    </Field>
                  </div>
                  <Field label="Message *">
                    <textarea
                      name="privacyMessage"
                      rows={4}
                      required={messageType === "Privacy Request"}
                      placeholder="Describe your privacy request."
                      className={`${fieldClassName} h-32 resize-none`}
                    />
                  </Field>
                </div>
              )}

              {/* Conditional Block: Legal Matter */}
              {messageType === "Legal Matter" && (
                <div className="flex flex-col gap-5 w-full">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Field label="Legal Topic *">
                      <input
                        type="text"
                        name="legalTopic"
                        placeholder="IP, DMCA, contract, corporate, etc."
                        required={messageType === "Legal Matter"}
                        className={fieldClassName}
                      />
                    </Field>
                    <Field label="Organization / Representative *">
                      <input
                        type="text"
                        name="legalRepresentative"
                        placeholder="Legal firm, company name, representative"
                        required={messageType === "Legal Matter"}
                        className={fieldClassName}
                      />
                    </Field>
                  </div>
                  <Field label="Message *">
                    <textarea
                      name="legalMessage"
                      rows={4}
                      required={messageType === "Legal Matter"}
                      placeholder="Provide the details of your legal request."
                      className={`${fieldClassName} h-32 resize-none`}
                    />
                  </Field>
                </div>
              )}

              {/* Conditional Block: Partnership / Collaboration */}
              {messageType === "Partnership / Collaboration" && (
                <div className="flex flex-col gap-5 w-full">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Field label="Partnership Type *">
                      <input
                        type="text"
                        name="partnershipType"
                        placeholder="Reseller, affiliate, technology integration, etc."
                        required={messageType === "Partnership / Collaboration"}
                        className={fieldClassName}
                      />
                    </Field>
                    <Field label="Organization Website *">
                      <input
                        type="url"
                        name="partnershipWebsite"
                        placeholder="https://company.com"
                        required={messageType === "Partnership / Collaboration"}
                        className={fieldClassName}
                      />
                    </Field>
                  </div>
                  <Field label="Proposal Summary *">
                    <textarea
                      name="partnershipProposal"
                      rows={4}
                      required={messageType === "Partnership / Collaboration"}
                      placeholder="Provide a summary of your partnership proposal."
                      className={`${fieldClassName} h-32 resize-none`}
                    />
                  </Field>
                </div>
              )}

              </div>
            )}

            {/* Visual Section 4: Security & Consent */}
            {canShowSecurityAndSubmit && (
              <div className={sectionWrapperClassName}>
                <h4 className={sectionTitleClassName}>4. Security & Consent</h4>
                
                <div className="flex flex-col gap-2 text-left">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="consentCheckbox"
                      checked={consentAccepted}
                      onChange={(e) => {
                        setConsentAccepted(e.target.checked);
                        if (e.target.checked && validationError) {
                          setValidationError(null);
                        }
                      }}
                      className="mt-1 h-4 w-4 shrink-0 rounded border-border-soft-val bg-white/[0.04] text-brand-primary focus:ring-brand-primary/20 accent-brand-primary cursor-pointer"
                    />
                    <label htmlFor="consentCheckbox" className="text-xs text-text-sub leading-normal cursor-pointer select-none">
                      I agree to the{" "}
                      <Link href="/legal/terms-of-service" className="hover:text-text-main underline transition-colors">
                        Terms of Service
                      </Link>{" "}
                      and acknowledge the{" "}
                      <Link href="/legal/privacy-policy" className="hover:text-text-main underline transition-colors">
                        Privacy Policy
                      </Link>
                      .
                    </label>
                  </div>
                  
                  {/* Calm inline validation message directly below the checkbox */}
                  {validationError && (
                    <span className="text-[11px] text-red-400 font-medium mt-1 block">
                      {validationError}
                    </span>
                  )}
                  
                  <span className="text-[11px] text-text-dark-gray leading-normal mt-2 block border-t border-border-soft-val/30 pt-2">
                    For additional legal information, review our{" "}
                    <Link href="/legal" className="hover:text-text-sub transition-colors underline">
                      legal pages
                    </Link>
                    .
                  </span>
                </div>

                {/* Future security integration:
                    // Cloudflare Turnstile should be mounted here before public backend routing goes live.
                    // The Turnstile token must be verified server-side before email sending, CRM routing, or storage.
                */}
              </div>
            )}

            {canShowSecurityAndSubmit && routingNoticeVisible && (
              <div className="rounded-radius-md border border-brand-primary/15 bg-brand-primary/[0.03] px-4 py-3 text-xs text-text-sub leading-relaxed text-left">
                Form routing is currently being finalized. For urgent project inquiries, please email{" "}
                <a href="mailto:sales@dxbmark.com" className="text-brand-primary font-bold hover:underline">
                  sales@dxbmark.com
                </a>{" "}
                directly.
              </div>
            )}

            {canShowSecurityAndSubmit && (
              <div className="flex flex-col gap-4 mt-2">
                <Button
                  type="submit"
                  className="group w-fit gap-2 hover:shadow-shadow-glow hover:-translate-y-[2px] transition-all duration-300"
                >
                  <span>Submit request</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </Button>
              </div>
            )}
          </form>
        </div>

        <ContactFAQStack className="mt-20 sm:mt-24 lg:mt-28" />

      </Container>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-left w-full">
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-text-dark-gray">
        {label}
      </span>
      {children}
    </label>
  );
}
