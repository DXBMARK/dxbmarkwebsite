"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Server, Activity, Clock, Cpu, ArrowUpRight } from "lucide-react";
import { HomeSection } from "@/components/home/sections/HomeSection";
import { Container } from "@/components/ui/layout";
import { HeroBadge } from "@/components/home/hero/HeroBadge";

interface StatItem {
  id: string;
  value: number;
  suffix: string;
  label: string;
  description: string;
}

const statsConfig: StatItem[] = [
  {
    id: "managed-servers",
    value: 5,
    suffix: "+",
    label: "Managed Servers",
    description: "Cloud environments and production infrastructure under active management.",
  },
  {
    id: "support-coverage",
    value: 24,
    suffix: "/7",
    label: "Support Coverage",
    description: "Monitoring, technical support, and incident response.",
  },
  {
    id: "open-projects",
    value: 8,
    suffix: "",
    label: "Open Projects",
    description: "Active builds, implementations, and delivery pipelines.",
  },
  {
    id: "system-uptime",
    value: 99.9,
    suffix: "%",
    label: "System Uptime",
    description: "Monitored availability across managed systems.",
  },
];

function CountUp({
  value,
  duration = 1.5,
  decimals = 0,
}: {
  value: number;
  duration?: number;
  decimals?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      const timer = setTimeout(() => setCount(value), 0);
      return () => clearTimeout(timer);
    }
    if (!isInView) return;

    const start = 0;
    const end = value;
    const totalFrames = Math.round(duration * 60);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const easeProgress = progress * (2 - progress); // Ease out quad
      const current = start + (end - start) * easeProgress;

      setCount(current);

      if (frame >= totalFrames) {
        setCount(end);
        clearInterval(counter);
      }
    }, 1000 / 60);

    return () => clearInterval(counter);
  }, [isInView, value, duration, shouldReduceMotion]);

  return <span ref={ref}>{count.toFixed(decimals)}</span>;
}

