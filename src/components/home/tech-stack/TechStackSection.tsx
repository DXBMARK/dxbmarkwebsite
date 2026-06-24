"use client";

import { motion, useReducedMotion } from "framer-motion";

import { HeroBadge } from "@/components/home/hero/HeroBadge";
import { HomeSection } from "@/components/home/sections/HomeSection";
import { techStackRowOne, techStackRowTwo } from "@/content/home/tech-stack";
import { TechStackMarquee } from "./TechStackMarquee";

export function TechStackSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <HomeSection
      id="technology-stack"
      className="relative overflow-hidden"
      aria-labelledby="home-technology-stack-title"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-glow blur-[130px] opacity-15" />
      </div>

      <div className="relative z-10 flex min-h-[100svh] w-full flex-col justify-center px-4 pt-24 pb-20 sm:px-6 sm:pt-28 sm:pb-24 lg:px-8 lg:pt-28 lg:pb-24">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18, filter: "blur(8px)" }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex justify-center">
            <HeroBadge label="TECHNOLOGY STACK" />
          </div>

          <h2
            id="home-technology-stack-title"
            className="mt-6 text-balance font-sans text-4xl font-black tracking-tight text-text-main sm:text-5xl lg:text-6xl"
          >
            Trusted technology{" "}
            <span className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary bg-clip-text text-transparent">
              stack.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl font-body text-sm leading-7 text-text-sub sm:text-base">
            A practical stack of tools, frameworks, and platforms we use to build,
            automate, deploy, and operate modern digital systems.
          </p>
        </motion.div>

        <motion.div
          className="relative mx-auto mt-12 w-full max-w-6xl overflow-hidden py-6"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24, scale: 0.985 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
        >
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-20 w-24 bg-gradient-to-r from-background-slate to-transparent sm:w-36"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-20 w-24 bg-gradient-to-l from-background-slate to-transparent sm:w-36"
            aria-hidden="true"
          />

          <TechStackMarquee items={techStackRowOne} direction="left" duration={58} />
          <div className="mt-5">
            <TechStackMarquee items={techStackRowTwo} direction="right" duration={64} />
          </div>
        </motion.div>
      </div>
    </HomeSection>
  );
}
