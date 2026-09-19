"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { Field, Input } from "@/registry/ui/input";
import { OtpField } from "@/registry/ui/otp-field";
import { Stepper } from "@/registry/ui/stepper";
import { fa } from "@/lib/utils";

/** ورود با موبایل و کد تأیید: دو مرحله در یک کارت. */
export function AuthPage() {
  const [step, setStep] = React.useState(0);
  const [phone, setPhone] = React.useState("");
  const [left, setLeft] = React.useState(90);

  React.useEffect(() => {
    if (step !== 1 || left <= 0) return;
    const id = window.setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [step, left]);

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background p-4 text-foreground">
      <div aria-hidden className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" style={{ backgroundImage: "linear-gradient(to right, oklch(from var(--foreground) l c h / 6%) 1px, transparent 1px), linear-gradient(to bottom, oklch(from var(--foreground) l c h / 6%) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
      <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-[0_30px_80px_-30px_oklch(0_0_0/70%)]">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-3 flex size-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">و</span>
          <h1 className="text-lg font-bold">{step === 0 ? "ورود یا ثبت‌نام" : "کد تأیید را وارد کنید"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {step === 0 ? "شماره‌ی موبایل‌تان را وارد کنید تا کد تأیید بفرستیم." : `کد ۶ رقمی به ${fa(phone || "۰۹۱۲۳۴۵۶۷۸۹")} پیامک شد.`}
          </p>
        </div>

        <Stepper current={step} steps={[{ label: "شماره" }, { label: "کد تأیید" }, { label: "ورود" }]} className="mb-6" />

        {step === 0 ? (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setStep(1); setLeft(90); }}>
            <Field label="شماره‌ی موبایل" htmlFor="phone">
              <Input id="phone" dir="ltr" inputMode="tel" autoComplete="tel" startAddon="+98" placeholder="912 345 6789" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </Field>
            <Button type="submit" className="w-full">دریافت کد</Button>
            <p className="text-center text-xs text-muted-foreground">با ورود، <a href="#" className="underline underline-offset-4">قوانین استفاده</a> را می‌پذیرید.</p>
          </form>
        ) : (
          <div className="space-y-5">
            <div className="flex justify-center"><OtpField onComplete={() => setStep(2)} /></div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <button type="button" onClick={() => setStep(0)} className="inline-flex cursor-pointer items-center gap-1 hover:text-foreground"><ArrowRight className="size-3.5" />تغییر شماره</button>
              {left > 0 ? <span>ارسال دوباره تا {fa(left)} ثانیه دیگر</span> : <button type="button" onClick={() => setLeft(90)} className="cursor-pointer font-medium text-foreground">ارسال دوباره‌ی کد</button>}
            </div>
            <Button className="w-full" onClick={() => setStep(2)}>ورود</Button>
          </div>
        )}
      </div>
    </div>
  );
}
