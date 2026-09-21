"use client";

import * as React from "react";
import { ArrowLeftRight, Bus, Plane, TrainFront } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { Badge } from "@/registry/ui/badge";
import { Combobox } from "@/registry/ui/combobox";
import { DatePicker } from "@/registry/ui/date-picker";
import { NumberField } from "@/registry/ui/number-field";
import { Checkbox } from "@/registry/ui/checkbox";
import { Slider } from "@/registry/ui/slider";
import { Field } from "@/registry/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/registry/ui/tabs";
import { cn, fa, faNumber, formatToman } from "@/lib/utils";
import { formatJalali } from "@/lib/jalali";

const cities = ["تهران", "مشهد", "شیراز", "اصفهان", "تبریز", "کیش", "اهواز", "رشت", "بندرعباس", "یزد"];
type Flight = { id: string; airline: string; no: string; dep: string; arr: string; dur: string; price: number; seats: number; cls: string; kind: "سیستمی" | "چارتر" };
const flights: Flight[] = [
  { id: "1", airline: "ماهان", no: "W5 1080", dep: "06:45", arr: "08:15", dur: "۱ ساعت و ۳۰ دقیقه", price: 2_180_000, seats: 9, cls: "اکونومی", kind: "سیستمی" },
  { id: "2", airline: "ایران‌ایر", no: "IR 460", dep: "09:30", arr: "11:05", dur: "۱ ساعت و ۳۵ دقیقه", price: 1_890_000, seats: 3, cls: "اکونومی", kind: "چارتر" },
  { id: "3", airline: "کاسپین", no: "IV 6942", dep: "13:10", arr: "14:40", dur: "۱ ساعت و ۳۰ دقیقه", price: 1_640_000, seats: 5, cls: "اکونومی", kind: "چارتر" },
  { id: "4", airline: "قشم‌ایر", no: "QB 1202", dep: "17:50", arr: "19:25", dur: "۱ ساعت و ۳۵ دقیقه", price: 2_050_000, seats: 12, cls: "اکونومی", kind: "سیستمی" },
  { id: "5", airline: "ماهان", no: "W5 1084", dep: "21:30", arr: "23:00", dur: "۱ ساعت و ۳۰ دقیقه", price: 2_760_000, seats: 2, cls: "بیزینس", kind: "سیستمی" },
];
const airlines = Array.from(new Set(flights.map((f) => f.airline)));
const sorts = [["cheap", "ارزان‌ترین"], ["early", "زودترین"], ["late", "دیرترین"]] as const;
const DEFAULT_DATE = new Date(Date.now() + 3 * 864e5);

