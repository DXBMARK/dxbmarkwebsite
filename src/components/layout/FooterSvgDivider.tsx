"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function FooterSvgDivider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fillPathRef = useRef<SVGPathElement>(null);
  const strokePathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const downPath = "M0,0 C0,0 464,80 1139,80 S2278,0 2278,0 V120 H0 Z";
      const centerPath = "M0,0 C0,0 464,0 1139,0 S2278,0 2278,0 V120 H0 Z";
      
      const downStroke = "M0,2.5 C0,2.5 464,80 1139,80 S2278,2.5 2278,2.5";
      const centerStroke = "M0,2.5 C0,2.5 464,2.5 1139,2.5 S2278,2.5 2278,2.5";

      // Breathing pulse loop for the resting state line
      const pulseTl = gsap.timeline({ repeat: -1, yoyo: true, paused: true });
      pulseTl.to(strokePathRef.current, {
        opacity: 0.75,
        duration: 2.5,
        ease: "sine.inOut"
      });

      const animateWobble = (self: globalThis.ScrollTrigger) => {
        const velocity = Math.abs(self.getVelocity());
        const strength = Math.min(1.8, Math.max(1, velocity / 2500));
        const damping = Math.max(0.45, 0.8 - velocity / 12000);

        // Pause pulse during active wobble to avoid conflict
        pulseTl.pause();
        gsap.set(strokePathRef.current, { opacity: 1.0 });

        gsap.fromTo(
          fillPathRef.current,
          { attr: { d: downPath } },
          {
            duration: 2.2,
            attr: { d: centerPath },
            ease: `elastic.out(${strength}, ${damping})`,
            overwrite: "auto"
          }
        );

        gsap.fromTo(
          strokePathRef.current,
          { attr: { d: downStroke } },
          {
            duration: 2.2,
            attr: { d: centerStroke },
            ease: `elastic.out(${strength}, ${damping})`,
            overwrite: "auto",
            onComplete: () => {
              if (self.isActive) {
                pulseTl.play();
              }
            }
          }
        );
      };

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 110%", // Smart pre-trigger 10% viewport height before entry
        onEnter: (self) => {
          animateWobble(self);
        },
        onEnterBack: (self) => {
          animateWobble(self);
        },
        onLeave: () => {
          pulseTl.pause();
        },
        onLeaveBack: () => {
          pulseTl.pause();
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute left-0 top-0 w-full pointer-events-none select-none z-30 overflow-visible h-20 sm:h-24 lg:h-32"
      style={{ transform: "translateY(-99%)" }}
    >
      <svg
        viewBox="0 0 2278 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block w-full h-full overflow-visible"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="footer-orange-line" x1="0" y1="0" x2="2278" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f97e1a" stopOpacity="0" />
            <stop offset="25%" stopColor="#e89548" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#f97e1a" stopOpacity="1" />
            <stop offset="75%" stopColor="#e89548" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f97e1a" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Solid background fill matching footer background #0a101d */}
        <path
          ref={fillPathRef}
          d="M0,0 C0,0 464,0 1139,0 S2278,0 2278,0 V120 H0 Z"
          fill="#0a101d"
        />

        {/* Thin glowing orange accent border stroke */}
        <path
          ref={strokePathRef}
          d="M0,2.5 C0,2.5 464,2.5 1139,2.5 S2278,2.5 2278,2.5"
          stroke="url(#footer-orange-line)"
          strokeWidth="2.5"
          fill="none"
        />
      </svg>
    </div>
  );
}
