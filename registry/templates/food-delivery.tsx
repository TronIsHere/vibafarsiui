"use client";

import * as React from "react";
import { Bike, ChevronDown, Clock, MapPin, Minus, Plus, Search, ShoppingBag, Star, Tag } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { Badge } from "@/registry/ui/badge";
import { Price } from "@/registry/ui/price";
import { Rating } from "@/registry/ui/rating";
import { Input } from "@/registry/ui/input";
import { Sheet } from "@/registry/ui/sheet";
import { cn, fa, faNumber, formatToman } from "@/lib/utils";

type Item = { id: string; name: string; desc: string; price: number; original?: number; cat: string; hot?: boolean; tone: string };
const cats = ["پرفروش‌ها", "کباب", "خورشت", "پیش‌غذا", "نوشیدنی"];
const menu: Item[] = [
  { id: "1", name: "چلوکباب کوبیده", desc: "دو سیخ کوبیده‌ی گوسفندی، برنج ایرانی، گوجه‌ی کبابی و کره", price: 285_000, cat: "کباب", hot: true, tone: "from-orange-950/40" },
  { id: "2", name: "جوجه کباب زعفرانی", desc: "سینه‌ی مرغ مزه‌دارشده با زعفران، برنج و گوجه", price: 245_000, original: 275_000, cat: "کباب", hot: true, tone: "from-amber-950/40" },
  { id: "3", name: "قورمه‌سبزی", desc: "با گوشت گوسفندی و لیمو عمانی، همراه برنج", price: 195_000, cat: "خورشت", tone: "from-green-950/40" },
  { id: "4", name: "قیمه بادمجان", desc: "لپه، گوشت و بادمجان سرخ‌شده، همراه برنج", price: 185_000, cat: "خورشت", tone: "from-yellow-950/40" },
  { id: "5", name: "ماست و خیار", desc: "ماست محلی با خیار، نعناع و گردو", price: 45_000, cat: "پیش‌غذا", tone: "from-emerald-950/40" },
  { id: "6", name: "سوپ جو", desc: "کاسه‌ی بزرگ، با مرغ و هویج", price: 65_000, cat: "پیش‌غذا", tone: "from-stone-800/40" },
  { id: "7", name: "دوغ محلی", desc: "بطری یک لیتری، با نعناع", price: 35_000, cat: "نوشیدنی", tone: "from-sky-950/40" },
  { id: "8", name: "نوشابه قوطی", desc: "کوکاکولا یا فانتا", price: 25_000, cat: "نوشیدنی", tone: "from-red-950/40" },
];
const DELIVERY = 35_000, PACK = 12_000;

function Qty({ n, onChange }: { n: number; onChange: (n: number) => void }) {
  if (n === 0) return <Button size="sm" variant="outline" onClick={() => onChange(1)}><Plus />افزودن</Button>;
  return (
    <div className="inline-flex h-8 items-center rounded-md border border-border" role="group" aria-label="تعداد">
      <button type="button" aria-label="افزایش" onClick={() => onChange(n + 1)} className="flex size-8 cursor-pointer items-center justify-center hover:bg-accent"><Plus className="size-3.5" /></button>
      <span className="w-6 text-center text-sm font-semibold tabular-nums">{fa(n)}</span>
      <button type="button" aria-label="کاهش" onClick={() => onChange(n - 1)} className="flex size-8 cursor-pointer items-center justify-center hover:bg-accent"><Minus className="size-3.5" /></button>
    </div>
  );
}

