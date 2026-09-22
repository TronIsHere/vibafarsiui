"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * وضعیت فکر کردن. An AI status line. While a state holds, a highlight sweeps
 * across the words; when it changes, the old line lifts out through a blur as
 * the next one rises in. The sparkle turns a quarter on every swap so the change
 * registers even in peripheral vision. Needs the `shimmer`, `swap-in` and `swap-out` keyframes.
 */
export function ThinkingStates({
  states,
  hold = 2000,
  loop = true,
  icon = true,
  className,
}: {
  states: string[];
  /** Milliseconds each state stays. */
  hold?: number;
  loop?: boolean;
  icon?: boolean;
  className?: string;
}) {
  const [i, setI] = React.useState(0);
  const [prev, setPrev] = React.useState(0);
  const [leaving, setLeaving] = React.useState<string | null>(null);
  if (i !== prev) {
    setPrev(i);
    setLeaving(states[prev]);
  }
  const last = i === states.length - 1;

  React.useEffect(() => {
    if (states.length < 2 || (!loop && last)) return;
    const id = window.setTimeout(() => setI((x) => (x + 1) % states.length), hold);
    return () => window.clearTimeout(id);
  }, [i, hold, loop, last, states.length]);

  React.useEffect(() => {
    if (leaving === null) return;
    const id = window.setTimeout(() => setLeaving(null), 150);
    return () => window.clearTimeout(id);
  }, [leaving]);

  const longest = states.reduce((a, b) => (b.length > a.length ? b : a), "");
  const cell = "col-start-1 row-start-1 whitespace-nowrap will-change-[transform,filter,opacity]";
  const shimmer: React.CSSProperties = {
    backgroundImage: "linear-gradient(90deg, var(--muted-foreground) 0%, var(--foreground) 45%, var(--foreground) 55%, var(--muted-foreground) 100%)",
    backgroundSize: "250% auto",
    animation: "shimmer 2.4s linear infinite",
  };
  return (
    <span role="status" className={cn("inline-flex items-center gap-2 text-sm", className)} style={{ ["--swap-y" as string]: "6px" }}>
      {icon && (
        <Sparkles className="size-4 shrink-0 text-muted-foreground transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ transform: `rotate(${i * 90}deg)` }} />
      )}
      <span className="relative inline-grid">
        <span aria-hidden className="invisible col-start-1 row-start-1 whitespace-nowrap">{longest}</span>
        {leaving !== null && (
          <span aria-hidden className={cn(cell, "text-muted-foreground")} style={{ animation: "swap-out 150ms ease-in-out both" }}>{leaving}</span>
        )}
        <span
          key={i}
          className={cn(cell, "bg-clip-text text-transparent")}
          style={leaving !== null ? { ...shimmer, animation: `${shimmer.animation}, swap-in 150ms ease-in-out both` } : shimmer}
        >
          {states[i]}
        </span>
      </span>
    </span>
  );
}
