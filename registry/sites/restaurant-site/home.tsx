"use client";

import { ArrowLeft, Clock, MapPin, Quote, Star } from "lucide-react";
import { Marquee } from "@/registry/animations/marquee";
import { Reveal } from "@/registry/animations/reveal";
import { GirihBackground } from "@/registry/backgrounds/girih";
import { faNumber } from "@/lib/utils";
import { BRANCHES, MENU, Photo, Shell, useHref } from "./shell";

const SIGNATURE = [
  { ...MENU[1].dishes[0], photo: "kebab" },
  { ...MENU[2].dishes[2], photo: "baghali" },
  { ...MENU[2].dishes[1], photo: "fesenjan" },
];

const REVIEWS = [
  { n: "مهسا از تهران", t: "باقالی‌پلوش دقیقاً مزه‌ی خونه‌ی مامان‌بزرگ را میده." },
  { n: "امید از شیراز", t: "فالوده‌ی اینجا بهترین فالوده‌ی شهره، بی‌تعارف." },
  { n: "سارا از اصفهان", t: "رزرو آنلاین کردیم و میز کنار حوض آماده بود." },
  { n: "کاوه از شیراز", t: "کباب برگش نرمه و زعفرانش واقعیه." },
  { n: "نازنین از تهران", t: "برای تولد مادرم رفتیم، کیک هم خودشون آوردن." },
];

/** صفحه‌ی اصلی رستوران. */
export function HomePage() {
  const href = useHref();
  return (
    <Shell active="/" overlay>
      <section className="relative isolate overflow-hidden pt-20">
        <GirihBackground size={64} className="-z-10 opacity-70" />
        <div aria-hidden className="absolute inset-x-0 -bottom-40 -z-10 mx-auto size-[40rem] rounded-full bg-brand/15 blur-3xl" />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="text-sm font-semibold text-brand">آشپزی خانگی شیرازی، از ۱۳۷۸</p>
            <h1 className="mt-5 text-5xl font-black leading-[1.3] sm:text-6xl">
              طعم خونه‌ی مادربزرگ،
              <br />
              سر میز شما
            </h1>
            <p className="mt-6 max-w-md text-lg leading-8 text-muted-foreground">برنج ایرانی، زعفران قائنات و خورش‌هایی که از صبح روی آتیش هستن. در سه شعبه در شیراز و تهران.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href={href("/reserve")} className="inline-flex h-12 items-center rounded-full bg-brand px-7 text-sm font-semibold text-brand-foreground shadow-[0_12px_30px_-12px_var(--brand)]">
                رزرو میز
              </a>
              <a href={href("/menu")} className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-background/60 px-7 text-sm font-semibold backdrop-blur hover:bg-secondary">
                دیدن منو
                <ArrowLeft className="size-4" />
              </a>
            </div>
            <p className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="size-4" />
              ناهار ۱۲ تا ۱۶ · شام ۱۹ تا ۲۴
            </p>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[2.5rem] border border-border shadow-2xl">
              <Photo name="hero" alt="سفره‌ی ایرانی با چلوکباب، قورمه‌سبزی، سالاد شیرازی و سبزی خوردن" eager />
            </div>
            <span className="absolute bottom-[12%] -end-4 rounded-2xl border border-border bg-background/90 px-4 py-2 text-sm shadow-xl backdrop-blur">
              <span className="block text-xs text-muted-foreground">امروز</span>
              <span className="font-bold">باقالی‌پلو با ماهیچه</span>
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-semibold text-brand">پیشنهاد سرآشپز</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">غذاهایی که به خاطرشون میان</h2>
        </div>
        <ul className="mt-14 grid gap-10 md:grid-cols-3">
          {SIGNATURE.map((d, i) => (
            <li key={d.name}>
              <Reveal delay={i * 90} className="text-center">
                <div className="mx-auto aspect-square w-3/5 overflow-hidden rounded-full border-4 border-card shadow-[0_24px_40px_-20px_rgb(0_0_0/0.6)]">
                  <Photo name={d.photo} alt={d.name} className="transition-transform duration-700 hover:rotate-12 hover:scale-105" />
                </div>
                <h3 className="mt-8 text-xl font-bold">{d.name}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-7 text-muted-foreground">{d.desc}</p>
                <p className="mt-3 font-bold text-brand">{faNumber(d.price)} تومان</p>
              </Reveal>
            </li>
          ))}
        </ul>
        <div className="mt-14 text-center">
          <a href={href("/menu")} className="inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-8">
            منوی کامل
            <ArrowLeft className="size-4" />
          </a>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-foreground py-20 text-background">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 sm:px-6 md:grid-cols-[auto_1fr]">
          <div className="mx-auto grid size-40 place-items-center rounded-full border border-background/20 text-5xl font-black text-brand">ف</div>
          <figure>
            <Quote className="size-7 text-brand" />
            <blockquote className="mt-4 text-2xl font-bold leading-[1.9]">«هنوز قورمه‌سبزی را مثل مادرم، شش ساعت روی حرارت کم می‌پزیم. اگر عجله کنیم، از مزه‌اش معلومه.»</blockquote>
            <figcaption className="mt-5 text-sm text-background/60">فرخنده رحمانی، سرآشپز و بنیان‌گذار</figcaption>
          </figure>
        </div>
      </section>

      <section className="py-16">
        <Marquee duration={50} gap="1rem">
          {REVIEWS.map((r) => (
            <figure key={r.n} className="w-80 shrink-0 rounded-3xl border border-border p-6">
              <div className="flex gap-0.5 text-brand">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-3 leading-7">{r.t}</blockquote>
              <figcaption className="mt-3 text-sm text-muted-foreground">{r.n}</figcaption>
            </figure>
          ))}
        </Marquee>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
        <h2 className="text-3xl font-black">شعبه‌ها</h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {BRANCHES.map((b) => (
            <li key={b.name} className="rounded-3xl border border-border p-6">
              <p className="text-xs text-muted-foreground">{b.city}</p>
              <p className="mt-1 text-lg font-bold">{b.name}</p>
              <p className="mt-3 flex gap-2 text-sm leading-7 text-muted-foreground">
                <MapPin className="mt-1.5 size-4 shrink-0" />
                {b.address}
              </p>
              <a href={href("/reserve")} className="mt-4 inline-flex text-sm font-semibold text-brand">
                رزرو در این شعبه
              </a>
            </li>
          ))}
        </ul>
      </section>
    </Shell>
  );
}
