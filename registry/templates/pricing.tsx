"use client";

import * as React from "react";
import { Check, Minus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/registry/ui/tabs";
import { Price } from "@/registry/ui/price";
import { Button } from "@/registry/ui/button";
import { Badge } from "@/registry/ui/badge";

const plans = [
  { name: "پایه", monthly: 0, desc: "برای شروع", cta: "شروع رایگان" },
  { name: "حرفه‌ای", monthly: 350_000, desc: "برای تیم‌های کوچک", cta: "شروع دوره‌ی آزمایشی", hot: true },
  { name: "سازمانی", monthly: 1_200_000, desc: "برای سازمان‌های بزرگ", cta: "تماس با فروش" },
];
const rows: [string, (boolean | string)[]][] = [
  ["کاربران", ["۱ نفر", "۱۰ نفر", "نامحدود"]],
  ["فضای ذخیره‌سازی", ["۱ گیگابایت", "۵۰ گیگابایت", "۱ ترابایت"]],
  ["دامنه‌ی اختصاصی", [false, true, true]],
  ["گزارش پیشرفته", [false, true, true]],
  ["پشتیبانی تلفنی", [false, false, true]],
];

/** صفحه‌ی قیمت‌گذاری: ماهانه/سالانه و جدول مقایسه. */
export function PricingPage() {
  const [period, setPeriod] = React.useState("monthly");
  const yearly = period === "yearly";
  return (
    <div className="min-h-dvh bg-background px-4 py-16 text-foreground">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">قیمت ساده، بدون غافلگیری</h1>
          <p className="mt-3 text-muted-foreground">با پرداخت سالانه دو ماه رایگان می‌گیرید.</p>
          <Tabs defaultValue="monthly" onValueChange={setPeriod} className="mt-6 inline-block">
            <TabsList aria-label="دوره‌ی پرداخت">
              <TabsTrigger value="monthly">ماهانه</TabsTrigger>
              <TabsTrigger value="yearly">سالانه <span className="ms-1 text-xs text-brand">۱۷٪ کمتر</span></TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {plans.map((p) => (
            <div key={p.name} className={`rounded-2xl border bg-card p-6 ${p.hot ? "border-foreground/40 shadow-[0_0_0_1px_var(--foreground)_inset]" : "border-border"}`}>
              <div className="flex items-center justify-between"><h2 className="font-semibold">{p.name}</h2>{p.hot && <Badge>پیشنهادی</Badge>}</div>
              <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
              <div className="mt-5"><Price amount={yearly ? p.monthly * 10 : p.monthly} unit={yearly ? "تومان / سال" : "تومان / ماه"} /></div>
              <Button className="mt-6 w-full" variant={p.hot ? "default" : "outline"}>{p.cta}</Button>
            </div>
          ))}
        </div>

        <div className="mt-12 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-xs text-muted-foreground">
              <tr><th className="px-4 py-3 text-start font-medium">امکانات</th>{plans.map((p) => <th key={p.name} className="px-4 py-3 text-start font-medium">{p.name}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map(([label, vals]) => (
                <tr key={label} className="border-t border-border">
                  <td className="px-4 py-3">{label}</td>
                  {vals.map((v, i) => (
                    <td key={i} className="px-4 py-3">
                      {v === true ? <Check className="size-4 text-brand" /> : v === false ? <Minus className="size-4 text-muted-foreground/50" /> : v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
