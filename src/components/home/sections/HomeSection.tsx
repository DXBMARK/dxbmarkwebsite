import * as React from "react";
import { cn } from "@/lib/utils";

interface HomeSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export const HomeSection = React.forwardRef<HTMLDivElement, HomeSectionProps>(
  ({ id, children, className, contentClassName, ...props }, ref) => {
    return (
      <section 
        id={id} 
        ref={ref}
        data-home-section 
        className={cn("relative w-full min-h-[calc(100svh-80px)] flex flex-col justify-center items-center overflow-hidden", className)}
        {...props}
      >
        <div className={cn("section-inner-wrapper relative z-10 w-full flex-1 flex flex-col items-center justify-center", contentClassName)}>
          {children}
        </div>
      </section>
    );
  }
);

HomeSection.displayName = "HomeSection";

