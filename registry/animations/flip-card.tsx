"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** کارت برگردان. Turns over on hover/focus (or on click) to show its back; both faces share the front's size. */
export function FlipCard({ front, back, trigger = "hover", className }: { front: React.ReactNode; back: React.ReactNode; trigger?: "hover" | "click"; className?: string }) {
  const [flipped, setFlipped] = React.useState(false);
  const click = trigger === "click";
  const toggle = () => setFlipped((f) => !f);
  return (
    <div
      className={cn("group relative [perspective:1200px]", click && "cursor-pointer outline-none", className)}
      role={click ? "button" : undefined}
      tabIndex={click ? 0 : undefined}
      aria-pressed={click ? flipped : undefined}
      onClick={click ? toggle : undefined}
      onKeyDown={click ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } } : undefined}
    >
      <div
        className={cn(
          "relative h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] [transform-style:preserve-3d]",
          !click && "group-hover:[transform:rotateY(180deg)] group-focus-within:[transform:rotateY(180deg)]",
          click && flipped && "[transform:rotateY(180deg)]",
        )}
      >
        <div className="[backface-visibility:hidden]">{front}</div>
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">{back}</div>
      </div>
    </div>
  );
}
