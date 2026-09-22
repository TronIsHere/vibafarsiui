"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight, CalendarX2 } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { Stepper } from "@/registry/ui/stepper";
import { RadioGroup } from "@/registry/ui/radio-group";
import { Calendar } from "@/registry/ui/calendar";
import { PhoneInput } from "@/registry/ui/phone-input";
import { Field, Input } from "@/registry/ui/input";
import { Textarea } from "@/registry/ui/textarea";
import { SuccessCheck } from "@/registry/animations/success-check";
import { formatJalali, JALALI_WEEKDAYS, jalaliWeekday } from "@/lib/jalali";
import { cn, fa, faNumber } from "@/lib/utils";
import { DOCTORS, Photo, SERVICES, Shell, useHref } from "./shell";

const STEPS = [{ label: "خدمت" }, { label: "پزشک و زمان" }, { label: "مشخصات" }];
const SLOTS = ["۰۹:۰۰", "۰۹:۴۵", "۱۰:۳۰", "۱۱:۱۵", "۱۲:۰۰", "۱۶:۰۰", "۱۶:۴۵", "۱۷:۳۰", "۱۸:۱۵", "۱۹:۰۰", "۱۹:۴۵", "۲۰:۳۰"];

/** Which slots are already taken on a day, stable for the same date. Replace with your API. */
function takenSlots(date: Date, doctor: string) {
  const seed = date.getDate() * 7 + date.getMonth() * 3 + doctor.length;
  return new Set(SLOTS.filter((_, i) => (seed + i * 5) % 4 === 0));
}

