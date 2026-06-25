"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { SaasSystemId } from "@/content/home/saas-systems";

// ============================================================================
// DESIGN TOKENS (aligned with globals.css — no raw hex except approved orange)
// ============================================================================
const ORANGE = "var(--color-accent-primary)";

// ============================================================================
// SHARED PRIMITIVES
// ============================================================================

function WindowDots() {
  return (
    <div className="flex items-center gap-1.5" aria-hidden="true">
      <span className="h-2 w-2 rounded-full bg-rose-400/60" />
      <span className="h-2 w-2 rounded-full bg-amber-400/60" />
      <span className="h-2 w-2 rounded-full bg-emerald-400/60" />
    </div>
  );
}

/** Glass card shell */
function GlassCard({
  children,
  className,
  glow,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm",
        glow && "shadow-[0_0_24px_rgba(249,126,26,0.12)] border-brand-primary/20",
        className
      )}
    >
      {/* top shimmer */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-xl bg-gradient-to-r from-transparent via-white/12 to-transparent" />
      {children}
    </div>
  );
}

/** Chrome topbar for dashboard shell */
function Shell({
  title,
  badge,
  children,
}: {
  title: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-[rgba(10,16,32,0.85)] shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
      {/* Topbar */}
      <div className="flex shrink-0 items-center justify-between border-b border-white/[0.07] px-4 py-2.5">
        <div className="flex items-center gap-3">
          <WindowDots />
          <span className="font-code text-[10px] tracking-wider text-text-muted-gray">{title}</span>
        </div>
        {badge}
      </div>
      {/* top-edge shimmer */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      {children}
    </div>
  );
}

/** Pulsing live dot */
function LiveDot({ color = "green" }: { color?: "green" | "orange" }) {
  const bg = color === "green" ? "bg-emerald-400" : "bg-brand-primary";
  return (
    <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
      <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-50", bg)} />
      <span className={cn("relative inline-flex h-2 w-2 rounded-full", bg)} />
    </span>
  );
}

/** Status pill */
function Pill({
  label,
  color,
}: {
  label: string;
  color: "green" | "orange" | "gray" | "blue" | "red";
}) {
  const cls = {
    green: "border-emerald-500/30 bg-emerald-500/[0.12] text-emerald-400",
    orange: "border-brand-primary/30 bg-brand-primary/[0.12] text-brand-primary",
    gray: "border-white/10 bg-white/[0.05] text-text-muted-gray",
    blue: "border-sky-500/30 bg-sky-500/[0.10] text-sky-400",
    red: "border-rose-500/30 bg-rose-500/[0.10] text-rose-400",
  }[color];
  return (
    <span className={cn("rounded-full border px-2 py-[2px] font-label text-[9px] font-semibold uppercase tracking-wider", cls)}>
      {label}
    </span>
  );
}

/** Status dot */
function Dot({ color }: { color: "green" | "orange" | "gray" | "blue" }) {
  const cls = {
    green: "bg-emerald-400",
    orange: "bg-brand-primary",
    gray: "bg-white/25",
    blue: "bg-sky-400",
  }[color];
  return <span className={cn("inline-block h-1.5 w-1.5 shrink-0 rounded-full", cls)} aria-hidden="true" />;
}



/** Standard KPI card */
function KpiCard({
  label,
  value,
  sub,
  trend,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  trend?: "up" | "down";
  accent?: boolean;
}) {
  return (
    <GlassCard className={cn("flex flex-col gap-0.5 p-2.5", accent && "glow")} glow={accent}>
      <span className="font-label text-[8px] uppercase tracking-widest text-text-muted-gray">{label}</span>
      <span className={cn("font-code text-sm font-bold leading-tight", accent ? "text-brand-primary" : "text-text-main")}>{value}</span>
      {sub && (
        <span className={cn("font-body text-[8px] leading-none", trend === "up" ? "text-emerald-400" : trend === "down" ? "text-rose-400" : "text-text-muted-gray")}>
          {sub}
        </span>
      )}
    </GlassCard>
  );
}

/** Data table row */
function DataRow({
  label,
  right,
  dot,
}: {
  label: string;
  right: React.ReactNode;
  dot?: "green" | "orange" | "gray" | "blue";
}) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-white/[0.05] py-1.5 last:border-0">
      <div className="flex min-w-0 items-center gap-2">
        {dot && <Dot color={dot} />}
        <span className="truncate font-body text-[10px] text-text-sub">{label}</span>
      </div>
      <div className="shrink-0">{right}</div>
    </div>
  );
}

/** Activity row */
function ActivityRow({ time, text, color = "orange" }: { time: string; text: string; color?: "orange" | "green" | "blue" }) {
  const bg = { orange: "bg-brand-primary/50", green: "bg-emerald-400/50", blue: "bg-sky-400/50" }[color];
  return (
    <div className="flex items-start gap-2 py-[3px]">
      <span className={cn("mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full", bg)} aria-hidden="true" />
      <p className="min-w-0 flex-1 truncate font-body text-[10px] leading-snug text-text-sub">{text}</p>
      <span className="shrink-0 font-code text-[9px] text-text-muted-gray">{time}</span>
    </div>
  );
}





// ============================================================================
// PREMIUM HELPER COMPONENTS
// ============================================================================

