"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useHeroMotion() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" }
      });

      // Initial Entrance Animations
      tl.fromTo(
        ".hero-badge-elem",
        { opacity: 0, y: -25 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2 }
      );

      tl.fromTo(
        ".hero-title-line",
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15 },
        "-=0.5"
      );

      tl.fromTo(
        ".hero-sub-elem",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.6"
      );

      tl.fromTo(
        ".hero-cta-elem",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
        "-=0.5"
      );

      tl.fromTo(
        ".hero-trust-logos-elem",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.4"
      );

      // Scroll Trigger Animations
      gsap.to(".hero-scroll-cue", {
        opacity: 0,
        y: 15,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "100px top",
          scrub: true,
        }
      });

      gsap.to(".hero-content-wrapper", {
        opacity: 0.9,
        y: 20,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return containerRef;
}
