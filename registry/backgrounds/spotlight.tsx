"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** نور موضعی. A soft light follows the pointer and reveals a grid underneath. Attach to a `relative` parent. */
export function SpotlightBackground({ radius = 220, className }: { radius?: number; className?: string }) {
  const [p, setP] = React.useState({ x: 50, y: 40 });
  return (
    <div
      aria-hidden
      className={cn("absolute inset-0", className)}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setP({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
      }}
      style={{ background: `radial-gradient(${radius}px circle at ${p.x}% ${p.y}%, oklch(from var(--foreground) l c h / 14%), transparent 70%)` }}
    >
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: "linear-gradient(to right, oklch(from var(--foreground) l c h / 8%) 1px, transparent 1px), linear-gradient(to bottom, oklch(from var(--foreground) l c h / 8%) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: `radial-gradient(${radius}px circle at ${p.x}% ${p.y}%, black, transparent)`,
        }}
      />
    </div>
  );
}
