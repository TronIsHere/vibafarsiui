"use client";

import * as React from "react";
import { Avatar } from "@/registry/ui/avatar";
import { cn } from "@/lib/utils";

/**
 * هاور آواتارها. The hovered avatar springs up and its neighbours follow with a
 * distance falloff; on leave the whole row bounces back with an overshoot.
 * The person's name floats above the active one. Works in either direction
 * because the falloff is measured by index, not by side.
 */
export function AvatarHover({
  people,
  lift = 8,
  falloff = 0.45,
  size = "md",
  className,
}: {
  people: { name: string; src?: string }[];
  /** Pixels the hovered avatar rises. */
  lift?: number;
  /** Each neighbour rises this fraction of the previous one. */
  falloff?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const [active, setActive] = React.useState<number | null>(null);
  const ease = active === null ? "cubic-bezier(0.34,3.85,0.64,1)" : "cubic-bezier(0.22,1,0.36,1)";
  return (
    <div className={cn("flex items-end", className)} onMouseLeave={() => setActive(null)}>
      {people.map((p, i) => {
        const on = i === active;
        const shift = active === null ? 0 : -lift * Math.pow(falloff, Math.abs(i - active));
        return (
          <div
            key={p.name}
            className={cn("relative will-change-transform", i > 0 && "-ms-2")}
            onMouseEnter={() => setActive(i)}
            style={{ transform: `translateY(${shift.toFixed(2)}px) scale(${on ? 1.08 : 1})`, transition: `transform 320ms ${ease}`, zIndex: on ? 2 : 1 }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 whitespace-nowrap rounded-md bg-foreground px-1.5 py-0.5 text-[10px] font-medium text-background"
              style={{ opacity: on ? 1 : 0, transform: `translate(-50%, ${on ? 0 : 4}px)`, transition: "opacity 200ms ease-out, transform 200ms ease-out" }}
            >
              {p.name}
            </span>
            <Avatar name={p.name} src={p.src} size={size} className="ring-2 ring-background" />
          </div>
        );
      })}
    </div>
  );
}
