"use client";

import * as React from "react";
import { Check, Menu, Plus, ShoppingBag, Star, Truck } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { Sheet } from "@/registry/ui/sheet";
import { Price } from "@/registry/ui/price";
import { cn, fa } from "@/lib/utils";

const BaseContext = React.createContext("");

/** Mounts the site under a path prefix, e.g. the docs preview at /preview/site/shop-site. Your app doesn't need it. */
export function SiteBase({ base, children }: { base: string; children: React.ReactNode }) {
  return <BaseContext value={base}>{children}</BaseContext>;
}

/** Internal links: href("/shop") is "/shop" in your app and gets the base prefix inside the preview. */
export function useHref() {
  const base = React.useContext(BaseContext);
  return React.useCallback((to: string) => (to === "/" ? base || "/" : `${base}${to}`), [base]);
}

/** Photos ship in public/sites/shop-site/. Replace the files with your own and keep the names, or change them here. */
export function Photo({ name, alt, className, eager }: { name: string; alt: string; className?: string; eager?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- a plain <img> keeps the site framework-agnostic
    <img src={`/sites/shop-site/${name}.webp`} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" className={cn("block size-full object-cover", className)} />
  );
}

export const NAV = [
  { href: "/shop", label: "فروشگاه" },
  { href: "/product", label: "پیشنهاد این هفته" },
  { href: "/about", label: "داستان ما" },
];

export type Roast = "روشن" | "متوسط" | "تیره";
export type Cat = "تک‌خاستگاه" | "ترکیبی" | "دمی";

export type Product = {
  id: string;
  name: string;
  origin: string;
  cat: Cat;
  roast: Roast;
  notes: string[];
  /** Price of a 250g bag in toman. */
  price: number;
  original?: number;
  rating: number;
  reviews: number;
  tone: number;
};

export const PRODUCTS: Product[] = [
  { id: "yirgacheffe", name: "اتیوپی یرگاچف", origin: "اتیوپی · ۲۰۰۰ متر", cat: "تک‌خاستگاه", roast: "روشن", notes: ["یاس", "لیمو", "چای سیاه"], price: 890_000, rating: 4.9, reviews: 214, tone: 0 },
  { id: "huila", name: "کلمبیا هویلا", origin: "کلمبیا · ۱۷۰۰ متر", cat: "تک‌خاستگاه", roast: "متوسط", notes: ["کارامل", "سیب قرمز", "شکلات شیری"], price: 760_000, original: 840_000, rating: 4.8, reviews: 173, tone: 1 },
  { id: "house", name: "ترکیب خانه", origin: "برزیل و گواتمالا", cat: "ترکیبی", roast: "متوسط", notes: ["فندق", "کاکائو", "شیرینی"], price: 540_000, rating: 4.7, reviews: 402, tone: 2 },
  { id: "espresso", name: "اسپرسو رُست", origin: "برزیل، هند و اتیوپی", cat: "ترکیبی", roast: "تیره", notes: ["دارک‌چاکلت", "ادویه", "توت‌فرنگی خشک"], price: 590_000, rating: 4.8, reviews: 356, tone: 3 },
  { id: "kenya", name: "کنیا نیِری", origin: "کنیا · ۱۸۵۰ متر", cat: "تک‌خاستگاه", roast: "روشن", notes: ["انگور سیاه", "گریپ‌فروت", "شیرین"], price: 960_000, rating: 4.9, reviews: 88, tone: 4 },
  { id: "cold", name: "ترکیب کلدبرو", origin: "پرو و برزیل", cat: "دمی", roast: "متوسط", notes: ["شکلات", "بادام", "کم‌اسید"], price: 620_000, original: 690_000, rating: 4.6, reviews: 97, tone: 5 },
];

export const WEIGHTS = [
  { value: "250", label: "۲۵۰ گرم", factor: 1 },
  { value: "500", label: "۵۰۰ گرم", factor: 1.9 },
  { value: "1000", label: "۱ کیلو", factor: 3.6 },
];

export const GRINDS = [
  { value: "bean", label: "دانه" },
  { value: "espresso", label: "اسپرسو" },
  { value: "moka", label: "موکاپات" },
  { value: "filter", label: "فرانسه و دمی" },
];

export const FREE_SHIPPING = 1_500_000;

/** 4.9 → ۴٫۹ with the Persian decimal separator. */
export const faDecimal = (n: number) => fa(String(n).replace(".", "٫"));

export const unitPrice = (p: Product, weight: string) => Math.round((p.price * (WEIGHTS.find((w) => w.value === weight)?.factor ?? 1)) / 1000) * 1000;

