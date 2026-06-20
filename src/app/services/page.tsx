import * as React from "react";
import { Glow } from "@/components/visual";

export default function ServicesPage() {
  return (
    <div className="relative min-h-[60vh] w-full flex items-center justify-center bg-background-slate overflow-hidden font-sans text-text-sub">
      <Glow className="absolute inset-0 z-0" />
      <div className="relative z-10 text-center flex flex-col gap-4">
        <h1 className="text-4xl font-black text-text-main">Services</h1>
        <p className="text-sm text-text-muted-gray">DXBMARK core services placeholder page.</p>
      </div>
    </div>
  );
}
