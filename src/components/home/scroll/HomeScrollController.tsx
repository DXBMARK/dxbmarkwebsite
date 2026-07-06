"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function HomeScrollController() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Enable snapping and parallax only on desktop viewports (min-width: 1024px)
      mm.add("(min-width: 1024px)", () => {
        const snapOffsets: number[] = [];
        const animatedSections = new WeakSet<HTMLElement>();
        
        const updateSnapOffsets = () => {
          snapOffsets.length = 0;
          const currentSections = gsap.utils.toArray<HTMLElement>("[data-home-section]");
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          currentSections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            const top = rect.top + window.scrollY;
            const progress = totalHeight > 0 ? top / totalHeight : 0;
            snapOffsets.push(Math.max(0, Math.min(1, progress)));
          });
        };

        const setupAnimations = () => {
          const currentSections = gsap.utils.toArray<HTMLElement>("[data-home-section]");
          currentSections.forEach((section, index) => {
            if (index === 0 || animatedSections.has(section)) return;

            const inner = section.querySelector(".section-inner-wrapper");
            if (!inner) return;

            gsap.fromTo(
              inner,
              { y: 30, opacity: 0.7 },
              {
                y: 0,
                opacity: 1,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: section,
                  start: "top 80%",
                  end: "top 20%",
                  scrub: 0.5,
                },
              }
            );

            animatedSections.add(section);
          });
        };

        updateSnapOffsets();
        setupAnimations();

        const resizeObserver = new ResizeObserver(() => {
          setupAnimations();
          updateSnapOffsets();
          ScrollTrigger.refresh();
        });
        resizeObserver.observe(document.body);

        window.addEventListener("resize", updateSnapOffsets);

        // Soft, non-aggressive document snapping
        const mainTrigger = ScrollTrigger.create({
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          snap: {
            snapTo: (value) => {
              if (snapOffsets.length < 2) return value;
              
              const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
              const lastOffset = snapOffsets.at(snapOffsets.length - 1) ?? 1;
              
              // 80px scroll threshold converted to progress units
              const thresholdPx = 80;
              const thresholdProgress = totalHeight > 0 ? thresholdPx / totalHeight : 0;
              
              // If we are past the last section's snap offset plus the threshold (moving toward the footer),
              // return the current value to let native scrolling continue untrapped.
              if (value > lastOffset + thresholdProgress) {
                return value;
              }

              let closest = snapOffsets.at(0) ?? 0;
              let minDiff = Math.abs(value - closest);
              for (let i = 1; i < snapOffsets.length; i++) {
                const currentOffset = snapOffsets.at(i);
                if (currentOffset !== undefined) {
                  const diff = Math.abs(value - currentOffset);
                  if (diff < minDiff) {
                    minDiff = diff;
                    closest = currentOffset;
                  }
                }
              }
              return closest;
            },
            duration: { min: 0.35, max: 0.7 },
            ease: "power2.inOut",
            delay: 0.15,
          },
        });

        // Refresh ScrollTrigger once after layout initialization
        ScrollTrigger.refresh();

        return () => {
          window.removeEventListener("resize", updateSnapOffsets);
          resizeObserver.disconnect();
          mainTrigger.kill();
        };
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
}
