"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** پشته‌ی کارت. Cards sit stacked; every few seconds the front card slides to the back. Pauses on hover. Give it a height via className. */
export function CardStack({ items, interval = 3200, offset = 12, scale = 0.05, className }: { items: React.ReactNode[]; interval?: number; offset?: number; scale?: number; className?: string }) {
  const [order, setOrder] = React.useState(() => items.map((_, i) => i));
  const [paused, setPaused] = React.useState(false);
  React.useEffect(() => {
    if (paused || items.length < 2) return;
    const id = window.setInterval(() => setOrder((o) => [...o.slice(1), o[0]]), interval);
    return () => window.clearInterval(id);
  }, [interval, paused, items.length]);
  return (
    <div className={cn("relative h-48 w-full max-w-sm", className)} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {items.map((node, i) => {
        const depth = order.indexOf(i);
        return (
          <div
            key={i}
            aria-hidden={depth !== 0}
            className="absolute inset-0 origin-top rounded-xl border border-border bg-card shadow-lg transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ zIndex: items.length - depth, transform: `translateY(${depth * offset}px) scale(${1 - depth * scale})`, opacity: depth > 2 ? 0 : 1 }}
          >
            {node}
          </div>
        );
      })}
    </div>
  );
}
