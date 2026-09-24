"use client";

import * as React from "react";
import { SearchX } from "lucide-react";
import { Select } from "@/registry/ui/select";
import { cn, fa } from "@/lib/utils";
import { PRODUCTS, ProductCard, Shell, type Cat, type Roast } from "./shell";

const CATS: ("همه" | Cat)[] = ["همه", "تک‌خاستگاه", "ترکیبی", "دمی"];
const ROASTS: Roast[] = ["روشن", "متوسط", "تیره"];

type Sort = "popular" | "cheap" | "expensive" | "rating";

/** فهرست محصولات با دسته، درجه‌ی برشته‌کاری و مرتب‌سازی. */
export function ShopPage() {
  const [cat, setCat] = React.useState<(typeof CATS)[number]>("همه");
  const [roasts, setRoasts] = React.useState<Roast[]>([]);
  const [sort, setSort] = React.useState<Sort>("popular");

  const list = PRODUCTS.filter((p) => (cat === "همه" || p.cat === cat) && (roasts.length === 0 || roasts.includes(p.roast))).sort((a, b) => {
    if (sort === "cheap") return a.price - b.price;
    if (sort === "expensive") return b.price - a.price;
    if (sort === "rating") return b.rating - a.rating;
    return b.reviews - a.reviews;
  });

  const toggleRoast = (r: Roast) => setRoasts((xs) => (xs.includes(r) ? xs.filter((x) => x !== r) : [...xs, r]));
  const reset = () => {
    setCat("همه");
    setRoasts([]);
  };

  return (
    <Shell active="/shop">
      <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 sm:pt-16">
        <h1 className="text-4xl font-black sm:text-5xl">فروشگاه</h1>
        <p className="mt-3 text-muted-foreground">همه‌ی بسته‌ها ۲۵۰ گرمی هستن و در صفحه‌ی هر قهوه می‌تونید وزن و نوع آسیاب را عوض کنید.</p>

        <div className="mt-10 flex flex-col gap-4 border-y border-border py-4 lg:flex-row lg:items-center lg:justify-between">
          <div role="group" aria-label="دسته" className="flex gap-2 overflow-x-auto">
            {CATS.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={cat === c}
                onClick={() => setCat(c)}
                className={cn(
                  "h-9 shrink-0 cursor-pointer rounded-full px-4 text-sm transition-colors",
                  cat === c ? "bg-foreground text-background" : "bg-secondary text-muted-foreground hover:text-foreground",
                )}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">برشته‌کاری:</span>
            {ROASTS.map((r) => (
              <button
                key={r}
                type="button"
                aria-pressed={roasts.includes(r)}
                onClick={() => toggleRoast(r)}
                className={cn(
                  "h-9 cursor-pointer rounded-full border px-3.5 text-sm transition-colors",
                  roasts.includes(r) ? "border-brand bg-brand/15 text-foreground" : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {r}
              </button>
            ))}
            <div className="ms-auto w-44 lg:ms-3">
              <Select
                aria-label="مرتب‌سازی"
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                options={[
                  { value: "popular", label: "پرفروش‌ترین" },
                  { value: "rating", label: "بیشترین امتیاز" },
                  { value: "cheap", label: "ارزان‌ترین" },
                  { value: "expensive", label: "گران‌ترین" },
                ]}
              />
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
          {fa(list.length)} قهوه
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {list.length ? (
          <ul className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3">
            {list.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center rounded-3xl border border-dashed border-border py-20 text-center">
            <SearchX className="size-8 text-muted-foreground" />
            <p className="mt-4 font-bold">قهوه‌ای با این فیلترها نداریم</p>
            <p className="mt-1 text-sm text-muted-foreground">یک درجه‌ی برشته‌کاری دیگه امتحان کنید.</p>
            <button type="button" onClick={reset} className="mt-5 cursor-pointer text-sm font-semibold underline underline-offset-4">
              پاک کردن فیلترها
            </button>
          </div>
        )}
      </section>
    </Shell>
  );
}