function AppSidebar({
  items,
  active = 0,
}: {
  items: string[];
  active?: number;
}) {
  return (
    <aside className="flex w-[92px] shrink-0 flex-col border-r border-white/[0.07] bg-white/[0.025] px-2 py-3">
      <div className="mb-3 rounded-lg border border-brand-primary/20 bg-brand-primary/[0.08] px-2 py-2 text-center font-label text-[9px] font-bold uppercase tracking-widest text-brand-primary">
        DXBM
      </div>
      
      <nav className="flex flex-1 flex-col gap-1">
        {items.map((item, index) => (
          <div
            key={item}
            className={cn(
              "rounded-lg px-2 py-2 font-label text-[9px] uppercase tracking-wider transition-colors",
              index === active
                ? "bg-brand-primary/15 text-brand-primary shadow-[inset_2px_0_0_var(--color-accent-primary)]"
                : "text-text-muted-gray hover:bg-white/[0.04] hover:text-text-sub",
            )}
          >
            {item}
          </div>
        ))}
      </nav>
      
      <div className="mt-3 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2 py-2 font-code text-[8px] text-text-muted-gray">
        v2.4.1
      </div>
    </aside>
  );
}

function DashboardTopbar({
  title,
  right,
}: {
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex shrink-0 items-center justify-between border-b border-white/[0.07] px-4 py-2.5">
      <div className="flex items-center gap-3">
        <WindowDots />
        <span className="font-code text-[10px] tracking-wider text-text-muted-gray">
          {title}
        </span>
      </div>
      {right}
    </div>
  );
}

function PremiumShell({
  title,
  sidebar,
  right,
  children,
}: {
  title: string;
  sidebar?: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-full overflow-hidden rounded-2xl border border-white/[0.1] bg-[rgba(8,14,28,0.9)] shadow-[0_0_55px_rgba(0,0,0,0.55)] backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(249,126,26,0.08),transparent_32%),radial-gradient(circle_at_30%_80%,rgba(56,189,248,0.06),transparent_34%)]" />
      <div className="relative z-10 flex h-full w-full flex-col">
        <DashboardTopbar title={title} right={right} />
        <div className="flex min-h-0 flex-1">
          {sidebar}
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}

function MetricBlock({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-white/[0.04] p-3",
        accent
          ? "border-brand-primary/30 shadow-[0_0_24px_rgba(249,126,26,0.12)]"
          : "border-white/[0.08]",
      )}
    >
      <div className="font-label text-[8px] uppercase tracking-widest text-text-muted-gray">
        {label}
      </div>
      <div
        className={cn(
          "mt-1 font-code text-lg font-black leading-none",
          accent ? "text-brand-primary" : "text-text-main",
        )}
      >
        {value}
      </div>
      {sub && <div className="mt-1 font-body text-[9px] text-emerald-400">{sub}</div>}
    </div>
  );
}



function ScreenCard({
  children,
  className,
  glow,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.04]",
        glow && "border-brand-primary/30 shadow-[0_0_28px_rgba(249,126,26,0.14)]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      {children}
    </div>
  );
}

