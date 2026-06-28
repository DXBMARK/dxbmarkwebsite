"use client";

import { RefObject, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function useIntegrationsMotion(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;
    if (reduce || isMobile) {
      const allElements = root.querySelectorAll("[data-integrations-reveal], [data-integrations-visual]");
      allElements.forEach((el) => {
        (el as HTMLElement).style.opacity = "1";
        (el as HTMLElement).style.visibility = "visible";
      });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.querySelectorAll("[data-integrations-reveal]"),
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

      gsap.fromTo(
        root.querySelector("[data-integrations-visual]"),
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
    }, root);

    return () => ctx.revert();
  }, [rootRef]);
}
