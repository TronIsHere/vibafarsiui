"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** چرخش کلمه. One slot in a sentence cycles through words; each rises in with a soft blur. Needs the `word-in` keyframes. */
export function WordRotate({ words, interval = 2200, className }: { words: string[]; interval?: number; className?: string }) {
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    const id = window.setInterval(() => setI((x) => (x + 1) % words.length), interval);
    return () => window.clearInterval(id);
  }, [words.length, interval]);
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "");
  return (
    // No overflow on the outer span: overflow ≠ visible makes inline-block
    // baseline the box bottom, which drops the slot below the rest of the line.
    <span className={cn("relative inline-block align-baseline", className)} aria-live="polite">
      <span aria-hidden className="invisible whitespace-nowrap">
        {longest}
      </span>
      <span className="absolute inset-0 overflow-hidden">
        <span
          key={i}
          className="block whitespace-nowrap"
          style={{ animation: "word-in 0.6s cubic-bezier(0.16,1,0.3,1) both" }}
        >
          {words[i]}
        </span>
      </span>
    </span>
  );
}
