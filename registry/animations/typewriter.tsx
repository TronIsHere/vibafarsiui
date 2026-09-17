"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TypewriterProps {
  text: string;
  /** Milliseconds per character. */
  speed?: number;
  /** Pause at the end before restarting (0 = no loop). */
  loopDelay?: number;
  cursor?: boolean;
  className?: string;
}

/** تایپ‌شونده. Reveals text character by character; Persian letters join correctly as they appear. */
export function Typewriter({ text, speed = 70, loopDelay = 0, cursor = true, className }: TypewriterProps) {
  const [n, setN] = React.useState(0);
  React.useEffect(() => {
    const id = window.setInterval(() => {
      setN((x) => {
        if (x < text.length) return x + 1;
        if (loopDelay) { window.setTimeout(() => setN(0), loopDelay); }
        return x;
      });
    }, speed);
    return () => window.clearInterval(id);
  }, [text, speed, loopDelay]);

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden>{text.slice(0, n)}</span>
      {cursor && <span aria-hidden className={cn("ms-0.5 inline-block h-[1em] w-px translate-y-[0.15em] bg-current align-baseline", n >= text.length && loopDelay === 0 ? "animate-pulse-soft" : "")} />}
    </span>
  );
}
