"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface AnimatedTabsProps {
  items: string[];
  value?: number;
  onChange?: (index: number) => void;
  className?: string;
}

/** تب‌های لغزان. The indicator slides with `inset-inline-start`, so it's RTL-correct without measuring. */
export function AnimatedTabs({ items, value, onChange, className }: AnimatedTabsProps) {
  const [internal, setInternal] = React.useState(0);
  const i = value ?? internal;
  const n = items.length;
  return (
    <div role="tablist" className={cn("relative inline-flex rounded-lg border border-border bg-background p-1", className)}>
      <span
        aria-hidden
        className="absolute inset-y-1 rounded-md bg-foreground transition-[inset-inline-start] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ width: `calc((100% - 0.5rem) / ${n})`, insetInlineStart: `calc(0.25rem + ${i} * (100% - 0.5rem) / ${n})` }}
      />
      {items.map((t, idx) => (
        <button
          key={t}
          type="button"
          role="tab"
          aria-selected={i === idx}
          onClick={() => { if (value === undefined) setInternal(idx); onChange?.(idx); }}
          className={cn("relative z-10 min-w-20 cursor-pointer px-3 py-1.5 text-sm transition-colors duration-300", i === idx ? "font-semibold text-background" : "text-muted-foreground hover:text-foreground")}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
