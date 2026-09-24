"use client";

import { ArrowLeft, Banknote, Boxes, FileCheck2, LineChart, Smartphone, Users } from "lucide-react";
import { Accordion } from "@/registry/ui/accordion";
import { Avatar } from "@/registry/ui/avatar";
import { Marquee } from "@/registry/animations/marquee";
import { Reveal } from "@/registry/animations/reveal";
import { GradientText } from "@/registry/animations/gradient-text";
import { SpotlightCard } from "@/registry/animations/spotlight-card";
import { Counter } from "@/registry/animations/counter";
import { GridBackground } from "@/registry/backgrounds/grid";
import { cn } from "@/lib/utils";
import { ProductMock, Shell, useHref } from "./shell";

const LOGOS = ["کافه آبی", "چاپ نقره", "گل‌فروشی یاس", "کتاب‌سرای نون", "آهن‌آلات پارس", "داروخانه شفا", "مبل آرکا", "پوشاک ترمه"];

const FEATURES = [
  { icon: FileCheck2, t: "سامانه‌ی مودیان، خودکار", b: "هر فاکتوری که صادر می‌کنید با شناسه‌ی یکتا به سامانه‌ی مودیان می‌ره و وضعیتش همین‌جا دیده میشه.", wide: true },
  { icon: Banknote, t: "اتصال به بانک", b: "تراکنش‌های حساب بانکی هر شب وارد میشن و با فاکتورها تطبیق داده میشن." },
  { icon: Boxes, t: "انبار و کالا", b: "موجودی، کاردکس و هشدار کمبود کالا برای هر انبار." },
  { icon: Users, t: "حقوق و دستمزد", b: "فیش حقوقی، بیمه و مالیات حقوق با جدول‌های سال ۱۴۰۵.", wide: true },
  { icon: LineChart, t: "گزارش‌های آماده", b: "سود و زیان، ترازنامه و گردش حساب، با خروجی اکسل برای حسابدار.", wide: true },
];

const REVIEWS = [
  { name: "مینا رضوی", role: "صاحب کافه آبی", text: "قبلاً آخر هر فصل سه روز درگیر مالیات بودم. الان گزارش فصلی را با یک دکمه برای حسابدارم می‌فرستم." },
  { name: "حامد یزدانی", role: "مدیر مالی مبل آرکا", text: "سه شعبه و دو انبار را با یک حساب مدیریت می‌کنیم. تطبیق بانکی تنهایی ارزش اشتراک را داره." },
  { name: "الهام قاسمی", role: "طراح مستقل", text: "فاکتورم را از روی گوشی صادر می‌کنم و مشتری لینک پرداخت می‌گیره. ساده‌تر از این نمی‌شد." },
];

const FAQ = [
  { id: "1", title: "دوره‌ی آزمایشی رایگان چطوریه؟", content: "۱۴ روز همه‌ی امکانات پلن حرفه‌ای را رایگان دارید و کارت بانکی هم لازم نیست. بعدش اگر خواستید یک پلن انتخاب می‌کنید." },
  { id: "2", title: "اطلاعاتم کجا نگهداری میشه؟", content: "روی سرورهای داخل ایران با پشتیبان‌گیری روزانه. داده‌ها رمزنگاری میشن و فقط خودتون و کسانی که دسترسی میدید می‌بینن." },
  { id: "3", title: "می‌تونم از نرم‌افزار قبلی اطلاعاتم را بیارم؟", content: "بله، از فایل اکسل یا خروجی نرم‌افزارهای رایج. تیم پشتیبانی هم رایگان کمکتون می‌کنه." },
  { id: "4", title: "برای حسابدارم هم دسترسی جدا میشه ساخت؟", content: "بله، در پلن حرفه‌ای و سازمانی می‌تونید برای حسابدار دسترسی فقط‌خواندنی یا کامل بسازید." },
];

