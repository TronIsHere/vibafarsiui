"use client";

import { ArrowLeft, CalendarCheck, ShieldCheck, Star } from "lucide-react";
import { Accordion } from "@/registry/ui/accordion";
import { Reveal } from "@/registry/animations/reveal";
import { Counter } from "@/registry/animations/counter";
import { CompareSlider } from "@/registry/animations/compare-slider";
import { fa, faNumber } from "@/lib/utils";
import { DOCTORS, INSURANCES, Photo, SERVICES, Shell, useHref } from "./shell";

/** Upper teeth along a smile curve, drawn in SVG. `even` straightens and brightens them for the «after» side. */
function Teeth({ even }: { even?: boolean }) {
  const offsets = even ? [0, 0, 0, 0, 0, 0, 0, 0] : [4, -5, 3, 6, -4, 5, -3, 4];
  return (
    <div className="absolute inset-0 grid place-items-center" style={{ background: even ? "var(--secondary)" : "var(--muted)" }}>
      <svg viewBox="0 0 320 170" className="w-4/5" aria-hidden>
        <path d="M20 40 Q160 150 300 40" fill="none" stroke="var(--destructive)" strokeOpacity="0.35" strokeWidth="30" strokeLinecap="round" />
        {offsets.map((o, i) => {
          // Walk the same quadratic curve as the gum: x = 20 + 280t, y = 40 + 220t(1 - t).
          const t = 0.14 + i * 0.103;
          const x = 20 + 280 * t;
          const y = 40 + 220 * t * (1 - t);
          const angle = (Math.atan2(220 * (1 - 2 * t), 280) * 180) / Math.PI;
          const front = i === 3 || i === 4;
          return (
            <rect
              key={i}
              x={x - 13}
              y={y - 4 + o}
              width="26"
              height={front ? 44 : 36}
              rx="9"
              fill={even ? "var(--foreground)" : "color-mix(in oklch, var(--warning) 45%, var(--muted-foreground))"}
              opacity={even ? 0.95 : 0.85}
              transform={`rotate(${angle + (even ? 0 : o * 1.6)} ${x} ${y})`}
            />
          );
        })}
      </svg>
    </div>
  );
}

const FAQ = [
  { id: "1", title: "برای اولین جلسه چی همراهم بیارم؟", content: "کارت ملی، دفترچه یا کارت بیمه‌ی تکمیلی و اگر عکس دندان قبلی دارید، همونو بیارید. عکس دیجیتال را هم در خود کلینیک می‌گیریم." },
  { id: "2", title: "می‌تونم هزینه را قسطی پرداخت کنم؟", content: "برای ایمپلنت و ارتودنسی پرداخت اقساطی تا ۱۲ ماه بدون سود داریم. جزئیاتش را در جلسه‌ی مشاوره می‌گیم." },
  { id: "3", title: "بچه‌ها از چند سالگی باید معاینه بشن؟", content: "از حدود یک سالگی، یعنی بعد از درآمدن اولین دندان‌ها. جلسه‌ی اول بیشتر آشنایی کودک با فضای مطبه." },
  { id: "4", title: "اگر نتونم سر نوبت بیام چی؟", content: "تا ۲۴ ساعت قبل از طریق پیامکی که براتون می‌فرستیم نوبت را جابه‌جا کنید، بدون هزینه." },
];

