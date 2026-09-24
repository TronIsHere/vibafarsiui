"use client";

import * as React from "react";
import { Check, Minus } from "lucide-react";
import { SegmentedControl } from "@/registry/ui/segmented-control";
import { Accordion } from "@/registry/ui/accordion";
import { cn, faNumber } from "@/lib/utils";
import { PLANS, Shell, useHref, yearly } from "./shell";

type Cell = boolean | string;
const COMPARE: { group: string; rows: { t: string; v: [Cell, Cell, Cell] }[] }[] = [
  {
    group: "فروش",
    rows: [
      { t: "فاکتور رسمی", v: ["نامحدود", "نامحدود", "نامحدود"] },
      { t: "لینک پرداخت", v: [true, true, true] },
      { t: "یادآوری پیامکی سررسید", v: [false, true, true] },
    ],
  },
  {
    group: "مالیات و گزارش",
    rows: [
      { t: "ارسال به سامانه‌ی مودیان", v: [true, true, true] },
      { t: "گزارش فصلی ارزش افزوده", v: [true, true, true] },
      { t: "مرکز هزینه و پروژه", v: [false, false, true] },
    ],
  },
  {
    group: "تیم",
    rows: [
      { t: "تعداد کاربر", v: ["۱", "۵", "نامحدود"] },
      { t: "دسترسی نقش‌محور", v: [false, true, true] },
      { t: "چند شرکت و شعبه", v: [false, false, true] },
    ],
  },
];

const FAQ = [
  { id: "a", title: "بعد از ۱۴ روز چی میشه؟", content: "اگر پلنی انتخاب نکنید حسابتون فقط‌خواندنی میشه و هیچ اطلاعاتی پاک نمیشه." },
  { id: "b", title: "قیمت‌ها ارزش افزوده دارن؟", content: "قیمت‌های این صفحه بدون ارزش افزوده‌ی ۱۰ درصد هستن و فاکتور رسمی براتون صادر میشه." },
  { id: "c", title: "وسط دوره می‌تونم پلن را عوض کنم؟", content: "بله، مابه‌التفاوت روزشمار حساب میشه و همون لحظه امکانات جدید فعال میشن." },
];

function Value({ v }: { v: Cell }) {
  if (v === true) return <Check className="mx-auto size-4 text-brand" aria-label="دارد" />;
  if (v === false) return <Minus className="mx-auto size-4 text-muted-foreground/50" aria-label="ندارد" />;
  return <span>{v}</span>;
}

/** قیمت با تغییر ماهانه و سالانه و جدول مقایسه. */
export function PricingPage() {
  const href = useHref();
  const [cycle, setCycle] = React.useState("year");

  return (
    <Shell active="/pricing">
      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 sm:pt-24">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-black sm:text-5xl">قیمت ساده، بدون هزینه‌ی پنهان</h1>
          <p className="mt-4 text-lg text-muted-foreground">۱۴ روز رایگان امتحان کنید، بعد پلنی که به کارتون میاد را انتخاب کنید.</p>
          <div className="mt-8 inline-flex items-center gap-3">
            <SegmentedControl
              aria-label="دوره‌ی پرداخت"
              value={cycle}
              onChange={setCycle}
              options={[
                { value: "month", label: "ماهانه" },
                { value: "year", label: "سالانه" },
              ]}
            />
            <span className="rounded-full bg-success/15 px-2.5 py-1 text-xs font-semibold text-success">دو ماه رایگان در سالانه</span>
          </div>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {PLANS.map((p) => {
            const price = cycle === "year" ? yearly(p.monthly) : p.monthly;
            return (
              <article
                key={p.id}
                className={cn(
                  "relative flex flex-col rounded-3xl border p-7",
                  p.hot ? "border-brand bg-card shadow-[0_30px_60px_-30px_var(--brand)]" : "border-border",
                )}
              >
                {p.hot && <span className="absolute -top-3 start-7 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-brand-foreground">محبوب‌ترین</span>}
                <h2 className="text-xl font-bold">{p.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
                <p className="mt-7 flex items-baseline gap-1.5">
                  <span className="text-4xl font-black tabular-nums">{faNumber(price)}</span>
                  <span className="text-sm text-muted-foreground">تومان {cycle === "year" ? "در سال" : "در ماه"}</span>
                </p>
                <p className="mt-1 h-5 text-xs text-success">{cycle === "year" ? `${faNumber(p.monthly * 2)} تومان صرفه‌جویی` : ""}</p>
                <a
                  href={href("/login")}
                  className={cn(
                    "mt-6 inline-flex h-11 items-center justify-center rounded-xl text-sm font-semibold transition-colors",
                    p.hot ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border border-border hover:bg-secondary",
                  )}
                >
                  شروع ۱۴ روز رایگان
                </a>
                <ul className="mt-7 space-y-3 text-sm">
                  {p.items.map((it) => (
                    <li key={it} className="flex items-center gap-2.5">
                      <Check className="size-4 shrink-0 text-brand" />
                      {it}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <h2 className="text-2xl font-black">مقایسه‌ی کامل پلن‌ها</h2>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[40rem] text-sm">
            <thead>
              <tr className="border-b border-border bg-card/60">
                <th scope="col" className="px-5 py-4 text-start font-medium text-muted-foreground">
                  امکانات
                </th>
                {PLANS.map((p) => (
                  <th key={p.id} scope="col" className={cn("px-5 py-4 text-center font-bold", p.hot && "text-brand")}>
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            {COMPARE.map((g) => (
              <tbody key={g.group}>
                <tr>
                  <th colSpan={4} scope="colgroup" className="bg-secondary/40 px-5 py-2 text-start text-xs font-semibold text-muted-foreground">
                    {g.group}
                  </th>
                </tr>
                {g.rows.map((r) => (
                  <tr key={r.t} className="border-t border-border">
                    <th scope="row" className="px-5 py-3.5 text-start font-normal">
                      {r.t}
                    </th>
                    {r.v.map((v, i) => (
                      <td key={i} className="px-5 py-3.5 text-center">
                        <Value v={v} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
        <h2 className="mb-6 text-2xl font-black">سؤال‌های پرداخت</h2>
        <Accordion items={FAQ} />
      </section>
    </Shell>
  );
}
