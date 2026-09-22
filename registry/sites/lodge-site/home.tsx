"use client";

import * as React from "react";
import { ArrowLeft, BedDouble, Maximize, Moon, Users } from "lucide-react";
import { Accordion } from "@/registry/ui/accordion";
import { Avatar } from "@/registry/ui/avatar";
import { Rating } from "@/registry/ui/rating";
import { NumberField } from "@/registry/ui/number-field";
import { DateRangePicker, type DateRange } from "@/registry/ui/date-range-picker";
import { Reveal } from "@/registry/animations/reveal";
import { Counter } from "@/registry/animations/counter";
import { fa, faNumber } from "@/lib/utils";
import { EXPERIENCES, Photo, ROOMS, Shell, useHref } from "./shell";

const REVIEWS = [
  { n: "لیلا و آرش", c: "تهران", t: "شب دوم برق روستا رفت و تازه فهمیدیم آسمون کویر یعنی چی. صبحانه‌ی محلی هم بی‌نظیر بود.", r: 5 },
  { n: "خانواده‌ی محمدی", c: "مشهد", t: "بچه‌ها از شترسواری و نون پختن با مادربزرگ هنوز حرف می‌زنن. کلبه برای ما چهار نفر عالی بود.", r: 5 },
  { n: "یوهانا", c: "برلین", t: "The most peaceful place I have stayed in Iran. Hosts speak English and arranged everything.", r: 4.5 },
];

const FAQ = [
  { id: "1", title: "چطور به اقامتگاه برسیم؟", content: "با خودرو از اصفهان حدود ۵ ساعت راهه و جاده تا در اقامتگاه آسفالته. از ترمینال خور هم می‌تونیم دنبالتون بیایم." },
  { id: "2", title: "بهترین فصل سفر کی هست؟", content: "مهر تا اردیبهشت. تابستون روزها گرمه ولی شب‌ها خنک و آسمون صاف‌تره." },
  { id: "3", title: "شرایط لغو رزرو چطوریه؟", content: "تا ۷ روز قبل از ورود کل مبلغ برمی‌گرده. بعد از اون، هزینه‌ی یک شب کسر میشه." },
  { id: "4", title: "غذا چی می‌خوریم؟", content: "صبحانه در قیمت اتاقه. ناهار و شام خانگی و محلی را هم می‌تونید سفارش بدید، غذای گیاهی هم داریم." },
];