/** صفحه‌ی اصلی کلینیک. */
export function HomePage() {
  const href = useHref();
  return (
    <Shell active="/">
      <section className="relative isolate overflow-hidden">
        <div aria-hidden className="absolute -top-32 end-0 -z-10 size-[34rem] rounded-full bg-brand/10 blur-3xl" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
              <ShieldCheck className="size-3.5" />
              طرف قرارداد با ۸ بیمه‌ی تکمیلی
            </p>
            <h1 className="mt-6 text-4xl font-black leading-[1.3] sm:text-6xl">لبخندتون را با خیال راحت به ما بسپارید</h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">
              دوازده ساله که در اصفهان از معاینه‌ی ساده تا ایمپلنت و ارتودنسی کنار خانواده‌ها هستیم. نوبتتون را آنلاین بگیرید، بدون تماس و انتظار.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href={href("/booking")} className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground">
                <CalendarCheck className="size-4" />
                نوبت آنلاین
              </a>
              <a href={href("/services")} className="inline-flex h-12 items-center rounded-full border border-border px-7 text-sm font-semibold hover:bg-secondary">
                خدمات و تعرفه
              </a>
            </div>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6">
              {[
                { v: 12, l: "سال تجربه" },
                { v: 18000, l: "بیمار راضی" },
                { v: 4, l: "متخصص" },
              ].map((s) => (
                <div key={s.l} className="flex flex-col-reverse">
                  <dt className="mt-1 text-xs text-muted-foreground">{s.l}</dt>
                  <dd className="text-3xl font-black">
                    <Counter to={s.v} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-border">
              <Photo name="hero" alt="اتاق درمان روشن کلینیک با یونیت دندانپزشکی و پنجره‌ی بزرگ" eager className="absolute inset-0" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              <div className="absolute inset-x-8 bottom-8 space-y-3">
                <div className="rounded-2xl border border-border bg-background/85 p-4 shadow-xl backdrop-blur">
                  <p className="text-xs text-muted-foreground">نزدیک‌ترین نوبت خالی</p>
                  <p className="mt-1 font-bold">فردا، ساعت ۱۰:۳۰</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="size-8 overflow-hidden rounded-full">
                      <Photo name={DOCTORS[0].photo} alt="" />
                    </span>
                    <span className="text-sm">{DOCTORS[0].name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/85 p-4 shadow-xl backdrop-blur">
                  <Star className="size-5 fill-brand text-brand" />
                  <p className="text-sm">
                    <span className="font-bold">۴٫۹ از ۵</span> <span className="text-muted-foreground">در ۱٬۷۳۱ نظر</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl font-black">خدمات ما</h2>
          <a href={href("/services")} className="inline-flex items-center gap-1 text-sm font-semibold">
            همه‌ی خدمات و تعرفه‌ها
            <ArrowLeft className="size-4" />
          </a>
        </div>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <li key={s.id}>
              <Reveal delay={(i % 3) * 70} className="h-full">
                <a href={href("/booking")} className="group flex h-full flex-col rounded-3xl border border-border p-6 transition-colors hover:border-foreground/25 hover:bg-card">
                  <span className="grid size-12 place-items-center rounded-2xl bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
                    <s.icon className="size-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold">{s.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-7 text-muted-foreground">{s.desc}</p>
                  <p className="mt-4 text-sm">
                    از <span className="font-bold">{faNumber(s.from)}</span> تومان
                  </p>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-border bg-card/40 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-brand">قبل و بعد</p>
            <h2 className="mt-3 text-3xl font-black leading-tight">ارتودنسی با الاینر شفاف، در ۱۴ ماه</h2>
            <p className="mt-4 leading-8 text-muted-foreground">دسته را بکشید و تفاوت را ببینید. هر درمان با طرح سه‌بعدی شروع میشه تا از روز اول بدونید نتیجه چه شکلیه.</p>
          </div>
          <CompareSlider className="aspect-[16/10] overflow-hidden rounded-3xl border border-border" before={<Teeth />} after={<Teeth even />} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl font-black">پزشکان ما</h2>
          <a href={href("/doctors")} className="inline-flex items-center gap-1 text-sm font-semibold">
            همه‌ی پزشکان
            <ArrowLeft className="size-4" />
          </a>
        </div>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {DOCTORS.map((d) => (
            <li key={d.id}>
              <div className="aspect-[4/5] overflow-hidden rounded-3xl border border-border">
                <Photo name={d.photo} alt={d.name} className="transition-transform duration-700 hover:scale-[1.03]" />
              </div>
              <p className="mt-4 font-bold">{d.name}</p>
              <p className="text-sm text-muted-foreground">{d.role}</p>
              <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="size-3.5 fill-brand text-brand" />
                {fa(String(d.rating).replace(".", "٫"))} · {fa(d.years)} سال سابقه
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-3xl border border-border p-7 sm:p-10">
          <h2 className="text-xl font-bold">بیمه‌های طرف قرارداد</h2>
          <ul className="mt-6 flex flex-wrap gap-2">
            {INSURANCES.map((x) => (
              <li key={x} className="rounded-full border border-border px-4 py-2 text-sm">
                {x}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <h2 className="text-3xl font-black">پرسش‌های پرتکرار</h2>
          <p className="mt-3 leading-7 text-muted-foreground">سؤال دیگه‌ای دارید؟ از ۹ تا ۲۱ جواب تلفن را می‌دیم.</p>
        </div>
        <Accordion items={FAQ} defaultOpen={["1"]} />
      </section>
    </Shell>
  );
}
