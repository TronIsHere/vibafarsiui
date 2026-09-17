"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  /** alertdialog blocks outside-click dismissal. */
  role?: "dialog" | "alertdialog";
  className?: string;
}

/**
 * پنجره (مودال). Closes on Escape and overlay click, locks body scroll,
 * moves focus inside on open and restores it on close.
 */
export function Dialog({ open, onOpenChange, title, description, children, footer, role = "dialog", className }: DialogProps) {
  const panel = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();
  const descId = React.useId();

  React.useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("[data-autofocus], button, input, textarea, select, a[href]")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onOpenChange(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      prev?.focus();
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center"
      onClick={() => role === "dialog" && onOpenChange(false)}
    >
      <div
        ref={panel}
        role={role}
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "w-full max-w-md rounded-2xl border border-border bg-popover p-5 text-popover-foreground shadow-[0_30px_80px_-20px_oklch(0_0_0/80%)]",
          "animate-fade-up [animation-duration:250ms]",
          className,
        )}
      >
        {(title || role === "dialog") && (
          <div className="flex items-start justify-between gap-4">
            <div>
              {title && <h2 id={titleId} className="text-base font-semibold">{title}</h2>}
              {description && <p id={descId} className="mt-1 text-sm text-muted-foreground">{description}</p>}
            </div>
            {role === "dialog" && (
              <button type="button" aria-label="بستن" onClick={() => onOpenChange(false)} className="-me-1 -mt-1 flex size-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                <X className="size-4" />
              </button>
            )}
          </div>
        )}
        {children && <div className="mt-4">{children}</div>}
        {footer && <div className="mt-5 flex flex-row-reverse justify-start gap-2 sm:flex-row">{footer}</div>}
      </div>
    </div>
  );
}
