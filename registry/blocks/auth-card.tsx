"use client";

import * as React from "react";
import { Button } from "@/registry/ui/button";
import { PhoneInput } from "@/registry/ui/phone-input";
import { OtpField } from "@/registry/ui/otp-field";
import { fa } from "@/lib/utils";

/** کارت ورود. Phone → OTP in one card; drop it on any page background. */
export function AuthCard({ title = "ورود یا ثبت‌نام", onVerified }: { title?: string; onVerified?: (phone: string) => void }) {
  const [phone, setPhone] = React.useState("");
  const [valid, setValid] = React.useState(false);
  const [step, setStep] = React.useState<0 | 1>(0);
  const [left, setLeft] = React.useState(90);
  React.useEffect(() => {
    if (step !== 1 || left <= 0) return;
    const id = window.setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [step, left]);

  return (
    <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-[0_30px_80px_-30px_oklch(0_0_0/70%)]">
      <h1 className="text-lg font-bold">{step === 0 ? title : "کد تأیید"}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{step === 0 ? "شماره‌ی موبایل‌تان را وارد کنید تا کد تأیید بفرستیم." : `کد ۶ رقمی به ۰${fa(phone)} پیامک شد.`}</p>
      {step === 0 ? (
        <form className="mt-5 space-y-4" onSubmit={(e) => { e.preventDefault(); if (valid) { setStep(1); setLeft(90); } }}>
          <PhoneInput id="auth-phone" value={phone} onChange={(d, v) => { setPhone(d); setValid(v); }} autoFocus />
          <Button type="submit" className="w-full" disabled={!valid}>دریافت کد</Button>
          <p className="text-center text-xs text-muted-foreground">با ورود، <a href="#" className="underline underline-offset-4">قوانین</a> را می‌پذیرید.</p>
        </form>
      ) : (
        <div className="mt-5 space-y-4">
          <div className="flex justify-center"><OtpField onComplete={() => onVerified?.(phone)} /></div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <button type="button" onClick={() => setStep(0)} className="cursor-pointer hover:text-foreground">تغییر شماره</button>
            {left > 0 ? <span>ارسال دوباره تا {fa(left)} ثانیه</span> : <button type="button" onClick={() => setLeft(90)} className="cursor-pointer font-medium text-foreground">ارسال دوباره</button>}
          </div>
        </div>
      )}
    </div>
  );
}
