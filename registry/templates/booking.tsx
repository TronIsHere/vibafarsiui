"use client";

import * as React from "react";
import { Clock, MapPin, Scissors, Stethoscope } from "lucide-react";
import { Calendar } from "@/registry/ui/calendar";
import { Button } from "@/registry/ui/button";
import { Badge } from "@/registry/ui/badge";
import { Avatar } from "@/registry/ui/avatar";
import { RadioGroup } from "@/registry/ui/radio-group";
import { PhoneInput } from "@/registry/ui/phone-input";
import { cn, fa, formatToman } from "@/lib/utils";
import { formatJalali, jalaliWeekday } from "@/lib/jalali";

const services = [
  { value: "cut", label: "اصلاح مو", description: "۴۵ دقیقه · ۲۸۰ هزار تومان", price: 280_000, icon: Scissors },
  { value: "color", label: "رنگ مو", description: "۲ ساعت · ۹۵۰ هزار تومان", price: 950_000, icon: Scissors },
  { value: "consult", label: "مشاوره‌ی پوست", description: "۳۰ دقیقه · ۴۰۰ هزار تومان", price: 400_000, icon: Stethoscope },
];
const slots = ["۱۰:۰۰", "۱۰:۴۵", "۱۱:۳۰", "۱۲:۱۵", "۱۴:۰۰", "۱۴:۴۵", "۱۵:۳۰", "۱۶:۱۵", "۱۷:۰۰"];

/** رزرو نوبت: سرویس، روز روی تقویم شمسی (جمعه‌ها تعطیل)، ساعت و تأیید. */
export function BookingPage() {
  const [service, setService] = React.useState("cut");
  const [date, setDate] = React.useState<Date | null>(null);
  const [slot, setSlot] = React.useState<string | null>(null);
  const closed = date ? jalaliWeekday(date) === 6 : false;
  const chosen = services.find((s) => s.value === service)!;
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-border"><div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4"><Avatar name="سالن نگار" /><div><p className="text-sm font-bold">سالن زیبایی نگار</p><p className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="size-3" />تهران، سعادت‌آباد</p></div><Badge variant="success" className="ms-auto">امروز باز است</Badge></div></header>
      <main className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-3">
        <section className="space-y-3"><h2 className="font-semibold">۱. سرویس</h2><RadioGroup variant="cards" value={service} onChange={setService} options={services} /></section>
        <section className="space-y-3">
          <h2 className="font-semibold">۲. روز و ساعت</h2>
          <Calendar value={date} onChange={(d) => { setDate(d); setSlot(null); }} min={new Date()} className="w-full" />
          {date && (closed ? <p className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-xs">جمعه‌ها تعطیل هستیم؛ روز دیگری انتخاب کنید.</p> : (
            <div className="grid grid-cols-3 gap-2">
              {slots.map((s, i) => { const taken = i % 4 === 2; return (
                <button key={s} type="button" disabled={taken} onClick={() => setSlot(s)} className={cn("flex h-9 cursor-pointer items-center justify-center gap-1 rounded-md border text-sm tabular-nums transition-colors disabled:cursor-not-allowed disabled:line-through disabled:opacity-40", slot === s ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent")}><Clock className="size-3" />{s}</button>
              ); })}
            </div>
          ))}
        </section>
        <section className="h-fit space-y-4 rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-6">
          <h2 className="font-semibold">۳. تأیید</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">سرویس</dt><dd>{chosen.label}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">روز</dt><dd>{date && !closed ? formatJalali(date, { weekday: true }) : "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">ساعت</dt><dd>{slot ?? "—"}</dd></div>
            <div className="flex justify-between border-t border-border pt-2 font-bold"><dt>بیعانه</dt><dd>{formatToman(Math.round(chosen.price * 0.3))}</dd></div>
          </dl>
          <div className="space-y-1.5"><span className="text-sm font-medium">شماره‌ی موبایل برای یادآوری</span><PhoneInput /></div>
          <Button className="w-full" disabled={!date || closed || !slot}>پرداخت بیعانه و ثبت نوبت</Button>
          <p className="text-[11px] text-muted-foreground">تا {fa(24)} ساعت قبل از نوبت می‌توانید رایگان لغو کنید.</p>
        </section>
      </main>
    </div>
  );
}
