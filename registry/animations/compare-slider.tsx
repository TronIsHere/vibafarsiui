"use client";

import * as React from "react";
import { ChevronsLeftRight } from "lucide-react";
import { cn, fa } from "@/lib/utils";

/** مقایسه‌ی قبل و بعد. Two layers with a draggable divider; «قبل» sits on the right (the RTL start). The divider is a real range input, so it works with the keyboard too. */
export function CompareSlider({ before, after, beforeLabel = "قبل", afterLabel = "بعد", defaultValue = 50, className }: { before: React.ReactNode; after: React.ReactNode; beforeLabel?: string; afterLabel?: string; defaultValue?: number; className?: string }) {
  const [v, setV] = React.useState(defaultValue); // percent of the width, measured from the right
  const tag = "pointer-events-none absolute top-2 rounded-md bg-background/80 px-2 py-0.5 text-[11px] font-medium backdrop-blur";
  return (
    <div className={cn("relative w-full select-none overflow-hidden rounded-xl border border-border", className)}>
      <div aria-hidden>{before}</div>
      <div aria-hidden className="absolute inset-0" style={{ clipPath: `inset(0 ${v}% 0 0)` }}>{after}</div>
      <span className={cn(tag, "start-2")}>{beforeLabel}</span>
      <span className={cn(tag, "end-2")}>{afterLabel}</span>
      <span aria-hidden className="pointer-events-none absolute inset-y-0 w-0.5 bg-foreground shadow-[0_0_0_1px_var(--background)]" style={{ right: `calc(${v}% - 1px)` }}>
        <span className="absolute top-1/2 left-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-md">
          <ChevronsLeftRight className="size-4" />
        </span>
      </span>
      <input
        type="range"
        min={0}
        max={100}
        value={v}
        onChange={(e) => setV(Number(e.target.value))}
        aria-label="جابه‌جایی خط مقایسه"
        aria-valuetext={`${fa(v)}٪`}
        className="absolute inset-0 h-full w-full cursor-col-resize opacity-0"
      />
    </div>
  );
}
