"use client";

import * as React from "react";
import { Clock, Gauge, Users } from "lucide-react";
import { Reveal } from "@/registry/animations/reveal";
import { cn, faNumber } from "@/lib/utils";
import { EXPERIENCES, Photo, Shell, useHref } from "./shell";

const LEVELS = ["همه", "آسان", "متوسط", "سخت"] as const;
const LEVEL_STYLE: Record<string, string> = { آسان: "text-success", متوسط: "text-warning", سخت: "text-destructive" };

/** تجربه‌ها و تورها با فیلتر سختی. */
export function ExperiencesPage() {
  const href = useHref();
  const [level, setLevel] = React.useState<(typeof LEVELS)[number]>("همه");
  const list = level === "همه" ? EXPERIENCES : EXPERIENCES.filter((x) => x.level === level);

  return (
    <Shell active="/experiences">
      <section className="relative isolate overflow-hidden border-b border-border">
        <Photo name="stars" alt="" eager className="absolute inset-0 -z-20" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/60 to-background/20" />
        <div className="mx-auto max-w-6xl px-4 pt-24 pb-28 sm:px-6">
          <h1 className="text-4xl font-black sm:text-6xl">تجربه‌ها</h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-foreground/75">کویر را فقط از پشت پنجره نبینید. همه‌ی تورها با راهنمای محلی و از خود اقامتگاه شروع میشن.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div role="group" aria-label="سختی" className="flex flex-wrap gap-2">
          {LEVELS.map((l) => (
            <button
              key={l}
              type="button"
              aria-pressed={level === l}
              onClick={() => setLevel(l)}
              className={cn(
                "h-10 cursor-pointer rounded-full border px-5 text-sm transition-colors",
                level === l ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {l}
            </button>
          ))}
        </div>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((x, i) => (
            <li key={x.id}>
              <Reveal delay={(i % 3) * 70} className="h-full">
                <article className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-border">
                  <div className="h-48 overflow-hidden">
                    <Photo name={x.photo} alt={x.title} className="transition-transform duration-700 hover:scale-[1.04]" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="text-lg font-bold">{x.title}</h2>
                    <p className="mt-2 flex-1 text-sm leading-7 text-muted-foreground">{x.desc}</p>
                    <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <li className="flex items-center gap-1">
                        <Clock className="size-3.5" />
                        {x.hours}
                      </li>
                      <li className="flex items-center gap-1">
                        <Users className="size-3.5" />
                        {x.group}
                      </li>
                      <li className={cn("flex items-center gap-1", LEVEL_STYLE[x.level])}>
                        <Gauge className="size-3.5" />
                        {x.level}
                      </li>
                    </ul>
                    <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                      <p className="text-sm">
                        <span className="font-bold">{faNumber(x.price)}</span> <span className="text-muted-foreground">تومان هر نفر</span>
                      </p>
                      <a href={href("/book")} className="text-sm font-semibold text-brand">
                        اضافه به رزرو
                      </a>
                    </div>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>
    </Shell>
  );
}
