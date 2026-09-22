"use client";

import { BedDouble, Check, Maximize, Users } from "lucide-react";
import { Reveal } from "@/registry/animations/reveal";
import { fa, faNumber } from "@/lib/utils";
import { Photo, ROOMS, Shell, useHref } from "./shell";

/** اتاق‌ها با گالری کوچک، ظرفیت، متراژ، امکانات و قیمت هر شب. */
export function RoomsPage() {
  const href = useHref();
  return (
    <Shell active="/rooms">
      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 sm:pt-20">
        <h1 className="text-4xl font-black sm:text-5xl">اتاق‌ها</h1>
        <p className="mt-4 max-w-2xl leading-8 text-muted-foreground">
          هفت اتاق دور یک حیاط، هر کدوم با اسم و حال‌وهوای خودش. همه‌ی اتاق‌ها حمام اختصاصی و صبحانه‌ی محلی دارن.
        </p>
      </section>

      <section className="mx-auto max-w-6xl space-y-16 px-4 py-14 sm:px-6">
        {ROOMS.map((r, i) => (
          <Reveal key={r.id}>
            <article className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
              <div className={i % 2 ? "lg:order-2" : undefined}>
                <div className="aspect-[16/10] overflow-hidden rounded-[2rem] border border-border">
                  <Photo name={r.photo} alt={r.name} eager={i === 0} />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {["hero", "room-hoz", "stars", "camel"]
                    .filter((n) => n !== r.photo)
                    .slice(0, 3)
                    .map((n) => (
                      <div key={n} className="aspect-[4/3] overflow-hidden rounded-2xl border border-border">
                        <Photo name={n} alt="" />
                      </div>
                    ))}
                </div>
              </div>
              <div className="flex flex-col">
                <p className="text-sm text-brand">{fa(`0${i + 1}`)}</p>
                <h2 className="mt-2 text-3xl font-black">{r.name}</h2>
                <p className="mt-4 leading-8 text-muted-foreground">{r.desc}</p>
                <dl className="mt-6 grid grid-cols-3 gap-3 text-sm">
                  {[
                    { i: Users, l: "ظرفیت", v: `${fa(r.guests)} نفر` },
                    { i: Maximize, l: "متراژ", v: `${fa(r.meters)} متر` },
                    { i: BedDouble, l: "تخت", v: r.beds },
                  ].map((x) => (
                    <div key={x.l} className="rounded-2xl bg-secondary/60 p-3">
                      <x.i className="size-4 text-brand" />
                      <dt className="mt-2 text-xs text-muted-foreground">{x.l}</dt>
                      <dd className="mt-0.5 text-xs font-semibold leading-5">{x.v}</dd>
                    </div>
                  ))}
                </dl>
                <ul className="mt-6 grid grid-cols-2 gap-2 text-sm">
                  {r.amenities.map((a) => (
                    <li key={a} className="flex items-center gap-2">
                      <Check className="size-4 text-success" />
                      {a}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex items-end justify-between gap-4 border-t border-border pt-6">
                  <p>
                    <span className="text-2xl font-black tabular-nums">{faNumber(r.price)}</span>
                    <span className="text-sm text-muted-foreground"> تومان هر شب</span>
                  </p>
                  <a href={href("/book")} className="inline-flex h-11 items-center rounded-full bg-foreground px-6 text-sm font-semibold text-background">
                    رزرو این اتاق
                  </a>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </section>
    </Shell>
  );
}
