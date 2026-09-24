"use client";

import * as React from "react";
import { Reveal } from "@/registry/animations/reveal";
import { cn, fa } from "@/lib/utils";
import { Cover, PROJECTS, Shell, type Category } from "./shell";

const FILTERS: ("همه" | Category)[] = ["همه", "برند", "وب", "اپ", "محصول"];

/** نمونه‌کارها با فیلتر دسته. */
export function WorkPage() {
  const [filter, setFilter] = React.useState<(typeof FILTERS)[number]>("همه");
  const list = filter === "همه" ? PROJECTS : PROJECTS.filter((p) => p.cat === filter);

  return (
    <Shell active="/work">
      <section className="mx-auto max-w-6xl px-4 pt-16 pb-10 sm:px-6 sm:pt-24">
        <p className="text-sm text-muted-foreground">نمونه‌کارها</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
          {fa(PROJECTS.length)} پروژه که دوستشون داریم
        </h1>
        <div role="group" aria-label="فیلتر دسته" className="mt-10 flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const count = f === "همه" ? PROJECTS.length : PROJECTS.filter((p) => p.cat === f).length;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={cn(
                  "inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm transition-colors",
                  filter === f ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {f}
                <span className={cn("text-xs", filter === f ? "text-background/60" : "text-muted-foreground/70")}>{fa(count)}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <ul className="grid gap-x-5 gap-y-12 sm:grid-cols-2">
          {list.map((p, i) => (
            <li key={p.title} className={cn(i % 3 === 0 && "sm:col-span-2")}>
              <Reveal delay={(i % 2) * 80}>
                <article className="group">
                  <Cover project={p} className={cn("rounded-3xl border border-border", i % 3 === 0 ? "aspect-[16/7]" : "aspect-square")}>
                    <span className="absolute top-4 start-4 rounded-full bg-background/80 px-3 py-1 text-xs font-medium backdrop-blur">{p.cat}</span>
                  </Cover>
                  <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h2 className="text-xl font-bold">{p.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {p.client} · {p.year}
                    </p>
                  </div>
                  <p className="mt-2 text-sm text-brand">{p.metric}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>
    </Shell>
  );
}
