"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { eventInside, FloatPortal, useFloat } from "@/lib/float";

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
 * Rendered into `document.body` so a parent with overflow hidden cannot clip it.
 * `align="start"` hugs the trigger's inline-start (right in RTL).
 */
export function Popover({ trigger, children, side = "bottom", align = "start", open, onOpenChange, className }: PopoverProps) {
  const [internal, setInternal] = React.useState(false);
  const isOpen = open ?? internal;
  const set = (v: boolean) => { if (open === undefined) setInternal(v); onOpenChange?.(v); };
  const root = React.useRef<HTMLDivElement>(null);
  const id = React.useId();
  const { mounted, style, theme, panel, update } = useFloat(isOpen, root, { side, align });

  React.useEffect(() => {
    if (!isOpen) return;
    const onDoc = (e: MouseEvent) => { if (!eventInside(e, root.current, panel.current)) set(false); };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && set(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <div ref={root} className="inline-block">
      <span
        onClick={() => { if (!isOpen) update(); set(!isOpen); }}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={id}
        className="inline-flex cursor-pointer"
      >
        {trigger}
      </span>
      <FloatPortal
        open={isOpen}
        mounted={mounted}
        style={style}
        theme={theme}
        panelRef={panel}
        id={id}
        role="dialog"
        className={cn(
          "fixed z-50 min-w-56 rounded-xl border border-border bg-popover p-4 text-sm text-popover-foreground shadow-[0_20px_50px_-20px_oklch(0_0_0/80%)]",
          "animate-fade-up [animation-duration:180ms]",
          className,
        )}
      >
        {children}
      </FloatPortal>
    </div>
  );
}
