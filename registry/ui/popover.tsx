"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom";
  align?: "start" | "center" | "end";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/**
 * پاپ‌آور. A small panel anchored to its trigger; closes on outside click and Escape.
 * `align="start"` hugs the trigger's inline-start (right in RTL).
 */
export function Popover({ trigger, children, side = "bottom", align = "start", open, onOpenChange, className }: PopoverProps) {
  const [internal, setInternal] = React.useState(false);
  const isOpen = open ?? internal;
  const set = (v: boolean) => { if (open === undefined) setInternal(v); onOpenChange?.(v); };
  const root = React.useRef<HTMLDivElement>(null);
  const id = React.useId();

  React.useEffect(() => {
    if (!isOpen) return;
    const onDoc = (e: MouseEvent) => !root.current?.contains(e.target as Node) && set(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && set(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <div ref={root} className="relative inline-block">
      <span onClick={() => set(!isOpen)} aria-haspopup="dialog" aria-expanded={isOpen} aria-controls={id} className="inline-flex cursor-pointer">
        {trigger}
      </span>
      {isOpen && (
        <div
          id={id}
          role="dialog"
          className={cn(
            "absolute z-40 min-w-56 rounded-xl border border-border bg-popover p-4 text-sm text-popover-foreground shadow-[0_20px_50px_-20px_oklch(0_0_0/80%)]",
            "animate-fade-up [animation-duration:180ms]",
            side === "bottom" ? "top-full mt-2" : "bottom-full mb-2",
            align === "start" && "start-0",
            align === "end" && "end-0",
            align === "center" && "left-1/2 -translate-x-1/2",
            className,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
