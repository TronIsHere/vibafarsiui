"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface RadioOption {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** "list" = plain radios, "cards" = each option is a selectable card. */
  variant?: "list" | "cards";
  name?: string;
  className?: string;
}

/** گروه رادیویی. Arrow keys move selection; RTL-aware (ArrowLeft = next). */
export function RadioGroup({ options, value, defaultValue, onChange, variant = "list", name, className }: RadioGroupProps) {
  const [internal, setInternal] = React.useState(defaultValue ?? "");
  const selected = value ?? internal;
  const autoName = React.useId();

  function select(v: string) {
    if (value === undefined) setInternal(v);
    onChange?.(v);
  }

  function onKeyDown(e: React.KeyboardEvent, i: number) {
    const dir = e.key === "ArrowLeft" || e.key === "ArrowDown" ? 1 : e.key === "ArrowRight" || e.key === "ArrowUp" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const enabled = options.filter((o) => !o.disabled);
    const cur = enabled.findIndex((o) => o.value === options[i].value);
    const next = enabled[(cur + dir + enabled.length) % enabled.length];
    select(next.value);
    (e.currentTarget.parentElement?.querySelectorAll<HTMLElement>("[role=radio]")[options.indexOf(next)])?.focus();
  }

  return (
    <div role="radiogroup" className={cn(variant === "cards" ? "space-y-2" : "space-y-2.5", className)}>
      {options.map((o, i) => {
        const on = selected === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            name={name ?? autoName}
            aria-checked={on}
            disabled={o.disabled}
            tabIndex={on || (!selected && i === 0) ? 0 : -1}
            onClick={() => select(o.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              "flex w-full cursor-pointer items-start gap-2.5 text-start text-sm transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "disabled:cursor-not-allowed disabled:opacity-50",
              variant === "cards" && "rounded-control border-line p-3",
              variant === "cards" && (on ? "border-foreground/50 bg-accent/60" : "border-border hover:bg-accent/40"),
            )}
          >
            <span className={cn("mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border", on ? "border-primary" : "border-input")}>
              {on && <span className="size-2 rounded-full bg-primary" />}
            </span>
            <span>
              <span className="block font-medium leading-5">{o.label}</span>
              {o.description && <span className="block text-xs text-muted-foreground">{o.description}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}
