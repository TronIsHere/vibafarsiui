"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  /** "start" slides in from the right in RTL (the natural side for Persian). */
  side?: "start" | "end" | "bottom";
  children: React.ReactNode;
  className?: string;
}

const SLIDE = "0.35s cubic-bezier(0.16, 1, 0.3, 1) both";

function panelAnimation(side: NonNullable<SheetProps["side"]>) {
  if (side === "bottom") return `sheet-from-bottom ${SLIDE}`;
  const rtl = typeof document === "undefined" || document.documentElement.dir !== "ltr";
  if (side === "start") return `${rtl ? "sheet-from-right" : "sheet-from-left"} ${SLIDE}`;
  return `${rtl ? "sheet-from-left" : "sheet-from-right"} ${SLIDE}`;
}

/** کشو. A side panel for filters, carts and mobile navigation. */
export function Sheet({ open, onOpenChange, title, side = "start", children, className }: SheetProps) {
  const titleId = React.useId();
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onOpenChange(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, onOpenChange]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
      style={{ animation: "fade-in 0.2s ease-out both" }}
      onClick={() => onOpenChange(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        onClick={(e) => e.stopPropagation()}
        style={{ animation: panelAnimation(side) }}
        className={cn(
          "absolute flex flex-col bg-popover text-popover-foreground shadow-2xl",
          side === "start" && "inset-y-0 start-0 w-full max-w-sm border-e border-border",
          side === "end" && "inset-y-0 end-0 w-full max-w-sm border-s border-border",
          side === "bottom" && "inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl border-t border-border",
          className,
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          {title && <h2 id={titleId} className="text-sm font-semibold">{title}</h2>}
          <button type="button" aria-label="بستن" onClick={() => onOpenChange(false)} className="ms-auto flex size-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4">{children}</div>
      </div>
    </div>
  );
}