/** صفحه‌ی اصلی نرم‌افزار. */
export function HomePage() {
  const href = useHref();
  return (
    <Shell active="/">
      <section className="relative isolate overflow-hidden">
        <div aria-hidden className="absolute inset-x-0 -top-24 -z-10 mx-auto h-[28rem] max-w-3xl rounded-full bg-brand/20 blur-3xl" />
        <div className="mx-auto max-w-6xl px-4 pt-16 text-center sm:px-6 sm:pt-24">
          <a href={href("/blog")} className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 py-1 ps-1 pe-3 text-xs backdrop-blur transition-colors hover:border-foreground/25">
            <span className="rounded-full bg-brand px-2 py-0.5 font-semibold text-brand-foreground">تازه</span>
            نسخه‌ی ۳ با تطبیق خودکار بانک منتشر شد
            <ArrowLeft className="size-3.5 text-muted-foreground" />
          </a>
          <h1 className="mx-auto mt-8 max-w-4xl text-4xl font-black leading-[1.25] sm:text-6xl">
            حساب‌وکتاب کسب‌وکارتون را <GradientText>بسپارید به ما</GradientText>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            فاکتور رسمی، سامانه‌ی مودیان، انبار و حقوق در یک نرم‌افزار آنلاین که روی گوشی هم کار می‌کنه.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a href={href("/login")} className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:-translate-y-0.5">
              ۱۴ روز رایگان امتحان کنید
              <ArrowLeft className="size-4" />
            </a>
            <a href={href("/features")} className="inline-flex h-12 items-center rounded-xl border border-border bg-card/60 px-6 text-sm font-semibold transition-colors hover:bg-secondary">
              دیدن امکانات
            </a>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">بدون کارت بانکی · لغو هر وقت خواستید</p>
        </div>
        <div className="mx-auto mt-16 max-w-5xl px-4 [perspective:2000px] sm:px-6">
          <div className="relative [transform:rotateX(12deg)] transition-transform duration-700 hover:[transform:rotateX(0deg)]">
            <div aria-hidden className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-b from-brand/25 to-transparent blur-2xl" />
            <ProductMock className="[mask-image:linear-gradient(to_bottom,black_70%,transparent)]" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <p className="text-center text-sm text-muted-foreground">
          بیشتر از <Counter to={12400} className="font-bold text-foreground" /> کسب‌وکار حسابشون را به حسابینو سپردن
        </p>
        <Marquee className="mt-8" duration={35} gap="3rem">
          {LOGOS.map((l) => (
            <span key={l} className="whitespace-nowrap text-lg font-bold text-muted-foreground/60">
              {l}
            </span>
          ))}
        </Marquee>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-brand">همه‌چیز در یک جا</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">کمتر فرم پر کنید، بیشتر بفروشید</h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.t} delay={i * 60} className={cn(f.wide && "md:col-span-2")}>
              <SpotlightCard className="h-full">
                <div className="p-6 sm:p-7">
                  <span className="grid size-11 place-items-center rounded-xl border border-border bg-background">
                    <f.icon className="size-5 text-brand" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold">{f.t}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{f.b}</p>
                  {f.wide && i === 0 && (
                    <div className="mt-5 flex flex-wrap gap-2 text-xs">
                      {["صادر شد", "ارسال به مودیان", "تأیید شد"].map((s, j) => (
                        <span key={s} className={cn("rounded-full border px-3 py-1", j === 2 ? "border-success/40 text-success" : "border-border text-muted-foreground")}>
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
          <Reveal delay={300}>
            <div className="flex h-full flex-col justify-between rounded-xl border border-border bg-gradient-to-br from-brand/20 to-card p-6 sm:p-7">
              <Smartphone className="size-6 text-brand" />
              <div className="mt-8">
                <h3 className="text-lg font-bold">اپ اندروید و iOS</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">فاکتور را کنار مشتری صادر کنید.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-border bg-card/30 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-black">از زبان مشتری‌ها</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {REVIEWS.map((r) => (
              <figure key={r.name} className="flex flex-col rounded-2xl border border-border bg-background p-6">
                <blockquote className="flex-1 leading-8 text-foreground/90">«{r.text}»</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <Avatar name={r.name} />
                  <span className="text-sm">
                    <span className="block font-semibold">{r.name}</span>
                    <span className="block text-muted-foreground">{r.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.5fr]">
        <div>
          <h2 className="text-3xl font-black">پرسش‌های متداول</h2>
          <p className="mt-3 leading-7 text-muted-foreground">پشتیبانی هر روز از ۸ تا ۲۲ جواب میده.</p>
        </div>
        <Accordion items={FAQ} defaultOpen={["1"]} />
      </section>

      <section className="px-4 pb-20 sm:px-6">
        <div className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-3xl border border-border bg-card px-6 py-16 text-center sm:py-20">
          <GridBackground className="-z-10" />
          <div aria-hidden className="absolute inset-x-0 -bottom-24 -z-10 mx-auto h-48 max-w-lg rounded-full bg-brand/30 blur-3xl" />
          <h2 className="text-3xl font-black sm:text-4xl">همین امروز اولین فاکتور را صادر کنید</h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">ثبت‌نام کمتر از یک دقیقه طول می‌کشه.</p>
          <a href={href("/login")} className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-7 text-sm font-semibold text-primary-foreground">
            شروع رایگان
            <ArrowLeft className="size-4" />
          </a>
        </div>
      </section>
    </Shell>
  );
}
