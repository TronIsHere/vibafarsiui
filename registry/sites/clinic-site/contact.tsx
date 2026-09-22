"use client";

import * as React from "react";
import { Bus, Car, Check, Clock, MapPin, Phone, TrainFront } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { Field, Input } from "@/registry/ui/input";
import { PhoneInput } from "@/registry/ui/phone-input";
import { Textarea } from "@/registry/ui/textarea";
import { Shell } from "./shell";

/** A stylised street map drawn with theme tokens. Swap for Neshan or Balad embed in production. */
function MapArt() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-secondary" aria-hidden>
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
        <g stroke="var(--background)" strokeLinecap="round">
          <path d="M-20 90 L420 60" strokeWidth="18" />
          <path d="M-20 220 L420 250" strokeWidth="12" />
          <path d="M140 -20 L170 320" strokeWidth="14" />
          <path d="M300 -20 L270 320" strokeWidth="9" />
          <path d="M-20 160 Q200 130 420 170" strokeWidth="7" />
        </g>
        <g fill="var(--muted)">
          <rect x="30" y="110" width="80" height="35" rx="6" />
          <rect x="190" y="95" width="60" height="50" rx="6" />
          <rect x="190" y="180" width="60" height="45" rx="6" />
          <rect x="310" y="190" width="70" height="40" rx="6" />
          <rect x="30" y="180" width="90" height="30" rx="6" />
        </g>
        <circle cx="220" cy="160" r="46" fill="var(--brand)" opacity="0.18" />
      </svg>
      {/* The map is a picture, not text, so the pin uses a physical offset. */}
      <div className="absolute top-[53%] -translate-x-1/2 -translate-y-full" style={{ left: "55%" }}>
        <div className="rounded-full bg-brand p-2 text-brand-foreground shadow-lg">
          <MapPin className="size-5" />
        </div>
      </div>
    </div>
  );
}

/** تماس، مسیر، ساعت کاری و فرم پیام. */
export function ContactPage() {
  const [sent, setSent] = React.useState(false);
  const [phoneOk, setPhoneOk] = React.useState(false);

  return (
    <Shell active="/contact">
      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 sm:pt-20">
        <h1 className="text-4xl font-black sm:text-5xl">تماس و مسیر</h1>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-4 py-10 sm:px-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="relative min-h-80 overflow-hidden rounded-[2rem] border border-border">
          <MapArt />
        </div>
        <div className="space-y-4">
          {[
            { i: MapPin, t: "آدرس", b: "اصفهان، خیابان شیخ صدوق شمالی، ساختمان پزشکان ارغوان، طبقه‌ی دوم، واحد ۴" },
            { i: Phone, t: "تلفن", b: <span dir="ltr">۰۳۱ ۳۶۲۸ ۱۰۰۰</span> },
            { i: Clock, t: "ساعت کاری", b: "شنبه تا چهارشنبه ۹ تا ۲۱، پنجشنبه ۹ تا ۱۴" },
          ].map((x) => (
            <div key={x.t} className="flex gap-4 rounded-3xl border border-border p-5">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand/10 text-brand">
                <x.i className="size-5" />
              </span>
              <div>
                <p className="font-bold">{x.t}</p>
                <p className="mt-1 text-sm leading-7 text-muted-foreground">{x.b}</p>
              </div>
            </div>
          ))}
          <ul className="grid grid-cols-3 gap-2 text-center text-xs">
            {[
              { i: TrainFront, t: "مترو میدان آزادی، ۵ دقیقه پیاده" },
              { i: Bus, t: "ایستگاه شیخ صدوق" },
              { i: Car, t: "پارکینگ طبقه‌ی منفی یک" },
            ].map((x) => (
              <li key={x.t} className="rounded-2xl bg-secondary/60 p-3 leading-5">
                <x.i className="mx-auto mb-2 size-4 text-muted-foreground" />
                {x.t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
        <div className="rounded-[2rem] border border-border bg-card p-6 sm:p-9">
          <h2 className="text-2xl font-black">پیام بگذارید</h2>
          <p className="mt-2 text-sm text-muted-foreground">برای سؤال درباره‌ی هزینه یا درمان. برای نوبت از صفحه‌ی نوبت‌دهی استفاده کنید.</p>
          {sent ? (
            <p role="status" className="mt-8 flex items-center gap-2 rounded-2xl bg-success/10 p-4 text-sm text-success">
              <Check className="size-4" />
              پیامتون رسید. تا پایان روز کاری باهاتون تماس می‌گیریم.
            </p>
          ) : (
            <form
              className="mt-8 grid gap-5 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (phoneOk) setSent(true);
              }}
            >
              <Field label="اسم" htmlFor="ct-name">
                <Input id="ct-name" required autoComplete="name" />
              </Field>
              <Field label="شماره‌ی موبایل" htmlFor="ct-phone">
                <PhoneInput id="ct-phone" onChange={(_, ok) => setPhoneOk(ok)} />
              </Field>
              <Field label="پیام" htmlFor="ct-msg" className="sm:col-span-2">
                <Textarea id="ct-msg" required rows={4} maxLength={500} showCount />
              </Field>
              <Button type="submit" size="lg" disabled={!phoneOk} className="rounded-full sm:col-span-2">
                فرستادن پیام
              </Button>
            </form>
          )}
        </div>
      </section>
    </Shell>
  );
}
