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

/**
 * Panel spring ≈ Animate UI `{ type: "spring", stiffness: 150, damping: 22 }`.
 * Overlay fade ≈ Animate UI `{ duration: 0.2, ease: "easeInOut" }`.
 */
const PANEL_MS = 480;
const PANEL_EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
const OVERLAY_MS = 200;

function panelHidden(side: NonNullable<SheetProps["side"]>) {
  if (side === "bottom") return "translate-y-full opacity-0";
  if (side === "start") return "ltr:-translate-x-full rtl:translate-x-full opacity-0";
  return "ltr:translate-x-full rtl:-translate-x-full opacity-0";
}

/** کشو. A side panel for filters, carts and mobile navigation. */
export function Sheet({
  open,
  onOpenChange,
  title,
  side = "start",
  children,
  className,
}: SheetProps) {
  const titleId = React.useId();
  const [present, setPresent] = React.useState(open);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setPresent(true);
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setShown(true));
      });
      return () => cancelAnimationFrame(id);
    }
    setShown(false);
    const t = window.setTimeout(() => setPresent(false), PANEL_MS);
    return () => window.clearTimeout(t);
  }, [open]);

  React.useEffect(() => {
    if (!present) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onOpenChange(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [present, onOpenChange]);

  if (!present) return null;

  return (
    <div className="fixed inset-0 z-50" role="presentation">
      <div
        aria-hidden
        onClick={() => onOpenChange(false)}
        className={cn(
          "absolute inset-0 bg-black/50 transition-[opacity,filter] ease-in-out",
          shown ? "opacity-100 blur-0" : "opacity-0 blur-sm",
        )}
        style={{ transitionDuration: `${OVERLAY_MS}ms` }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={cn(
          "absolute flex flex-col bg-popover text-popover-foreground shadow-2xl will-change-transform",
          "transition-[transform,opacity]",
          side === "start" && "inset-y-0 start-0 w-full max-w-sm border-e border-border",
          side === "end" && "inset-y-0 end-0 w-full max-w-sm border-s border-border",
          side === "bottom" && "inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl border-t border-border",
          shown ? "translate-x-0 translate-y-0 opacity-100" : panelHidden(side),
          className,
        )}
        style={{
          transitionDuration: `${PANEL_MS}ms`,
          transitionTimingFunction: PANEL_EASE,
        }}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          {title && (
            <h2 id={titleId} className="text-sm font-semibold">
              {title}
            </h2>
          )}
          <button
            type="button"
            aria-label="بستن"
            onClick={() => onOpenChange(false)}
            className="ms-auto flex size-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="flex flex-1 flex-col overflow-auto p-4">{children}</div>
      </div>
    </div>
  );
}
