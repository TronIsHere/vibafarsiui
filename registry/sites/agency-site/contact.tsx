"use client";

import * as React from "react";
import { Check, Clock, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { Field, Input } from "@/registry/ui/input";
import { Textarea } from "@/registry/ui/textarea";
import { SegmentedControl } from "@/registry/ui/segmented-control";
import { Select } from "@/registry/ui/select";
import { cn } from "@/lib/utils";
import { Shell, useHref } from "./shell";

const TYPES = ["هویت برند", "وب‌سایت", "اپ موبایل", "پنل و داشبورد", "سامانه‌ی طراحی", "مشاوره"];
const BUDGETS = [
  { value: "s", label: "زیر ۵۰۰ میلیون" },
  { value: "m", label: "۵۰۰ میلیون تا ۱ میلیارد" },
  { value: "l", label: "بیشتر از ۱ میلیارد" },
];

/** فرم شروع پروژه با نوع کار، بودجه و زمان‌بندی. */
export function ContactPage() {
  const href = useHref();
  const [types, setTypes] = React.useState<string[]>(["وب‌سایت"]);
  const [budget, setBudget] = React.useState("m");
  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState("");

  const toggle = (t: string) => setTypes((xs) => (xs.includes(t) ? xs.filter((x) => x !== t) : [...xs, t]));

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (!String(data.get("name")).trim() || !String(data.get("email")).includes("@")) {
      setError("اسم و ایمیل را وارد کنید تا بتونیم جواب بدیم.");
      return;
    }
    setError("");
    setSent(true);
  }

  return (
    <Shell active="/contact">
      <section className="mx-auto grid max-w-6xl gap-14 px-4 pt-16 pb-24 sm:px-6 sm:pt-24 lg:grid-cols-[1fr_1.5fr]">
        <div>
          <p className="text-sm text-muted-foreground">شروع پروژه</p>
          <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">از پروژه‌تون بگید</h1>
          <p className="mt-5 max-w-sm leading-8 text-muted-foreground">
            فرم را پر کنید تا یکی از مدیرهای پروژه تا یک روز کاری باهاتون تماس بگیره. جلسه‌ی اول رایگانه.
          </p>
          <ul className="mt-10 space-y-5 text-sm">
            <li className="flex items-center gap-3">
              <Mail className="size-4 text-brand" />
              <span dir="ltr">hello@naghsh.studio</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="size-4 text-brand" />
              <span dir="ltr">۰۲۱ ۸۸۸۸ ۱۲۱۲</span>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="size-4 text-brand" />
              تهران، خیابان ولیعصر، کوچه‌ی بهار، پلاک ۱۲
            </li>
            <li className="flex items-center gap-3">
              <Clock className="size-4 text-brand" />
              شنبه تا چهارشنبه، ۹ تا ۱۸
            </li>
          </ul>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 sm:p-9">
          {sent ? (
            <div className="flex min-h-96 flex-col items-center justify-center text-center" role="status">
              <span className="grid size-14 place-items-center rounded-full bg-success/15 text-success">
                <Check className="size-7" />
              </span>
              <h2 className="mt-5 text-2xl font-bold">پیامتون رسید</h2>
              <p className="mt-2 max-w-sm leading-7 text-muted-foreground">تا پایان روز کاری بعد باهاتون تماس می‌گیریم. تا اون موقع نمونه‌کارها را ببینید.</p>
              <a href={href("/work")} className="mt-6 text-sm font-semibold underline underline-offset-4">
                دیدن نمونه‌کارها
              </a>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="space-y-7">
              <fieldset>
                <legend className="text-sm font-medium">چه کاری لازم دارید؟</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {TYPES.map((t) => {
                    const on = types.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggle(t)}
                        className={cn(
                          "inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full border px-4 text-sm transition-colors",
                          on ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {on && <Check className="size-3.5" />}
                        {t}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="اسم و نام خانوادگی" htmlFor="c-name">
                  <Input id="c-name" name="name" autoComplete="name" placeholder="مثلاً سارا محمدی" />
                </Field>
                <Field label="ایمیل" htmlFor="c-email">
                  <Input id="c-email" name="email" type="email" dir="ltr" autoComplete="email" placeholder="you@company.ir" />
                </Field>
                <Field label="شرکت یا برند" htmlFor="c-company">
                  <Input id="c-company" name="company" autoComplete="organization" />
                </Field>
                <Field label="زمان شروع" htmlFor="c-when">
                  <Select
                    id="c-when"
                    name="when"
                    defaultValue="month"
                    options={[
                      { value: "now", label: "همین حالا" },
                      { value: "month", label: "تا یک ماه دیگه" },
                      { value: "quarter", label: "تا سه ماه دیگه" },
                      { value: "unsure", label: "هنوز مطمئن نیستم" },
                    ]}
                  />
                </Field>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium" id="c-budget">
                  بودجه (تومان)
                </p>
                <SegmentedControl aria-label="بودجه" options={BUDGETS} value={budget} onChange={setBudget} fullWidth />
              </div>

              <Field label="کمی از پروژه بگید" htmlFor="c-desc">
                <Textarea id="c-desc" name="desc" rows={5} maxLength={600} showCount placeholder="مخاطب کیه، چه مشکلی را حل می‌کنه و چه چیزی تا حالا ساخته شده؟" />
              </Field>

              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}

              <Button type="submit" size="lg" className="w-full rounded-full">
                فرستادن
              </Button>
            </form>
          )}
        </div>
      </section>
    </Shell>
  );
}
