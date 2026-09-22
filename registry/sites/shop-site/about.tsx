"use client";

import { Reveal } from "@/registry/animations/reveal";
import { Counter } from "@/registry/animations/counter";
import { Photo, Shell, useHref } from "./shell";

const TIMELINE = [
  { y: "۱۳۹۶", t: "یک دستگاه برشته‌کن دست‌دوم", b: "در انباری خونه‌ی پدربزرگ، هفته‌ای ده کیلو قهوه برای دوستان." },
  { y: "۱۳۹۸", t: "اولین کافه‌ی مشتری", b: "یک کافه در چهارباغ قهوه‌ی ما را سر میز آورد و بقیه دنبالش اومدن." },
  { y: "۱۴۰۱", t: "خرید مستقیم از مزرعه", b: "برای اولین بار دانه را بدون واسطه از یک تعاونی در اتیوپی خریدیم." },
  { y: "۱۴۰۴", t: "برشته‌خانه‌ی جدید", b: "دستگاه ۱۵ کیلویی، آزمایشگاه کاپینگ و یک پیشخوان کوچک برای مهمون‌ها." },
];

const FARMS = [
  { n: "تعاونی کُچِره", c: "اتیوپی", a: "۲۱۰۰ متر" },
  { n: "مزرعه‌ی لا اسپرانزا", c: "کلمبیا", a: "۱۷۵۰ متر" },
  { n: "کارخانه‌ی گاتومبی", c: "کنیا", a: "۱۸۵۰ متر" },
];

/** داستان برشته‌کاری، مزرعه‌ها و خط زمان. */
export function AboutPage() {
  const href = useHref();
  return (
    <Shell active="/about">
      <section className="mx-auto max-w-4xl px-4 pt-16 text-center sm:px-6 sm:pt-24">
        <p className="text-sm text-muted-foreground">داستان ما</p>
        <h1 className="mt-4 text-4xl font-black leading-[1.35] sm:text-6xl">
          ما قهوه را به اندازه‌ی
          <br />
          <span className="text-brand">سفارش‌های همین هفته</span> برشته می‌کنیم
        </h1>
      </section>

      <section className="mx-auto mt-14 max-w-6xl px-4 sm:px-6">
        <div className="aspect-[16/9] overflow-hidden rounded-[2rem] border border-border">
          <Photo name="roastery" alt="برشته‌خانه‌ی رُست با دستگاه برشته‌کن و طاق‌های آجری" eager />
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-16 sm:grid-cols-3 sm:px-6">
        {[
          { v: 18, u: "تن", l: "قهوه‌ی برشته در سال ۱۴۰۴" },
          { v: 64, u: "کافه", l: "در ۱۱ شهر قهوه‌ی ما را سرو می‌کنن" },
          { v: 4, u: "روز", l: "بیشترین فاصله‌ی برشته‌کاری تا ارسال" },
        ].map((s) => (
          <div key={s.l} className="rounded-3xl border border-border p-7">
            <p className="text-5xl font-black">
              <Counter to={s.v} unit={s.u} />
            </p>
            <p className="mt-3 text-sm text-muted-foreground">{s.l}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h2 className="text-3xl font-black">از انباری تا برشته‌خانه</h2>
        <ol className="mt-10 space-y-10 border-s border-border ps-8">
          {TIMELINE.map((t, i) => (
            <li key={t.y} className="relative">
              <span className="absolute -start-[2.4rem] top-1 size-3 rounded-full border-2 border-background bg-brand ring-4 ring-brand/20" />
              <Reveal delay={i * 60}>
                <p className="text-sm font-semibold text-brand">{t.y}</p>
                <h3 className="mt-1 text-xl font-bold">{t.t}</h3>
                <p className="mt-2 leading-7 text-muted-foreground">{t.b}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-3xl font-black">مزرعه‌هایی که ازشون می‌خریم</h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {FARMS.map((f) => (
            <li key={f.n} className="rounded-3xl border border-border bg-card p-7">
              <p className="text-sm text-muted-foreground">{f.c}</p>
              <p className="mt-2 text-xl font-bold">{f.n}</p>
              <p className="mt-4 text-sm">ارتفاع {f.a}</p>
            </li>
          ))}
        </ul>
        <div className="mt-12 text-center">
          <a href={href("/shop")} className="inline-flex h-12 items-center rounded-full bg-foreground px-7 text-sm font-semibold text-background">
            قهوه‌هاشون را بچشید
          </a>
        </div>
      </section>
    </Shell>
  );
}
