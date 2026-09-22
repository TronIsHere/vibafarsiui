"use client";

import { ArrowUpLeft, Quote } from "lucide-react";
import { Avatar } from "@/registry/ui/avatar";
import { Marquee } from "@/registry/animations/marquee";
import { Reveal } from "@/registry/animations/reveal";
import { WordRotate } from "@/registry/animations/word-rotate";
import { Counter } from "@/registry/animations/counter";
import { ArrowLink } from "@/registry/animations/arrow-link";
import { GrainBackground } from "@/registry/backgrounds/grain";
import { cn } from "@/lib/utils";
import { Cover, PROJECTS, Shell, useHref } from "./shell";

const CLIENTS = ["بازارچه", "ره‌نگار", "پادکست‌باز", "سپیدار", "نان‌آور", "کاروان", "دفترچه", "آوند", "تیرگان", "ماهور"];

const SERVICES = [
  { n: "۰۱", title: "استراتژی و پژوهش", desc: "مصاحبه با کاربر، تحلیل رقبا و نقشه‌ی راه محصول" },
  { n: "۰۲", title: "هویت برند", desc: "لوگو، تایپوگرافی فارسی، رنگ و راهنمای برند" },
  { n: "۰۳", title: "طراحی محصول", desc: "تجربه‌ی کاربری، رابط کاربری و سامانه‌ی طراحی" },
  { n: "۰۴", title: "ساخت و توسعه", desc: "وب‌سایت، وب‌اپ و اپ موبایل با Next.js و React Native" },
];

/** صفحه‌ی اصلی استودیو. */
export function HomePage() {
  const href = useHref();
  const featured = PROJECTS.slice(0, 3);

  return (
    <Shell active="/">
      <section className="relative isolate overflow-hidden border-b border-border">
        <GrainBackground className="-z-10 opacity-60" />
        <div aria-hidden className="absolute -top-40 start-1/3 -z-10 size-[36rem] rounded-full bg-brand/15 blur-3xl" />
        <div className="mx-auto max-w-6xl px-4 pt-20 pb-16 sm:px-6 sm:pt-28 lg:pt-32">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <span className="size-1.5 animate-pulse rounded-full bg-success" />
            برای پروژه‌های پاییز ۱۴۰۵ ظرفیت داریم
          </p>
          <h1 className="mt-8 max-w-5xl text-5xl font-black leading-[1.15] sm:text-7xl lg:text-8xl">
            برای برندهایی که{" "}
            <WordRotate words={["جسورند", "عجله دارند", "فارسی حرف می‌زنند"]} className="text-brand" />
            <br />
            محصول می‌سازیم.
          </h1>
          <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-md text-lg leading-8 text-muted-foreground">
              ما یک تیم ۳۸ نفره از طراح و برنامه‌نویس هستیم و از اولین جلسه تا روز انتشار کنار شما می‌مونیم.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={href("/contact")} className="inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-semibold text-background transition-transform hover:scale-[1.03]">
                شروع پروژه
                <ArrowUpLeft className="size-4" />
              </a>
              <a href={href("/work")} className="inline-flex h-12 items-center rounded-full border border-border px-6 text-sm font-semibold transition-colors hover:bg-secondary">
                دیدن نمونه‌کارها
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-border/60 py-6">
          <Marquee duration={40} gap="3.5rem">
            {CLIENTS.map((c) => (
              <span key={c} className="text-xl font-bold text-muted-foreground/70">
                {c}
              </span>
            ))}
          </Marquee>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="mb-10 flex items-end justify-between gap-4">
          <h2 className="text-3xl font-black sm:text-4xl">کارهای منتخب</h2>
          <ArrowLink href={href("/work")}>همه‌ی نمونه‌کارها</ArrowLink>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {featured.map((p, i) => (
            <Reveal key={p.title} delay={i * 80} className={cn(i === 0 && "md:col-span-2")}>
              <a href={href("/work")} className="group block">
                <Cover project={p} className={cn("rounded-3xl border border-border", i === 0 ? "aspect-[16/8]" : "aspect-[4/3]")} />
                <div className="mt-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {p.client} · {p.cat} · {p.year}
                    </p>
                    <h3 className="mt-1 text-lg font-bold">{p.title}</h3>
                  </div>
                  <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-xs text-foreground/80">{p.metric}</span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card/40">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 divide-border px-4 sm:px-6 lg:grid-cols-4 lg:divide-x lg:rtl:divide-x-reverse">
          {[
            { v: 124, l: "پروژه‌ی تحویل‌شده" },
            { v: 14, l: "سال تجربه" },
            { v: 38, l: "طراح و برنامه‌نویس" },
            { v: 9, l: "جایزه‌ی طراحی" },
          ].map((s) => (
            <div key={s.l} className="px-2 py-10 lg:px-8">
              <dt className="text-sm text-muted-foreground">{s.l}</dt>
              <dd className="mt-2 text-5xl font-black">
                <Counter to={s.v} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <h2 className="text-3xl font-black sm:text-4xl">کاری که بلدیم</h2>
          <p className="mt-4 max-w-sm leading-8 text-muted-foreground">
            هر پروژه را با یک تیم ثابت جلو می‌بریم، پس کسی که روز اول برندتون را می‌شناسه روز آخر هم هست.
          </p>
          <ArrowLink href={href("/services")} className="mt-6">
            جزئیات خدمات
          </ArrowLink>
        </div>
        <ul className="divide-y divide-border border-y border-border">
          {SERVICES.map((s) => (
            <li key={s.n}>
              <a href={href("/services")} className="group flex items-center gap-6 py-6">
                <span className="text-sm text-muted-foreground tabular-nums">{s.n}</span>
                <span className="flex-1">
                  <span className="block text-xl font-bold transition-colors group-hover:text-brand">{s.title}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{s.desc}</span>
                </span>
                <ArrowUpLeft className="size-5 text-muted-foreground transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:text-foreground" />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-24 text-center sm:px-6">
        <Quote className="mx-auto size-8 text-brand" />
        <blockquote className="mt-6 text-2xl font-bold leading-[1.8] sm:text-3xl">
          نقش اولین تیمی بود که قبل از طراحی، سه روز پشت پیشخوان فروشگاه‌هامون ایستاد. نتیجه‌اش اپی شد که مشتری‌ها بدون آموزش باهاش کار می‌کنن.
        </blockquote>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Avatar name="سارا محمدی" />
          <div className="text-start text-sm">
            <p className="font-semibold">سارا محمدی</p>
            <p className="text-muted-foreground">مدیر محصول بازارچه</p>
          </div>
        </div>
      </section>
    </Shell>
  );
}
