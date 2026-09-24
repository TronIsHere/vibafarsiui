"use client";

import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { DateRangePicker, formatJalaliRange, rangeLength, type DateRange } from "@/registry/ui/date-range-picker";
import { NumberField } from "@/registry/ui/number-field";
import { RadioGroup } from "@/registry/ui/radio-group";
import { Checkbox } from "@/registry/ui/checkbox";
import { PhoneInput } from "@/registry/ui/phone-input";
import { Field, Input } from "@/registry/ui/input";
import { SuccessCheck } from "@/registry/animations/success-check";
import { fa, faNumber } from "@/lib/utils";
import { Photo, ROOMS, Shell, useHref } from "./shell";

const DINNER = 450_000;
const TRANSFER = 1_200_000;
const TAX = 0.1;

const noop = () => () => {};

/** The home hero hands over ?from=&to=&guests= so the guest doesn't pick them twice. */
function useHandoff() {
  const search = React.useSyncExternalStore(noop, () => window.location.search, () => "");
  return React.useMemo(() => {
    const q = new URLSearchParams(search);
    const date = (k: string) => (q.get(k) ? new Date(Number(q.get(k))) : null);
    return { range: { from: date("from"), to: date("to") } as DateRange, guests: Number(q.get("guests")) || 2 };
  }, [search]);
}

