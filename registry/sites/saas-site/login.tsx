"use client";

import * as React from "react";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { PhoneInput } from "@/registry/ui/phone-input";
import { OtpField } from "@/registry/ui/otp-field";
import { Avatar } from "@/registry/ui/avatar";
import { fa } from "@/lib/utils";
import { Photo, Shell } from "./shell";

type Step = "phone" | "code" | "done";

/** ورود و ثبت‌نام با شماره‌ی موبایل و کد تأیید. */
export function LoginPage() {
  const [step, setStep] = React.useState<Step>("phone");
  const [phone, setPhone] = React.useState("");
  const [valid, setValid] = React.useState(false);
  const [left, setLeft] = React.useState(0);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (left <= 0) return;
    const id = window.setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [left]);

  const send = () => {
    setStep("code");
    setLeft(90);
    setError("");
  };

  const verify = (code: string) => {
    // Demo rule: any code except 000000 passes. Call your API here.
    if (code === "000000") setError("کد درست نیست. دوباره امتحان کنید.");
    else setStep("done");
  };

  const masked = phone ? `${fa(phone.slice(0, 4))}•••${fa(phone.slice(-4))}` : "";

  return (
    <Shell active="/login" bare>
      <div className="grid min-h-[calc(100dvh-4rem)] lg:grid-cols-2">
        <section className="flex items-center justify-center px-4 py-16 sm:px-6">
          <div className="w-full max-w-sm">
            {step === "phone" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (valid) send();
                }}
              >
                <h1 className="text-3xl font-black">ورود یا ثبت‌نام</h1>
                <p className="mt-2 leading-7 text-muted-foreground">شماره‌ی موبایلتون را وارد کنید تا کد تأیید براتون پیامک بشه.</p>
                <label htmlFor="login-phone" className="mt-8 block text-sm font-medium">
                  شماره‌ی موبایل
                </label>
                <PhoneInput
                  id="login-phone"
                  className="mt-2"
                  value={phone}
                  autoFocus
                  onChange={(d, ok) => {
                    setPhone(d);
                    setValid(ok);
                  }}
                />
                <Button type="submit" size="lg" className="mt-6 w-full" disabled={!valid}>
                  دریافت کد تأیید
                </Button>
                <p className="mt-6 text-center text-xs leading-6 text-muted-foreground">
                  با ورود، <a href="#" className="underline underline-offset-4">قوانین</a> و <a href="#" className="underline underline-offset-4">حریم خصوصی</a> را می‌پذیرید.
                </p>
              </form>
            )}

            {step === "code" && (
              <div>
                <button type="button" onClick={() => setStep("phone")} className="mb-6 inline-flex cursor-pointer items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                  <ArrowRight className="size-4" />
                  تغییر شماره
                </button>
                <h1 className="text-3xl font-black">کد تأیید</h1>
                <p className="mt-2 leading-7 text-muted-foreground">
                  کد ۶ رقمی به <span dir="ltr" className="font-semibold text-foreground">{masked}</span> فرستاده شد.
                </p>
                <OtpField className="mt-8" aria-label="کد تأیید" onComplete={verify} onChange={() => setError("")} />
                {error && (
                  <p role="alert" className="mt-3 text-sm text-destructive">
                    {error}
                  </p>
                )}
                <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
                  {left > 0 ? (
                    <>ارسال دوباره تا {fa(`${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`)}</>
                  ) : (
                    <button type="button" onClick={send} className="cursor-pointer font-semibold text-foreground underline underline-offset-4">
                      ارسال دوباره‌ی کد
                    </button>
                  )}
                </p>
              </div>
            )}

            {step === "done" && (
              <div className="text-center" role="status">
                <span className="mx-auto grid size-16 place-items-center rounded-full bg-success/15 text-success">
                  <Check className="size-8" />
                </span>
                <h1 className="mt-6 text-3xl font-black">خوش اومدید</h1>
                <p className="mt-2 leading-7 text-muted-foreground">در حال رفتن به داشبورد… ۱۴ روز رایگان شما از همین حالا شروع شد.</p>
              </div>
            )}
          </div>
        </section>

        <aside className="relative hidden overflow-hidden border-s border-border bg-card lg:block">
          <Photo name="login" alt="" eager className="absolute inset-0" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="relative flex h-full flex-col justify-end p-12">
            <figure className="max-w-md">
              <blockquote className="text-xl font-bold leading-9">«اولین فاکتور رسمی را در کمتر از سه دقیقه صادر کردم.»</blockquote>
              <figcaption className="mt-5 flex items-center gap-3 text-sm">
                <Avatar name="الهام قاسمی" />
                <span>
                  <span className="block font-semibold">الهام قاسمی</span>
                  <span className="text-muted-foreground">طراح مستقل</span>
                </span>
              </figcaption>
            </figure>
          </div>
        </aside>
      </div>
    </Shell>
  );
}