/** سفارش غذا: منوی رستوران با دسته‌ها، افزودن به سبد، سبد چسبان و کشوی پایین در موبایل. */
export function FoodDelivery() {
  const [cart, setCart] = React.useState<Record<string, number>>({ "1": 1, "7": 2 });
  const [cat, setCat] = React.useState(cats[0]);
  const [open, setOpen] = React.useState(false);
  const set = (id: string, n: number) => setCart((c) => { const next = { ...c }; if (n <= 0) delete next[id]; else next[id] = n; return next; });
  const lines = Object.entries(cart).map(([id, n]) => ({ item: menu.find((m) => m.id === id)!, n }));
  const count = lines.reduce((s, l) => s + l.n, 0);
  const subtotal = lines.reduce((s, l) => s + l.item.price * l.n, 0);
  const total = subtotal + (subtotal ? DELIVERY + PACK : 0);
  const shown = cat === "پرفروش‌ها" ? menu.filter((m) => m.hot) : menu.filter((m) => m.cat === cat);

  const summary = (
    <div className="space-y-4">
      {lines.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">سبد خالی است. از منو چیزی انتخاب کنید.</p> : (
        <ul className="divide-y divide-border">
          {lines.map(({ item, n }) => (
            <li key={item.id} className="flex items-center gap-3 py-3">
              <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{item.name}</p><p className="text-xs text-muted-foreground">{formatToman(item.price)}</p></div>
              <Qty n={n} onChange={(v) => set(item.id, v)} />
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2"><Input placeholder="کد تخفیف" startAddon={<Tag className="size-4" />} className="h-9" /><Button size="sm" variant="outline">اعمال</Button></div>
      <dl className="space-y-1.5 text-sm">
        <div className="flex justify-between"><dt className="text-muted-foreground">جمع سفارش</dt><dd className="tabular-nums">{faNumber(subtotal)}</dd></div>
        <div className="flex justify-between"><dt className="text-muted-foreground">هزینه‌ی ارسال</dt><dd className="tabular-nums">{faNumber(subtotal ? DELIVERY : 0)}</dd></div>
        <div className="flex justify-between"><dt className="text-muted-foreground">بسته‌بندی</dt><dd className="tabular-nums">{faNumber(subtotal ? PACK : 0)}</dd></div>
        <div className="flex justify-between border-t border-border pt-2 font-semibold"><dt>قابل پرداخت</dt><dd>{formatToman(total)}</dd></div>
      </dl>
      <Button className="w-full" size="lg" disabled={!lines.length}>ادامه و پرداخت</Button>
    </div>
  );

  return (
    <div className="min-h-dvh bg-background pb-24 text-foreground lg:pb-0">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
          <button type="button" className="flex min-w-0 cursor-pointer items-center gap-1.5 text-sm"><MapPin className="size-4 shrink-0 text-brand" /><span className="truncate">تهران، سعادت‌آباد، بلوار دریا</span><ChevronDown className="size-3.5 text-muted-foreground" /></button>
          <div className="ms-auto hidden w-64 sm:block"><Input placeholder="جست‌وجو در منو…" startAddon={<Search className="size-4" />} className="h-9" /></div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4">
        <section className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="h-32 bg-gradient-to-l from-orange-950/50 via-card to-card" />
          <div className="-mt-8 flex flex-wrap items-end gap-4 px-5 pb-5">
            <span className="flex size-16 items-center justify-center rounded-2xl border border-border bg-background text-2xl font-black shadow-md">ح</span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2"><h1 className="text-xl font-bold">کبابی حاج‌محمود</h1><Badge variant="success" className="rounded-full border border-success/30 px-2 text-[11px]">باز است</Badge></div>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Star className="size-3.5 fill-warning text-warning" />{fa(4.7).replace(".", "٫")} ({faNumber(1_240)} نظر)</span>
                <span className="flex items-center gap-1"><Clock className="size-3.5" />۳۵ تا ۴۵ دقیقه</span>
                <span className="flex items-center gap-1"><Bike className="size-3.5" />ارسال {formatToman(DELIVERY)}</span>
                <span>حداقل سفارش {formatToman(100_000)}</span>
              </div>
            </div>
            <Rating value={5} readOnly size="sm" className="hidden sm:inline-flex" />
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="sticky top-14 z-20 -mx-4 flex gap-2 overflow-x-auto bg-background px-4 py-3 [scrollbar-width:none]">
              {cats.map((c) => <button key={c} type="button" onClick={() => setCat(c)} className={cn("shrink-0 cursor-pointer rounded-full border px-3.5 py-1.5 text-sm transition-colors", c === cat ? "border-foreground bg-foreground text-background" : "border-border hover:bg-accent")}>{c}</button>)}
            </div>
            <h2 className="mb-3 mt-2 text-lg font-bold">{cat}</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {shown.map((m) => (
                <li key={m.id} className="flex gap-3 rounded-2xl border border-border bg-card p-3">
                  <div className={cn("size-24 shrink-0 rounded-xl bg-gradient-to-br to-secondary", m.tone)} aria-hidden />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2"><h3 className="text-sm font-semibold">{m.name}</h3>{m.hot && <Badge variant="brand" className="text-[11px]">پرفروش</Badge>}</div>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{m.desc}</p>
                    <div className="mt-auto flex items-end justify-between pt-2"><Price amount={m.price} original={m.original} size="sm" /><Qty n={cart[m.id] ?? 0} onChange={(v) => set(m.id, v)} /></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <aside className="hidden lg:block"><div className="sticky top-20 rounded-2xl border border-border bg-card p-5"><h2 className="mb-2 flex items-center gap-2 text-sm font-semibold"><ShoppingBag className="size-4" />سبد شما {count > 0 && <span className="text-muted-foreground">({fa(count)} قلم)</span>}</h2>{summary}</div></aside>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/90 p-3 backdrop-blur lg:hidden">
        <Button className="w-full justify-between" size="lg" onClick={() => setOpen(true)} disabled={!count}><span className="flex items-center gap-2"><ShoppingBag />مشاهده‌ی سبد{count > 0 && <span className="rounded-full bg-background/20 px-2 text-xs">{fa(count)}</span>}</span><span>{formatToman(total)}</span></Button>
      </div>
      <Sheet open={open} onOpenChange={setOpen} side="bottom" title={`سبد شما · ${fa(count)} قلم`}><div className="p-4">{summary}</div></Sheet>
    </div>
  );
}
