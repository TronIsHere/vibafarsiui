"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * تعویض متن. Swaps a status label in place: the old text lifts out through a
 * small blur while the new one rises in from the other side, both at once.
 * Pass `options` so the slot is as wide as the longest label and the button
 * around it never jumps. Needs the `swap-in` and `swap-out` keyframes.
 */
export function TextSwap({
  value,
  options,
  duration = 150,
  direction = "up",
  className,
}: {
  value: string;
  /** Every label this slot can show; reserves width. */
  options?: string[];
  duration?: number;
  direction?: "up" | "down";
  className?: string;
}) {
  // Remember the previous value during render so the outgoing copy can animate out.
  const [prev, setPrev] = React.useState(value);
  const [leaving, setLeaving] = React.useState<string | null>(null);
  if (value !== prev) {
    setPrev(value);
    setLeaving(prev);
  }
  React.useEffect(() => {
    if (leaving === null) return;
    const id = window.setTimeout(() => setLeaving(null), duration);
    return () => window.clearTimeout(id);
  }, [leaving, duration]);

  const longest = options?.reduce((a, b) => (b.length > a.length ? b : a), "") ?? "";
  const cell = "col-start-1 row-start-1 inline-block whitespace-nowrap text-center will-change-[transform,filter,opacity]";
  return (
    <span className={cn("relative inline-grid", className)} aria-live="polite" style={{ ["--swap-y" as string]: direction === "up" ? "4px" : "-4px" }}>
      {longest && <span aria-hidden className="invisible col-start-1 row-start-1 whitespace-nowrap">{longest}</span>}
      {leaving !== null && (
        <span aria-hidden className={cell} style={{ animation: `swap-out ${duration}ms ease-in-out both` }}>{leaving}</span>
      )}
      <span key={value} className={cell} style={leaving !== null ? { animation: `swap-in ${duration}ms ease-in-out both` } : undefined}>{value}</span>
    </span>
  );
}
