"use client";

import { ArrowLeft, Flame, Leaf, PackageCheck, Repeat } from "lucide-react";
import { Marquee } from "@/registry/animations/marquee";
import { Reveal } from "@/registry/animations/reveal";
import { GrainBackground } from "@/registry/backgrounds/grain";
import { PRODUCTS, Photo, ProductCard, Shell, useHref } from "./shell";

const NOTES = ["یاس", "کارامل", "توت‌فرنگی", "دارچین", "شکلات تلخ", "لیمو", "فندق", "عسل", "انگور سیاه", "هل"];

/** صفحه‌ی اصلی فروشگاه قهوه. */
export function HomePage() {
  const href = useHref();
  return (
    <Shell active="/">
      <section className="relative isolate overflow-hidden">
        <GrainBackground className="-z-10 opacity-50" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Flame className="size-4 text-brand" />
              آخرین برشته‌کاری: سه‌شنبه ۱ مهر
            </p>
            <h1 className="mt-5 text-5xl font-black leading-[1.2] sm:text-6xl lg:text-7xl">
              قهوه‌ای که
              <br />
              <span className="text-brand">همین هفته</span> برشته شده
            </h1>
            <p className="mt-6 max-w-md text-lg leading-8 text-muted-foreground">
              دانه‌های تک‌خاستگاه را خودمون از مزرعه می‌خریم، در اصفهان برشته می‌کنیم و همون روز می‌فرستیم.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href={href("/shop")} className="inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-7 text-sm font-semibold text-background transition-transform hover:scale-[1.03]">
                خرید قهوه
                <ArrowLeft className="size-4" />
              </a>
              <a href={href("/about")} className="inline-flex h-12 items-center rounded-full border border-border px-7 text-sm font-semibold hover:bg-secondary">
                برشته‌خانه را ببینید
              </a>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div aria-hidden className="absolute -inset-6 -z-10 rounded-[3rem] bg-brand/15 blur-2xl" />
            <div className="aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-border shadow-2xl">
              <Photo name="hero" alt="بسته‌های قهوه، یک فنجان دمی و دانه‌های برشته روی سنگ" eager />
            </div>
            <a href={href("/product")} className="absolute -bottom-6 start-6 flex items-center gap-3 rounded-2xl border border-border bg-background/90 p-2.5 pe-5 shadow-xl backdrop-blur transition-transform hover:-translate-y-0.5">
              <span className="size-12 overflow-hidden rounded-xl">
                <Photo name="product" alt="" />
              </span>
              <span className="text-sm">
                <span className="block font-bold">{PRODUCTS[0].name}</span>
                <span className="text-xs text-muted-foreground">پیشنهاد این هفته</span>
              </span>
            </a>
          </div>
        </div>
        <div className="border-y border-border py-4">
          <Marquee duration={45} gap="2.5rem">
            {NOTES.map((n) => (
              <span key={n} className="flex items-center gap-10 whitespace-nowrap text-lg font-bold text-muted-foreground">
                {n}
                <span className="size-1.5 rounded-full bg-brand" />
              </span>
            ))}
          </Marquee>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="text-3xl font-black sm:text-4xl">پرفروش‌های این ماه</h2>
          <a href={href("/shop")} className="text-sm font-semibold underline underline-offset-4">
            همه‌ی قهوه‌ها
          </a>
        </div>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {PRODUCTS.slice(0, 4).map((p, i) => (
            <li key={p.id}>
              <Reveal delay={i * 70} className="h-full">
                <ProductCard product={p} />
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid overflow-hidden rounded-[2rem] bg-foreground text-background lg:grid-cols-2">
          <div className="p-8 sm:p-12">
            <Repeat className="size-6 text-brand" />
            <h2 className="mt-6 text-3xl font-black leading-tight sm:text-4xl">اشتراک ماهانه، هر ماه یک قهوه‌ی تازه</h2>
            <p className="mt-4 max-w-md leading-8 text-background/70">اول هر ماه یک بسته‌ی ۲۵۰ گرمی از قهوه‌ای که انتخاب کردیم به دستتون می‌رسه. هر وقت خواستید متوقفش کنید.</p>
            <a href={href("/shop")} className="mt-8 inline-flex h-12 items-center rounded-full bg-brand px-7 text-sm font-semibold text-brand-foreground">
              ماهی ۷۹۰٬۰۰۰ تومان
            </a>
          </div>
          <div className="relative min-h-72">
            <Photo name="pour" alt="دم کردن قهوه با کتری گردن‌غازی" className="absolute inset-0" />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-20 sm:grid-cols-3 sm:px-6">
        {[
          { i: Leaf, t: "مستقیم از مزرعه", b: "هر دانه را با اسم مزرعه و ارتفاع کشتش می‌شناسیم." },
          { i: Flame, t: "برشته‌کاری دوبار در هفته", b: "هیچ بسته‌ای بیشتر از چهار روز در انبار نمی‌مونه." },
          { i: PackageCheck, t: "ارسال همون روز", b: "سفارش‌های قبل از ساعت ۱۴ همون روز تحویل پست میشن." },
        ].map((x) => (
          <div key={x.t} className="rounded-3xl border border-border p-7">
            <x.i className="size-6 text-brand" />
            <h3 className="mt-5 text-lg font-bold">{x.t}</h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{x.b}</p>
          </div>
        ))}
      </section>
    </Shell>
  );
}
