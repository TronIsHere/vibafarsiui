"use client";

import * as React from "react";
import { ShoppingBag, Trash2, Truck } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { Input } from "@/registry/ui/input";
import { NumberField } from "@/registry/ui/number-field";
import { Progress } from "@/registry/ui/progress";
import { faNumber } from "@/lib/utils";
import { Bag, FREE_SHIPPING, GRINDS, PRODUCTS, Shell, WEIGHTS, unitPrice, useCart, useHref } from "./shell";

const SHIPPING = 85_000;
const CODES: Record<string, number> = { RAST10: 0.1 };

/** سبد خرید با تعداد، ارسال رایگان، کد تخفیف و خلاصه‌ی سفارش. */
export function CartPage() {
  const href = useHref();
  const { lines, setQty, remove, clear } = useCart();
  const [code, setCode] = React.useState("");
  const [applied, setApplied] = React.useState<string | null>(null);
  const [codeError, setCodeError] = React.useState("");
  const [placed, setPlaced] = React.useState(false);

  const rows = lines
    .map((l) => {
      const p = PRODUCTS.find((x) => x.id === l.id);
      return p ? { line: l, product: p, unit: unitPrice(p, l.weight) } : null;
    })
    .filter((r) => r !== null);

  const subtotal = rows.reduce((n, r) => n + r.unit * r.line.qty, 0);
  const discount = applied ? Math.round((subtotal * CODES[applied]) / 1000) * 1000 : 0;
  const shipping = subtotal - discount >= FREE_SHIPPING || subtotal === 0 ? 0 : SHIPPING;
  const total = subtotal - discount + shipping;
  const toFree = Math.max(0, FREE_SHIPPING - (subtotal - discount));

  function apply(e: React.FormEvent) {
    e.preventDefault();
    const c = code.trim().toUpperCase();
    if (CODES[c]) {
      setApplied(c);
      setCodeError("");
    } else {
      setCodeError("این کد معتبر نیست.");
    }
  }

  if (placed) {
    return (
      <Shell active="/cart">
        <section className="mx-auto max-w-lg px-4 py-24 text-center" role="status">
          <h1 className="text-3xl font-black">سفارشتون ثبت شد</h1>
          <p className="mt-3 leading-8 text-muted-foreground">کد پیگیری و لینک پرداخت براتون پیامک شد. قهوه‌ها در برشته‌کاری بعدی آماده میشن.</p>
          <a href={href("/shop")} className="mt-8 inline-flex h-12 items-center rounded-full bg-foreground px-7 text-sm font-semibold text-background">
            برگشت به فروشگاه
          </a>
        </section>
      </Shell>
    );
  }

  return (
    <Shell active="/cart">
      <section className="mx-auto max-w-6xl px-4 pt-12 pb-16 sm:px-6">
        <h1 className="text-4xl font-black">سبد خرید</h1>

        {rows.length === 0 ? (
          <div className="mt-10 flex flex-col items-center rounded-3xl border border-dashed border-border py-20 text-center">
            <ShoppingBag className="size-9 text-muted-foreground" />
            <p className="mt-4 text-lg font-bold">سبدتون خالیه</p>
            <p className="mt-1 text-sm text-muted-foreground">یک قهوه انتخاب کنید، بقیه‌اش با ما.</p>
            <a href={href("/shop")} className="mt-6 inline-flex h-11 items-center rounded-full bg-foreground px-6 text-sm font-semibold text-background">
              رفتن به فروشگاه
            </a>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem]">
            <div>
              <div className="rounded-2xl border border-border p-4">
                <p className="flex items-center gap-2 text-sm">
                  <Truck className="size-4 text-brand" />
                  {toFree > 0 ? <>فقط {faNumber(toFree)} تومان تا ارسال رایگان مونده</> : <>ارسالتون رایگان شد</>}
                </p>
                <Progress value={Math.min(100, ((subtotal - discount) / FREE_SHIPPING) * 100)} className="mt-3" />
              </div>
              <ul className="mt-6 divide-y divide-border border-y border-border">
                {rows.map(({ line, product, unit }) => (
                  <li key={`${line.id}-${line.weight}-${line.grind}`} className="flex gap-4 py-5">
                    <div className="grid w-24 shrink-0 place-items-center rounded-2xl bg-secondary/60 p-3 sm:w-28">
                      <Bag product={product} className="w-3/4" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <a href={href("/product")} className="font-bold hover:underline">
                            {product.name}
                          </a>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {WEIGHTS.find((w) => w.value === line.weight)?.label} · آسیاب {GRINDS.find((g) => g.value === line.grind)?.label}
                          </p>
                        </div>
                        <button type="button" onClick={() => remove(line)} aria-label={`حذف ${product.name}`} className="grid size-9 cursor-pointer place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-destructive">
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-end justify-between gap-3 pt-3">
                        <NumberField aria-label="تعداد" value={line.qty} onChange={(q) => setQty(line, q)} min={1} max={10} />
                        <p className="font-bold tabular-nums">
                          {faNumber(unit * line.qty)} <span className="text-xs font-normal text-muted-foreground">تومان</span>
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <button type="button" onClick={clear} className="mt-4 cursor-pointer text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">
                خالی کردن سبد
              </button>
            </div>

            <aside className="h-fit rounded-3xl border border-border bg-card p-6 lg:sticky lg:top-24">
              <h2 className="font-bold">خلاصه‌ی سفارش</h2>
              <form onSubmit={apply} className="mt-5 flex gap-2">
                <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="کد تخفیف" aria-label="کد تخفیف" dir="ltr" className="uppercase" />
                <Button type="submit" variant="secondary">
                  اعمال
                </Button>
              </form>
              {codeError && <p className="mt-2 text-xs text-destructive">{codeError}</p>}
              {!applied && !codeError && <p className="mt-2 text-xs text-muted-foreground">برای امتحان: RAST10</p>}
              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">جمع کالاها</dt>
                  <dd className="tabular-nums">{faNumber(subtotal)} تومان</dd>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-success">
                    <dt>تخفیف {applied}</dt>
                    <dd className="tabular-nums">−{faNumber(discount)} تومان</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">ارسال</dt>
                  <dd className="tabular-nums">{shipping ? `${faNumber(shipping)} تومان` : "رایگان"}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-3 text-base font-bold">
                  <dt>قابل پرداخت</dt>
                  <dd className="tabular-nums">{faNumber(total)} تومان</dd>
                </div>
              </dl>
              <Button size="lg" className="mt-6 w-full rounded-full" onClick={() => { clear(); setPlaced(true); }}>
                ادامه و پرداخت
              </Button>
            </aside>
          </div>
        )}
      </section>
    </Shell>
  );
}
