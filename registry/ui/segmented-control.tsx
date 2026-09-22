"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type SegmentedOption = { value: string; label: React.ReactNode; disabled?: boolean; "aria-label"?: string };

export interface SegmentedControlProps {
  options: SegmentedOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: "sm" | "md";
  /** Stretch to the container and give every segment the same width. */
  fullWidth?: boolean;
  className?: string;
  "aria-label"?: string;
}

/**
 * کنترل بخشی. One pill slides under the chosen segment. The indicator is
 * measured from the DOM, so it lands on the right segment in RTL and LTR alike.
 */
export function SegmentedControl({ options, value, defaultValue, onChange, size = "md", fullWidth, className, ...aria }: SegmentedControlProps) {
  const [internal, setInternal] = React.useState(defaultValue ?? options[0]?.value ?? "");
  const selected = value ?? internal;
  const list = React.useRef<HTMLDivElement>(null);
  const [pill, setPill] = React.useState<{ x: number; w: number } | null>(null);

  function select(v: string) {
    if (value === undefined) setInternal(v);
    onChange?.(v);
  }

  const measure = React.useCallback(() => {
    const root = list.current;
    const el = root?.querySelector<HTMLElement>(`[data-value="${CSS.escape(selected)}"]`);
    if (!root || !el) return setPill(null);
    setPill({ x: el.offsetLeft, w: el.offsetWidth });
  }, [selected]);

  React.useLayoutEffect(measure, [measure, options.length, size, fullWidth]);
  React.useEffect(() => {
    const root = list.current;
    if (!root || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, [measure]);

  return (
    <div
      ref={list}
      role="radiogroup"
      aria-label={aria["aria-label"]}
      onKeyDown={(e) => {
        const dir = e.key === "ArrowLeft" || e.key === "ArrowDown" ? 1 : e.key === "ArrowRight" || e.key === "ArrowUp" ? -1 : 0;
        if (!dir) return;
        e.preventDefault();
        const enabled = options.filter((o) => !o.disabled);
        const i = enabled.findIndex((o) => o.value === selected);
        const next = enabled[(i + dir + enabled.length) % enabled.length];
        if (!next) return;
        select(next.value);
        list.current?.querySelector<HTMLElement>(`[data-value="${CSS.escape(next.value)}"]`)?.focus();
      }}
      className={cn(
        // Equal-width columns; fr tracks in an inline grid grow to the widest label.
        "relative isolate auto-cols-fr grid-flow-col rounded-[calc(var(--shape-control)+2px)] bg-muted p-0.5",
        fullWidth ? "grid w-full" : "inline-grid",
        className,
      )}
    >
      {pill && (
        <span
          aria-hidden
          className="absolute inset-y-0.5 -z-10 rounded-control bg-background shadow-sm ring-1 ring-border transition-[transform,width] duration-(--motion) ease-motion"
          style={{ width: pill.w, left: 0, transform: `translateX(${pill.x}px)` }}
        />
      )}
      {options.map((o) => {
        const on = o.value === selected;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            data-value={o.value}
            aria-checked={on}
            aria-label={o["aria-label"]}
            disabled={o.disabled}
            tabIndex={on ? 0 : -1}
            onClick={() => select(o.value)}
            className={cn(
              "relative cursor-pointer rounded-control font-medium whitespace-nowrap transition-colors duration-(--motion) ease-motion",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
              "disabled:cursor-not-allowed disabled:opacity-40",
              size === "sm" ? "h-7 px-2.5 text-xs" : "h-8 px-3.5 text-sm",
              on ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
