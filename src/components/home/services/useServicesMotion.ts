'use client';

import * as React from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger since we are using it locally
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function useServicesMotion(rootRef: React.RefObject<HTMLDivElement | null>) {
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;
    if (prefersReducedMotion || isMobile) {
      const allElements = root.querySelectorAll("[data-services-reveal], [data-service-card]");
      allElements.forEach((el) => {
        (el as HTMLElement).style.opacity = "1";
        (el as HTMLElement).style.visibility = "visible";
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Reveal the badge, h2, and description
      gsap.fromTo(
        "[data-services-reveal]",
        { autoAlpha: 0, y: 18, filter: "blur(8px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: {
            trigger: root,
            start: "top 72%",
            once: true,
          },
        }
      );

      // Stagger reveal the service cards
      gsap.fromTo(
        "[data-service-card]",
        { autoAlpha: 0, y: 26, scale: 0.975, filter: "blur(10px)" },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.09,
          clearProps: "opacity,visibility,filter",
          scrollTrigger: {
            trigger: root,
            start: "top 68%",
            once: true,
          },
        }
      );
    }, root);

    return () => ctx.revert();
  }, [rootRef]);
}
