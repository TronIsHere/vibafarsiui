"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** کارت سه‌بعدی. Tilts toward the pointer; resets on leave. `max` is the tilt in degrees. */
export function TiltCard({ children, max = 14, className }: { children: React.ReactNode; max?: number; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [t, setT] = React.useState({ x: 0, y: 0 });
  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        setT({ x: py * -max, y: px * max });
      }}
      onMouseLeave={() => setT({ x: 0, y: 0 })}
      className={cn("rounded-xl border border-border bg-card transition-transform duration-150 [transform-style:preserve-3d]", className)}
      style={{ transform: `perspective(600px) rotateX(${t.x}deg) rotateY(${t.y}deg)` }}
    >
      {children}
    </div>
  );
}
