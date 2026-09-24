"use client";

import * as React from "react";
import { Check, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { bankLabel, formatIban, ibanBank, isIban, normalizeIban } from "@/lib/persian";

export interface IbanInputProps {
  value?: string;
  onChange?: (iban: string, valid: boolean) => void;
  className?: string;
  id?: string;
}

/** شماره‌ی شبا. Fixed «IR» prefix, digits grouped in fours, mod-97 validation and bank detection. */
export function IbanInput({ value, onChange, className, id }: IbanInputProps) {
  const [internal, setInternal] = React.useState("IR");
  const iban = normalizeIban(value ?? internal);
  const digits = iban.slice(2);
  const valid = isIban(iban);
  const bank = ibanBank(iban);
  const complete = digits.length === 24;

  function set(next: string) {
    const n = normalizeIban("IR" + next);
    if (value === undefined) setInternal(n);
    onChange?.(n, isIban(n));
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className={cn("flex h-10 items-center gap-2 rounded-field border-line-field bg-field shadow-field px-3 transition-colors focus-within:ring-2 focus-within:ring-ring/60", complete && !valid ? "border-destructive/60" : "border-input")} dir="ltr">
        <span className="font-mono text-sm text-muted-foreground">IR</span>
        <input
          id={id}
          inputMode="numeric"
          value={formatIban(iban).slice(3)}
          onChange={(e) => set(e.target.value)}
          placeholder="00 0000 0000 0000 0000 0000 00"
          className="h-full min-w-0 flex-1 bg-transparent font-mono text-sm tracking-wide outline-none placeholder:text-muted-foreground/50"
          aria-invalid={complete && !valid ? true : undefined}
        />
        {valid && <Check className="size-4 text-success" />}
      </div>
      <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        {bank ? (<><Landmark className="size-3" />{bankLabel(bank)}</>) : complete && !valid ? <span className="text-destructive">شماره‌ی شبا معتبر نیست</span> : "۲۴ رقم بعد از IR"}
      </p>
    </div>
  );
}
