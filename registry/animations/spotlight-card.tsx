"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** کارت نورانی. A soft radial highlight follows the pointer across the card and lights up its border. */
export function SpotlightCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const [p, setP] = React.useState({ x: -200, y: -200 });
  const glow = `radial-gradient(180px circle at ${p.x}px ${p.y}px, oklch(from var(--foreground) l c h / 18%), transparent 70%)`;
  return (
    <div
      onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setP({ x: e.clientX - r.left, y: e.clientY - r.top }); }}
      onMouseLeave={() => setP({ x: -200, y: -200 })}
      className={cn("relative rounded-xl border border-border bg-card p-px", className)}
    >
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-xl" style={{ background: glow }} />
      <div className="relative rounded-[calc(var(--radius)+1px)] bg-card/90">{children}</div>
    </div>
  );
}
