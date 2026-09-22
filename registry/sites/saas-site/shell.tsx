"use client";

import * as React from "react";
import { Menu, ShieldCheck } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { Sheet } from "@/registry/ui/sheet";
import { cn } from "@/lib/utils";

const BaseContext = React.createContext("");

/** Mounts the site under a path prefix, e.g. the docs preview at /preview/site/saas-site. Your app doesn't need it. */
export function SiteBase({ base, children }: { base: string; children: React.ReactNode }) {
  return <BaseContext value={base}>{children}</BaseContext>;
}

/** Internal links: href("/pricing") is "/pricing" in your app and gets the base prefix inside the preview. */
export function useHref() {
  const base = React.useContext(BaseContext);
  return React.useCallback((to: string) => (to === "/" ? base || "/" : `${base}${to}`), [base]);
}

/** Photos ship in public/sites/saas-site/. Replace the files with your own and keep the names, or change them here. */
export function Photo({ name, alt, className, eager }: { name: string; alt: string; className?: string; eager?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- a plain <img> keeps the site framework-agnostic
    <img src={`/sites/saas-site/${name}.webp`} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" className={cn("block size-full object-cover", className)} />
  );
}

export const NAV = [
  { href: "/features", label: "امکانات" },
  { href: "/pricing", label: "قیمت" },
  { href: "/blog", label: "وبلاگ" },
];

export type Plan = { id: string; name: string; desc: string; monthly: number; items: string[]; hot?: boolean };

export const PLANS: Plan[] = [
  { id: "start", name: "پایه", desc: "برای فریلنسرها و کسب‌وکارهای تک‌نفره", monthly: 290_000, items: ["۱ کاربر", "فاکتور رسمی نامحدود", "ارسال به سامانه‌ی مودیان", "گزارش سود و زیان"] },
  { id: "grow", name: "حرفه‌ای", desc: "برای فروشگاه‌ها و شرکت‌های کوچک", monthly: 690_000, items: ["۵ کاربر", "انبار و کالا", "اتصال به حساب بانکی", "حقوق و دستمزد", "پشتیبانی تلفنی"], hot: true },
  { id: "team", name: "سازمانی", desc: "برای چند شعبه و تیم مالی", monthly: 1_490_000, items: ["کاربر نامحدود", "چند شرکت و شعبه", "دسترسی نقش‌محور", "API و وبهوک", "کارشناس اختصاصی"] },
];

/** Yearly billing is ten months of the monthly price. */
export const yearly = (monthly: number) => monthly * 10;

function Logo() {
  return (
    <span className="flex items-center gap-2 text-base font-black">
      <span className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-brand to-brand/50 text-sm text-brand-foreground shadow-[0_8px_20px_-8px_var(--brand)]">ح</span>
      حسابینو
    </span>
  );
}

/**
 * Product screenshot drawn only with theme tokens: sidebar, KPI cards, a bar chart and invoice rows.
 * Swap it for a real screenshot when you have one.
 */
