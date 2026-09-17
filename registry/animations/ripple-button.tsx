"use client";

import * as React from "react";
import { Button, type ButtonProps } from "@/registry/ui/button";
import { cn } from "@/lib/utils";

/** دکمه‌ی موجی. A ring expands from the tap point. Needs the `ripple` keyframes. */
export function RippleButton({ className, children, onClick, ...props }: ButtonProps) {
  const [ripples, setRipples] = React.useState<{ id: number; x: number; y: number }[]>([]);
  return (
    <Button
      className={cn("relative overflow-hidden", className)}
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const id = Date.now();
        setRipples((l) => [...l, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
        window.setTimeout(() => setRipples((l) => l.filter((p) => p.id !== id)), 650);
        onClick?.(e);
      }}
      {...props}
    >
      {ripples.map((p) => (
        <span key={p.id} aria-hidden className="pointer-events-none absolute size-10 rounded-full bg-current" style={{ left: p.x, top: p.y, animation: "ripple 0.65s ease-out forwards" }} />
      ))}
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </Button>
  );
}
