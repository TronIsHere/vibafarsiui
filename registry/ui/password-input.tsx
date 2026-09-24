"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const LEVELS = ["خیلی ضعیف", "ضعیف", "متوسط", "قوی", "عالی"];

export function passwordStrength(v: string): number {
  let s = 0;
  if (v.length >= 8) s++;
  if (v.length >= 12) s++;
  if (/[a-z]/.test(v) && /[A-Z]/.test(v)) s++;
  if (/\d/.test(v) && /[^A-Za-z0-9]/.test(v)) s++;
  return v ? Math.max(1, s) : 0;
}

export interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Show the strength meter under the field. */
  strength?: boolean;
}

/** رمز عبور. Show/hide toggle at the inline-end, always LTR, optional strength meter with Persian labels. */
export function PasswordInput({ strength, className, onChange, value, defaultValue, ...props }: PasswordInputProps) {
  const [show, setShow] = React.useState(false);
  const [v, setV] = React.useState(String(value ?? defaultValue ?? ""));
  const level = passwordStrength(String(value ?? v));
  return (
    <div className="space-y-2">
      <div className={cn("flex h-10 items-center rounded-field border-line-field border-input bg-field shadow-field pe-1 ps-3 transition-colors focus-within:border-transparent focus-within:ring-2 focus-within:ring-ring/60", className)} dir="ltr">
        <input
          type={show ? "text" : "password"}
          autoComplete="new-password"
          value={value}
          defaultValue={defaultValue}
          onChange={(e) => { setV(e.target.value); onChange?.(e); }}
          className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
          {...props}
        />
        <button type="button" aria-label={show ? "پنهان کردن رمز" : "نمایش رمز"} aria-pressed={show} onClick={() => setShow((s) => !s)} className="flex size-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {strength && (
        <div className="space-y-1" aria-live="polite">
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((i) => (
              <span key={i} className={cn("h-1 flex-1 rounded-full transition-colors", i <= level ? (level <= 1 ? "bg-destructive" : level === 2 ? "bg-warning" : "bg-success") : "bg-input")} />
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground">{level ? `قدرت رمز: ${LEVELS[level]}` : "حداقل ۸ کاراکتر، با حرف بزرگ، عدد و نماد"}</p>
        </div>
      )}
    </div>
  );
}