/** بلیت سفر: جست‌وجوی پرواز با مبدأ/مقصد، جابه‌جایی، تاریخ شمسی و مسافر؛ فیلتر ایرلاین و قیمت؛ نتایج با ساعت و صندلی باقی‌مانده. */
export function TravelSearch() {
  const [from, setFrom] = React.useState("تهران");
  const [to, setTo] = React.useState("مشهد");
  const [date, setDate] = React.useState<Date | null>(DEFAULT_DATE);
  const [pax, setPax] = React.useState(1);
  const [chosen, setChosen] = React.useState<string[]>(airlines);
  const [maxPrice, setMaxPrice] = React.useState(3_000_000);
  const [sort, setSort] = React.useState<(typeof sorts)[number][0]>("cheap");
  const [swapKey, setSwapKey] = React.useState(0);

  const list = flights
    .filter((f) => chosen.includes(f.airline) && f.price <= maxPrice)
    .sort((a, b) => (sort === "cheap" ? a.price - b.price : sort === "early" ? a.dep.localeCompare(b.dep) : b.dep.localeCompare(a.dep)));

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <section className="border-b border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <Tabs defaultValue="flight" className="w-full">
            <TabsList aria-label="نوع سفر" className="grid w-full grid-cols-3 sm:inline-flex sm:w-auto">
              <TabsTrigger value="flight" className="inline-flex w-full items-center justify-center gap-1.5"><Plane className="size-4 shrink-0" />پرواز</TabsTrigger>
              <TabsTrigger value="train" className="inline-flex w-full items-center justify-center gap-1.5"><TrainFront className="size-4 shrink-0" />قطار</TabsTrigger>
              <TabsTrigger value="bus" className="inline-flex w-full items-center justify-center gap-1.5"><Bus className="size-4 shrink-0" />اتوبوس</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="mt-4 flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-card p-4">
            <Field label="مبدأ" htmlFor="from" className="min-w-0 flex-1 basis-36">
              <Combobox key={`f${swapKey}`} className="w-full" options={cities} value={from} onChange={setFrom} placeholder="شهر مبدأ" />
            </Field>
            <Button variant="outline" size="icon" aria-label="جابه‌جایی مبدأ و مقصد" className="mb-0.5 shrink-0" onClick={() => { setFrom(to); setTo(from); setSwapKey((k) => k + 1); }}><ArrowLeftRight /></Button>
            <Field label="مقصد" htmlFor="to" className="min-w-0 flex-1 basis-36">
              <Combobox key={`t${swapKey}`} className="w-full" options={cities} value={to} onChange={setTo} placeholder="شهر مقصد" />
            </Field>
            <Field label="تاریخ رفت" className="min-w-[12.5rem] flex-[1.2] basis-[12.5rem]">
              <DatePicker value={date} onChange={setDate} min={new Date()} clearable={false} weekday={false} />
            </Field>
            <Field label="مسافر" className="shrink-0">
              <NumberField value={pax} onChange={setPax} min={1} max={9} aria-label="تعداد مسافر" />
            </Field>
            <Button size="lg" className="h-10 shrink-0">جست‌وجو</Button>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-4">
        <aside className="space-y-6 lg:col-span-1">
          <div className="rounded-2xl border border-border bg-card p-4">
            <h2 className="text-sm font-semibold">ایرلاین</h2>
            <div className="mt-3 space-y-2">{airlines.map((a) => <Checkbox key={a} label={a} checked={chosen.includes(a)} onCheckedChange={(on) => setChosen((c) => (on ? [...c, a] : c.filter((x) => x !== a)))} />)}</div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <Slider label="حداکثر قیمت" min={1_500_000} max={3_000_000} step={50_000} value={maxPrice} onChange={setMaxPrice} format={formatToman} />
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <h2 className="text-sm font-semibold">ساعت حرکت</h2>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">{["صبح", "ظهر", "عصر", "شب"].map((t) => <button key={t} type="button" className="cursor-pointer rounded-lg border border-border px-2 py-1.5 transition-colors hover:bg-accent">{t}</button>)}</div>
          </div>
        </aside>

        <main className="lg:col-span-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><h1 className="text-lg font-bold">{from} به {to}</h1><p className="text-xs text-muted-foreground">{date ? formatJalali(date, { weekday: true }) : "تاریخ را انتخاب کنید"} · {fa(pax)} مسافر · {fa(list.length)} پرواز</p></div>
            <div className="inline-flex rounded-lg border border-border bg-background p-0.5 text-xs">{sorts.map(([k, l]) => <button key={k} type="button" onClick={() => setSort(k)} className={cn("cursor-pointer rounded-md px-3 py-1 transition-colors", sort === k ? "bg-secondary font-semibold" : "text-muted-foreground hover:text-foreground")}>{l}</button>)}</div>
          </div>
          <ul className="mt-4 space-y-3">
            {list.map((f) => (
              <li key={f.id} className="grid gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-foreground/25 md:grid-cols-[1fr_auto_auto] md:items-center">
                <div className="flex items-center gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-sm font-bold">{f.airline.charAt(0)}</span>
                  <div className="flex flex-1 items-center gap-4">
                    <div className="text-center"><p className="text-xl font-bold tabular-nums">{fa(f.dep)}</p><p className="text-xs text-muted-foreground">{from}</p></div>
                    <div className="flex flex-1 flex-col items-center text-[11px] text-muted-foreground"><span>{f.dur}</span><span className="my-1 h-px w-full bg-border" /><span>بدون توقف</span></div>
                    <div className="text-center"><p className="text-xl font-bold tabular-nums">{fa(f.arr)}</p><p className="text-xs text-muted-foreground">{to}</p></div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground md:flex-col md:items-start md:gap-1">
                  <span>{f.airline} · <span className="font-mono" dir="ltr">{f.no}</span></span>
                  <span className="flex gap-1.5"><Badge variant="secondary" className="text-[11px]">{f.cls}</Badge><Badge variant={f.kind === "چارتر" ? "warning" : "secondary"} className="text-[11px]">{f.kind}</Badge></span>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-border pt-3 md:flex-col md:items-end md:border-0 md:pt-0">
                  <div className="text-end"><p className="text-lg font-bold tabular-nums">{faNumber(f.price)} <span className="text-xs font-normal text-muted-foreground">تومان</span></p>{f.seats <= 3 ? <p className="text-[11px] text-destructive">فقط {fa(f.seats)} صندلی مانده</p> : <p className="text-[11px] text-muted-foreground">{fa(f.seats)} صندلی</p>}</div>
                  <Button size="sm">انتخاب</Button>
                </div>
              </li>
            ))}
            {list.length === 0 && <li className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">با این فیلترها پروازی نیست. سقف قیمت را بالاتر ببرید یا ایرلاین دیگری را هم انتخاب کنید.</li>}
          </ul>
        </main>
      </div>
    </div>
  );
}
