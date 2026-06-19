import * as React from "react";
import { cn } from "@/lib/utils";

export const GridPattern = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--color-border-soft)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border-soft)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30",
      className
    )}
    {...props}
  />
));
GridPattern.displayName = "GridPattern";

export const Glow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute inset-0 -z-10 pointer-events-none",
      className
    )}
    style={{
      backgroundImage: `radial-gradient(circle 600px at 50% 50%, rgba(59, 130, 246, 0.3), transparent)`,
      ...style,
    }}
    {...props}
  />
));
Glow.displayName = "Glow";

export const GlassPanel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-radius-xl border border-border-soft-val bg-surface-main/30 backdrop-blur-md shadow-shadow-card",
      className
    )}
    {...props}
  />
));
GlassPanel.displayName = "GlassPanel";
