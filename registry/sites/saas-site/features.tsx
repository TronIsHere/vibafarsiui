"use client";

import { Check, Cloud, KeyRound, Lock, RefreshCw } from "lucide-react";
import { Reveal } from "@/registry/animations/reveal";
import { cn } from "@/lib/utils";
import { ProductMock, Shell, useHref } from "./shell";

const SECTIONS = [
  {
    eyebrow: "فاکتور و فروش",
    t: "فاکتوری که مشتری همون لحظه پرداخت می‌کنه",
    b: "فاکتور رسمی با کد اقتصادی و شناسه‌ی ملی بسازید، لینک پرداخت بفرستید و ببینید کی بازش کرده.",
    points: ["قالب فاکتور با لوگوی خودتون", "لینک پرداخت از درگاه‌های داخلی", "یادآوری خودکار سررسید با پیامک", "پیش‌فاکتور و تبدیل با یک کلیک"],
    mock: "invoice" as const,
  },
  {
    eyebrow: "مالیات",
    t: "سامانه‌ی مودیان بدون دردسر",
    b: "کلید امضا را یک بار وارد می‌کنید و از اون به بعد فاکتورها خودکار ارسال میشن. اگر خطایی بیاد، دقیق می‌گیم کدوم فیلد را درست کنید.",
    points: ["ارسال گروهی و تکی", "وضعیت لحظه‌ای هر صورت‌حساب", "ابطال و اصلاح طبق دستورالعمل", "گزارش فصلی ارزش افزوده"],
    mock: "tax" as const,
  },
  {
    eyebrow: "گزارش",
    t: "عددهایی که حسابدار شما هم قبولشون داره",
    b: "سود و زیان، ترازنامه و گردش حساب‌ها همیشه به‌روزن. خروجی اکسل و PDF برای جلسه‌ی آخر ماه آماده‌ست.",
    points: ["گزارش مقایسه‌ای ماه به ماه", "مرکز هزینه و پروژه", "دسترسی فقط‌خواندنی برای حسابدار", "بستن سال مالی با راهنما"],
    mock: "report" as const,
  },
];

const INTEGRATIONS = ["بانک ملت", "بانک سامان", "زرین‌پال", "پی‌پینگ", "دیجی‌کالا", "باسلام", "ترب", "کاوه‌نگار", "ووکامرس", "اکسل"];

function MiniMock({ kind }: { kind: "invoice" | "tax" | "report" }) {
  if (kind === "report") return <ProductMock />;
  return (
    <div className="rounded-2xl border border-border bg-card p-5 text-sm shadow-xl" aria-hidden>
      {kind === "invoice" ? (
        <>
          <div className="flex items-center justify-between">
            <span className="font-bold">صورت‌حساب ۱۴۰۵-۲۱۸</span>
            <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs text-success">پرداخت‌شده</span>
          </div>
          <div className="mt-4 space-y-2 text-xs">
            {[["قهوه‌ی عربیکا ۱ کیلو", "۲٬۴۰۰٬۰۰۰"], ["فیلتر کاغذی × ۴", "۳۶۰٬۰۰۰"], ["ارسال", "۸۰٬۰۰۰"]].map(([a, b]) => (
              <div key={a} className="flex justify-between border-b border-dashed border-border pb-2">
                <span className="text-muted-foreground">{a}</span>
                <span>{b}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between font-bold">
            <span>جمع با ارزش افزوده</span>
            <span>۳٬۰۹۵٬۶۰۰ تومان</span>
          </div>
        </>
      ) : (
        <>
          <p className="font-bold">ارسال به سامانه‌ی مودیان</p>
          <ul className="mt-4 space-y-3 text-xs">
            {[
              { n: "۱۴۰۵-۲۱۸", s: "تأیید شد", c: "text-success" },
              { n: "۱۴۰۵-۲۱۷", s: "تأیید شد", c: "text-success" },
              { n: "۱۴۰۵-۲۱۶", s: "در صف ارسال", c: "text-warning" },
              { n: "۱۴۰۵-۲۱۵", s: "کد اقتصادی خریدار ناقصه", c: "text-destructive" },
            ].map((r) => (
              <li key={r.n} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                <span>{r.n}</span>
                <span className={r.c}>{r.s}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

/** امکانات با بخش‌های زیگزاگ، یکپارچه‌سازی‌ها و امنیت. */
export function FeaturesPage() {
  const href = useHref();
  return (
    <Shell active="/features">
      <section className="mx-auto max-w-3xl px-4 pt-16 text-center sm:px-6 sm:pt-24">
        <p className="text-sm font-semibold text-brand">امکانات</p>
        <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">هرچی برای حساب‌وکتاب لازم دارید</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-muted-foreground">از اولین فاکتور تا بستن سال مالی، بدون اینکه اسم یک سند حسابداری را بلد باشید.</p>
      </section>

      <div className="mx-auto max-w-6xl space-y-24 overflow-x-clip px-4 py-20 sm:px-6 sm:space-y-32">
        {SECTIONS.map((s, i) => (
          <section key={s.t} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal className={cn(i % 2 === 1 && "lg:order-2")}>
              <p className="text-sm font-semibold text-brand">{s.eyebrow}</p>
              <h2 className="mt-3 text-3xl font-black leading-tight">{s.t}</h2>
              <p className="mt-4 leading-8 text-muted-foreground">{s.b}</p>
              <ul className="mt-6 space-y-3">
                {s.points.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-sm">
                    <span className="grid size-5 place-items-center rounded-full bg-brand/15 text-brand">
                      <Check className="size-3" />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={120}>
              <div className="relative">
                <div aria-hidden className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-tr from-brand/15 to-transparent blur-2xl" />
                <MiniMock kind={s.mock} />
              </div>
            </Reveal>
          </section>
        ))}
      </div>

      <section className="border-y border-border bg-card/30 py-20">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-black">به ابزارهایی که دارید وصل میشه</h2>
          <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {INTEGRATIONS.map((x) => (
              <li key={x} className="rounded-xl border border-border bg-background px-4 py-5 text-sm font-semibold">
                {x}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="text-3xl font-black">امنیت</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { i: Cloud, t: "سرور داخل ایران", b: "دیتاسنتر با گواهی افتا در تهران." },
            { i: Lock, t: "رمزنگاری کامل", b: "اتصال TLS و رمزنگاری داده‌ها روی دیسک." },
            { i: RefreshCw, t: "پشتیبان روزانه", b: "تا ۳۰ روز قبل را می‌تونید برگردونید." },
            { i: KeyRound, t: "ورود دومرحله‌ای", b: "کد پیامکی یا اپ احراز هویت." },
          ].map((x) => (
            <div key={x.t} className="rounded-2xl border border-border p-6">
              <x.i className="size-5 text-brand" />
              <h3 className="mt-4 font-bold">{x.t}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{x.b}</p>
            </div>
          ))}
        </div>
        <div className="mt-14 text-center">
          <a href={href("/pricing")} className="inline-flex h-12 items-center rounded-xl bg-primary px-7 text-sm font-semibold text-primary-foreground">
            دیدن پلن‌ها و قیمت
          </a>
        </div>
      </section>
    </Shell>
  );
}
