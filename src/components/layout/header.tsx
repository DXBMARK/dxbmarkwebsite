"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Container } from "../ui/layout";
import { Button } from "../ui/button";
import { GlassPanel } from "../visual";
import { NAV_LINKS, MEGA_MENU_ITEMS } from "@/content/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, Monitor, Layers, GitBranch, Link2, ArrowRight } from "lucide-react";

const iconMap = {
  Monitor: Monitor,
  Layers: Layers,
  GitBranch: GitBranch,
  Link2: Link2,
};

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  React.useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 32) {
            setIsScrolled(true);
          } else {
            setIsScrolled(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out flex items-center justify-center",
        isScrolled ? "top-4 px-4" : "top-0 px-0"
      )}
    >
      <div
        className={cn(
          "w-full transition-all duration-500 ease-out border-b border-border-soft-val bg-background-slate/55 backdrop-blur-md",
          isScrolled
            ? "max-w-[1100px] rounded-radius-full border border-border-soft-val bg-background-slate/75 backdrop-blur-lg px-6 py-1 shadow-[0_0_20px_rgba(249,126,26,0.1)]"
            : "max-w-full border-b"
        )}
      >
        <Container
          className={cn(
            "flex items-center justify-between transition-all duration-500 ease-out px-4",
            isScrolled ? "h-14" : "h-20"
          )}
        >
          {/* Logo / Brand */}
          <div className="flex items-center gap-1.5 font-sans text-xl font-black tracking-tight text-text-main">
            DXB<span className="text-brand-primary">MARK</span>
            <span className="h-2 w-2 rounded-full bg-brand-primary animate-pulse" />
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-2 font-label text-sm text-text-sub font-medium">
            {NAV_LINKS.map((link) => {
              const isActive = link.href === "/" 
                ? pathname === "/" 
                : pathname?.startsWith(link.href);
              
              if (link.hasMegaMenu) {
                return (
                  <div
                    key={link.href}
                    className="relative group py-2"
                  >
                    <a
                      href={link.href}
                      className={cn(
                        "transition-colors hover:text-brand-primary px-4 py-1.5 rounded-radius-default flex items-center gap-1",
                        isActive ? "text-brand-primary font-bold" : "text-text-sub"
                      )}
                    >
                      {link.label}
                    </a>

                    {/* Invisible Hover Bridge to prevent gap trigger loss */}
                    <div className="absolute top-full left-0 w-full h-12 pointer-events-auto" />

                    {/* Services Mega Menu Panel */}
                    <div
                      className="absolute top-[calc(100%+28px)] left-1/2 -translate-x-1/2 w-[800px] transition-all duration-300 ease-out origin-top z-50 opacity-0 scale-95 -translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:scale-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto"
                    >
                      <GlassPanel className="p-8 grid grid-cols-3 gap-8 bg-surface-main/95 backdrop-blur-2xl">
                        {/* Services Grid */}
                        <div className="col-span-2 grid grid-cols-1 gap-6">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-text-dark-gray">
                            DXBMARK Core Solutions
                          </p>
                          <div className="grid grid-cols-1 gap-4">
                            {MEGA_MENU_ITEMS.map((item) => {
                              const IconComponent = iconMap[item.iconName];
                              return (
                                <a
                                  key={item.href}
                                  href={item.href}
                                  className="group/item flex gap-4 p-3 rounded-radius-md transition-colors hover:bg-white/5 border border-transparent hover:border-border-soft-val"
                                >
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-radius-default bg-brand-glow text-brand-primary transition-colors group-hover/item:bg-brand-primary group-hover/item:text-white">
                                    <IconComponent className="h-5 w-5" aria-hidden="true" />
                                  </div>
                                  <div className="flex flex-col gap-1 text-left">
                                    <h4 className="font-sans text-sm font-bold text-text-main group-hover/item:text-brand-primary transition-colors">
                                      {item.title}
                                    </h4>
                                    <p className="font-body text-xs text-text-muted-gray leading-normal">
                                      {item.description}
                                    </p>
                                  </div>
                                </a>
                              );
                            })}
                          </div>
                        </div>

                        {/* Banner Section */}
                        <div className="col-span-1 rounded-radius-lg border border-border-strong-val bg-brand-glow p-6 flex flex-col justify-between text-left relative overflow-hidden">
                          <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-brand-primary/20 blur-xl" />
                          
                          <div className="flex flex-col gap-3 relative z-10">
                            <span className="inline-flex max-w-max items-center rounded-radius-full bg-brand-primary px-2 py-0.5 text-[9px] font-bold uppercase text-white">
                              Featured Update
                            </span>
                            <h4 className="font-sans text-sm font-bold text-text-main">
                              Latest DXBMARK Update
                            </h4>
                            <p className="font-body text-xs text-text-sub leading-relaxed">
                              Featured service, product update, or launch announcement will appear here.
                            </p>
                          </div>

                          <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-brand-primary cursor-not-allowed opacity-75 relative z-10">
                            Coming soon
                            <ArrowRight className="h-3 w-3" />
                          </div>
                        </div>
                      </GlassPanel>
                    </div>
                  </div>
                );
              }

              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "transition-colors hover:text-brand-primary px-4 py-2 rounded-radius-default",
                    isActive ? "text-brand-primary font-bold" : "text-text-sub"
                  )}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* CTA + Mobile Menu Trigger */}
          <div className="flex items-center gap-4">
            <a href="/contact">
              <Button
                variant="primary"
                size="sm"
                className="font-label h-9 text-xs"
              >
                Start a project
              </Button>
            </a>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-radius-default border border-border-soft-val bg-background-dark/50 text-text-main md:hidden"
              aria-label={isMobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </Container>
      </div>

      {/* Simple Mobile Nav Panel Placeholder */}
      {isMobileOpen && (
        <div className="absolute top-full left-4 right-4 mt-2 rounded-radius-lg border border-border-soft-val bg-background-dark/95 backdrop-blur-lg p-6 shadow-shadow-card md:hidden flex flex-col gap-4 z-50">
          <nav className="flex flex-col gap-3 font-label text-sm text-text-sub font-medium">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className="hover:text-brand-primary py-1 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <hr className="border-border-soft-val" />
          <a href="/contact" onClick={() => setIsMobileOpen(false)}>
            <Button variant="primary" className="w-full">
              Start a project
            </Button>
          </a>
        </div>
      )}
    </header>
  );
}
