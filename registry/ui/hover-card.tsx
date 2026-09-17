"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface HoverCardProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  openDelay?: number;
  closeDelay?: number;
  className?: string;
}

/** کارت شناور. Opens after a short hover (or keyboard focus) — for author/profile previews. */
export function HoverCard({ trigger, children, openDelay = 300, closeDelay = 150, className }: HoverCardProps) {
  const [open, setOpen] = React.useState(false);
  const timer = React.useRef<number | undefined>(undefined);
  const schedule = (v: boolean, d: number) => { window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setOpen(v), d); };
  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => schedule(true, openDelay)}
      onMouseLeave={() => schedule(false, closeDelay)}
      onFocus={() => schedule(true, 0)}
      onBlur={() => schedule(false, 0)}
    >
      {trigger}
      {open && (
        <div className={cn("absolute start-0 top-full z-40 mt-2 w-72 rounded-xl border border-border bg-popover p-4 text-sm text-popover-foreground shadow-[0_20px_50px_-20px_oklch(0_0_0/80%)] animate-fade-up [animation-duration:180ms]", className)}>
          {children}
        </div>
      )}
    </span>
  );
}
