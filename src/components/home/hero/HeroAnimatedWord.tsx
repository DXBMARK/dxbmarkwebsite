"use client";

import React, { useEffect, useState } from "react";

interface HeroAnimatedWordProps {
  words: string[];
}

export function HeroAnimatedWord({ words }: HeroAnimatedWordProps) {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  
  // Initialize state lazily to avoid triggering synchronous setState in useEffect
  const [prefersReduced, setPrefersReduced] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const listener = (e: MediaQueryListEvent) => {
      React.startTransition(() => {
        setPrefersReduced(e.matches);
      });
    };
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  useEffect(() => {
    if (prefersReduced || words.length <= 1) return;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length);
        setFade(true);
      }, 300); // 300ms fade-out transition duration
    }, 2500);

    return () => clearInterval(interval);
  }, [words, prefersReduced]);

  if (prefersReduced) {
    return <span className="inline-block">{words[0]}</span>;
  }

  // To prevent any layout shifts, the container uses a responsive fixed width
  // matching the length of the longest word ("Automation"), absolute positioning inside,
  // and a fixed height bound to the line height.
  // In-place opacity transition ensures layout stability and baseline alignment.
  return (
    <span 
      className="inline-block text-left relative overflow-hidden align-bottom w-[6.5rem] sm:w-[8.5rem] md:w-[11rem] lg:w-[13.5rem] h-[1.1em] leading-none"
    >
      <span
        className={`absolute left-0 bottom-0 block w-full transition-opacity duration-300 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      >
        {words[index]}
      </span>
    </span>
  );
}