/** صفحه‌ی اصلی اقامتگاه. */
export function HomePage() {
  const href = useHref();
  const [range, setRange] = React.useState<DateRange>({ from: null, to: null });
  const [guests, setGuests] = React.useState(2);

  return (
    <Shell active="/" overlay>
      <section className="relative isolate overflow-hidden">
        <Photo name="hero" alt="" eager className="absolute inset-0 -z-20" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/35 to-background/10" />
        <div className="mx-auto flex min-h-[88dvh] max-w-6xl flex-col justify-center px-4 pt-24 pb-40 sm:px-6">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Moon className="size-4 text-brand" />
            روستای مصر، قلب کویر مرکزی
          </p>
          <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[1.25] sm:text-7xl">
            یک شب زیر
            <br />
            آسمون کویر
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-foreground/75">خونه‌ای ۱۵۰ ساله با دیوارهای کاهگلی، حیاط پر از انار و سکوتی که فقط اینجا پیدا میشه.</p>

          {/* A plain GET form: the booking page reads ?from=&to=&guests= back, so the guest doesn't pick them twice. */}
          <form
            action={href("/book")}
            method="get"
            className="mt-10 grid max-w-3xl gap-3 rounded-3xl border border-border bg-background/80 p-3 shadow-2xl backdrop-blur-md sm:grid-cols-[1.6fr_1fr_auto]"
          >
            {range.from && <input type="hidden" name="from" value={range.from.getTime()} />}
            {range.to && <input type="hidden" name="to" value={range.to.getTime()} />}
            <input type="hidden" name="guests" value={guests} />
            <DateRangePicker value={range} onChange={setRange} min={new Date()} presets={[]} placeholder="تاریخ ورود و خروج" />
            <NumberField aria-label="تعداد مهمان" value={guests} onChange={setGuests} min={1} max={10} />
            <button type="submit" className="h-10 cursor-pointer rounded-2xl bg-brand px-6 text-sm font-semibold text-brand-foreground">
              دیدن اتاق‌های خالی
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-black leading-tight sm:text-4xl">یک خونه‌ی قدیمی که دوباره نفس می‌کشه</h2>
          <p className="mt-5 leading-8 text-muted-foreground">
            کاهگل را در ۱۳۹۵ از زیر خاک و ویرانی بیرون آوردیم. با معمارهای محلی و همون مصالح قدیمی، کاهگل، خشت و چوب گز، مرمتش کردیم تا مهمون‌ها کویر را همون‌طور تجربه کنن که صاحب‌خونه‌هاش صد سال پیش تجربه می‌کردن.
          </p>
          <a href={href("/about")} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">
            داستان کاهگل
            <ArrowLeft className="size-4" />
          </a>
        </div>
        <dl className="grid grid-cols-2 gap-4">
          {[
            { v: 150, u: "سال", l: "قدمت خونه" },
            { v: 7, u: "اتاق", l: "فقط برای ۲۲ مهمون" },
            { v: 4200, u: "مهمان", l: "از ۳۸ کشور" },
            { v: 97, u: "درصد", l: "دوباره برمی‌گردن" },
          ].map((s) => (
            <div key={s.l} className="flex flex-col-reverse rounded-3xl border border-border p-6">
              <dt className="mt-2 text-sm text-muted-foreground">{s.l}</dt>
              <dd className="text-4xl font-black">
                <Counter to={s.v} unit={s.u} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl font-black">اتاق‌ها</h2>
          <a href={href("/rooms")} className="inline-flex items-center gap-1 text-sm font-semibold">
            همه‌ی اتاق‌ها
            <ArrowLeft className="size-4" />
          </a>
        </div>
        <ul className="mt-8 grid gap-5 md:grid-cols-3">
          {ROOMS.slice(0, 3).map((r, i) => (
            <li key={r.id}>
              <Reveal delay={i * 80}>
                <a href={href("/rooms")} className="group block">
                  <div className="aspect-[4/5] overflow-hidden rounded-[2rem] border border-border">
                    <Photo name={r.photo} alt={r.name} className="transition-transform duration-700 group-hover:scale-[1.04]" />
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold">{r.name}</h3>
                      <p className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="size-3.5" />
                          {fa(r.guests)} نفر
                        </span>
                        <span className="flex items-center gap-1">
                          <Maximize className="size-3.5" />
                          {fa(r.meters)} متر
                        </span>
                        <span className="flex items-center gap-1">
                          <BedDouble className="size-3.5" />
                          صبحانه
                        </span>
                      </p>
                    </div>
                    <p className="shrink-0 text-end text-sm">
                      <span className="font-bold">{faNumber(r.price)}</span>
                      <span className="block text-xs text-muted-foreground">تومان هر شب</span>
                    </p>
                  </div>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 border-y border-border bg-card/40 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-3xl font-black">تجربه‌ها</h2>
            <a href={href("/experiences")} className="inline-flex items-center gap-1 text-sm font-semibold">
              همه‌ی تجربه‌ها
              <ArrowLeft className="size-4" />
            </a>
          </div>
          <ul className="mt-8 flex snap-x gap-4 overflow-x-auto pb-4">
            {EXPERIENCES.map((x) => (
              <li key={x.id} className="w-72 shrink-0 snap-start">
                <div className="h-44 overflow-hidden rounded-3xl border border-border">
                  <Photo name={x.photo} alt={x.title} />
                </div>
                <p className="mt-3 font-bold">{x.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {x.hours} · {faNumber(x.price)} تومان
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="text-3xl font-black">مهمان‌ها چی میگن</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <figure key={r.n} className="flex flex-col rounded-3xl border border-border p-6">
              <Rating value={r.r} readOnly size="sm" />
              <blockquote className="mt-4 flex-1 leading-8" dir="auto">
                {r.t}
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 text-sm">
                <Avatar name={r.n} size="sm" />
                <span>
                  {r.n} <span className="text-muted-foreground">از {r.c}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-20 sm:px-6 lg:grid-cols-[1fr_1.6fr]">
        <h2 className="text-3xl font-black">پیش از سفر</h2>
        <Accordion items={FAQ} defaultOpen={["1"]} />
      </section>
    </Shell>
  );
}
