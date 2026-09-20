"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";
type Variant = "default" | "outline";

const sizes: Record<Size, string> = {
  sm: "h-8 min-w-8 px-2 text-xs [&_svg]:size-3.5",
  md: "h-9 min-w-9 px-2.5 text-sm [&_svg]:size-4",
  lg: "h-10 min-w-10 px-3 text-sm [&_svg]:size-4",
};

const base =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap transition-colors " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-50";

function toggleClass(on: boolean, variant: Variant, size: Size) {
  return cn(
    base,
    sizes[size],
    variant === "outline" && "border border-input",
    on ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
  );
}

export interface ToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  variant?: Variant;
  size?: Size;
}

/** دکمه‌ی فشاری. A two-state button (aria-pressed), for things like «پررنگ» or «فقط موجود». */
export function Toggle({ pressed, defaultPressed = false, onPressedChange, variant = "default", size = "md", className, onClick, ...props }: ToggleProps) {
  const [internal, setInternal] = React.useState(defaultPressed);
  const on = pressed ?? internal;
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={(e) => {
        if (pressed === undefined) setInternal(!on);
        onPressedChange?.(!on);
        onClick?.(e);
      }}
      className={cn(toggleClass(on, variant, size), className)}
      {...props}
    />
  );
}

export type ToggleGroupItem = { value: string; label: React.ReactNode; "aria-label"?: string; disabled?: boolean };

export type ToggleGroupProps = {
  items: ToggleGroupItem[];
  variant?: Variant;
  size?: Size;
  className?: string;
  "aria-label"?: string;
} & (
  | { type?: "single"; value?: string; defaultValue?: string; onChange?: (value: string) => void }
  | { type: "multiple"; value?: string[]; defaultValue?: string[]; onChange?: (value: string[]) => void }
);

/**
 * گروه دکمه‌ی فشاری. `single` behaves like a radio row (one may stay off),
 * `multiple` like a checkbox row. Arrow keys move between items in reading order.
 */
export function ToggleGroup(props: ToggleGroupProps) {
  const { items, variant = "default", size = "md", className } = props;
  const multiple = props.type === "multiple";
  const [internal, setInternal] = React.useState<string[]>(() => {
    const d = props.defaultValue;
    return d === undefined ? [] : Array.isArray(d) ? d : [d];
  });
  const selected: string[] = props.value === undefined ? internal : Array.isArray(props.value) ? props.value : props.value ? [props.value] : [];

  function pick(v: string) {
    const next = multiple ? (selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v]) : selected[0] === v ? [] : [v];
    if (props.value === undefined) setInternal(next);
    if (props.type === "multiple") props.onChange?.(next);
    else props.onChange?.(next[0] ?? "");
  }

  return (
    <div
      role="group"
      aria-label={props["aria-label"]}
      onKeyDown={(e) => {
        const dir = e.key === "ArrowLeft" ? 1 : e.key === "ArrowRight" ? -1 : 0;
        if (!dir) return;
        const buttons = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>("button:not(:disabled)"));
        const i = buttons.indexOf(document.activeElement as HTMLButtonElement);
        if (i < 0) return;
        e.preventDefault();
        buttons[(i + dir + buttons.length) % buttons.length].focus();
      }}
      className={cn("inline-flex items-center gap-1", variant === "outline" && "rounded-lg border border-input p-0.5", className)}
    >
      {items.map((it) => {
        const on = selected.includes(it.value);
        return (
          <button
            key={it.value}
            type="button"
            aria-pressed={on}
            aria-label={it["aria-label"]}
            disabled={it.disabled}
            onClick={() => pick(it.value)}
            className={toggleClass(on, "default", size)}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
