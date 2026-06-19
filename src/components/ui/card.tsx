"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, onMouseMove, ...props }, ref) => {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--aurora-x", `${x}px`);
    e.currentTarget.style.setProperty("--aurora-y", `${y}px`);
    if (onMouseMove) {
      onMouseMove(e);
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        "glass-card glass-card-aurora p-6 text-text-sub",
        className
      )}
      onMouseMove={handleMouseMove}
      {...props}
    />
  );
});
Card.displayName = "Card";

export { Card };
