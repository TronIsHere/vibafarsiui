"use client";

import * as React from "react";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { DatePicker } from "@/registry/ui/date-picker";
import { NumberField } from "@/registry/ui/number-field";
import { PhoneInput } from "@/registry/ui/phone-input";
import { Field, Input } from "@/registry/ui/input";
import { Textarea } from "@/registry/ui/textarea";
import { SegmentedControl } from "@/registry/ui/segmented-control";
import { Select } from "@/registry/ui/select";
import { SuccessCheck } from "@/registry/animations/success-check";
import { GirihBackground } from "@/registry/backgrounds/girih";
import { formatJalali } from "@/lib/jalali";
import { cn, fa } from "@/lib/utils";
import { BRANCHES, Photo, Shell, useHref } from "./shell";

const TIMES = {
  ناهار: ["۱۲:۰۰", "۱۲:۳۰", "۱۳:۰۰", "۱۳:۳۰", "۱۴:۰۰", "۱۴:۳۰"],
  شام: ["۱۹:۰۰", "۱۹:۳۰", "۲۰:۰۰", "۲۰:۳۰", "۲۱:۰۰", "۲۱:۳۰", "۲۲:۰۰", "۲۲:۳۰"],
};
const FULL = new Set(["۱۳:۰۰", "۲۰:۳۰", "۲۱:۰۰"]);

/** رزرو میز با شعبه، تاریخ شمسی، تعداد مهمان، ساعت و نوع میز. */
export function ReservePage() {
  const href = useHref();
  const [branch, setBranch] = React.useState(BRANCHES[0].name);
  const [date, setDate] = React.useState<Date | null>(null);
  const [guests, setGuests] = React.useState(2);
  const [time, setTime] = React.useState<string | null>(null);
  const [seat, setSeat] = React.useState("hall");
  const [name, setName] = React.useState("");
  const [phoneOk, setPhoneOk] = React.useState(false);
  const [done, setDone] = React.useState(false);

  const ready = Boolean(date && time && name.trim() && phoneOk);

  if (done) {
    return (
      <Shell active="/reserve">
        <section className="mx-auto max-w-md px-4 py-20 text-center" role="status">
          <SuccessCheck className="mx-auto" />
          <h1 className="mt-6 text-3xl font-black">میزتون رزرو شد</h1>
          <div className="mt-8 space-y-3 rounded-3xl border border-border p-6 text-start text-sm">
            <p className="flex items-center gap-3">
              <MapPin className="size-4 text-brand" />
              {branch}
            </p>
            <p className="flex items-center gap-3">
              <CalendarDays className="size-4 text-brand" />
              {date && formatJalali(date, { weekday: true })}
            </p>
            <p className="flex items-center gap-3">
              <Clock className="size-4 text-brand" />
              ساعت {time}
            </p>
            <p className="flex items-center gap-3">
              <Users className="size-4 text-brand" />
              {fa(guests)} نفر · {seat === "hall" ? "سالن" : seat === "yard" ? "حیاط کنار حوض" : "تخت سنتی"}
            </p>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">تا ۱۵ دقیقه بعد از ساعت رزرو، میز براتون نگه داشته میشه.</p>
          <a href={href("/menu")} className="mt-8 inline-flex h-11 items-center rounded-full border border-border px-6 text-sm font-semibold hover:bg-secondary">
            تا اون موقع منو را ببینید
          </a>
        </section>
      </Shell>
    );
  }

  return (
    <Shell active="/reserve">
      <section className="relative isolate overflow-hidden border-b border-border">
        <Photo name="courtyard" alt="" eager className="absolute inset-0 -z-20" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-background/70" />
        <GirihBackground size={56} className="-z-10 opacity-40" />
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <h1 className="text-4xl font-black sm:text-5xl">رزرو میز</h1>
          <p className="mt-4 text-muted-foreground">برای جمع‌های بیشتر از ۱۰ نفر لطفاً با شعبه تماس بگیرید.</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <form
          className="space-y-8"
          onSubmit={(e) => {
            e.preventDefault();
            if (ready) setDone(true);
          }}
        >
          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="شعبه" htmlFor="r-branch">
              <Select id="r-branch" value={branch} onChange={(e) => setBranch(e.target.value)} options={BRANCHES.map((b) => ({ value: b.name, label: `${b.name}، ${b.city}` }))} />
            </Field>
            <Field label="تاریخ">
              <DatePicker value={date} onChange={setDate} min={new Date()} />
            </Field>
            <Field label="تعداد مهمان">
              <NumberField aria-label="تعداد مهمان" value={guests} onChange={setGuests} min={1} max={10} />
            </Field>
          </div>

          <fieldset>
            <legend className="mb-3 text-sm font-medium">ساعت</legend>
            {(Object.keys(TIMES) as (keyof typeof TIMES)[]).map((meal) => (
              <div key={meal} className="mb-4">
                <p className="mb-2 text-xs text-muted-foreground">{meal}</p>
                <div role="radiogroup" aria-label={meal} className="flex flex-wrap gap-2">
                  {TIMES[meal].map((t) => {
                    const full = FULL.has(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        role="radio"
                        aria-checked={time === t}
                        disabled={full}
                        onClick={() => setTime(t)}
                        className={cn(
                          "h-10 min-w-20 cursor-pointer rounded-full border px-4 text-sm tabular-nums transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                          time === t ? "border-brand bg-brand text-brand-foreground" : "border-border hover:border-foreground/30",
                        )}
                      >
                        {t}
                        {full && <span className="ms-1 text-[10px]">پر</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </fieldset>

          <div>
            <p className="mb-2 text-sm font-medium">جای نشستن</p>
            <SegmentedControl
              aria-label="جای نشستن"
              value={seat}
              onChange={setSeat}
              fullWidth
              options={[
                { value: "hall", label: "سالن" },
                { value: "yard", label: "حیاط کنار حوض" },
                { value: "takht", label: "تخت سنتی" },
              ]}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="اسم رزروکننده" htmlFor="r-name">
              <Input id="r-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            </Field>
            <Field label="شماره‌ی موبایل" htmlFor="r-phone">
              <PhoneInput id="r-phone" onChange={(_, ok) => setPhoneOk(ok)} />
            </Field>
            <Field label="مناسبت یا درخواست خاص (اختیاری)" htmlFor="r-note" className="sm:col-span-2">
              <Textarea id="r-note" rows={3} maxLength={200} showCount placeholder="مثلاً تولد، صندلی کودک یا میز دور از بلندگو" />
            </Field>
          </div>

          <Button type="submit" size="lg" disabled={!ready} className="w-full rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
            ثبت رزرو
          </Button>
        </form>
      </section>
    </Shell>
  );
}
