import * as React from "react";
import { cn, fa } from "@/lib/utils";

export interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = { sm: "size-7 text-[11px]", md: "size-9 text-sm", lg: "size-12 text-base" };

/** آواتار. Photo when `src` is set; otherwise a white initial in a white ring. */
export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const initial = name.trim().charAt(0);
  return (
    <span
      title={name}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full font-semibold",
        !src && "bg-transparent text-foreground ring-2 ring-foreground",
        sizes[size],
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- avatars are tiny and often external */}
      {src ? <img src={src} alt={name} className="size-full rounded-full object-cover" /> : initial}
    </span>
  );
}

/** Overlapping avatars with a «+n» tail. */
export function AvatarGroup({ people, max = 4, size = "md", className }: { people: { name: string; src?: string }[]; max?: number; size?: AvatarProps["size"]; className?: string }) {
  const shown = people.slice(0, max);
  const rest = people.length - shown.length;
  return (
    <div className={cn("flex items-center", className)}>
      {shown.map((p, i) => (
        <Avatar key={p.name} {...p} size={size} className={cn("ring-2 ring-background", i > 0 && "-ms-2")} />
      ))}
      {rest > 0 && <span className="ms-2 text-xs text-muted-foreground">+{fa(rest)} نفر دیگر</span>}
    </div>
  );
}