export function ProductMock({ className }: { className?: string }) {
  const bars = [38, 52, 44, 68, 60, 82, 74, 90, 66, 78, 96, 88];
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border bg-card text-[10px] shadow-2xl", className)} aria-hidden>
      <div className="flex h-8 items-center gap-1.5 border-b border-border px-3" dir="ltr">
        <span className="size-2 rounded-full bg-foreground/15" />
        <span className="size-2 rounded-full bg-foreground/15" />
        <span className="size-2 rounded-full bg-foreground/15" />
        <span className="mx-auto rounded bg-secondary px-8 py-0.5 text-muted-foreground">app.hesabino.ir</span>
      </div>
      <div className="grid grid-cols-[9rem_1fr] max-sm:grid-cols-1">
        <aside className="space-y-1 border-e border-border p-3 max-sm:hidden">
          {["داشبورد", "فاکتورها", "مشتری‌ها", "انبار", "بانک", "گزارش‌ها", "تنظیمات"].map((x, i) => (
            <div key={x} className={cn("rounded-md px-2 py-1.5", i === 0 ? "bg-secondary font-semibold text-foreground" : "text-muted-foreground")}>
              {x}
            </div>
          ))}
        </aside>
        <div className="space-y-3 p-3 sm:p-4">
          <div className="grid grid-cols-3 gap-2">
            {[
              { l: "فروش این ماه", v: "۴۸۲٬۵۰۰٬۰۰۰", d: "+۱۲٪" },
              { l: "دریافتنی", v: "۹۶٬۲۰۰٬۰۰۰", d: "۸ فاکتور" },
              { l: "مالیات فصل", v: "۴۳٬۴۲۵٬۰۰۰", d: "تا ۱۵ مهر" },
            ].map((k) => (
              <div key={k.l} className="rounded-lg border border-border p-2">
                <p className="text-muted-foreground">{k.l}</p>
                <p className="mt-1 text-xs font-bold text-foreground sm:text-sm">{k.v}</p>
                <p className="mt-0.5 text-brand">{k.d}</p>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="mb-2 font-semibold text-foreground">فروش ۱۲ ماه</p>
            <div className="flex h-24 items-end gap-1.5">
              {bars.map((h, i) => (
                <div key={i} className={cn("flex-1 rounded-t", i === bars.length - 2 ? "bg-brand" : "bg-foreground/15")} style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
          <div className="divide-y divide-border rounded-lg border border-border">
            {[
              { n: "فاکتور ۱۴۰۵-۲۱۸", c: "کافه آبی", s: "پرداخت‌شده", ok: true },
              { n: "فاکتور ۱۴۰۵-۲۱۷", c: "چاپ نقره", s: "ارسال به مودیان", ok: true },
              { n: "فاکتور ۱۴۰۵-۲۱۶", c: "گل‌فروشی یاس", s: "سررسید ۳ روز دیگه", ok: false },
            ].map((r) => (
              <div key={r.n} className="flex items-center justify-between gap-2 px-3 py-2">
                <span className="text-foreground">{r.n}</span>
                <span className="text-muted-foreground max-sm:hidden">{r.c}</span>
                <span className={r.ok ? "text-success" : "text-warning"}>{r.s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Header, mobile menu and footer shared by every page. `active` is the current route. */
export function Shell({ active, children, bare }: { active: string; children: React.ReactNode; bare?: boolean }) {
  const href = useHref();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-lg">
        <nav aria-label="اصلی" className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-4 sm:px-6">
          <a href={href("/")} aria-label="حسابینو، خانه">
            <Logo />
          </a>
          <ul className="hidden items-center gap-1 md:flex">
            {NAV.map((l) => (
              <li key={l.href}>
                <a
                  href={href(l.href)}
                  aria-current={active === l.href ? "page" : undefined}
                  className={cn("rounded-md px-3 py-2 text-sm transition-colors hover:text-foreground", active === l.href ? "text-foreground" : "text-muted-foreground")}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="ms-auto hidden items-center gap-2 md:flex">
            <a href={href("/login")} className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
              ورود
            </a>
            <a href={href("/login")} className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
              شروع رایگان
            </a>
          </div>
          <Button variant="ghost" size="icon" className="ms-auto md:hidden" aria-label="باز کردن منو" onClick={() => setOpen(true)}>
            <Menu />
          </Button>
        </nav>
      </header>
      <Sheet open={open} onOpenChange={setOpen} title={<Logo />}>
        <ul className="flex flex-col p-2">
          {NAV.map((l) => (
            <li key={l.href}>
              <a href={href(l.href)} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-base hover:bg-accent">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-col gap-2 border-t border-border p-4">
          <a href={href("/login")} className="inline-flex h-11 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
            شروع رایگان
          </a>
          <a href={href("/login")} className="inline-flex h-11 items-center justify-center rounded-lg border border-border text-sm">
            ورود
          </a>
        </div>
      </Sheet>

      <main className="flex-1">{children}</main>

      {!bare && (
        <footer className="border-t border-border bg-card/30">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div className="space-y-4">
              <Logo />
              <p className="max-w-xs text-sm leading-7 text-muted-foreground">نرم‌افزار حسابداری آنلاین برای کسب‌وکارهای کوچک ایرانی، با فاکتور رسمی و ارسال خودکار به سامانه‌ی مودیان.</p>
              <div className="flex gap-2">
                {["نماد اعتماد", "ساماندهی"].map((b) => (
                  <span key={b} className="grid size-16 place-items-center rounded-xl border border-border text-center text-[10px] text-muted-foreground">
                    <ShieldCheck className="size-5" />
                    {b}
                  </span>
                ))}
              </div>
            </div>
            {[
              { t: "محصول", l: [["امکانات", "/features"], ["قیمت", "/pricing"], ["ورود", "/login"]] },
              { t: "منابع", l: [["وبلاگ", "/blog"], ["راهنمای مودیان", "/blog"], ["وبینارها", "/blog"]] },
              { t: "شرکت", l: [["درباره‌ی ما", "/"], ["فرصت‌های شغلی", "/"], ["تماس", "/"]] },
            ].map((c) => (
              <div key={c.t} className="space-y-3 text-sm">
                <p className="font-semibold">{c.t}</p>
                {c.l.map(([label, to]) => (
                  <a key={label} href={href(to)} className="block text-muted-foreground hover:text-foreground">
                    {label}
                  </a>
                ))}
              </div>
            ))}
          </div>
          <p className="border-t border-border py-5 text-center text-xs text-muted-foreground">© ۱۴۰۵ حسابینو. ساخته‌شده در شیراز.</p>
        </footer>
      )}
    </div>
  );
}
