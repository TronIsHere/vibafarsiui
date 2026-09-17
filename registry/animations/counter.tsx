"use client";

import * as React from "react";
import { cn, faNumber } from "@/lib/utils";

export interface CounterProps {
  to: number;
  from?: number;
  duration?: number;
  /** Format the number only; defaults to Persian thousands. */
  format?: (n: number) => string;
  /** Unit rendered outside the animating box, so it never moves (e.g. «تومان»). */
  unit?: React.ReactNode;
  className?: string;
}

/**
 * شمارنده. Counts up when scrolled into view, eased, with Persian digits.
 * The final value is rendered invisibly to reserve the box width, the live
 * value is anchored to the units digit, and the unit sits outside the box —
 * so nothing shifts when the digit count changes (e.g. crossing ۱۰٬۰۰۰٬۰۰۰).
 */
export function Counter({ to, from = 0, duration = 1600, format = faNumber, unit, className }: CounterProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [v, setV] = React.useState(from);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const run = () => {
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setV(Math.round(from + (to - from) * eased));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    if (typeof IntersectionObserver === "undefined") { run(); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { run(); io.disconnect(); } });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to, from, duration]);

  return (
    <span ref={ref} className={cn("inline-flex items-baseline gap-[0.35em] tabular-nums", className)}>
      <span className="relative inline-block">
        <span aria-hidden className="invisible">{format(Math.max(to, from))}</span>
        <span className="absolute inset-0 text-right" dir="ltr">{format(v)}</span>
      </span>
      {unit && <span className="text-[0.5em] font-normal text-muted-foreground">{unit}</span>}
    </span>
  );
}