// ============================================================================
// DASHBOARD 1 — SaaS Platforms
// Premium SaaS subscription engine: dominant MRR showcase with floating revenue metrics
// ============================================================================
function DashSaasPlat() {
  return (
    <Shell
      title="platform.dxbmark.com — Revenue Console"
      badge={
        <div className="flex items-center gap-1.5">
          <LiveDot />
          <span className="font-label text-[9px] uppercase tracking-widest text-emerald-400">Revenue Active</span>
        </div>
      }
    >
      <div className="relative flex flex-1 overflow-hidden">
        {/* Ambient glow behind revenue area */}
        <div
          className="pointer-events-none absolute -top-20 left-1/4 h-60 w-80 rounded-full bg-brand-glow opacity-30 blur-[100px]"
          aria-hidden="true"
        />

        <div className="relative flex flex-1 flex-col gap-3 p-4">
          {/* Top row: KPI metrics */}
          <div className="grid grid-cols-3 gap-3">
            <KpiCard label="Total Users" value="1,248" sub="↑ 34 this week" trend="up" />
            <KpiCard label="Active Plans" value="342" sub="89% retention" accent trend="up" />
            <KpiCard label="Churn" value="1.1%" sub="↓ 0.3%" trend="down" />
          </div>

          {/* Central: Large MRR card with dominant visual */}
          <div className="relative flex-1 min-h-0">
            <GlassCard className="h-full flex flex-col p-4 relative overflow-hidden" glow>
              {/* Top shimmer */}
              <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-brand-primary/20 to-transparent pointer-events-none" />
              
              <div className="relative z-10 mb-3">
                <span className="font-label text-[9px] uppercase tracking-widest text-text-muted-gray">Monthly Recurring Revenue</span>
              </div>

              <div className="relative z-10 flex-1 flex flex-col justify-center">
                <span className="font-code text-5xl font-black text-brand-primary leading-tight mb-1">
                  $18.4k
                </span>
                <span className="font-body text-sm text-emerald-400">↑ 12% Month over Month</span>
              </div>

              {/* Floating stat cards */}
              <div className="absolute top-6 right-4 z-20 flex flex-col gap-2">
                <div className="bg-white/[0.04] border border-brand-primary/20 rounded-lg px-2.5 py-1.5 backdrop-blur-sm">
                  <span className="font-code text-[8px] text-text-muted-gray block">ARR</span>
                  <span className="font-code text-sm font-bold text-text-main">$220.8k</span>
                </div>
                <div className="bg-white/[0.04] border border-emerald-500/20 rounded-lg px-2.5 py-1.5 backdrop-blur-sm">
                  <span className="font-code text-[8px] text-text-muted-gray block">Net MRR</span>
                  <span className="font-code text-sm font-bold text-emerald-400">+$1.8k</span>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Bottom row: Plan distribution + activity */}
          <div className="grid grid-cols-[1fr_1.2fr] gap-3">
            {/* Plan split */}
            <GlassCard className="flex flex-col p-3">
              <span className="font-label text-[9px] uppercase tracking-widest text-text-muted-gray mb-2 block">Subscription Mix</span>
              <div className="flex flex-col gap-2.5">
                {[
                  { name: "Starter", pct: 45, cls: "bg-sky-400/40" },
                  { name: "Pro", pct: 34, cls: "bg-brand-primary/60" },
                  { name: "Enterprise", pct: 21, cls: "bg-brand-primary shadow-[0_0_8px_rgba(249,126,26,0.5)]" },
                ].map((p) => (
                  <div key={p.name}>
                    <div className="flex justify-between mb-1">
                      <span className="font-label text-[9px] text-text-muted-gray">{p.name}</span>
                      <span className="font-code text-[9px] text-text-sub">{p.pct}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                      <div className={cn("h-full rounded-full transition-all", p.cls)} style={{ width: `${p.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-auto pt-2 border-t border-white/[0.05]">
                <div className="flex items-center gap-1.5 text-[9px] text-text-muted-gray mt-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Active billing: 342
                </div>
              </div>
            </GlassCard>

            {/* Activity feed */}
            <GlassCard className="flex flex-col p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-label text-[9px] uppercase tracking-widest text-text-muted-gray">Recent Activity</span>
                <Pill label="Live" color="green" />
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <ActivityRow time="2m" text="user_1248 upgraded to Pro" color="orange" />
                <ActivityRow time="9m" text="user_1241 new Enterprise" color="green" />
                <ActivityRow time="31m" text="Billing cycle renewed" color="blue" />
                <ActivityRow time="47m" text="user_1206 downgraded" color="orange" />
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </Shell>
  );
}

// ============================================================================
// DASHBOARD 2 — Admin Dashboards
// Real admin dashboard with sidebar, topbar, metrics, chart, and data table
// ============================================================================
function DashAdmin() {
  return (
    <PremiumShell
      title="admin.ops — Operations Dashboard"
      right={
        <div className="flex items-center gap-2">
          <LiveDot />
          <span className="font-label text-[9px] uppercase tracking-widest text-emerald-400">
            Live Admin
          </span>
        </div>
      }
      sidebar={
        <AppSidebar
          active={0}
          items={["Dashboard", "Orders", "Users", "Reports", "Automation", "Settings"]}
        />
      }
    >
      <div className="grid h-full grid-rows-[auto_1fr_auto] gap-3 p-3">
        <div className="grid grid-cols-4 gap-2">
          <MetricBlock label="Revenue" value="$32.8k" sub="+18%" accent />
          <MetricBlock label="Orders" value="284" sub="+42 today" />
          <MetricBlock label="Users" value="2,540" sub="+7.4%" />
          <MetricBlock label="Uptime" value="99.9%" sub="stable" />
        </div>
        
        <div className="grid min-h-0 grid-cols-[1.35fr_0.65fr] gap-3">
          <ScreenCard glow className="flex flex-col p-4">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <div className="font-label text-[9px] uppercase tracking-widest text-text-muted-gray">
                  Revenue Performance
                </div>
                <div className="mt-2 font-code text-3xl font-black text-text-main">
                  $128.4k
                </div>
              </div>
              <Pill label="+22.4%" color="green" />
            </div>
            
            <div className="relative min-h-0 flex-1">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-brand-primary/[0.08] to-transparent" />
              <svg
                viewBox="0 0 420 180"
                className="relative h-full w-full"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M0 145 C35 120 50 132 78 105 C108 74 128 102 158 72 C188 42 210 68 238 45 C270 20 292 48 320 30 C356 6 380 24 420 8"
                  fill="none"
                  stroke={ORANGE}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M0 145 C35 120 50 132 78 105 C108 74 128 102 158 72 C188 42 210 68 238 45 C270 20 292 48 320 30 C356 6 380 24 420 8 L420 180 L0 180 Z"
                  fill="url(#adminRevenueFill)"
                  opacity="0.38"
                />
                <defs>
                  <linearGradient id="adminRevenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={ORANGE} stopOpacity="0.45" />
                    <stop offset="100%" stopColor={ORANGE} stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </ScreenCard>
          
          <div className="grid min-h-0 grid-rows-2 gap-3">
            <ScreenCard className="p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-label text-[9px] uppercase tracking-widest text-text-muted-gray">
                  System Health
                </span>
                <Pill label="Healthy" color="green" />
              </div>
              <div className="space-y-2">
                {[
                  ["API Server", "14ms", "green"],
                  ["Database", "3ms", "green"],
                  ["Cache Layer", "98%", "green"],
                  ["Queue", "3 jobs", "orange"],
                ].map(([label, value, color]) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="font-body text-[10px] text-text-sub">{label}</span>
                    <span className={cn("font-code text-[10px]", color === "green" ? "text-emerald-400" : "text-brand-primary")}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </ScreenCard>
            
            <ScreenCard className="p-3">
              <div className="mb-2 font-label text-[9px] uppercase tracking-widest text-text-muted-gray">
                Recent Orders
              </div>
              <DataRow label="Package A — Website" right={<Pill label="Shipped" color="green" />} dot="green" />
              <DataRow label="Package C — SaaS" right={<Pill label="Active" color="orange" />} dot="orange" />
              <DataRow label="Custom Build" right={<Pill label="Review" color="blue" />} dot="blue" />
            </ScreenCard>
          </div>
        </div>
        
        <div className="grid grid-cols-5 gap-2">
          {["Growth", "Billing", "Support", "Security", "Reports"].map((item, index) => (
            <div
              key={item}
              className="rounded-xl border border-white/[0.08] bg-white/[0.035] px-3 py-2 text-center font-label text-[9px] uppercase tracking-wider text-text-sub"
            >
              {index + 1}. {item}
            </div>
          ))}
        </div>
      </div>
    </PremiumShell>
  );
}

// ============================================================================
// DASHBOARD 3 — Client Portals
// Secure client workspace: timeline + requests + files, emphasizing collaboration
// ============================================================================
function DashPortal() {
  return (
    <Shell
      title="portal.secure — Client Workspace"
      badge={
        <div className="flex items-center gap-1.5">
          <Dot color="green" />
          <span className="font-label text-[9px] uppercase tracking-widest text-text-muted-gray">Secure</span>
        </div>
      }
    >
      <div className="relative flex flex-1 overflow-hidden">
        {/* Glow behind timeline */}
        <div
          className="pointer-events-none absolute top-1/3 left-1/2 h-72 w-96 rounded-full bg-brand-glow opacity-20 blur-[100px]"
          aria-hidden="true"
        />

        <div className="relative flex flex-1 flex-col gap-3 p-4">
          {/* Top summary */}
          <div className="grid grid-cols-3 gap-2">
            <KpiCard label="Open Requests" value="4" sub="2 in progress" accent />
            <KpiCard label="Files Shared" value="38" sub="4 new today" trend="up" />
            <KpiCard label="Due Amount" value="$3.2k" sub="2 pending" />
          </div>

          {/* Main: Timeline + Requests */}
          <div className="flex-1 min-h-0 grid grid-cols-[1.5fr_1fr] gap-3">
            {/* Timeline */}
            <GlassCard className="flex flex-col p-4 relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-brand-primary/10 to-transparent pointer-events-none" />
              
              <div className="relative z-10 mb-3">
                <span className="font-label text-[9px] uppercase tracking-widest text-text-muted-gray block">Project Timeline</span>
                <span className="font-body text-[9px] text-text-sub mt-0.5">Current Stage: Client Review</span>
              </div>

              <div className="relative flex flex-1 flex-col justify-center gap-0">
                {/* Connector line */}
                <div className="absolute left-2 top-8 bottom-0 w-px bg-gradient-to-b from-brand-primary/40 to-white/[0.05]" aria-hidden="true" />

                {[
                  { step: "Kickoff", done: true, icon: "✓" },
                  { step: "Requirements Review", done: true, icon: "✓" },
                  { step: "Design Phase", done: true, icon: "✓" },
                  { step: "Client Review", active: true, icon: "▶" },
                  { step: "Final Delivery", done: false, icon: "◯" },
                ].map((s, i) => (
                  <div key={i} className="relative flex items-center gap-3 py-2">
                    <span
                      className={cn(
                        "relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                        (s as { active?: boolean }).active
                          ? "border-2 border-brand-primary bg-brand-primary/20 text-brand-primary shadow-[0_0_12px_rgba(249,126,26,0.4)]"
                          : s.done
                          ? "border-2 border-emerald-500 bg-emerald-500/20 text-emerald-400"
                          : "border-2 border-white/20 bg-white/[0.02] text-white/40"
                      )}
                      aria-hidden="true"
                    >
                      {(s as { active?: boolean }).active ? "▸" : s.done ? "✓" : "○"}
                    </span>
                    <span
                      className={cn(
                        "font-body text-[10px] font-medium",
                        (s as { active?: boolean }).active
                          ? "text-brand-primary font-semibold"
                          : s.done
                          ? "text-text-sub"
                          : "text-text-muted-gray"
                      )}
                    >
                      {s.step}
                    </span>
                    {(s as { active?: boolean }).active && (
                      <span className="ml-auto shrink-0">
                        <Pill label="Now" color="orange" />
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Requests + Files */}
            <div className="flex flex-col gap-3">
              {/* Active requests */}
              <GlassCard className="shrink-0 p-3">
                <span className="font-label text-[9px] uppercase tracking-widest text-text-muted-gray mb-2 block">Active Requests</span>
                <div className="flex flex-col gap-1.5">
                  <DataRow label="Homepage redesign" right={<Pill label="In Review" color="orange" />} dot="orange" />
                  <DataRow label="Export feature" right={<Pill label="In Prog" color="blue" />} dot="blue" />
                  <DataRow label="Login fix" right={<Pill label="Resolved" color="green" />} dot="green" />
                </div>
              </GlassCard>

              {/* Secure session */}
              <GlassCard className="flex-1 min-h-0 p-3 relative">
                <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />
                
                <div className="relative z-10 flex flex-col gap-2.5">
                  <div>
                    <span className="font-label text-[9px] uppercase tracking-widest text-text-muted-gray block mb-1">Session Info</span>
                    <div className="flex items-center gap-1.5">
                      <LiveDot />
                      <span className="font-body text-[9px] text-text-sub">Active session</span>
                    </div>
                  </div>
                  <div className="border-t border-white/[0.05] pt-2">
                    <span className="font-label text-[9px] uppercase tracking-widest text-text-muted-gray block mb-1">Security</span>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span className="font-code text-[9px] text-text-muted-gray">256-bit encrypted</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span className="font-code text-[9px] text-text-muted-gray">Last login: 3h ago</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

// ============================================================================
// DASHBOARD 4 — Workflow Automation
// PREMIUM n8n-inspired automation canvas with cinematic composition
// ============================================================================

function DashWorkflow() {
  // Dramatically staged flow with asymmetric branching
  const nodes = [
    { label: "Lead Form", sub: "Trigger", x: 10, y: 48, color: "green", size: "large" },
    { label: "CRM Sync", sub: "Action", x: 30, y: 48, color: "blue", size: "medium" },
    { label: "Payment Check", sub: "Condition", x: 52, y: 48, color: "orange", size: "hero" },
    { label: "Create Task", sub: "Action", x: 75, y: 28, color: "blue", size: "medium" },
    { label: "Notify Team", sub: "Slack", x: 75, y: 68, color: "blue", size: "medium" },
    { label: "Success", sub: "Complete", x: 92, y: 48, color: "green", size: "large" },
  ];
  
  // Premium curved Bezier paths with intentional dramatic branching
  const edges = [
    { path: "M 10 48 C 18 48, 22 48, 30 48", from: "green", to: "blue" },
    { path: "M 30 48 C 38 48, 44 48, 52 48", from: "blue", to: "orange" },
    { path: "M 52 48 C 60 38, 68 30, 75 28", from: "orange", to: "blue" },
    { path: "M 52 48 C 60 58, 68 66, 75 68", from: "orange", to: "blue" },
    { path: "M 75 28 C 81 32, 87 42, 92 48", from: "blue", to: "green" },
    { path: "M 75 68 C 81 64, 87 54, 92 48", from: "blue", to: "green" },
  ];
  
  return (
    <PremiumShell
      title="workflow.engine — Automation Builder"
      right={
        <div className="flex items-center gap-2">
          <LiveDot color="orange" />
          <span className="font-label text-[9px] uppercase tracking-widest text-brand-primary">Live Orchestration</span>
        </div>
      }
    >
      <div className="relative h-full overflow-hidden">
        {/* Dramatic ambient glows behind key nodes */}
        <div className="pointer-events-none absolute left-[52%] top-[48%] h-48 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-glow opacity-25 blur-[90px]" aria-hidden="true" />
        <div className="pointer-events-none absolute left-[10%] top-[48%] h-32 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/20 opacity-20 blur-[70px]" aria-hidden="true" />
        <div className="pointer-events-none absolute left-[92%] top-[48%] h-32 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/20 opacity-20 blur-[70px]" aria-hidden="true" />
        
        <div className="flex h-full flex-col gap-3 p-3">
          {/* Canvas dominates — 85% of vertical space */}
          <div className="relative flex-1 min-h-0">
            <ScreenCard glow className="relative h-full overflow-hidden">
              {/* Subtle grid background for product feel */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(249,126,26,0.15) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(249,126,26,0.15) 1px, transparent 1px)
                  `,
                  backgroundSize: "24px 24px",
                }}
                aria-hidden="true"
              />
              
              {/* Central radial glow */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_52%_48%,rgba(249,126,26,0.12),transparent_45%)]" aria-hidden="true" />
              
              {/* Canvas SVG — all connectors and particles */}
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid meet"
                className="absolute inset-0 h-full w-full"
                aria-hidden="true"
              >
                <defs>
                  <filter id="workflowGlow2" x="-80%" y="-80%" width="260%" height="260%">
                    <feGaussianBlur stdDeviation="1.8" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                
                {edges.map((edge, index) => (
                  <g key={index}>
                    {/* Base connector line */}
                    <path
                      d={edge.path}
                      fill="none"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="1"
                      strokeLinecap="round"
                    />
                    {/* Animated dashed line */}
                    <path
                      d={edge.path}
                      fill="none"
                      stroke={ORANGE}
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeDasharray="6 10"
                      filter="url(#workflowGlow2)"
                      opacity="0.75"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        from="24"
                        to="0"
                        dur={`${1.5 + index * 0.15}s`}
                        repeatCount="indefinite"
                      />
                    </path>
                    {/* Traveling particle */}
                    <circle r="2" fill={ORANGE} filter="url(#workflowGlow2)" opacity="0.9">
                      <animateMotion
                        path={edge.path}
                        dur={`${1.8 + index * 0.12}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                ))}
              </svg>
              
              {/* Premium nodes with z-depth */}
              {nodes.map((node) => {
                const sizeClasses = {
                  large: "min-w-[110px] px-4 py-3",
                  medium: "min-w-[96px] px-3 py-2.5",
                  hero: "min-w-[130px] px-5 py-4",
                };
                
                const colorClasses = {
                  green: "border-emerald-500/50 bg-emerald-500/[0.15] text-emerald-400 shadow-[0_0_32px_rgba(52,211,153,0.2)]",
                  blue: "border-sky-500/50 bg-sky-500/[0.14] text-sky-400 shadow-[0_0_28px_rgba(56,189,248,0.18)]",
                  orange: "border-brand-primary/60 bg-brand-primary/[0.16] text-brand-primary shadow-[0_0_42px_rgba(249,126,26,0.3)]",
                };
                
                return (
                  <div
                    key={node.label}
                    className={cn(
                      "absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border-2 backdrop-blur-xl transition-all duration-300",
                      sizeClasses[node.size as keyof typeof sizeClasses],
                      colorClasses[node.color as keyof typeof colorClasses]
                    )}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  >
                    <div className={cn(
                      "font-label font-black uppercase tracking-wide",
                      node.size === "hero" ? "text-[11px]" : "text-[10px]"
                    )}>
                      {node.label}
                    </div>
                    <div className={cn(
                      "mt-1 font-code text-text-muted-gray",
                      node.size === "hero" ? "text-[9px]" : "text-[8px]"
                    )}>
                      {node.sub}
                    </div>
                  </div>
                );
              })}
              
              {/* Floating inspector card — product-style detail */}
              <div className="absolute bottom-3 left-3 w-48 rounded-lg border border-white/[0.12] bg-[rgba(10,16,32,0.92)] px-3 py-2 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="font-label text-[8px] uppercase tracking-widest text-text-muted-gray">Node Inspector</span>
                  <Pill label="Active" color="orange" />
                </div>
                <div className="font-body text-[10px] text-text-sub">
                  <div className="mb-1">Payment Check</div>
                  <div className="flex items-center gap-1.5 text-[9px] text-text-muted-gray">
                    <Dot color="orange" />
                    <span>Processing 2 branches</span>
                  </div>
                </div>
              </div>
            </ScreenCard>
          </div>
          
          {/* Compact execution log — 15% of vertical space */}
          <div className="shrink-0">
            <ScreenCard className="px-3 py-2">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="font-label text-[8px] uppercase tracking-widest text-text-muted-gray">Execution Log</span>
                <div className="flex items-center gap-1">
                  <LiveDot />
                  <span className="font-code text-[8px] text-emerald-400">Live</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                <div className="flex items-start gap-1.5 py-[2px]">
                  <span className="mt-[4px] h-1 w-1 shrink-0 rounded-full bg-emerald-400" aria-hidden="true" />
                  <span className="font-code text-[9px] text-text-sub">Trigger fired</span>
                  <span className="ml-auto font-code text-[8px] text-text-muted-gray">0s</span>
                </div>
                <div className="flex items-start gap-1.5 py-[2px]">
                  <span className="mt-[4px] h-1 w-1 shrink-0 rounded-full bg-sky-400" aria-hidden="true" />
                  <span className="font-code text-[9px] text-text-sub">CRM synced</span>
                  <span className="ml-auto font-code text-[8px] text-text-muted-gray">1.2s</span>
                </div>
                <div className="flex items-start gap-1.5 py-[2px]">
                  <span className="mt-[4px] h-1 w-1 shrink-0 rounded-full bg-brand-primary" aria-hidden="true" />
                  <span className="font-code text-[9px] text-text-sub">Payment OK</span>
                  <span className="ml-auto font-code text-[8px] text-text-muted-gray">2.1s</span>
                </div>
                <div className="flex items-start gap-1.5 py-[2px]">
                  <span className="mt-[4px] h-1 w-1 shrink-0 rounded-full bg-emerald-400" aria-hidden="true" />
                  <span className="font-code text-[9px] text-text-sub">Complete</span>
                  <span className="ml-auto font-code text-[8px] text-text-muted-gray">3.4s</span>
                </div>
              </div>
            </ScreenCard>
          </div>
        </div>
      </div>
    </PremiumShell>
  );
}

// ============================================================================
// DASHBOARD 5 — Custom Business Systems
// PREMIUM system transformation board with dramatic hero core
// ============================================================================

function DashCustom() {
  return (
    <PremiumShell
      title="system.builder — Custom Business OS"
      right={
        <div className="flex items-center gap-2">
          <Pill label="Live Build" color="orange" />
          <span className="font-code text-[9px] text-sky-400">v2.4.1</span>
        </div>
      }
    >
      <div className="relative h-full overflow-hidden p-3">
        {/* Dramatic hero glow behind core */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-glow opacity-30 blur-[110px]" aria-hidden="true" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-primary/20 opacity-40 blur-[80px]" aria-hidden="true" />
        
        {/* Left scatter glows */}
        <div className="pointer-events-none absolute left-[15%] top-[30%] h-24 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500/15 opacity-20 blur-[60px]" aria-hidden="true" />
        <div className="pointer-events-none absolute left-[18%] top-[70%] h-24 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500/15 opacity-20 blur-[60px]" aria-hidden="true" />
        
        {/* Right organized glows */}
        <div className="pointer-events-none absolute left-[85%] top-[50%] h-32 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/15 opacity-25 blur-[70px]" aria-hidden="true" />
        
        <div className="relative z-10 flex h-full items-center gap-2">
          {/* LEFT ZONE — Fragmented inputs (scattered but elegant) */}
          <div className="flex w-[28%] flex-col gap-2.5">
            {/* Problem statement */}
            <ScreenCard className="p-3 border-rose-500/20" glow>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-400" aria-hidden="true" />
                <span className="font-label text-[8px] uppercase tracking-widest text-rose-400">Problem</span>
              </div>
              <div className="font-body text-xs font-semibold text-text-main leading-snug">
                Operations scattered across tools
              </div>
              <p className="mt-1.5 font-body text-[9px] leading-relaxed text-text-sub">
                Data disconnected, reports manual, teams siloed.
              </p>
            </ScreenCard>
            
            {/* Fragmented inputs — asymmetric for visual drama */}
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { label: "Forms", offset: "mt-0" },
                { label: "CRM", offset: "mt-2" },
                { label: "Billing", offset: "mt-1" },
                { label: "Files", offset: "mt-3" },
              ].map((item) => (
                <div
                  key={item.label}
                  className={cn(
                    "rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 py-2 text-center font-label text-[8px] uppercase tracking-wider text-text-muted-gray transition-all",
                    item.offset
                  )}
                >
                  {item.label}
                </div>
              ))}
            </div>
            
            {/* Additional scattered input */}
            <div className="ml-3 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 py-1.5 text-center font-label text-[8px] uppercase tracking-wider text-text-muted-gray">
              Reports
            </div>
            <div className="mr-3 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 py-1.5 text-center font-label text-[8px] uppercase tracking-wider text-text-muted-gray">
              Support
            </div>
          </div>
          
          {/* CENTER — DRAMATIC HERO CORE with orbital rings */}
          <div className="relative flex w-[44%] items-center justify-center">
            {/* Animated connectors from inputs */}
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 420" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
              {/* Left inputs converging to core */}
              <path
                d="M 20 100 Q 120 100 180 180"
                fill="none"
                stroke={ORANGE}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="10 12"
                opacity="0.7"
              >
                <animate attributeName="stroke-dashoffset" from="22" to="0" dur="2s" repeatCount="indefinite" />
              </path>
              <circle r="2.5" fill={ORANGE} opacity="0.8">
                <animateMotion path="M 20 100 Q 120 100 180 180" dur="2.2s" repeatCount="indefinite" />
              </circle>
              
              <path
                d="M 20 200 Q 100 200 180 210"
                fill="none"
                stroke={ORANGE}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="10 12"
                opacity="0.7"
              >
                <animate attributeName="stroke-dashoffset" from="22" to="0" dur="2.1s" repeatCount="indefinite" />
              </path>
              <circle r="2.5" fill={ORANGE} opacity="0.8">
                <animateMotion path="M 20 200 Q 100 200 180 210" dur="2.3s" repeatCount="indefinite" />
              </circle>
              
              <path
                d="M 20 320 Q 120 320 180 240"
                fill="none"
                stroke={ORANGE}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="10 12"
                opacity="0.7"
              >
                <animate attributeName="stroke-dashoffset" from="22" to="0" dur="2.2s" repeatCount="indefinite" />
              </path>
              <circle r="2.5" fill={ORANGE} opacity="0.8">
                <animateMotion path="M 20 320 Q 120 320 180 240" dur="2.4s" repeatCount="indefinite" />
              </circle>
              
              {/* Core radiating to outputs */}
              <path
                d="M 220 180 Q 300 180 380 100"
                fill="none"
                stroke={ORANGE}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="10 12"
                opacity="0.75"
              >
                <animate attributeName="stroke-dashoffset" from="22" to="0" dur="1.9s" repeatCount="indefinite" />
              </path>
              <circle r="2.5" fill={ORANGE} opacity="0.85">
                <animateMotion path="M 220 180 Q 300 180 380 100" dur="2.1s" repeatCount="indefinite" />
              </circle>
              
              <path
                d="M 220 210 Q 300 210 380 210"
                fill="none"
                stroke={ORANGE}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="10 12"
                opacity="0.75"
              >
                <animate attributeName="stroke-dashoffset" from="22" to="0" dur="1.8s" repeatCount="indefinite" />
              </path>
              <circle r="2.5" fill={ORANGE} opacity="0.85">
                <animateMotion path="M 220 210 Q 300 210 380 210" dur="2s" repeatCount="indefinite" />
              </circle>
              
              <path
                d="M 220 240 Q 300 240 380 320"
                fill="none"
                stroke={ORANGE}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="10 12"
                opacity="0.75"
              >
                <animate attributeName="stroke-dashoffset" from="22" to="0" dur="2s" repeatCount="indefinite" />
              </path>
              <circle r="2.5" fill={ORANGE} opacity="0.85">
                <animateMotion path="M 220 240 Q 300 240 380 320" dur="2.2s" repeatCount="indefinite" />
              </circle>
            </svg>
            
            {/* Orbital rings for depth */}
            <div className="absolute h-56 w-56 rounded-full border border-brand-primary/15 animate-[spin_20s_linear_infinite]" aria-hidden="true" />
            <div className="absolute h-48 w-48 rounded-full border border-brand-primary/20 animate-[spin_15s_linear_infinite_reverse]" aria-hidden="true" />
            
            {/* HERO CORE with layered depth */}
            <div className="relative z-20 flex h-52 w-52 flex-col items-center justify-center rounded-[2.5rem] border-2 border-brand-primary/50 bg-gradient-to-b from-[rgba(10,16,32,0.95)] to-[rgba(10,16,32,0.88)] text-center shadow-[0_0_70px_rgba(249,126,26,0.25),inset_0_0_40px_rgba(249,126,26,0.08)] backdrop-blur-xl">
              {/* Inner glow ring */}
              <div className="pointer-events-none absolute inset-2 rounded-[2rem] border border-brand-primary/25 shadow-[inset_0_0_24px_rgba(249,126,26,0.12)]" aria-hidden="true" />
              
              {/* Content */}
              <div className="relative z-10 px-5">
                <div className="font-label text-[11px] uppercase tracking-[0.24em] text-brand-primary drop-shadow-[0_0_8px_rgba(249,126,26,0.6)]">
                  DXBMARK
                </div>
                <div className="mt-2 font-sans text-xl font-black leading-tight text-text-main drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                  System Core
                </div>
                <div className="mt-2 max-w-[160px] font-body text-[10px] leading-relaxed text-text-sub">
                  Unified backend, workflows, data layer, and UI.
                </div>
                
                {/* Status indicators */}
                <div className="mt-3 flex items-center justify-center gap-1.5">
                  <LiveDot color="orange" />
                  <span className="font-code text-[8px] text-brand-primary">Building</span>
                </div>
              </div>
              
              {/* Floating badge */}
              <div className="absolute -right-4 -top-4">
                <div className="rounded-full border border-brand-primary/40 bg-brand-primary/[0.14] px-2.5 py-1 backdrop-blur-sm shadow-[0_4px_16px_rgba(249,126,26,0.2)]">
                  <span className="font-label text-[8px] font-bold uppercase tracking-wider text-brand-primary">v2.4</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* RIGHT ZONE — Organized outputs + build pipeline */}
          <div className="flex w-[28%] flex-col gap-2.5">
            {/* Organized outputs */}
            <ScreenCard className="p-3 border-emerald-500/20" glow>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                <span className="font-label text-[8px] uppercase tracking-widest text-emerald-400">Output</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {["Dashboard", "Portal", "API", "Reports"].map((item) => (
                  <div
                    key={item}
                    className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.08] px-2 py-2 text-center font-label text-[8px] uppercase tracking-wider text-emerald-400"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </ScreenCard>
            
            {/* Build pipeline — compact supporting evidence */}
            <ScreenCard className="p-2.5">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="font-label text-[8px] uppercase tracking-widest text-text-muted-gray">Pipeline</span>
                <Pill label="Deploying" color="green" />
              </div>
              
              <div className="space-y-1 font-code text-[9px]">
                {[
                  ["Schema", "done"],
                  ["API", "done"],
                  ["UI", "active"],
                  ["Jobs", "queue"],
                ].map(([label, status]) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-text-sub">→ {label}</span>
                    <span
                      className={cn(
                        status === "done" && "text-emerald-400",
                        status === "active" && "text-brand-primary",
                        status === "queue" && "text-text-muted-gray",
                      )}
                    >
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </ScreenCard>
            
            {/* System stats */}
            <div className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-2">
              <div className="flex items-center justify-between">
                <span className="font-code text-[9px] text-text-muted-gray">Modules</span>
                <span className="font-code text-[9px] font-bold text-text-main">12</span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="font-code text-[9px] text-text-muted-gray">Integrations</span>
                <span className="font-code text-[9px] font-bold text-text-main">8</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PremiumShell>
  );
}

// ============================================================================
// COMPOSITION MAP
// ============================================================================
const DASHBOARD_MAP: Record<SaasSystemId, React.FC> = {
  "saas-platforms":      DashSaasPlat,
  "admin-dashboards":    DashAdmin,
  "client-portals":      DashPortal,
  "workflow-automation": DashWorkflow,
  "custom-systems":      DashCustom,
};

// ============================================================================
// PUBLIC EXPORT — SaasSystemVisual
// ============================================================================
interface SaasSystemVisualProps {
  activeId: SaasSystemId;
  className?: string;
}

export function SaasSystemVisual({ activeId, className }: SaasSystemVisualProps) {
  const shouldReduceMotion = useReducedMotion();
  const Dashboard = DASHBOARD_MAP[activeId];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl",
        // outer shell — subtle orange ring glow
        "shadow-[0_0_60px_rgba(0,0,0,0.5),0_0_30px_rgba(249,126,26,0.06)]",
        className
      )}
    >
      {/* Ambient orange glow behind panel */}
      <div
        className="pointer-events-none absolute -bottom-10 left-1/2 h-40 w-80 -translate-x-1/2 rounded-full bg-brand-glow opacity-40 blur-[80px]"
        aria-hidden="true"
      />

      {/* Panel content */}
      <div
        className="relative h-full w-full"
        aria-live="polite"
        aria-label="Dashboard preview"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8, scale: 0.988 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? {} : { opacity: 0, y: -6, scale: 0.988 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            className="h-full w-full"
          >
            <Dashboard />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
