"use client";

import Image from "next/image";

import type { TechStackItem } from "@/content/home/tech-stack";

type TechStackIconProps = {
  item: TechStackItem;
};

export function TechStackIcon({ item }: TechStackIconProps) {
  const Icon = item.icon;
  const LobeIcon = item.lobeIcon;
  const CustomIcon = item.customIcon;
  const iconClassName = item.iconClassName ?? "h-7 w-7 lg:h-8 lg:w-8";

  return (
    <span
      aria-hidden="true"
      className="flex h-full w-full items-center justify-center"
      style={{ color: item.color ?? "var(--color-accent-primary)" }}
    >
      {item.imageSrc ? (
        <Image
          alt={item.alt ?? `${item.name} logo`}
          className={item.imageClassName ?? "h-8 w-8 object-contain lg:h-9 lg:w-9"}
          draggable={false}
          height={item.imageHeight ?? 40}
          src={item.imageSrc}
          width={item.imageWidth ?? 40}
        />
      ) : LobeIcon ? (
        <LobeIcon size={item.lobeIconSize ?? 32} />
      ) : CustomIcon ? (
        <CustomIcon className={iconClassName} />
      ) : Icon ? (
        <Icon className={iconClassName} />
      ) : (
        <span className="font-sans text-lg font-black uppercase tracking-normal lg:text-xl">
          {item.fallback ?? item.name.charAt(0)}
        </span>
      )}
    </span>
  );
}
