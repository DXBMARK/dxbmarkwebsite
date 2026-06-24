"use client";

import { motion, useReducedMotion } from "framer-motion";

import type { TechStackItem } from "@/content/home/tech-stack";
import { TechStackIcon } from "./TechStackIcon";

type TechStackMarqueeProps = {
  items: TechStackItem[];
  direction?: "left" | "right";
  duration?: number;
};

const repeatedItems = (items: TechStackItem[]) => [
  ...items,
  ...items,
  ...items,
  ...items,
];

export function TechStackMarquee({
  items,
  direction = "left",
  duration,
}: TechStackMarqueeProps) {
  const shouldReduceMotion = useReducedMotion();
  const loopItems = repeatedItems(items);
  const calmDuration = Math.max(duration ?? 0, direction === "left" ? 65 : 70);

  return (
    <div className="relative overflow-hidden py-2">
      <motion.div
        className="flex w-max items-center gap-4 whitespace-nowrap sm:gap-5 lg:gap-6"
        animate={
          shouldReduceMotion
            ? undefined
            : {
                x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
              }
        }
        transition={
          shouldReduceMotion
            ? undefined
            : {
                duration: calmDuration,
                ease: "linear",
                repeat: Infinity,
              }
        }
      >
        {loopItems.map((item, index) => (
          <motion.div
            key={`${item.id}-${index}`}
            role="img"
            aria-label={`${item.name} - ${item.category}`}
            className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] border border-white/10 bg-white/[0.045] shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-[border-color,background-color,box-shadow] duration-200 hover:border-white/15 hover:bg-white/[0.06] lg:h-16 lg:w-16 lg:rounded-[20px]"
            whileHover={
              shouldReduceMotion
                ? undefined
                : {
                    y: -2,
                    scale: 1.06,
                    transition: { duration: 0.16, ease: [0.22, 1, 0.36, 1] },
                  }
            }
          >
            <TechStackIcon item={item} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
