"use client";

import * as React from "react";
import { Button } from "@/registry/ui/button";
import { Field, Input } from "@/registry/ui/input";
import { PhoneInput } from "@/registry/ui/phone-input";
import { OtpField } from "@/registry/ui/otp-field";
import { Stepper } from "@/registry/ui/stepper";
import { RadioGroup } from "@/registry/ui/radio-group";
import { SuccessCheck } from "@/registry/animations/success-check";
import { fa } from "@/lib/utils";

/** ثبت‌نام پیامکی: موبایل → کد تأیید → پروفایل → پایان. */
export function OnboardingPage() {
  const [step, setStep] = React.useState(0);
  const [phone, setPhone] = React.useState("");
  const [valid, setValid] = React.useState(false);
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background p-4 text-foreground">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 sm:p-8">
        <Stepper current={step} steps={[{ label: "موبایل" }, { label: "کد تأیید" }, { label: "پروفایل" }]} className="mb-8" />
        {step === 0 && (
          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); if (valid) setStep(1); }}>
            <div><h1 className="text-lg font-bold">خوش آمدید</h1><p className="mt-1 text-sm text-muted-foreground">با شماره‌ی موبایل شروع کنید؛ رمز لازم نیست.</p></div>
            <div className="space-y-1.5"><span className="text-sm font-medium">شماره‌ی موبایل</span><PhoneInput value={phone} onChange={(d, v) => { setPhone(d); setValid(v); }} autoFocus /></div>
            <Button type="submit" className="w-full" disabled={!valid}>دریافت کد</Button>
          </form>
        )}
        {step === 1 && (
          <div className="space-y-5">
            <div><h1 className="text-lg font-bold">کد تأیید</h1><p className="mt-1 text-sm text-muted-foreground">کد ۶ رقمی به ۰{fa(phone)} پیامک شد.</p></div>
            <div className="flex justify-center"><OtpField onComplete={() => setStep(2)} /></div>
            <button type="button" onClick={() => setStep(0)} className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">تغییر شماره</button>
          </div>
        )}
        {step === 2 && (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
            <div><h1 className="text-lg font-bold">کمی درباره‌ی خودتان</h1><p className="mt-1 text-sm text-muted-foreground">بعداً هم می‌توانید عوض کنید.</p></div>
            <Field label="نام و نام خانوادگی" htmlFor="o-n"><Input id="o-n" placeholder="مثلاً: سارا محمدی" required /></Field>
            <Field label="ایمیل (اختیاری)" htmlFor="o-e"><Input id="o-e" type="email" dir="ltr" placeholder="you@example.com" /></Field>
            <div className="space-y-1.5"><span className="text-sm font-medium">از دکان برای چه استفاده می‌کنید؟</span><RadioGroup defaultValue="shop" options={[{ value: "shop", label: "فروشگاه دارم" }, { value: "buy", label: "خرید می‌کنم" }, { value: "dev", label: "برای مشتری‌هایم می‌سازم" }]} /></div>
            <Button type="submit" className="w-full">شروع</Button>
          </form>
        )}
        {step === 3 && (
          <div className="flex flex-col items-center py-6 text-center">
            <SuccessCheck label="حساب شما آماده است" />
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">اولین محصول را اضافه کنید یا یک نگاه به داشبورد بیندازید.</p>
            <div className="mt-6 flex gap-2"><Button>رفتن به داشبورد</Button><Button variant="outline" onClick={() => setStep(0)}>از اول</Button></div>
          </div>
        )}
      </div>
    </div>
  );
}
