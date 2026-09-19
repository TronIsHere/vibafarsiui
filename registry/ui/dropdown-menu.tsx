"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { eventInside, FloatPortal, useFloat } from "@/lib/float";

export type MenuItem =
  | {
      type?: "item";
      label: React.ReactNode;
      icon?: React.ComponentType<{ className?: string }>;
      shortcut?: string;
      danger?: boolean;
      disabled?: boolean;
      onSelect?: () => void;
    }
  | { type: "separator" }
  | { type: "label"; label: React.ReactNode };

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: MenuItem[];
  align?: "start" | "end";
  className?: string;
}

/**
 * منوی کشویی. Opens below the trigger aligned to the inline-start; closes on
 * outside click and Escape; arrow keys move between items.
 */
export function DropdownMenu({
  trigger,
  items,
  align = "start",
  className,
}: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);
  const root = React.useRef<HTMLDivElement>(null);
  const { mounted, style, theme, panel, update } = useFloat(open, root, { align });

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (!eventInside(e, root.current, panel.current)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const els = Array.from(
          panel.current?.querySelectorAll<HTMLElement>(
            "[role=menuitem]:not([disabled])",
          ) ?? [],
        );
        const i = els.indexOf(document.activeElement as HTMLElement);
        els[
          (i + (e.key === "ArrowDown" ? 1 : -1) + els.length) % els.length
        ]?.focus();
      }
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    panel.current?.querySelector<HTMLElement>("[role=menuitem]")?.focus();
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, panel]);

  return (
    <div ref={root} className={cn("inline-block", className)}>
      <span
        onClick={() => { if (!open) update(); setOpen((o) => !o); }}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex cursor-pointer"
      >
        {trigger}
      </span>
      <FloatPortal
        open={open}
        mounted={mounted}
        style={style}
        theme={theme}
        panelRef={panel}
        role="menu"
        className={cn(
          "fixed z-50 min-w-44 rounded-lg border border-border bg-popover p-1 text-sm text-popover-foreground shadow-lg",
          "animate-fade-up [animation-duration:150ms]",
        )}
      >
        {items.map((it, i) => {
            if (it.type === "separator")
              return <hr key={i} className="my-1 border-border" />;
            if (it.type === "label")
              return (
                <p
                  key={i}
                  className="px-2 py-1 text-[11px] text-muted-foreground"
                >
                  {it.label}
                </p>
              );
            return (
              <button
                key={i}
                type="button"
                role="menuitem"
                disabled={it.disabled}
                onClick={() => {
                  it.onSelect?.();
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between gap-6 rounded-md px-2 py-1.5 text-start outline-none transition-colors",
                  "hover:bg-accent focus:bg-accent disabled:cursor-not-allowed disabled:opacity-50",
                  it.danger ? "text-destructive" : "text-foreground/90",
                )}
              >
                <span className="flex items-center gap-2">
                  {it.icon && <it.icon className="size-4" />}
                  {it.label}
                </span>
                {it.shortcut && (
                  <kbd className="  text-[10px] text-muted-foreground">
                    {it.shortcut}
                  </kbd>
                )}
              </button>
            );
          })}
      </FloatPortal>
    </div>
  );
}
