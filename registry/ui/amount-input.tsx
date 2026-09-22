"use client";

import * as React from "react";
import { cn, en, fa, faNumber } from "@/lib/utils";
import { amountToWords } from "@/lib/number-to-words";

export interface AmountInputProps {
  value?: number | null;
  defaultValue?: number | null;
  onChange?: (value: number | null) => void;
  /** Unit shown at the end of the field and after the words. */
  unit?: string;
  min?: number;
  max?: number;
  /** Spell the amount out under the field (default true). */
  words?: boolean;
  /** Preset chips that set the value, e.g. [100_000, 500_000, 1_000_000]. */
  quick?: number[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

/** 100000 → «۱۰۰ هزار», 2500000 → «۲٫۵ میلیون», 1200 → «۱٬۲۰۰». */
export function shortAmount(n: number) {
  if (n >= 1_000_000 && n % 100_000 === 0) return `${fa(String(n / 1_000_000).replace(".", "٫"))} میلیون`;
  if (n >= 1_000 && n % 1_000 === 0) return `${fa(n / 1_000)} هزار`;
  return faNumber(n);
}

/**
 * مبلغ. Thousands separator «٬» and Persian digits while you type, the unit
 * after the number, and the amount spelled out underneath so nobody pays
 * ۱۲٬۵۰۰٬۰۰۰ when they meant ۱٬۲۵۰٬۰۰۰. The value is a plain number.
 */
export function AmountInput({ value, defaultValue = null, onChange, unit = "تومان", min, max, words = true, quick, placeholder = "۰", disabled, className, id }: AmountInputProps) {
  const [internal, setInternal] = React.useState<number | null>(defaultValue);
  const amount = value === undefined ? internal : value;
  const tooLow = amount !== null && min !== undefined && amount < min;
  const tooHigh = amount !== null && max !== undefined && amount > max;
  const invalid = tooLow || tooHigh;

  function set(next: number | null) {
    if (value === undefined) setInternal(next);
    onChange?.(next);
  }

  function type(raw: string) {
    const digits = en(raw).replace(/\D/g, "").replace(/^0+(?=\d)/, "").slice(0, 15);
    set(digits ? Number(digits) : null);
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      <div
        className={cn(
          "flex h-10 items-center gap-2 rounded-field border-line-field bg-field shadow-field px-3 transition-colors focus-within:ring-2 focus-within:ring-ring/60",
          invalid ? "border-destructive/60" : "border-input",
          disabled && "opacity-50",
        )}
      >
        <input
          id={id}
          inputMode="numeric"
          autoComplete="off"
          disabled={disabled}
          value={amount === null ? "" : faNumber(amount)}
          onChange={(e) => type(e.target.value)}
          placeholder={placeholder}
          className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium tabular-nums outline-none placeholder:text-muted-foreground/50 disabled:cursor-not-allowed"
          aria-invalid={invalid ? true : undefined}
          aria-describedby={id ? `${id}-words` : undefined}
        />
        <span className="shrink-0 text-sm text-muted-foreground">{unit}</span>
      </div>
      {(words || invalid) && (
        <p id={id ? `${id}-words` : undefined} className={cn("min-h-4 text-[11px]", invalid ? "text-destructive" : "text-muted-foreground")} aria-live="polite">
          {tooLow ? `حداقل ${faNumber(min!)} ${unit}` : tooHigh ? `حداکثر ${faNumber(max!)} ${unit}` : amount !== null ? amountToWords(amount, unit) : " "}
        </p>
      )}
      {quick && quick.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {quick.map((q) => (
            <button
              key={q}
              type="button"
              disabled={disabled}
              onClick={() => set(q)}
              className={cn(
                "cursor-pointer rounded-full border px-2.5 py-0.5 text-[11px] tabular-nums transition-colors disabled:cursor-not-allowed",
                amount === q ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground",
              )}
            >
              {shortAmount(q)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
