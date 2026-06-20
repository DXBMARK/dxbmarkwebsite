"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Headphones, Mail, MessageCircle } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import GlobeWireframe from "@/components/ui/globe-wireframe";
import { SeparatorPro } from "@/components/ui/separator-pro";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/layout";
import { Glow } from "@/components/visual";

const CONTACT_LINKS = [
  {
    icon: Mail,
    label: "info@dxbmark.com",
    href: "mailto:info@dxbmark.com",
    helper: "General inquiries",
  },
  {
    icon: MessageCircle,
    label: "sales@dxbmark.com",
    href: "mailto:sales@dxbmark.com",
    helper: "Project and sales discussions",
  },
  {
    icon: Headphones,
    label: "support@dxbmark.com",
    href: "mailto:support@dxbmark.com",
    helper: "Support requests",
  },
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLDivElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);

  const [formStatus, setFormStatus] = useState<string | null>(null);

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
        leftRef.current,
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: leftRef.current,
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus(
      "Online form routing is being finalized. For now, please email sales@dxbmark.com with your project details.",
    );
  };

  const fieldClassName = "w-full rounded-radius-md border border-border-soft-val bg-white/[0.04] px-4 py-3 text-sm text-text-main placeholder:text-text-muted-gray/65 outline-none transition-all duration-200 focus:border-brand-primary/58 focus:bg-white/[0.08] focus:ring-4 focus:ring-brand-primary/10";

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative min-h-screen w-full overflow-hidden bg-background-slate px-4 pt-24 pb-20 text-text-main sm:px-6 lg:px-8 sm:pb-28 lg:pb-32 scroll-mt-24"
    >
      <Glow className="absolute inset-0 z-0" />

      <Container className="relative z-10">
        <div ref={headingRef} className="mx-auto mb-8 max-w-3xl text-center">
          <div className="hero-badge-elem mx-auto mb-5 relative z-0 bg-white/5 overflow-hidden p-px inline-flex items-center justify-center rounded-full transition duration-300">
            {/* Rotating Orange Accent Gradient Border */}
            <div 
              className="absolute -left-1/2 -top-1/2 w-[200%] h-[200%] bg-no-repeat bg-[100%_50%] bg-[length:50%_30%] blur-[4px] animate-[spin_6s_linear_infinite]"
              style={{
                backgroundImage: "linear-gradient(to right, var(--color-accent-primary), var(--color-accent-secondary))",
                transformOrigin: "center",
              }}
              aria-hidden="true"
            />
            {/* Inner Content Container using Legacy exception inner bg #0d2130 */}
            <div className="relative flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0d2130]/95 backdrop-blur-md border border-border-soft-val shadow-inner">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-primary animate-pulse shadow-[0_0_6px_var(--color-accent-primary)]" aria-hidden="true" />
              <span className="font-label text-[10px] font-bold text-text-main uppercase tracking-widest">
                Contact
              </span>
            </div>
          </div>

          <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-[4rem] font-black tracking-tight leading-[1.05]">
            <span className="block text-text-main">
              Let&apos;s build your
            </span>
            <span className="block mt-2 bg-gradient-to-r from-text-main via-brand-primary to-brand-secondary bg-clip-text text-transparent pb-1">
              next digital system.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl font-body text-xs sm:text-sm md:text-base text-text-sub leading-relaxed">
            Share your project details and we will review the best way to support your software, automation, cloud, or integration requirements.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div ref={leftRef} className="flex flex-col gap-5">
            <div className="text-left">
              <h2 className="text-xl font-bold text-text-main">Get in touch</h2>
              <p className="mt-2 max-w-md text-xs sm:text-sm leading-relaxed text-text-muted-gray">
                Choose the right channel below. For project requests, include a
                short summary of the system, platform, or workflow you want to
                build.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              {CONTACT_LINKS.map(({ icon: Icon, label, href, helper }) => (
                <a
                  key={label}
                  href={href}
                  className="group flex w-fit items-center gap-3 rounded-radius-md border border-border-soft-val bg-white/[0.03] px-3.5 py-2.5 text-sm text-text-sub transition-all duration-300 hover:border-brand-primary/40 hover:bg-brand-primary/10 hover:text-text-main"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-radius-default border border-border-soft-val bg-background-dark/70 text-text-muted-gray transition-all duration-300 group-hover:border-brand-primary/40 group-hover:text-brand-primary">
                    <Icon className="h-4 w-4" />
                  </span>

                  <span className="flex flex-col text-left">
                    <span className="font-medium font-label">{label}</span>
                    <span className="text-xs text-text-dark-gray group-hover:text-text-sub transition-colors duration-300">
                      {helper}
                    </span>
                  </span>
                </a>
              ))}
            </div>

            <div className="relative mt-2 h-48 overflow-hidden rounded-radius-xl border border-border-soft-val bg-background-dark/30">
              <GlobeWireframe
                className="absolute left-1/2 top-0 aspect-square w-[120%] max-w-none -translate-x-1/2 text-brand-primary/70"
                variant="wireframesolid"
                autoRotate
                autoRotateSpeed={0.35}
                strokeWidth={0.55}
                graticuleOpacity={0.1}
                sphereOutlineWidth={1}
                rotateToLocation="dubai"
              />

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background-slate via-background-slate/80 to-transparent" aria-hidden="true" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,var(--color-accent-glow),transparent_45%)]" aria-hidden="true" />
            </div>
          </div>

          <div
            ref={formRef}
            className="rounded-radius-xl border border-border-soft-val bg-white/[0.03] p-4 shadow-shadow-card backdrop-blur-xl sm:p-6"
          >
            <div className="text-left">
              <h2 className="text-xl font-bold text-text-main">Send a message</h2>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-text-muted-gray">
                Tell us what you want to build, improve, automate, or integrate.
              </p>
            </div>

            <SeparatorPro variant="dots" className="my-4" />

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Full Name">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Your name"
                    required
                    className={fieldClassName}
                  />
                </Field>

                <Field label="Company">
                  <input
                    type="text"
                    name="company"
                    placeholder="Company name"
                    className={fieldClassName}
                  />
                </Field>
              </div>

              <Field label="Email Address">
                <input
                  type="email"
                  name="email"
                  placeholder="you@company.com"
                  required
                  className={fieldClassName}
                />
              </Field>

              <Field label="Project Type">
                <select name="projectType" required className={fieldClassName}>
                  <option value="" className="bg-background-slate text-text-main">Select a service</option>
                  <option value="web-saas" className="bg-background-slate text-text-main">Web / SaaS Application</option>
                  <option value="automation" className="bg-background-slate text-text-main">Automation & Workflows</option>
                  <option value="integrations" className="bg-background-slate text-text-main">Integrations</option>
                  <option value="cloud-hosting" className="bg-background-slate text-text-main">Cloud & Hosting</option>
                  <option value="consulting" className="bg-background-slate text-text-main">Technical Consulting</option>
                </select>
              </Field>

              <Field label="Message">
                <textarea
                  name="message"
                  rows={3}
                  required
                  placeholder="Tell us what you want to build, improve, automate, or integrate."
                  className={`${fieldClassName} h-24 resize-none`}
                />
              </Field>

              {formStatus && (
                <div className="rounded-radius-md border border-brand-primary/15 bg-brand-primary/[0.03] px-3.5 py-2.5 text-xs text-text-sub leading-relaxed text-left">
                  {formStatus}
                </div>
              )}

              <Button
                type="submit"
                className="group w-fit gap-2 hover:shadow-shadow-glow hover:-translate-y-[2px] transition-all duration-300"
              >
                <span>Submit request</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </Button>
            </form>
          </div>
        </div>
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
    <label className="flex flex-col gap-1.5 text-left">
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-text-dark-gray">
        {label}
      </span>
      {children}
    </label>
  );
}
