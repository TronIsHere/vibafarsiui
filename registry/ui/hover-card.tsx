"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { FloatPortal, useFloat } from "@/lib/float";

export interface HoverCardProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  openDelay?: number;
  closeDelay?: number;
  className?: string;
}

/** کارت شناور. Opens after a short hover (or keyboard focus) — for author/profile previews. Rendered into `document.body` so a parent with overflow hidden cannot clip it. */
export function HoverCard({ trigger, children, openDelay = 300, closeDelay = 150, className }: HoverCardProps) {
  const [open, setOpen] = React.useState(false);
  const root = React.useRef<HTMLSpanElement>(null);
  const timer = React.useRef<number | undefined>(undefined);
  const { mounted, style, theme, panel, update } = useFloat(open, root);
  const schedule = (v: boolean, d: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      if (v) update();
      setOpen(v);
    }, d);
  };

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <span
      ref={root}
      className="inline-block"
      onMouseEnter={() => schedule(true, openDelay)}
      onMouseLeave={() => schedule(false, closeDelay)}
      onFocus={() => schedule(true, 0)}
      onBlur={() => schedule(false, 0)}
    >
      {trigger}
      <FloatPortal
        open={open}
        mounted={mounted}
        style={style}
        theme={theme}
        panelRef={panel}
        onMouseEnter={() => schedule(true, 0)}
        onMouseLeave={() => schedule(false, closeDelay)}
        className={cn("fixed z-50 w-72 rounded-overlay border-line border-border bg-popover p-4 text-sm text-popover-foreground shadow-overlay [backdrop-filter:var(--surface-filter)] animate-fade-up [animation-duration:180ms]", className)}
      >
        {children}
      </FloatPortal>
    </span>
  );
}