/* ——— Cart: a tiny localStorage store shared by every page and every tab ——— */

export type CartLine = { id: string; weight: string; grind: string; qty: number };

const KEY = "rost-cart";
const EMPTY: CartLine[] = [];
const listeners = new Set<() => void>();
let lastRaw: string | null = null;
let lastLines: CartLine[] = EMPTY;

function readCart(): CartLine[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return EMPTY;
  }
  if (raw === lastRaw) return lastLines;
  lastRaw = raw;
  try {
    lastLines = raw ? (JSON.parse(raw) as CartLine[]) : EMPTY;
  } catch {
    lastLines = EMPTY;
  }
  return lastLines;
}

function writeCart(lines: CartLine[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    /* private mode: the cart simply won't persist */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

const same = (a: CartLine, b: Omit<CartLine, "qty">) => a.id === b.id && a.weight === b.weight && a.grind === b.grind;

export function useCart() {
  const lines = React.useSyncExternalStore(subscribe, readCart, () => EMPTY);
  return {
    lines,
    count: lines.reduce((n, l) => n + l.qty, 0),
    add(line: CartLine) {
      const cur = readCart();
      const hit = cur.find((l) => same(l, line));
      writeCart(hit ? cur.map((l) => (l === hit ? { ...l, qty: l.qty + line.qty } : l)) : [...cur, line]);
    },
    setQty(line: CartLine, qty: number) {
      writeCart(readCart().map((l) => (same(l, line) ? { ...l, qty } : l)));
    },
    remove(line: CartLine) {
      writeCart(readCart().filter((l) => !same(l, line)));
    },
    clear() {
      writeCart(EMPTY);
    },
  };
}

/* ——— Packshot: a coffee bag drawn with theme tokens ——— */

const TONES = [
  "linear-gradient(160deg, color-mix(in oklch, var(--brand) 85%, var(--background)), color-mix(in oklch, var(--brand) 45%, var(--background)))",
  "linear-gradient(160deg, color-mix(in oklch, var(--foreground) 88%, var(--brand)), color-mix(in oklch, var(--foreground) 65%, var(--background)))",
  "linear-gradient(160deg, var(--secondary), var(--card))",
  "linear-gradient(160deg, color-mix(in oklch, var(--brand) 35%, var(--card)), var(--card))",
  "linear-gradient(160deg, color-mix(in oklch, var(--success) 45%, var(--background)), color-mix(in oklch, var(--success) 20%, var(--background)))",
  "linear-gradient(160deg, color-mix(in oklch, var(--foreground) 22%, var(--background)), var(--background))",
];

/** A coffee bag with a folded top and a round label. */
export function Bag({ product, className }: { product: Pick<Product, "name" | "roast" | "tone">; className?: string }) {
  const dark = product.tone === 1;
  const tone = TONES[product.tone % TONES.length];
  return (
    <div className={cn("aspect-[3/4]", className)} aria-hidden>
      <div className="relative size-full">
        <div className="absolute inset-x-[6%] top-0 h-[10%] rounded-t-md opacity-80" style={{ background: tone, filter: "brightness(0.85)" }} />
        <div className="absolute inset-x-0 top-[8%] bottom-0 rounded-[1.25rem] border border-foreground/10 shadow-[0_30px_50px_-25px_rgb(0_0_0/0.6)]" style={{ background: tone }}>
          <div className="absolute inset-x-0 top-[9%] h-px bg-foreground/15" />
          <div className={cn("absolute inset-x-[14%] top-[30%] grid aspect-square place-items-center rounded-full border text-center", dark ? "border-background/30 text-background" : "border-foreground/20 text-foreground")}>
            <span className="px-2">
              <span className="block text-[0.6rem] opacity-70">رُست</span>
              <span className="mt-0.5 block text-xs font-black leading-5 sm:text-sm">{product.name}</span>
              <span className="mt-0.5 block text-[0.6rem] opacity-70">برشته‌ی {product.roast}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Product tile with a quick «add 250g whole bean» button. */
export function ProductCard({ product }: { product: Product }) {
  const href = useHref();
  const { add } = useCart();
  const [added, setAdded] = React.useState(false);

  React.useEffect(() => {
    if (!added) return;
    const id = window.setTimeout(() => setAdded(false), 1400);
    return () => window.clearTimeout(id);
  }, [added]);

  return (
    <article className="group relative flex h-full flex-col">
      <a href={href("/product")} className="relative block overflow-hidden rounded-3xl bg-secondary/60 px-8 pt-8 pb-4 transition-colors group-hover:bg-secondary">
        <Bag product={product} className="mx-auto max-w-60 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5 group-hover:rotate-[-2deg]" />
        {product.original && <span className="absolute top-4 start-4 rounded-full bg-destructive px-2 py-0.5 text-[11px] font-semibold text-white">تخفیف</span>}
      </a>
      <div className="mt-4 flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <a href={href("/product")} className="font-bold hover:underline">
            {product.name}
          </a>
          <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
            <Star className="size-3.5 fill-brand text-brand" />
            {faDecimal(product.rating)}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{product.notes.join("، ")}</p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <Price amount={product.price} original={product.original} size="sm" />
          <button
            type="button"
            onClick={() => {
              add({ id: product.id, weight: "250", grind: "bean", qty: 1 });
              setAdded(true);
            }}
            aria-label={`افزودن ${product.name} به سبد`}
            className={cn(
              "grid size-10 shrink-0 cursor-pointer place-items-center rounded-full border transition-colors",
              added ? "border-success bg-success text-background" : "border-border hover:bg-foreground hover:text-background",
            )}
          >
            {added ? <Check className="size-4" /> : <Plus className="size-4" />}
          </button>
        </div>
      </div>
    </article>
  );
}

function Logo() {
  return <span className="text-2xl font-black">رُست</span>;
}

/** Announcement bar, header with cart badge, mobile menu and footer shared by every page. */
export function Shell({ active, children }: { active: string; children: React.ReactNode }) {
  const href = useHref();
  const { count } = useCart();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <p className="flex items-center justify-center gap-2 bg-foreground px-4 py-2 text-center text-xs text-background">
        <Truck className="size-3.5" />
        ارسال رایگان برای خریدهای بالای ۱٬۵۰۰٬۰۰۰ تومان · برشته‌کاری هر شنبه و سه‌شنبه
      </p>
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <nav aria-label="اصلی" className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
          <div className="flex items-center gap-8">
            <Button variant="ghost" size="icon" className="-ms-2 md:hidden" aria-label="باز کردن منو" onClick={() => setOpen(true)}>
              <Menu />
            </Button>
            <a href={href("/")} aria-label="رُست، خانه">
              <Logo />
            </a>
            <ul className="hidden items-center gap-6 md:flex">
              {NAV.map((l) => (
                <li key={l.href}>
                  <a
                    href={href(l.href)}
                    aria-current={active === l.href ? "page" : undefined}
                    className={cn("text-sm transition-colors hover:text-foreground", active === l.href ? "font-semibold text-foreground" : "text-muted-foreground")}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <a
            href={href("/cart")}
            aria-label={`سبد خرید، ${fa(count)} کالا`}
            className={cn("relative inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm transition-colors", active === "/cart" ? "border-foreground" : "border-border hover:bg-secondary")}
          >
            <ShoppingBag className="size-4" />
            <span className="max-sm:hidden">سبد خرید</span>
            {count > 0 && (
              <span className="grid min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] font-bold text-brand-foreground">
                {fa(count)}
              </span>
            )}
          </a>
        </nav>
      </header>
      <Sheet open={open} onOpenChange={setOpen} title={<Logo />}>
        <ul className="flex flex-col p-2">
          {[{ href: "/", label: "خانه" }, ...NAV, { href: "/cart", label: "سبد خرید" }].map((l) => (
            <li key={l.href}>
              <a href={href(l.href)} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-base hover:bg-accent">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </Sheet>

      <main>{children}</main>

      <footer className="mt-10 border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
          <div className="space-y-3 md:col-span-2">
            <Logo />
            <p className="max-w-sm text-sm leading-7 text-muted-foreground">برشته‌کاری کوچک در اصفهان. دانه‌ها را خودمون از مزرعه انتخاب می‌کنیم و فقط به اندازه‌ی سفارش‌های همون هفته برشته می‌کنیم.</p>
          </div>
          <div className="space-y-2 text-sm">
            <p className="font-semibold">فروشگاه</p>
            {["تک‌خاستگاه", "ترکیبی", "دمی"].map((c) => (
              <a key={c} href={href("/shop")} className="block text-muted-foreground hover:text-foreground">
                {c}
              </a>
            ))}
          </div>
          <div className="space-y-2 text-sm">
            <p className="font-semibold">برشته‌خانه</p>
            <p className="text-muted-foreground">اصفهان، خیابان چهارباغ بالا، کوچه‌ی ۱۸</p>
            <p className="text-muted-foreground">هر روز ۸ تا ۲۰</p>
          </div>
        </div>
        <p className="border-t border-border py-5 text-center text-xs text-muted-foreground">© ۱۴۰۵ رُست</p>
      </footer>
    </div>
  );
}
