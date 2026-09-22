"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * جریان استدلال. A small card that plays back an agent's reasoning: the
 * transcript steps up a couple of lines at a time, holds, and loops without a
 * visible jump because the text is cloned once underneath. The fades at the top
 * and bottom are a mask, so any card background works. Hover pauses it.
 */
export function ReasoningStream({
  text,
  lines = 2,
  hold = 1200,
  height = 104,
  className,
}: {
  text: string | string[];
  /** Lines per step. */
  lines?: number;
  /** Milliseconds between steps. */
  hold?: number;
  height?: number;
  className?: string;
}) {
  const scroll = React.useRef<HTMLDivElement>(null);
  const copy = React.useRef<HTMLDivElement>(null);
  const paused = React.useRef(false);
  const paragraphs = Array.isArray(text) ? text : [text];

  React.useEffect(() => {
    const el = scroll.current;
    const first = copy.current;
    if (!el || !first) return;
    let offset = 0;
    let alive = true;
    let id = 0;
    const step = () => {
      id = window.setTimeout(() => {
        if (!alive) return;
        if (paused.current) return step();
        const lineH = parseFloat(getComputedStyle(first).lineHeight) || 20;
        offset += lineH * lines;
        el.style.transition = "transform 500ms cubic-bezier(0.22,1,0.36,1)";
        el.style.transform = `translateY(${-offset}px)`;
        id = window.setTimeout(() => {
          if (!alive) return;
          // Past one copy's height, snap back by exactly that much: the clone makes it invisible.
          const h = first.offsetHeight;
          if (offset >= h) {
            offset -= h;
            el.style.transition = "none";
            el.style.transform = `translateY(${-offset}px)`;
            void el.offsetWidth;
          }
          step();
        }, 530);
      }, hold);
    };
    step();
    return () => {
      alive = false;
      window.clearTimeout(id);
      el.style.transition = "none";
      el.style.transform = "translateY(0)";
    };
  }, [lines, hold, text]);

  const body = paragraphs.map((p, i) => <p key={i}>{p}</p>);
  return (
    <div
      className={cn("relative w-full max-w-sm overflow-hidden rounded-xl border border-border bg-card text-xs leading-5 text-muted-foreground", className)}
      style={{ height }}
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
    >
      <div className="absolute inset-0 overflow-hidden [mask-image:linear-gradient(transparent,black_22%,black_78%,transparent)]">
        <div ref={scroll} className="absolute inset-x-0 top-0 px-4 py-3 will-change-transform">
          <div ref={copy} className="space-y-1">{body}</div>
          <div aria-hidden className="space-y-1">{body}</div>
        </div>
      </div>
    </div>
  );
}
