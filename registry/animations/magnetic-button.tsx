"use client";

import * as React from "react";
import { Button, type ButtonProps } from "@/registry/ui/button";
import { cn } from "@/lib/utils";

/** دکمه‌ی آهنربایی. Leans toward the pointer while it's nearby, then springs back. `strength` is the max offset in px. */
export function MagneticButton({ strength = 10, className, ...props }: ButtonProps & { strength?: number }) {
  const [t, setT] = React.useState({ x: 0, y: 0 });
  return (
    <span
      className="inline-block p-5"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        setT({ x: px * strength * 2, y: py * strength * 2 });
      }}
      onMouseLeave={() => setT({ x: 0, y: 0 })}
    >
      <Button className={cn("transition-transform duration-200 ease-out", className)} style={{ transform: `translate(${t.x}px, ${t.y}px)` }} {...props} />
    </span>
  );
}
