"use client";

import * as React from "react";
import { cn, fa } from "@/lib/utils";

export interface SliderProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Formats the value label, e.g. formatToman. Defaults to Persian digits. */
  format?: (value: number) => string;
  label?: React.ReactNode;
  showValue?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * اسلایدر. A styled native range input: the track fills from the inline-start
 * (right in RTL), so the browser handles direction, keyboard and touch.
 */
export function Slider({ value, defaultValue = 0, onChange, min = 0, max = 100, step = 1, format = (v) => fa(v), label, showValue = true, disabled, className }: SliderProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const v = value ?? internal;
  const pct = ((v - min) / (max - min)) * 100;
  const id = React.useId();

  return (
    <div className={cn("space-y-2", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs">
          <label htmlFor={id} className="text-muted-foreground">{label}</label>
          {showValue && <span className="font-medium tabular-nums">{format(v)}</span>}
        </div>
      )}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={v}
        disabled={disabled}
        onChange={(e) => {
          const n = Number(e.target.value);
          if (value === undefined) setInternal(n);
          onChange?.(n);
        }}
        className={cn(
          "h-1.5 w-full cursor-pointer appearance-none rounded-full outline-none disabled:cursor-not-allowed disabled:opacity-50",
          "[&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow",
          "[&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-background",
          "focus-visible:ring-2 focus-visible:ring-ring/60",
        )}
        style={{ background: `linear-gradient(to left, var(--primary) ${pct}%, var(--input) ${pct}%)` }}
      />
    </div>
  );
}
