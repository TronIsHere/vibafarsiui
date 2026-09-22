"use client";

import { Check, Compass, Hammer, PenTool, Sparkles } from "lucide-react";
import { Accordion } from "@/registry/ui/accordion";
import { Reveal } from "@/registry/animations/reveal";
import { fa } from "@/lib/utils";
import { Art, Shell, useHref } from "./shell";

const SERVICES = [
  { icon: Compass, title: "استراتژی و پژوهش", desc: "قبل از طراحی می‌فهمیم مشتری شما چرا می‌خره و چرا نمی‌خره.", items: ["مصاحبه‌ی کاربر و نقشه‌ی سفر", "تحلیل رقبا و بازار", "تعریف شاخص موفقیت", "نقشه‌ی راه سه‌ماهه"] },
  { icon: Sparkles, title: "هویت برند", desc: "برندی که روی تابلوی مغازه و آیکون اپ به یک اندازه خوب دیده میشه.", items: ["لوگو و نشانه", "تایپوگرافی فارسی و لاتین", "پالت رنگ و راهنمای برند", "قالب شبکه‌های اجتماعی"] },
  { icon: PenTool, title: "طراحی محصول", desc: "رابطی که راست‌چین فکر شده، نه ترجمه‌شده.", items: ["معماری اطلاعات و وایرفریم", "رابط کاربری و نمونه‌ی تعاملی", "سامانه‌ی طراحی با توکن", "تست کاربردپذیری"] },
  { icon: Hammer, title: "ساخت و توسعه", desc: "کدی که تیم شما بعد از ما هم راحت نگهش می‌داره.", items: ["وب‌سایت و وب‌اپ با Next.js", "اپ موبایل با React Native", "پنل مدیریت و API", "سئو، سرعت و دسترس‌پذیری"] },
];

const STEPS = [
  { t: "کشف", d: "دو هفته", b: "جلسه‌ی شروع، مصاحبه و جمع‌بندی مسئله" },
  { t: "طراحی", d: "چهار تا شش هفته", b: "وایرفریم، رابط و نمونه‌ی تعاملی با دو دور بازخورد" },
  { t: "ساخت", d: "شش تا ده هفته", b: "توسعه در اسپرینت‌های دوهفته‌ای با نسخه‌ی آزمایشی" },
  { t: "رشد", d: "ماهانه", b: "اندازه‌گیری، بهبود و پشتیبانی بعد از انتشار" },
];

const FAQ = [
  { id: "a", title: "کوچک‌ترین پروژه‌ای که قبول می‌کنید چقدره؟", content: "پروژه‌های برند از ۴۰۰ میلیون تومان و پروژه‌های محصول از ۹۰۰ میلیون تومان شروع میشن. برای کارهای کوچک‌تر یک کارگاه دوروزه داریم." },
  { id: "b", title: "کد و فایل‌های طراحی مال کیه؟", content: "همه‌چیز بعد از تسویه متعلق به شماست، از فایل فیگما تا مخزن کد. ما فقط اجازه می‌گیریم که کار را در نمونه‌کارها نشون بدیم." },
  { id: "c", title: "با تیم فنی خود ما هم کار می‌کنید؟", content: "بله، بیشتر پروژه‌های ما همین‌طوری هستن. طراح‌های ما در اسپرینت‌های تیم شما شرکت می‌کنن و سامانه‌ی طراحی را تحویل برنامه‌نویس‌ها میدن." },
  { id: "d", title: "پرداخت چطوریه؟", content: "سی درصد در شروع و بقیه در سه مرحله‌ی تحویل. برای قراردادهای ماهانه، پرداخت اول هر ماه انجام میشه." },
];

/** خدمات، فرایند و پرسش‌های متداول. */
export function ServicesPage() {
  const href = useHref();
  return (
    <Shell active="/services">
      <section className="mx-auto max-w-6xl px-4 pt-16 pb-16 sm:px-6 sm:pt-24">
        <p className="text-sm text-muted-foreground">خدمات</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">از ایده تا محصولی که مردم هر روز باهاش کار می‌کنن</h1>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-4 sm:px-6 md:grid-cols-2">
        {SERVICES.map((s, i) => (
          <Reveal key={s.title} delay={(i % 2) * 80}>
            <article className="h-full rounded-3xl border border-border bg-card p-7 sm:p-9">
              <span className="grid size-12 place-items-center rounded-2xl bg-brand/15 text-brand">
                <s.icon className="size-5" />
              </span>
              <h2 className="mt-6 text-2xl font-bold">{s.title}</h2>
              <p className="mt-2 leading-7 text-muted-foreground">{s.desc}</p>
              <ul className="mt-6 grid gap-2.5 text-sm sm:grid-cols-2">
                {s.items.map((it) => (
                  <li key={it} className="flex items-center gap-2">
                    <Check className="size-4 shrink-0 text-brand" />
                    {it}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <h2 className="text-3xl font-black sm:text-4xl">فرایند کار</h2>
        <ol className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.t} className="bg-background p-7">
              <span className="text-6xl font-black text-foreground/10 tabular-nums">{fa(`0${i + 1}`)}</span>
              <h3 className="mt-4 text-xl font-bold">{s.t}</h3>
              <p className="mt-1 text-xs text-brand">{s.d}</p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{s.b}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-4 sm:px-6 lg:grid-cols-2">
        <Art variant={3} className="flex min-h-72 flex-col justify-end rounded-3xl border border-border p-8">
          <p className="text-sm text-foreground/70">قرارداد پروژه‌ای</p>
          <p className="mt-2 text-3xl font-black">از ۹۰۰ میلیون تومان</p>
          <p className="mt-2 max-w-sm text-sm leading-7 text-foreground/70">دامنه و زمان‌بندی مشخص، برای ساخت نسخه‌ی اول یا بازطراحی کامل.</p>
        </Art>
        <Art variant={5} className="flex min-h-72 flex-col justify-end rounded-3xl border border-border p-8">
          <p className="text-sm text-foreground/70">تیم ماهانه</p>
          <p className="mt-2 text-3xl font-black">از ۱۸۰ میلیون تومان در ماه</p>
          <p className="mt-2 max-w-sm text-sm leading-7 text-foreground/70">یک طراح و یک برنامه‌نویس ثابت که کنار تیم شما محصول را رشد میدن.</p>
        </Art>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <h2 className="text-3xl font-black">پرسش‌های متداول</h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            جوابتون اینجا نبود؟{" "}
            <a href={href("/contact")} className="text-foreground underline underline-offset-4">
              بپرسید
            </a>
            .
          </p>
        </div>
        <Accordion items={FAQ} defaultOpen={["a"]} />
      </section>
    </Shell>
  );
}
