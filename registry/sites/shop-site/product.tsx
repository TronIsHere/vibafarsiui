"use client";

import * as React from "react";
import { Check, Mountain, Package, Sprout, Truck } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { Price } from "@/registry/ui/price";
import { Rating } from "@/registry/ui/rating";
import { SegmentedControl } from "@/registry/ui/segmented-control";
import { RadioGroup } from "@/registry/ui/radio-group";
import { NumberField } from "@/registry/ui/number-field";
import { cn, fa, faNumber } from "@/lib/utils";
import { Bag, GRINDS, PRODUCTS, Photo, ProductCard, Shell, WEIGHTS, faDecimal, unitPrice, useCart, useHref } from "./shell";

// A single product page. In a real shop, move it to app/product/[id]/page.tsx and look the product up by id.
const PRODUCT = PRODUCTS[0];

const SPECS = [
  { i: Mountain, l: "ارتفاع", v: "۱۹۰۰ تا ۲۲۰۰ متر" },
  { i: Sprout, l: "واریته", v: "هیرلوم اتیوپی" },
  { i: Package, l: "فرآوری", v: "شسته" },
];

/** صفحه‌ی محصول با وزن، آسیاب، تعداد و افزودن به سبد. */
export function ProductPage() {
  const href = useHref();
  const [weight, setWeight] = React.useState("250");
  const [grind, setGrind] = React.useState("bean");
  const [qty, setQty] = React.useState(1);
  const [view, setView] = React.useState(0);
  const [added, setAdded] = React.useState(false);
  const { add } = useCart();

  const price = unitPrice(PRODUCT, weight);
  // Gallery: the packshot photo, the drawn bag in another colourway, and a brewing photo.
  const shot = (i: number, thumb?: boolean) =>
    i === 0 ? (
      <Photo name="product" alt={thumb ? "" : `بسته‌ی ${PRODUCT.name}`} eager={!thumb} />
    ) : i === 1 ? (
      <div className="grid size-full place-items-center">
        <Bag product={{ ...PRODUCT, tone: 2 }} className={thumb ? "w-1/3" : "w-1/2"} />
      </div>
    ) : (
      <Photo name="pour" alt={thumb ? "" : "دم کردن با قهوه‌ساز دمی"} />
    );

  return (
    <Shell active="/product">
      <nav aria-label="مسیر" className="mx-auto max-w-6xl px-4 pt-8 text-sm text-muted-foreground sm:px-6">
        <a href={href("/")} className="hover:text-foreground">
          خانه
        </a>
        <span className="mx-2">/</span>
        <a href={href("/shop")} className="hover:text-foreground">
          فروشگاه
        </a>
        <span className="mx-2">/</span>
        <span className="text-foreground">{PRODUCT.name}</span>
      </nav>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div>
          <div className="relative grid aspect-square place-items-center overflow-hidden rounded-[2rem] bg-secondary/60">
            <div aria-hidden className="absolute size-3/4 rounded-full bg-brand/15 blur-2xl" />
            <div className="absolute inset-0">{shot(view)}</div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                type="button"
                aria-label={`نمای ${fa(i + 1)}`}
                aria-pressed={view === i}
                onClick={() => setView(i)}
                className={cn("relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl bg-secondary/60 transition", view === i ? "ring-2 ring-foreground" : "opacity-70 hover:opacity-100")}
              >
                <span className="absolute inset-0">{shot(i, true)}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">{PRODUCT.origin}</p>
          <h1 className="mt-2 text-4xl font-black">{PRODUCT.name}</h1>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <Rating value={PRODUCT.rating} readOnly size="sm" />
            <span className="font-semibold">{faDecimal(PRODUCT.rating)}</span>
            <span className="text-muted-foreground">({faNumber(PRODUCT.reviews)} نظر)</span>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {PRODUCT.notes.map((n) => (
              <span key={n} className="rounded-full bg-brand/15 px-3 py-1 text-sm">
                {n}
              </span>
            ))}
          </div>
          <p className="mt-6 leading-8 text-muted-foreground">
            قهوه‌ای روشن و گلی از منطقه‌ی گدئو. برای دمی و فرانسه عالیه و اگر اسپرسوی میوه‌ای دوست دارید، روی دستگاه هم خوش‌طعمه.
          </p>

          <div className="mt-8 space-y-6 border-t border-border pt-8">
            <div>
              <p className="mb-2 text-sm font-medium">وزن</p>
              <SegmentedControl aria-label="وزن" options={WEIGHTS.map(({ value, label }) => ({ value, label }))} value={weight} onChange={(v) => { setWeight(v); setAdded(false); }} fullWidth />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">آسیاب</p>
              <RadioGroup name="grind" variant="cards" options={GRINDS} value={grind} onChange={(v) => { setGrind(v); setAdded(false); }} />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-secondary/50 p-4">
              <Price amount={price * qty} size="md" />
              <div className="flex items-center gap-3">
                <NumberField aria-label="تعداد" value={qty} onChange={(v) => { setQty(v); setAdded(false); }} min={1} max={10} />
                <Button
                  size="lg"
                  onClick={() => {
                    add({ id: PRODUCT.id, weight, grind, qty });
                    setAdded(true);
                  }}
                  className={cn("min-w-36 rounded-full", added && "bg-success text-background hover:bg-success")}
                >
                  {added ? (
                    <>
                      <Check />
                      در سبد
                    </>
                  ) : (
                    "افزودن به سبد"
                  )}
                </Button>
              </div>
            </div>
            {added && (
              <p role="status" className="text-sm">
                به سبد اضافه شد.{" "}
                <a href={href("/cart")} className="font-semibold underline underline-offset-4">
                  دیدن سبد
                </a>
              </p>
            )}
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="size-4" />
              سفارش تا ساعت ۱۴ امروز، همین امروز ارسال میشه.
            </p>
          </div>

          <dl className="mt-8 grid grid-cols-3 gap-3">
            {SPECS.map((s) => (
              <div key={s.l} className="rounded-2xl border border-border p-4">
                <s.i className="size-4 text-brand" />
                <dt className="mt-3 text-xs text-muted-foreground">{s.l}</dt>
                <dd className="mt-0.5 text-sm font-semibold">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="mb-8 text-2xl font-black">شاید اینا را هم دوست داشته باشید</h2>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
          {PRODUCTS.slice(1, 5).map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </section>
    </Shell>
  );
}