/** نوبت‌دهی سه‌مرحله‌ای با تقویم شمسی و ساعت‌های خالی. */
export function BookingPage() {
  const href = useHref();
  const [step, setStep] = React.useState(0);
  const [service, setService] = React.useState(SERVICES[0].id);
  const [doctor, setDoctor] = React.useState(DOCTORS[0].id);
  const [date, setDate] = React.useState<Date | null>(null);
  const [slot, setSlot] = React.useState<string | null>(null);
  const [phoneOk, setPhoneOk] = React.useState(false);
  const [name, setName] = React.useState("");
  const [done, setDone] = React.useState<string | null>(null);

  const svc = SERVICES.find((s) => s.id === service)!;
  const doc = DOCTORS.find((d) => d.id === doctor)!;
  const weekday = date ? JALALI_WEEKDAYS[jalaliWeekday(date)] : null;
  const closed = date ? jalaliWeekday(date) === 6 : false;
  const off = date && !closed && weekday ? !doc.days.includes(weekday) : false;
  const taken = date ? takenSlots(date, doctor) : new Set<string>();

  const canNext = step === 0 ? Boolean(service) : step === 1 ? Boolean(date && slot && !closed && !off) : name.trim().length > 1 && phoneOk;

  function next() {
    if (step < 2) setStep(step + 1);
    else setDone(`LB-${Math.floor(100000 + Math.random() * 899999)}`);
  }

  if (done) {
    return (
      <Shell active="/booking">
        <section className="mx-auto max-w-lg px-4 py-20 text-center" role="status">
          <SuccessCheck className="mx-auto" />
          <h1 className="mt-6 text-3xl font-black">نوبتتون ثبت شد</h1>
          <p className="mt-3 leading-8 text-muted-foreground">
            {svc.name} با {doc.name}، {date && formatJalali(date, { weekday: true })} ساعت {slot}. پیامک یادآوری یک روز قبل براتون می‌آد.
          </p>
          <p className="mx-auto mt-6 w-fit rounded-xl border border-dashed border-border px-5 py-3 text-sm">
            کد پیگیری: <span dir="ltr" className="font-mono font-bold">{done}</span>
          </p>
          <a href={href("/")} className="mt-8 inline-flex h-11 items-center rounded-full border border-border px-6 text-sm font-semibold hover:bg-secondary">
            برگشت به خانه
          </a>
        </section>
      </Shell>
    );
  }

  return (
    <Shell active="/booking">
      <section className="mx-auto max-w-6xl px-4 pt-12 pb-20 sm:px-6">
        <h1 className="text-3xl font-black sm:text-4xl">نوبت‌دهی آنلاین</h1>
        <Stepper steps={STEPS} current={step} className="mt-8 max-w-xl" />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_20rem]">
          <div className="rounded-3xl border border-border p-5 sm:p-7">
            {step === 0 && (
              <fieldset>
                <legend className="mb-4 font-bold">چه خدمتی لازم دارید؟</legend>
                <RadioGroup
                  name="service"
                  variant="cards"
                  value={service}
                  onChange={setService}
                  options={SERVICES.map((s) => ({ value: s.id, label: s.name, description: `از ${faNumber(s.from)} تومان · حدود ${fa(s.min)} دقیقه` }))}
                />
              </fieldset>
            )}

            {step === 1 && (
              <div className="space-y-8">
                <fieldset>
                  <legend className="mb-4 font-bold">پزشک</legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {DOCTORS.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        aria-pressed={doctor === d.id}
                        onClick={() => {
                          setDoctor(d.id);
                          setSlot(null);
                        }}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-2xl border p-3 text-start transition-colors",
                          doctor === d.id ? "border-foreground bg-secondary" : "border-border hover:bg-secondary/50",
                        )}
                      >
                        <span className="size-11 shrink-0 overflow-hidden rounded-full">
                          <Photo name={d.photo} alt="" />
                        </span>
                        <span className="text-sm">
                          <span className="block font-semibold">{d.name}</span>
                          <span className="block text-xs text-muted-foreground">{d.days.join("، ")}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </fieldset>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <p className="mb-3 font-bold">روز</p>
                    <Calendar
                      value={date}
                      onChange={(d) => {
                        setDate(d);
                        setSlot(null);
                      }}
                      min={new Date()}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <p className="mb-3 font-bold">ساعت</p>
                    {!date ? (
                      <p className="rounded-2xl bg-secondary/60 p-4 text-sm text-muted-foreground">اول یک روز را روی تقویم انتخاب کنید.</p>
                    ) : closed || off ? (
                      <div className="flex flex-col items-center rounded-2xl bg-secondary/60 p-6 text-center text-sm">
                        <CalendarX2 className="size-6 text-muted-foreground" />
                        <p className="mt-3 font-semibold">{closed ? "جمعه‌ها کلینیک تعطیله" : `${doc.name} ${weekday}ها در کلینیک نیستن`}</p>
                        <p className="mt-1 text-muted-foreground">یک روز دیگه انتخاب کنید.</p>
                      </div>
                    ) : (
                      <div role="radiogroup" aria-label="ساعت" className="grid grid-cols-3 gap-2">
                        {SLOTS.map((s) => {
                          const busy = taken.has(s);
                          return (
                            <button
                              key={s}
                              type="button"
                              role="radio"
                              aria-checked={slot === s}
                              disabled={busy}
                              onClick={() => setSlot(s)}
                              className={cn(
                                "h-11 cursor-pointer rounded-xl border text-sm tabular-nums transition-colors disabled:cursor-not-allowed disabled:text-muted-foreground/50 disabled:line-through",
                                slot === s ? "border-foreground bg-foreground text-background" : "border-border hover:bg-secondary",
                              )}
                            >
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="اسم و نام خانوادگی" htmlFor="b-name">
                  <Input id="b-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
                </Field>
                <Field label="شماره‌ی موبایل" htmlFor="b-phone" hint="کد پیگیری و یادآوری به این شماره پیامک میشه.">
                  <PhoneInput id="b-phone" onChange={(_, ok) => setPhoneOk(ok)} />
                </Field>
                <Field label="توضیحات (اختیاری)" htmlFor="b-note" className="sm:col-span-2">
                  <Textarea id="b-note" rows={3} maxLength={300} showCount placeholder="مثلاً دندان سمت راست بالا به سرما حساسه" />
                </Field>
              </div>
            )}

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-6">
              <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 0}>
                <ArrowRight />
                قبلی
              </Button>
              <Button onClick={next} disabled={!canNext} className="rounded-full px-6">
                {step === 2 ? "ثبت نوبت" : "مرحله‌ی بعد"}
                {step < 2 && <ArrowLeft />}
              </Button>
            </div>
          </div>

          <aside className="h-fit rounded-3xl border border-border bg-card p-6 lg:sticky lg:top-28">
            <h2 className="font-bold">خلاصه‌ی نوبت</h2>
            <dl className="mt-5 space-y-3 text-sm">
              {[
                ["خدمت", svc.name],
                ["پزشک", step > 0 ? doc.name : "—"],
                ["روز", date && !closed && !off ? formatJalali(date, { weekday: true }) : "—"],
                ["ساعت", slot ?? "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 border-b border-dashed border-border pb-3">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-end font-medium">{v}</dd>
                </div>
              ))}
              <div className="flex justify-between gap-3 pt-1">
                <dt className="text-muted-foreground">هزینه‌ی تقریبی</dt>
                <dd className="font-bold">از {faNumber(svc.from)} تومان</dd>
              </div>
            </dl>
            <p className="mt-5 rounded-xl bg-secondary/60 p-3 text-xs leading-6 text-muted-foreground">نوبت رایگان ثبت میشه و هزینه بعد از معاینه و در خود کلینیک پرداخت میشه.</p>
          </aside>
        </div>
      </section>
    </Shell>
  );
}
