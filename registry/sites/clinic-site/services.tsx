"use client";

import { Clock, Info } from "lucide-react";
import { Reveal } from "@/registry/animations/reveal";
import { fa, faNumber } from "@/lib/utils";
import { INSURANCES, SERVICES, Shell, useHref } from "./shell";

const EXTRA = [
  { name: "عکس رادیوگرافی پانورامیک", price: "۶۵۰٬۰۰۰" },
  { name: "ترمیم کامپوزیت (هر دندان)", price: "۱٬۸۰۰٬۰۰۰ تا ۲٬۹۰۰٬۰۰۰" },
  { name: "کشیدن دندان ساده", price: "۹۰۰٬۰۰۰" },
  { name: "کشیدن دندان عقل نهفته", price: "۴٬۲۰۰٬۰۰۰ تا ۶٬۸۰۰٬۰۰۰" },
  { name: "روکش زیرکونیا", price: "۱۲٬۰۰۰٬۰۰۰" },
  { name: "لمینت سرامیکی (هر واحد)", price: "۱۸٬۰۰۰٬۰۰۰" },
  { name: "نایت‌گارد", price: "۳٬۵۰۰٬۰۰۰" },
];

/** خدمات با بازه‌ی قیمت، زمان هر جلسه و تعرفه‌های دیگر. */
export function ServicesPage() {
  const href = useHref();
  return (
    <Shell active="/services">
      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 sm:pt-20">
        <h1 className="text-4xl font-black sm:text-5xl">خدمات و تعرفه</h1>
        <p className="mt-4 max-w-2xl leading-8 text-muted-foreground">
          قیمت‌ها بازه‌ای هستن چون هر دهان فرق داره. قیمت دقیق را در جلسه‌ی معاینه و قبل از شروع درمان، مکتوب بهتون میدیم.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <ul className="grid gap-4 md:grid-cols-2">
          {SERVICES.map((s, i) => (
            <li key={s.id}>
              <Reveal delay={(i % 2) * 70} className="h-full">
                <article className="flex h-full gap-5 rounded-3xl border border-border p-6">
                  <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-brand/10 text-brand">
                    <s.icon className="size-6" />
                  </span>
                  <div className="flex flex-1 flex-col">
                    <h2 className="text-lg font-bold">{s.name}</h2>
                    <p className="mt-1.5 flex-1 text-sm leading-7 text-muted-foreground">{s.desc}</p>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-border pt-4">
                      <p className="text-sm">
                        <span className="font-bold tabular-nums">{faNumber(s.from)}</span>
                        <span className="text-muted-foreground"> تا </span>
                        <span className="font-bold tabular-nums">{faNumber(s.to)}</span>
                        <span className="text-muted-foreground"> تومان</span>
                      </p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="size-3.5" />
                        {fa(s.min)} دقیقه
                      </p>
                    </div>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-20 sm:px-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="overflow-hidden rounded-3xl border border-border">
          <table className="w-full text-sm">
            <caption className="border-b border-border bg-card/60 px-6 py-4 text-start text-base font-bold">تعرفه‌های دیگر</caption>
            <thead className="sr-only">
              <tr>
                <th scope="col">خدمت</th>
                <th scope="col">قیمت (تومان)</th>
              </tr>
            </thead>
            <tbody>
              {EXTRA.map((e) => (
                <tr key={e.name} className="border-b border-border last:border-0">
                  <th scope="row" className="px-6 py-3.5 text-start font-normal">
                    {e.name}
                  </th>
                  <td className="px-6 py-3.5 text-end tabular-nums">{e.price} تومان</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <aside className="h-fit space-y-4">
          <div className="rounded-3xl border border-border bg-card p-6">
            <p className="flex items-center gap-2 font-bold">
              <Info className="size-4 text-brand" />
              بیمه‌ی تکمیلی
            </p>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">با این بیمه‌ها طرف قراردادیم و سهم بیمه را مستقیم از شرکت بیمه می‌گیریم:</p>
            <p className="mt-3 text-sm leading-7">{INSURANCES.join("، ")}</p>
          </div>
          <a href={href("/booking")} className="flex h-12 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            رزرو جلسه‌ی معاینه
          </a>
        </aside>
      </section>
    </Shell>
  );
}
