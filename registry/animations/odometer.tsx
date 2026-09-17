"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const FA = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

function Digit({ d }: { d: number }) {
  return (
    <span className="inline-block h-[1em] overflow-hidden align-baseline leading-none">
      <span className="flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ transform: `translateY(-${d}em)` }}>
        {FA.map((f) => <span key={f} className="h-[1em] leading-none">{f}</span>)}
      </span>
    </span>
  );
}

/**
 * شماره‌انداز. Each digit rolls to its new value like a mechanical counter.
 * Ideal for prices that update live. Digits are laid out LTR inside the number.
 */
export function Odometer({ value, unit, className }: { value: number; unit?: string; className?: string }) {
  const chars = Math.round(value).toLocaleString("en-US").replace(/,/g, "٬").split("");
  return (
    <span className={cn("inline-flex items-baseline gap-1.5 tabular-nums", className)}>
      <span className="inline-flex" dir="ltr">
        {chars.map((c, i) => (/\d/.test(c) ? <Digit key={`${chars.length}-${i}`} d={Number(c)} /> : <span key={`s${i}`} className="leading-none">{c}</span>))}
      </span>
      {unit && <span className="text-[0.5em] text-muted-foreground">{unit}</span>}
    </span>
  );
}
