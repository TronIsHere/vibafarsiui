"use client";

import * as React from "react";
import { Clock, MapPin, Phone } from "lucide-react";
import { SegmentedControl } from "@/registry/ui/segmented-control";
import { GirihBackground } from "@/registry/backgrounds/girih";
import { BRANCHES, Shell, useHref } from "./shell";

/** شعبه‌ها با فیلتر شهر، ساعت کاری و تماس. */
export function ContactPage() {
  const href = useHref();
  const [city, setCity] = React.useState("all");
  const list = city === "all" ? BRANCHES : BRANCHES.filter((b) => b.city === city);

  return (
    <Shell active="/contact">
      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-black sm:text-5xl">شعبه‌ها</h1>
            <p className="mt-3 text-muted-foreground">سه شعبه، یک منو و یک آشپزخانه‌ی مرکزی برای خورش‌ها.</p>
          </div>
          <SegmentedControl
            aria-label="شهر"
            value={city}
            onChange={setCity}
            options={[
              { value: "all", label: "همه" },
              { value: "شیراز", label: "شیراز" },
              { value: "تهران", label: "تهران" },
            ]}
          />
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-4 py-12 sm:px-6 lg:grid-cols-3">
        {list.map((b, i) => (
          <article key={b.name} className="overflow-hidden rounded-[2rem] border border-border">
            <div className="relative h-40 overflow-hidden bg-secondary/60">
              <GirihBackground size={36 + i * 8} className="opacity-70" />
              <span className="absolute bottom-4 start-4 rounded-full bg-background/85 px-3 py-1 text-xs backdrop-blur">{b.city}</span>
            </div>
            <div className="space-y-3 p-6 text-sm">
              <h2 className="text-xl font-black">{b.name}</h2>
              <p className="flex gap-2 leading-7 text-muted-foreground">
                <MapPin className="mt-1.5 size-4 shrink-0 text-brand" />
                {b.address}
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Clock className="size-4 shrink-0 text-brand" />
                {b.hours}
              </p>
              <a href="#" className="flex items-center gap-2 font-semibold">
                <Phone className="size-4 shrink-0 text-brand" />
                <span dir="ltr">{b.phone}</span>
              </a>
              <a href={href("/reserve")} className="mt-3 inline-flex h-10 items-center rounded-full border border-brand px-4 font-semibold text-brand hover:bg-brand hover:text-brand-foreground">
                رزرو میز
              </a>
            </div>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="grid gap-6 rounded-[2rem] bg-foreground p-8 text-background sm:p-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-black">مراسم و مهمانی</h2>
            <p className="mt-3 leading-8 text-background/70">برای تولد، نامزدی یا جلسه‌ی کاری تا ۴۰ نفر، حیاط شعبه‌ی زند را اختصاصی رزرو کنید. منو را با هم می‌چینیم.</p>
          </div>
          <div className="flex items-center md:justify-end">
            <a href="#" className="inline-flex h-12 items-center rounded-full bg-brand px-7 text-sm font-semibold text-brand-foreground">
              تماس با مدیر شعبه
            </a>
          </div>
        </div>
      </section>
    </Shell>
  );
}
