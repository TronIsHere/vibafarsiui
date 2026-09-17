"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatIranMobile, isIranMobile, mobileOperator, normalizeIranMobile } from "@/lib/persian";

export interface PhoneInputProps {
  value?: string;
  /** Receives the 10-digit national number («912…») and validity. */
  onChange?: (digits: string, valid: boolean) => void;
  className?: string;
  id?: string;
  autoFocus?: boolean;
}

/** شماره‌ی موبایل ایران. «+98» fixed on the left, groups of 3-3-4, operator detection, Persian digits accepted. */
export function PhoneInput({ value, onChange, className, id, autoFocus }: PhoneInputProps) {
  const [internal, setInternal] = React.useState("");
  const digits = normalizeIranMobile(value ?? internal);
  const valid = isIranMobile(digits);
  const op = mobileOperator(digits);

  function set(next: string) {
    const d = normalizeIranMobile(next);
    if (value === undefined) setInternal(d);
    onChange?.(d, isIranMobile(d));
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className={cn("flex h-10 items-center gap-2 rounded-lg border bg-background/60 px-3 transition-colors focus-within:ring-2 focus-within:ring-ring/60", digits.length === 10 && !valid ? "border-destructive/60" : "border-input")} dir="ltr">
        <span className="text-sm text-muted-foreground">+98</span>
        <input
          id={id}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          autoFocus={autoFocus}
          value={formatIranMobile(digits)}
          onChange={(e) => set(e.target.value)}
          placeholder="912 345 6789"
          className="h-full min-w-0 flex-1 bg-transparent text-sm tabular-nums outline-none placeholder:text-muted-foreground/50"
          aria-invalid={digits.length === 10 && !valid ? true : undefined}
        />
        {valid && <Check className="size-4 text-success" />}
      </div>
      <p className="text-[11px] text-muted-foreground">
        {op ? `اپراتور: ${op}` : digits.length === 10 && !valid ? <span className="text-destructive">شماره باید با ۹ شروع شود و ۱۰ رقم باشد</span> : "بدون صفر اول هم می‌توانید وارد کنید"}
      </p>
    </div>
  );
}
