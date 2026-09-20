"use client";

import * as React from "react";
import { Minus, Plus, Search, Trash2 } from "lucide-react";
import { AmountInput } from "@/registry/ui/amount-input";
import { Badge } from "@/registry/ui/badge";
import { Button } from "@/registry/ui/button";
import { Field, Input } from "@/registry/ui/input";
import { SearchInput } from "@/registry/ui/search-input";
import { SegmentedControl } from "@/registry/ui/segmented-control";
import { cn, fa, formatToman } from "@/lib/utils";

type Product = { id: string; name: string; sku: string; price: number; unit: string };
type Line = Product & { qty: number };

const catalog: Product[] = [
  { id: "1", name: "قهوه ترک ۲۵۰ گرم", sku: "CF-250", price: 285_000, unit: "بسته" },
  { id: "2", name: "چای ممتاز ۵۰۰ گرم", sku: "TE-500", price: 420_000, unit: "بسته" },
  { id: "3", name: "شیر پرچرب ۱ لیتر", sku: "ML-1L", price: 68_000, unit: "عدد" },
  { id: "4", name: "نان سنگک تازه", sku: "BR-01", price: 25_000, unit: "عدد" },
  { id: "5", name: "ماست چکیده ۹۰۰ گرم", sku: "YG-900", price: 95_000, unit: "سطل" },
  { id: "6", name: "آب معدنی ۱٫۵ لیتر", sku: "WT-15", price: 18_000, unit: "عدد" },
  { id: "7", name: "روغن آفتابگردان", sku: "OL-9", price: 310_000, unit: "بطری" },
  { id: "8", name: "شکر سفید ۱ کیلو", sku: "SG-1K", price: 72_000, unit: "بسته" },
];

/** صندوق فروش: کاتالوگ، سبد سریع، تخفیف تومانی، روش پرداخت و صدور رسید. */
export function PosPage() {
  const [q, setQ] = React.useState("");
  const [cart, setCart] = React.useState<Line[]>([]);
  const [pay, setPay] = React.useState("card");
  const [discount, setDiscount] = React.useState<number | null>(null);
  const [done, setDone] = React.useState(false);

  const filtered = catalog.filter((p) => !q || p.name.includes(q) || p.sku.toLowerCase().includes(q.toLowerCase()));
  const subtotal = cart.reduce((s, l) => s + l.price * l.qty, 0);
  const off = Math.min(discount ?? 0, subtotal);
  const total = subtotal - off;

  function add(p: Product) {
    setDone(false);
    setCart((c) => {
      const i = c.findIndex((l) => l.id === p.id);
      if (i >= 0) return c.map((l, idx) => (idx === i ? { ...l, qty: l.qty + 1 } : l));
      return [...c, { ...p, qty: 1 }];
    });
  }

  function setQty(id: string, qty: number) {
    setCart((c) => (qty <= 0 ? c.filter((l) => l.id !== id) : c.map((l) => (l.id === id ? { ...l, qty } : l))));
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="flex h-14 items-center gap-3 border-b border-border px-4">
        <p className="font-bold">صندوق فروشگاه روز</p>
        <Badge variant="secondary" className="ms-1">صندوق ۱</Badge>
        <p className="ms-auto text-xs text-muted-foreground">اپراتور: مینا · شیفت صبح</p>
      </header>

      <div className="mx-auto grid max-w-6xl gap-4 p-4 lg:grid-cols-5">
        <section className="lg:col-span-3">
          <SearchInput value={q} onChange={setQ} placeholder="جست‌وجو با نام یا کد کالا…" shortcut="/" className="mb-4" />
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {filtered.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => add(p)}
                  className="flex h-full w-full cursor-pointer flex-col rounded-2xl border border-border bg-card p-4 text-start transition-colors hover:bg-accent/50 active:scale-[0.98]"
                >
                  <span className="font-mono text-[11px] text-muted-foreground" dir="ltr">{p.sku}</span>
                  <span className="mt-1 flex-1 text-sm font-medium leading-6">{p.name}</span>
                  <span className="mt-3 text-sm font-bold tabular-nums">{formatToman(p.price)}</span>
                  <span className="text-[11px] text-muted-foreground">/{p.unit}</span>
                </button>
              </li>
            ))}
          </ul>
          {filtered.length === 0 && (
            <p className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border p-10 text-sm text-muted-foreground">
              <Search className="size-4" />کالایی پیدا نشد
            </p>
          )}
        </section>

        <aside className="flex h-fit flex-col rounded-2xl border border-border bg-card lg:sticky lg:top-4 lg:col-span-2">
          <div className="border-b border-border px-4 py-3">
            <h2 className="font-semibold">سبد فروش</h2>
            <p className="text-xs text-muted-foreground">{fa(cart.reduce((s, l) => s + l.qty, 0))} قلم</p>
          </div>

          <ul className="max-h-72 divide-y divide-border overflow-auto">
            {cart.length === 0 && (
              <li className="px-4 py-10 text-center text-sm text-muted-foreground">کالایی انتخاب نشده. از سمت راست اضافه کنید.</li>
            )}
            {cart.map((l) => (
              <li key={l.id} className="flex items-center gap-2 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{l.name}</p>
                  <p className="text-xs tabular-nums text-muted-foreground">{formatToman(l.price)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon" className="size-8" aria-label="کم" onClick={() => setQty(l.id, l.qty - 1)}><Minus /></Button>
                  <span className="w-8 text-center text-sm tabular-nums">{fa(l.qty)}</span>
                  <Button variant="outline" size="icon" className="size-8" aria-label="زیاد" onClick={() => setQty(l.id, l.qty + 1)}><Plus /></Button>
                </div>
                <button type="button" aria-label="حذف" className="cursor-pointer text-muted-foreground hover:text-destructive" onClick={() => setQty(l.id, 0)}>
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>

          <div className="space-y-4 border-t border-border p-4">
            <Field label="تخفیف">
              <AmountInput value={discount} onChange={setDiscount} max={subtotal || undefined} words={false} quick={[10_000, 50_000, 100_000]} />
            </Field>
            <div>
              <p className="mb-2 text-sm font-medium">روش پرداخت</p>
              <SegmentedControl
                fullWidth
                aria-label="روش پرداخت"
                value={pay}
                onChange={setPay}
                options={[
                  { value: "card", label: "کارت" },
                  { value: "cash", label: "نقد" },
                  { value: "wallet", label: "کیف پول" },
                ]}
              />
            </div>
            {pay === "cash" && (
              <Field label="مبلغ دریافتی از مشتری" htmlFor="cash">
                <Input id="cash" inputMode="numeric" placeholder={fa(total)} dir="ltr" />
              </Field>
            )}
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">جمع جزء</dt><dd className="tabular-nums">{formatToman(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">تخفیف</dt><dd className="tabular-nums">{formatToman(off)}</dd></div>
              <div className="flex justify-between border-t border-border pt-2 text-base font-bold"><dt>قابل پرداخت</dt><dd className="tabular-nums">{formatToman(total)}</dd></div>
            </dl>
            <Button
              className="w-full"
              size="lg"
              disabled={cart.length === 0}
              onClick={() => { setDone(true); setCart([]); setDiscount(null); }}
            >
              ثبت فروش و چاپ رسید
            </Button>
            {done && (
              <p className={cn("rounded-lg bg-success/15 px-3 py-2 text-center text-sm text-success")}>
                فروش ثبت شد. رسید به پرینتر صندوق ارسال شد.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
