"use client";

import * as React from "react";
import { Container } from "../../ui/layout";
import { HomeSection } from "./HomeSection";

export function NextSectionPlaceholder() {
  return (
    <HomeSection 
      id="next-section"
      className="border-t border-border-soft-val text-center py-24"
      aria-label="Next Section Placeholder"
    >
      <Container className="relative z-10 flex flex-col items-center justify-center">
        {/* Simple Badge matching Hero badge style */}
        <div className="relative z-0 bg-white/5 overflow-hidden p-px flex items-center justify-center rounded-full transition duration-300 select-none">
          <div className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d2130]/95 backdrop-blur-md border border-border-soft-val shadow-inner">
            <span className="font-label text-[10px] font-bold text-text-muted-gray uppercase tracking-widest">
              Next Section
            </span>
          </div>
        </div>
      </Container>
    </HomeSection>
  );
}

