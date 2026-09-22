"use client";

import * as React from "react";
import { Leaf } from "lucide-react";
import { cn, faNumber } from "@/lib/utils";
import { MENU, Plate, Shell, type Dish } from "./shell";

const TAG_STYLE: Record<NonNullable<Dish["tags"]>[number], string> = {
  محبوب: "bg-brand/15 text-foreground",
  گیاهی: "bg-success/15 text-success",
  تند: "bg-destructive/15 text-destructive",
  جدید: "bg-foreground text-background",
};

/** منوی دسته‌بندی‌شده با نوار دسته‌ی چسبان و فیلتر گیاهی. */
export function MenuPage() {
  const [active, setActive] = React.useState(MENU[0].id);
  const [veg, setVeg] = React.useState(false);

  // Scroll-spy: the category nearest the top of the viewport is highlighted.
  React.useEffect(() => {
    const sections = MENU.map((c) => document.getElementById(`menu-${c.id}`)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        const top = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (top) setActive(top.target.id.replace("menu-", ""));
      },
      { rootMargin: "-140px 0px -60% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [veg]);

  const cats = MENU.map((c) => ({ ...c, dishes: veg ? c.dishes.filter((d) => d.tags?.includes("گیاهی")) : c.dishes })).filter((c) => c.dishes.length);

  return (
    <Shell active="/menu">
      <section className="mx-auto max-w-4xl px-4 pt-14 text-center sm:px-6">
        <p className="text-sm font-semibold text-brand">منوی ناهار و شام</p>
        <h1 className="mt-3 text-4xl font-black sm:text-5xl">منو</h1>
        <p className="mt-4 text-muted-foreground">قیمت‌ها به تومان و با احتساب ارزش افزوده هستن. سرویس پذیرایی جداگانه حساب نمیشه.</p>
      </section>

      <div className="sticky top-20 z-30 mt-10 border-y border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-2 overflow-x-auto px-4 py-3 sm:px-6">
          {cats.map((c) => (
            <a
              key={c.id}
              href={`#menu-${c.id}`}
              aria-current={active === c.id ? "true" : undefined}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm transition-colors",
                active === c.id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {c.title}
            </a>
          ))}
          <button
            type="button"
            aria-pressed={veg}
            onClick={() => setVeg((v) => !v)}
            className={cn(
              "ms-auto inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3 py-2 text-sm transition-colors",
              veg ? "border-success bg-success/15 text-success" : "border-border text-muted-foreground",
            )}
          >
            <Leaf className="size-4" />
            فقط گیاهی
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-16 px-4 py-14 sm:px-6">
        {cats.map((c, ci) => (
          <section key={c.id} id={`menu-${c.id}`} className="scroll-mt-40">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-black">{c.title}</h2>
              <span className="h-px flex-1 bg-border" />
            </div>
            <ul className="mt-6 divide-y divide-dashed divide-border">
              {c.dishes.map((d, i) => (
                <li key={d.name} className="flex items-center gap-5 py-5">
                  <Plate tone={ci + i} className="w-16 shrink-0 sm:w-20" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold">{d.name}</h3>
                      {d.tags?.map((t) => (
                        <span key={t} className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", TAG_STYLE[t])}>
                          {t}
                        </span>
                      ))}
                    </div>
                    <p className="mt-1 text-sm leading-7 text-muted-foreground">{d.desc}</p>
                  </div>
                  <p className="shrink-0 text-end font-bold tabular-nums">
                    {faNumber(d.price)}
                    <span className="block text-xs font-normal text-muted-foreground">تومان</span>
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Shell>
  );
}