/** رزرو با بازه‌ی تاریخ شمسی، تعداد مهمان، انتخاب اتاق و محاسبه‌ی هزینه. */
export function BookPage() {
  const href = useHref();
  const handoff = useHandoff();
  const [rangeState, setRange] = React.useState<DateRange | null>(null);
  const [adultsState, setAdults] = React.useState<number | null>(null);
  const [kids, setKids] = React.useState(0);
  const [room, setRoom] = React.useState(ROOMS[0].id);
  const [dinner, setDinner] = React.useState(false);
  const [transfer, setTransfer] = React.useState(false);
  const [name, setName] = React.useState("");
  const [phoneOk, setPhoneOk] = React.useState(false);
  const [done, setDone] = React.useState(false);

  const range = rangeState ?? handoff.range;
  const adults = adultsState ?? handoff.guests;
  const r = ROOMS.find((x) => x.id === room)!;
  const nights = Math.max(0, rangeLength(range) - 1);
  const guests = adults + kids;
  const tooMany = guests > r.guests;

  const roomTotal = r.price * nights;
  const dinnerTotal = dinner ? DINNER * guests * nights : 0;
  const transferTotal = transfer ? TRANSFER : 0;
  const tax = Math.round(((roomTotal + dinnerTotal + transferTotal) * TAX) / 1000) * 1000;
  const total = roomTotal + dinnerTotal + transferTotal + tax;
  const ready = nights > 0 && !tooMany && name.trim().length > 1 && phoneOk;

  if (done) {
    return (
      <Shell active="/book">
        <section className="mx-auto max-w-md px-4 py-20 text-center" role="status">
          <SuccessCheck className="mx-auto" />
          <h1 className="mt-6 text-3xl font-black">درخواست رزروتون ثبت شد</h1>
          <p className="mt-3 leading-8 text-muted-foreground">
            {r.name}، {formatJalaliRange(range)}، {fa(nights)} شب برای {fa(guests)} نفر. تا یک ساعت دیگه برای تأیید و پرداخت بیعانه باهاتون تماس می‌گیریم.
          </p>
          <a href={href("/experiences")} className="mt-8 inline-flex h-11 items-center rounded-full border border-border px-6 text-sm font-semibold hover:bg-secondary">
            تجربه‌ها را ببینید
          </a>
        </section>
      </Shell>
    );
  }

  return (
    <Shell active="/book">
      <section className="mx-auto max-w-6xl px-4 pt-12 pb-20 sm:px-6">
        <h1 className="text-4xl font-black">رزرو اقامت</h1>
        <p className="mt-3 text-muted-foreground">اول تاریخ را انتخاب کنید تا هزینه‌ی دقیق را ببینید. پرداخت بعد از تأیید تلفنی انجام میشه.</p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_22rem]">
          <form
            className="space-y-10"
            onSubmit={(e) => {
              e.preventDefault();
              if (ready) setDone(true);
            }}
          >
            <fieldset className="grid gap-5 sm:grid-cols-3">
              <legend className="mb-4 text-lg font-bold">تاریخ و مهمان‌ها</legend>
              <Field label="ورود و خروج" className="sm:col-span-3">
                <DateRangePicker value={range} onChange={setRange} min={new Date()} presets={[]} placeholder="تاریخ ورود و خروج" />
              </Field>
              <Field label="بزرگسال">
                <NumberField aria-label="بزرگسال" value={adults} onChange={setAdults} min={1} max={8} />
              </Field>
              <Field label="کودک (زیر ۱۲ سال)">
                <NumberField aria-label="کودک" value={kids} onChange={setKids} min={0} max={6} />
              </Field>
            </fieldset>

            <fieldset>
              <legend className="mb-4 text-lg font-bold">اتاق</legend>
              <RadioGroup
                name="room"
                variant="cards"
                value={room}
                onChange={setRoom}
                options={ROOMS.map((x) => ({
                  value: x.id,
                  label: x.name,
                  description: `تا ${fa(x.guests)} نفر · ${fa(x.meters)} متر · ${faNumber(x.price)} تومان هر شب`,
                  disabled: guests > x.guests,
                }))}
              />
              {tooMany && (
                <p role="alert" className="mt-3 flex items-center gap-2 text-sm text-warning">
                  <AlertTriangle className="size-4" />
                  ظرفیت {r.name} {fa(r.guests)} نفره. یک اتاق بزرگ‌تر انتخاب کنید.
                </p>
              )}
            </fieldset>

            <fieldset className="space-y-3">
              <legend className="mb-4 text-lg font-bold">خدمات اضافه</legend>
              <Checkbox checked={dinner} onCheckedChange={setDinner} label="شام محلی هر شب" description={`${faNumber(DINNER)} تومان برای هر نفر`} />
              <Checkbox checked={transfer} onCheckedChange={setTransfer} label="ترانسفر از ترمینال خور" description={`${faNumber(TRANSFER)} تومان، رفت و برگشت`} />
            </fieldset>

            <fieldset className="grid gap-5 sm:grid-cols-2">
              <legend className="mb-4 text-lg font-bold">مشخصات رزروکننده</legend>
              <Field label="اسم و نام خانوادگی" htmlFor="bk-name">
                <Input id="bk-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
              </Field>
              <Field label="شماره‌ی موبایل" htmlFor="bk-phone">
                <PhoneInput id="bk-phone" onChange={(_, ok) => setPhoneOk(ok)} />
              </Field>
            </fieldset>

            <div className="lg:hidden">
              <Button type="submit" size="lg" disabled={!ready} className="w-full rounded-full">
                ثبت درخواست رزرو
              </Button>
            </div>
          </form>

          <aside className="h-fit overflow-hidden rounded-[2rem] border border-border bg-card lg:sticky lg:top-28">
            <div className="aspect-[16/9]">
              <Photo name={r.photo} alt={r.name} />
            </div>
            <div className="p-6">
              <h2 className="font-bold">خلاصه‌ی هزینه</h2>
              <p className="mt-1 text-sm text-muted-foreground">{range.from ? formatJalaliRange(range) : "تاریخ هنوز انتخاب نشده"}</p>
              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">
                    {r.name} × {fa(nights)} شب
                  </dt>
                  <dd className="tabular-nums">{faNumber(roomTotal)}</dd>
                </div>
                {dinner && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">
                      شام × {fa(guests)} نفر × {fa(nights)} شب
                    </dt>
                    <dd className="tabular-nums">{faNumber(dinnerTotal)}</dd>
                  </div>
                )}
                {transfer && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">ترانسفر</dt>
                    <dd className="tabular-nums">{faNumber(transferTotal)}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">ارزش افزوده ({fa(10)}٪)</dt>
                  <dd className="tabular-nums">{faNumber(tax)}</dd>
                </div>
                <div className="flex justify-between gap-3 border-t border-border pt-3 text-base font-bold">
                  <dt>جمع کل</dt>
                  <dd className="tabular-nums">{faNumber(total)} تومان</dd>
                </div>
              </dl>
              <p className="mt-4 rounded-xl bg-secondary/60 p-3 text-xs leading-6 text-muted-foreground">بیعانه ۳۰٪ جمع کل ({faNumber(Math.round(total * 0.3 / 1000) * 1000)} تومان) بعد از تأیید تلفنی گرفته میشه.</p>
              <div className="mt-5 hidden lg:block">
                <Button type="button" size="lg" disabled={!ready} onClick={() => setDone(true)} className="w-full rounded-full">
                  ثبت درخواست رزرو
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </Shell>
  );
}
