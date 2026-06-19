import * as React from "react";
import { Glow } from "@/components/visual";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[#0f172a] relative flex flex-col overflow-hidden font-sans selection:bg-brand-primary selection:text-white">
      {/* Blue Radial Glow Background */}
      <Glow className="absolute inset-0 z-0" />

      {/* Main Canvas Area */}
      <main className="flex-1 relative z-10">
        {/* 
          [Canvas Reset Area]
          Future dynamic sections, interactive blocks and marketing grids will be inserted here 
        */}
      </main>
    </div>
  );
}
