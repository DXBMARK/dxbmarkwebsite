"use client";

import { type RefObject, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * GSAP ScrollTrigger-based section entrance animation for the SaaS Systems section.
 * Mirrors the pattern used in useIntegrationsMotion.ts.
 *
 * - [data-saas-reveal] elements: staggered fade-in-up with blur
 * - [data-saas-visual] panel: scale + fade entrance
 * - [data-saas-feature-section]: Independent scroll-triggered animations for each feature row
 *
 * Respects (prefers-reduced-motion: reduce) — returns early if set.
 */
export function useSaasSystemsMotion(
  rootRef: RefObject<HTMLDivElement | null>
) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      // Make all animated elements immediately visible for reduced motion
      const allAnimatedElements = root.querySelectorAll(
        "[data-saas-reveal], [data-saas-visual], [data-saas-feature-visual], [data-saas-feature-content], [data-saas-final-panel]"
      );
      allAnimatedElements.forEach((el) => {
        (el as HTMLElement).style.opacity = "1";
        (el as HTMLElement).style.visibility = "visible";
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Stagger reveal for text elements
      gsap.fromTo(
        root.querySelectorAll("[data-saas-reveal]"),
        { autoAlpha: 0, y: 22, filter: "blur(10px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 72%",
            once: true,
          },
          clearProps: "opacity,visibility,filter,transform",
        }
      );

      // Panel entrance
      gsap.fromTo(
        root.querySelector("[data-saas-visual]"),
        { autoAlpha: 0, y: 28, scale: 0.975, filter: "blur(12px)" },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.95,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 68%",
            once: true,
          },
          clearProps: "opacity,visibility,filter,transform",
        }
      );

      // Feature showcase sections — each as independent scroll target
      const featureSections = gsap.utils.toArray<HTMLElement>("[data-saas-feature-section]");
      
      featureSections.forEach((section) => {
        const visual = section.querySelector("[data-saas-feature-visual]");
        const content = section.querySelector("[data-saas-feature-content]");

        if (!visual || !content) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 72%",
            once: true,
          },
        });

        tl.fromTo(
          visual,
          { autoAlpha: 0, y: 28, scale: 0.975, filter: "blur(12px)" },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.75,
            ease: "power3.out",
            clearProps: "opacity,visibility,filter,transform",
          }
        ).fromTo(
          content,
          { autoAlpha: 0, y: 22, filter: "blur(10px)" },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.65,
            ease: "power3.out",
            clearProps: "opacity,visibility,filter,transform",
          },
          "-=0.45"
        );
      });

      // Final CTA panel — dramatic entrance
      const finalPanel = root.querySelector("[data-saas-final-panel]");
      if (finalPanel) {
        gsap.fromTo(
          finalPanel,
          { autoAlpha: 0, y: 30, scale: 0.975, filter: "blur(12px)" },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: finalPanel,
              start: "top 75%",
              once: true,
            },
            clearProps: "opacity,visibility,filter,transform",
          }
        );
      }
    }, root);

    return () => ctx.revert();
  }, [rootRef]);
}
