"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { cn, en, fa } from "@/lib/utils";

export interface NumberFieldProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

/** عدد. Plus sits at the inline-start (right in RTL), display uses Persian digits. */
export function NumberField({ value, defaultValue = 0, onChange, min = -Infinity, max = Infinity, step = 1, disabled, className, ...aria }: NumberFieldProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const n = value ?? internal;

  function set(next: number) {
    const clamped = Math.min(max, Math.max(min, next));
    if (value === undefined) setInternal(clamped);
    onChange?.(clamped);
  }

  const btn = "flex w-10 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className={cn("inline-flex h-10 items-stretch overflow-hidden rounded-lg border border-input bg-background/60", className)} role="group" aria-label={aria["aria-label"]}>
      <button type="button" aria-label="افزایش" disabled={disabled || n >= max} onClick={() => set(n + step)} className={btn}>
        <Plus className="size-4" />
      </button>
      <input
        inputMode="numeric"
        value={fa(n)}
        disabled={disabled}
        onChange={(e) => {
          const parsed = Number(en(e.target.value).replace(/[^\d.-]/g, ""));
          if (!Number.isNaN(parsed)) set(parsed);
        }}
        className="w-14 border-x border-input bg-transparent text-center text-sm font-semibold outline-none"
      />
      <button type="button" aria-label="کاهش" disabled={disabled || n <= min} onClick={() => set(n - step)} className={btn}>
        <Minus className="size-4" />
      </button>
    </div>
  );
}
