"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * متن جریانی. Words resolve one after another through a small blur, like a
 * model's answer condensing into place rather than being typed. Each word is its
 * own span, so the letters inside a Persian word stay joined. A soft dot marks the
 * stream head until the last word lands. Needs the `pulse-soft` keyframes.
 */
export function StreamingText({
  text,
  gap = 60,
  fade = 300,
  className,
}: {
  text: string;
  /** Milliseconds between words. */
  gap?: number;
  /** Milliseconds each word takes to resolve. */
  fade?: number;
  className?: string;
}) {
  const words = React.useMemo(() => text.split(/\s+/).filter(Boolean), [text]);
  const [n, setN] = React.useState(0);
  const [prevWords, setPrevWords] = React.useState(words);
  if (words !== prevWords) {
    setPrevWords(words);
    setN(0);
  }

  React.useEffect(() => {
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setN(i);
      if (i >= words.length) window.clearInterval(id);
    }, gap);
    return () => window.clearInterval(id);
  }, [words, gap]);

  const done = n >= words.length;
  return (
    <p className={cn("leading-8", className)} aria-label={text}>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <span
            aria-hidden
            className="inline-block will-change-[opacity,filter]"
            style={{ opacity: i < n ? 1 : 0, filter: i < n ? "blur(0)" : "blur(3px)", transition: `opacity ${fade}ms ease-out, filter ${fade}ms ease-out` }}
          >
            {w}
          </span>
          {i < words.length - 1 && " "}
        </React.Fragment>
      ))}
      <span aria-hidden className="ms-1 inline-block size-2 rounded-full bg-foreground align-middle transition-opacity duration-300" style={{ opacity: done ? 0 : 1, animation: done ? undefined : "pulse-soft 1s ease-in-out infinite" }} />
    </p>
  );
}