export function StatsSection() {
  const shouldReduceMotion = useReducedMotion();
  const titleRef = useRef(null);
  
  // 3D Parallax Tilt Effect States
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate mouse position relative to center of the card
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    // Calculate rotation: max 12 degrees tilt
    const rX = -(mouseY / height) * 12;
    const rY = (mouseX / width) * 12;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  // Find individual config stats to render in specific Bento layout nodes
  const managedServers = statsConfig.find((s) => s.id === "managed-servers") || statsConfig[0];
  const openProjects = statsConfig.find((s) => s.id === "open-projects") || statsConfig[2];
  const supportCoverage = statsConfig.find((s) => s.id === "support-coverage") || statsConfig[1];
  const systemUptime = statsConfig.find((s) => s.id === "system-uptime") || statsConfig[3];

  const cardsContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 12, filter: "blur(3px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <HomeSection
      id="operational-stats"
      className="relative overflow-hidden"
      aria-labelledby="home-stats-title"
    >
      {/* Background Subtle Radial Glow */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-glow blur-[120px] opacity-10" />
      </div>

      <div className="relative z-10 flex min-h-[calc(100svh-100px)] lg:min-h-[85svh] w-full flex-col justify-center px-4 pt-16 pb-12 sm:px-6 sm:pt-20 sm:pb-16 lg:px-8 lg:pt-20 lg:pb-16">
        {/* Section Title - centered at the top of the section */}
        <motion.div
          ref={titleRef}
          className="mx-auto max-w-4xl text-center mb-8 lg:mb-10"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 14, filter: "blur(6px)" }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <div className="flex justify-center">
            <HeroBadge label="OPERATIONAL METRICS" />
          </div>

          <h2
            id="home-stats-title"
            className="mt-5 text-balance font-display text-3xl font-black tracking-tight text-text-main sm:text-4xl lg:text-5xl"
          >
            Numbers behind{" "}
            <span className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary bg-clip-text text-transparent">
              reliable systems.
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl font-body text-xs leading-relaxed text-text-sub sm:text-sm">
            Infrastructure, support, and active delivery work behind DXBMARK projects — presented clearly without exaggerated claims.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <Container>
          <motion.div
            className="grid grid-cols-12 gap-4 sm:gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={shouldReduceMotion ? {} : cardsContainerVariants}
          >
            {/* Left Column: Visual Console Card (col-span-12 lg:col-span-5 lg:row-span-2) */}
            <motion.div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              variants={cardVariants}
              className="relative col-span-12 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brand-primary/10 via-[#0d2130]/40 to-transparent p-5 lg:col-span-5 lg:row-span-2 flex flex-col justify-between group cursor-default"
              style={{
                minHeight: "330px",
                transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                transformStyle: "preserve-3d",
                transition: rotateX === 0 && rotateY === 0 ? "transform 0.5s ease" : "transform 0.1s ease-out"
              }}
            >
              {/* Header Live Tag */}
              <div 
                className="absolute right-4 top-4 z-20 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-background-slate/60 px-2.5 py-1 backdrop-blur"
                style={{ transform: "translateZ(30px)" }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-text-sub">Live</span>
              </div>

              {/* Floater graphics area */}
              <div className="relative flex h-full w-full items-center justify-center py-6">
                {/* Visual Card 1: deploy.log */}
                <motion.div
                  animate={
                    shouldReduceMotion
                      ? {}
                      : {
                          y: [0, -6, 0],
                        }
                  }
                  transition={
                    shouldReduceMotion
                      ? {}
                      : {
                          duration: 5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }
                  }
                  className="absolute left-2 top-4 w-[65%] -rotate-[10deg] rounded-xl border border-white/15 bg-background-slate/80 p-3 shadow-2xl backdrop-blur-md"
                  style={{ transform: "translateZ(20px) rotate(-10deg)" }}
                >
                  <div className="mb-2.5 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500/60"></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500/60"></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/60"></span>
                    <span className="ml-2 font-mono text-[9px] uppercase tracking-wider text-text-sub">deploy.log</span>
                  </div>
                  <div className="space-y-1 font-mono text-[9px] leading-relaxed text-text-main">
                    <div className="text-text-sub">$ dxbm deploy --prod</div>
                    <div className="flex justify-between">
                      <span className="text-text-main/70">→ provisioning nodes</span>
                      <span className="text-emerald-400 font-bold">ok</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-main/70">→ scaling cluster</span>
                      <span className="text-emerald-400 font-bold">ok</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-main/70">→ routing traffic</span>
                      <span className="text-brand-primary font-bold">live</span>
                    </div>
                  </div>
                </motion.div>

                {/* Visual Card 2: Main Active Console Panel */}
                <motion.div
                  animate={
                    shouldReduceMotion
                      ? {}
                      : {
                          y: [0, 6, 0],
                        }
                  }
                  transition={
                    shouldReduceMotion
                      ? {}
                      : {
                          duration: 6,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }
                  }
                  className="relative z-10 w-[78%] translate-x-3 -translate-y-2 rotate-[4deg] rounded-xl border border-white/20 bg-[#0c1f2d]/90 shadow-2xl backdrop-blur-xl"
                  style={{ transform: "translateZ(40px) rotate(4deg)" }}
                >
                  <div className="flex items-center justify-between border-b border-white/10 px-3.5 py-2">
                    <div className="flex items-center gap-2">
                      <div className="h-4.5 w-4.5 rounded bg-brand-primary flex items-center justify-center text-white">
                        <Cpu className="h-3 w-3" />
                      </div>
                      <span className="font-mono text-[9px] font-semibold uppercase tracking-widest text-text-main">Console</span>
                    </div>
                    <span className="rounded bg-brand-primary px-1.5 py-0.5 text-[8px] font-bold text-white animate-pulse">ACTIVE</span>
                  </div>
                  <div className="space-y-3 p-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-[8px] uppercase tracking-widest text-text-sub">Cloud uptime</div>
                        <div className="mt-0.5 font-sans text-2xl font-black text-text-main tabular-nums"><span>99.9%</span></div>
                      </div>
                      <div className="text-right">
                        <div className="text-[8px] uppercase tracking-widest text-text-sub">Reqs/s</div>
                        <div className="mt-0.5 font-sans text-lg font-bold text-brand-primary tabular-nums">12.4k</div>
                      </div>
                    </div>
                    {/* Simulated mini activity bars */}
                    <div className="flex h-11 items-end gap-1">
                      <div className="flex-1 rounded-t bg-white/10" style={{ height: "40%" }}><div className="h-full w-full rounded-t bg-brand-primary opacity-40"></div></div>
                      <div className="flex-1 rounded-t bg-white/10" style={{ height: "65%" }}><div className="h-full w-full rounded-t bg-brand-primary opacity-[0.65]"></div></div>
                      <div className="flex-1 rounded-t bg-white/10" style={{ height: "35%" }}><div className="h-full w-full rounded-t bg-brand-primary opacity-[0.35]"></div></div>
                      <div className="flex-1 rounded-t bg-white/10" style={{ height: "80%" }}><div className="h-full w-full rounded-t bg-brand-primary opacity-80"></div></div>
                      <div className="flex-1 rounded-t bg-white/10" style={{ height: "55%" }}><div className="h-full w-full rounded-t bg-brand-primary opacity-[0.55]"></div></div>
                      <div className="flex-1 rounded-t bg-white/10" style={{ height: "95%" }}><div className="h-full w-full rounded-t bg-brand-primary opacity-[0.95]"></div></div>
                      <div className="flex-1 rounded-t bg-white/10" style={{ height: "70%" }}><div className="h-full w-full rounded-t bg-brand-primary opacity-[0.7]"></div></div>
                      <div className="flex-1 rounded-t bg-white/10" style={{ height: "88%" }}><div className="h-full w-full rounded-t bg-brand-primary opacity-[0.88]"></div></div>
                      <div className="flex-1 rounded-t bg-white/10" style={{ height: "60%" }}><div className="h-full w-full rounded-t bg-brand-primary opacity-60"></div></div>
                      <div className="flex-1 rounded-t bg-white/10" style={{ height: "100%" }}><div className="h-full w-full rounded-t bg-brand-primary opacity-100"></div></div>
                      <div className="flex-1 rounded-t bg-white/10" style={{ height: "75%" }}><div className="h-full w-full rounded-t bg-brand-primary opacity-[0.75]"></div></div>
                      <div className="flex-1 rounded-t bg-white/10" style={{ height: "92%" }}><div className="h-full w-full rounded-t bg-brand-primary opacity-[0.92]"></div></div>
                    </div>
                    <div className="flex items-center justify-between text-[8px] uppercase tracking-widest text-text-sub">
                      <span>00:00</span>
                      <span>now</span>
                    </div>
                  </div>
                </motion.div>

                {/* Visual Card 3: Mini chart floater - Raised up slightly & layered under the Console card */}
                <motion.div
                  animate={
                    shouldReduceMotion
                      ? {}
                      : {
                          y: [0, -4, 0],
                        }
                  }
                  transition={
                    shouldReduceMotion
                      ? {}
                      : {
                          duration: 4.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }
                  }
                  className="absolute bottom-8 right-6 z-0 w-24 -rotate-[8deg] rounded-lg border border-white/15 bg-background-slate/80 p-2 shadow-xl backdrop-blur-md"
                  style={{ transform: "translateZ(10px) rotate(-8deg)" }}
                >
                  <div className="mb-2 h-1 w-6 rounded-full bg-white/20"></div>
                  <div className="space-y-1">
                    <div className="h-1.5 rounded bg-white/15"></div>
                    <div className="h-1.5 w-3/4 rounded bg-white/10"></div>
                    <div className="mt-2 h-6 rounded bg-brand-primary/30"></div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Column: Managed Servers (col-span-12 sm:col-span-6 lg:col-span-3) */}
            <motion.div
              variants={cardVariants}
              className="col-span-12 sm:col-span-6 lg:col-span-3 p-5 sm:p-6 rounded-2xl border border-white/[0.04] bg-white/[0.01] backdrop-blur-sm flex flex-col justify-between group cursor-default relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
              <div className="flex justify-between items-start">
                <div className="p-2 rounded-lg border border-white/[0.05] bg-white/[0.02] text-text-sub group-hover:text-brand-primary group-hover:border-brand-primary/20 transition-all duration-300">
                  <Server className="h-4 w-4" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-text-muted-gray opacity-0 group-hover:opacity-100 group-hover:text-brand-primary transition-all duration-300" />
              </div>

              <div className="mt-6">
                <p className="font-sans text-3xl sm:text-4xl font-black tracking-tight text-text-main">
                  <CountUp value={managedServers.value} decimals={0} />
                  <span className="text-brand-primary">{managedServers.suffix}</span>
                </p>
                <h3 className="mt-1.5 font-sans text-xs sm:text-sm font-bold text-text-main">
                  {managedServers.label}
                </h3>
                <p className="mt-1 font-body text-[10px] sm:text-xs leading-relaxed text-text-sub">
                  {managedServers.description}
                </p>
              </div>
            </motion.div>

            {/* Right Column: Open Projects (col-span-12 sm:col-span-6 lg:col-span-4) */}
            <motion.div
              variants={cardVariants}
              className="col-span-12 sm:col-span-6 lg:col-span-4 p-5 sm:p-6 rounded-2xl border border-white/[0.04] bg-white/[0.01] backdrop-blur-sm flex flex-col justify-between group cursor-default relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
              <div className="flex justify-between items-start">
                <div className="p-2 rounded-lg border border-white/[0.05] bg-white/[0.02] text-text-sub group-hover:text-brand-primary group-hover:border-brand-primary/20 transition-all duration-300">
                  <Activity className="h-4 w-4" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-text-muted-gray opacity-0 group-hover:opacity-100 group-hover:text-brand-primary transition-all duration-300" />
              </div>

              <div className="mt-6">
                <p className="font-sans text-3xl sm:text-4xl font-black tracking-tight text-text-main">
                  <CountUp value={openProjects.value} decimals={0} />
                  <span className="text-brand-primary">{openProjects.suffix}</span>
                </p>
                <h3 className="mt-1.5 font-sans text-xs sm:text-sm font-bold text-text-main">
                  {openProjects.label}
                </h3>
                <p className="mt-1 font-body text-[10px] sm:text-xs leading-relaxed text-text-sub">
                  {openProjects.description}
                </p>
              </div>
            </motion.div>

            {/* Right Column: Support Coverage + Uptime Highlight Card (col-span-12 lg:col-span-7) */}
            <motion.div
              variants={cardVariants}
              className="col-span-12 lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#f97e1a] to-[#d65f08] text-white flex flex-col justify-between relative overflow-hidden shadow-[0_12px_40px_rgba(249,126,26,0.12)] border border-[#ff9d47]/20 group cursor-default"
            >
              {/* Ambient pattern */}
              <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05)_0%,transparent_60%)] bg-[size:10px_10px] opacity-40"
                aria-hidden="true"
              />

              <div className="relative z-10 flex justify-between items-center w-full">
                <div className="p-2 rounded-lg bg-white/10 border border-white/10 text-white">
                  <Clock className="h-4 w-4" />
                </div>
                <span className="font-label text-[9px] font-bold text-white/90 bg-white/10 px-2 py-0.5 rounded border border-white/10">
                  OFFICIAL SLA
                </span>
              </div>

              <div className="relative z-10 mt-6 grid grid-cols-2 gap-4 sm:gap-6 divide-x divide-white/10">
                {/* Left Column: Support Coverage */}
                <div className="pr-3 sm:pr-4">
                  <p className="font-sans text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-sm">
                    <CountUp value={supportCoverage.value} decimals={0} />
                    <span className="text-white/80">{supportCoverage.suffix}</span>
                  </p>
                  <h3 className="mt-1.5 font-sans text-xs sm:text-sm font-bold text-white">
                    {supportCoverage.label}
                  </h3>
                  <p className="mt-1 font-body text-[10px] sm:text-xs leading-relaxed text-white/80">
                    {supportCoverage.description}
                  </p>
                </div>

                {/* Right Column: System Uptime */}
                <div className="pl-4 sm:pl-6">
                  <p className="font-sans text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-sm">
                    <CountUp value={systemUptime.value} decimals={1} />
                    <span className="text-white/80">{systemUptime.suffix}</span>
                  </p>
                  <h3 className="mt-1.5 font-sans text-xs sm:text-sm font-bold text-white">
                    {systemUptime.label}
                  </h3>
                  <p className="mt-1 font-body text-[10px] sm:text-xs leading-relaxed text-white/80">
                    {systemUptime.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </div>
    </HomeSection>
  );
}
