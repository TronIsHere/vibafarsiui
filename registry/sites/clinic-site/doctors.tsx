"use client";

import { Award, CalendarCheck, Star } from "lucide-react";
import { Rating } from "@/registry/ui/rating";
import { Reveal } from "@/registry/animations/reveal";
import { cn, fa, faNumber } from "@/lib/utils";
import { DOCTORS, Photo, Shell, useHref } from "./shell";

const WEEK = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه"];

/** معرفی پزشکان با روزهای حضور و امتیاز. */
export function DoctorsPage() {
  const href = useHref();
  return (
    <Shell active="/doctors">
      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 sm:pt-20">
        <h1 className="text-4xl font-black sm:text-5xl">پزشکان کلینیک</h1>
        <p className="mt-4 max-w-2xl leading-8 text-muted-foreground">هر کدوم از همکارهای ما در یک رشته تخصص دارن، پس برای هر درمان سراغ کسی می‌رید که هر روز همون کار را انجام میده.</p>
      </section>

      <section className="mx-auto max-w-6xl space-y-5 px-4 py-12 sm:px-6">
        {DOCTORS.map((d) => (
          <Reveal key={d.id}>
            <article className="grid gap-6 rounded-[2rem] border border-border p-5 sm:p-6 md:grid-cols-[14rem_1fr]">
              <div className="aspect-square overflow-hidden rounded-3xl md:aspect-auto md:min-h-72">
                <Photo name={d.photo} alt={d.name} />
              </div>
              <div className="flex flex-col">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-black">{d.name}</h2>
                    <p className="mt-1 text-brand">{d.role}</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-sm">
                    <Rating value={d.rating} readOnly size="sm" />
                    <span className="font-semibold">{fa(String(d.rating).replace(".", "٫"))}</span>
                    <span className="text-muted-foreground">({faNumber(d.reviews)})</span>
                  </div>
                </div>
                <p className="mt-4 max-w-2xl leading-8 text-muted-foreground">{d.bio}</p>
                <p className="mt-4 flex items-center gap-2 text-sm">
                  <Award className="size-4 text-brand" />
                  {fa(d.years)} سال سابقه‌ی درمان
                </p>
                <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-6">
                  <div>
                    <p className="mb-2 text-xs text-muted-foreground">روزهای حضور</p>
                    <ul className="flex flex-wrap gap-1.5">
                      {WEEK.map((w) => (
                        <li
                          key={w}
                          className={cn(
                            "rounded-lg px-2.5 py-1 text-xs",
                            d.days.includes(w) ? "bg-brand/15 font-semibold text-foreground" : "text-muted-foreground/60 line-through",
                          )}
                        >
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a href={href("/booking")} className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground">
                    <CalendarCheck className="size-4" />
                    نوبت با {d.name}
                  </a>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="flex flex-col items-center gap-3 rounded-3xl bg-secondary/60 px-6 py-10 text-center">
          <Star className="size-6 fill-brand text-brand" />
          <p className="max-w-xl text-lg font-bold leading-9">«دکتر رحیمی کاری کرد که دخترم حالا خودش می‌پرسه کی دوباره می‌ریم دندونپزشکی.»</p>
          <p className="text-sm text-muted-foreground">مادر رها، ۶ ساله</p>
        </div>
      </section>
    </Shell>
  );
}
