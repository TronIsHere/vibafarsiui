"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { Sheet } from "@/registry/ui/sheet";
import { GirihBackground } from "@/registry/backgrounds/girih";
import { cn } from "@/lib/utils";

const BaseContext = React.createContext("");

/** Mounts the site under a path prefix, e.g. the docs preview at /preview/site/restaurant-site. Your app doesn't need it. */
export function SiteBase({ base, children }: { base: string; children: React.ReactNode }) {
  return <BaseContext value={base}>{children}</BaseContext>;
}

/** Internal links: href("/menu") is "/menu" in your app and gets the base prefix inside the preview. */
export function useHref() {
  const base = React.useContext(BaseContext);
  return React.useCallback((to: string) => (to === "/" ? base || "/" : `${base}${to}`), [base]);
}

/** Photos ship in public/sites/restaurant-site/. Replace the files with your own and keep the names, or change them here. */
export function Photo({ name, alt, className, eager }: { name: string; alt: string; className?: string; eager?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- a plain <img> keeps the site framework-agnostic
    <img src={`/sites/restaurant-site/${name}.webp`} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" className={cn("block size-full object-cover", className)} />
  );
}

export const NAV = [
  { href: "/menu", label: "منو" },
  { href: "/about", label: "داستان ما" },
  { href: "/contact", label: "شعبه‌ها" },
];

export type Dish = { name: string; desc: string; price: number; tags?: ("محبوب" | "گیاهی" | "تند" | "جدید")[] };

export const MENU: { id: string; title: string; dishes: Dish[] }[] = [
  {
    id: "starters",
    title: "پیش‌غذا",
    dishes: [
      { name: "کشک بادمجان", desc: "بادمجان کبابی، کشک محلی، نعنا داغ و گردوی برشته", price: 285_000, tags: ["گیاهی", "محبوب"] },
      { name: "میرزا قاسمی", desc: "بادمجان دودی، گوجه، سیر و تخم‌مرغ محلی", price: 265_000, tags: ["گیاهی"] },
      { name: "سالاد شیرازی", desc: "خیار، گوجه، پیاز، آبغوره و نعنای خشک", price: 145_000, tags: ["گیاهی"] },
      { name: "آش رشته", desc: "سبزی آش، حبوبات، رشته، کشک و پیاز داغ", price: 195_000, tags: ["محبوب"] },
    ],
  },
  {
    id: "kebab",
    title: "کباب",
    dishes: [
      { name: "کباب برگ", desc: "فیله‌ی گوسفندی خوابانده در زعفران و پیاز، با برنج ایرانی", price: 890_000, tags: ["محبوب"] },
      { name: "جوجه‌کباب زعفرانی", desc: "ران مرغ بی‌استخوان، لیمو و زعفران، با گوجه‌ی کبابی", price: 520_000 },
      { name: "کباب کوبیده", desc: "دو سیخ گوشت گوسفند و گوساله با سماق و ریحان", price: 560_000 },
      { name: "کباب بختیاری", desc: "یک سیخ جوجه و یک سیخ برگ، با کره و زعفران", price: 780_000, tags: ["جدید"] },
    ],
  },
  {
    id: "stew",
    title: "خورش و پلو",
    dishes: [
      { name: "قورمه‌سبزی", desc: "سبزی تفت‌داده، لوبیا قرمز، لیمو عمانی و گوشت گوسفندی", price: 420_000, tags: ["محبوب"] },
      { name: "فسنجان", desc: "گردو، رب انار ملس و ران مرغ، با برنج زعفرانی", price: 490_000 },
      { name: "باقالی‌پلو با ماهیچه", desc: "ماهیچه‌ی گوسفندی پخته در زعفران و دارچین", price: 950_000, tags: ["محبوب"] },
      { name: "زرشک‌پلو با مرغ", desc: "زرشک تازه، پسته و خلال بادام", price: 480_000 },
      { name: "خورش بادمجان گیاهی", desc: "بادمجان، گوجه، غوره و لپه، بدون گوشت", price: 340_000, tags: ["گیاهی"] },
    ],
  },
  {
    id: "dessert",
    title: "دسر و نوشیدنی",
    dishes: [
      { name: "فالوده‌ی شیرازی", desc: "رشته‌ی نشاسته، گلاب و آبلیمو، با بستنی سنتی", price: 165_000, tags: ["محبوب"] },
      { name: "شله‌زرد", desc: "برنج، زعفران، گلاب، دارچین و خلال پسته", price: 135_000 },
      { name: "دوغ محلی", desc: "دوغ گازدار با پونه‌ی کوهی", price: 65_000 },
      { name: "چای و نبات", desc: "چای دم‌کشیده روی زغال با نبات زعفرانی", price: 85_000 },
    ],
  },
];

export const BRANCHES = [
  { name: "شعبه‌ی زند", city: "شیراز", address: "بلوار کریم‌خان زند، روبه‌روی ارگ، کوچه‌ی ۳", phone: "۰۷۱ ۳۲۲۲ ۴۴۱۰", hours: "هر روز ۱۲ تا ۱۶ و ۱۹ تا ۲۴" },
  { name: "شعبه‌ی قصرالدشت", city: "شیراز", address: "خیابان قصرالدشت، نبش کوچه‌ی ۴۲", phone: "۰۷۱ ۳۶۲۸ ۹۰۱۰", hours: "هر روز ۱۲ تا ۲۴" },
  { name: "شعبه‌ی ولیعصر", city: "تهران", address: "خیابان ولیعصر، بالاتر از پارک ساعی، پلاک ۲۱۰۰", phone: "۰۲۱ ۸۸۷۷ ۵۰۲۰", hours: "هر روز ۱۲ تا ۲۴" },
];

/**
 * A plated dish seen from above (saffron rice with kebab, a stew, or a dessert), for dish photos you don't have yet.
 * Colours are derived from theme tokens with a fixed lightness, so rice stays cream-coloured in every theme.
 */
export function Plate({ tone = 0, className }: { tone?: number; className?: string }) {
  const kind = tone % 4;
  const rice = "oklch(from var(--warning) 0.94 0.035 h)";
  const saffron = "oklch(from var(--warning) 0.8 0.15 h)";
  const side = ["oklch(from var(--brand) 0.5 0.1 h)", "oklch(from var(--success) 0.42 0.08 h)", "oklch(from var(--destructive) 0.36 0.08 h)", "oklch(from var(--destructive) 0.8 0.07 h)"][kind];
  const herb = "oklch(from var(--success) 0.6 0.14 h)";
  return (
    <div className={cn("aspect-square rounded-full p-[7%] shadow-[0_24px_40px_-20px_rgb(0_0_0/0.6)]", className)} style={{ background: "radial-gradient(circle, var(--card) 62%, var(--secondary))" }} aria-hidden>
      <div className="relative size-full overflow-hidden rounded-full border border-foreground/10 bg-background">
        {kind === 3 ? (
          // Faloodeh: a mound of rose-tinted noodles with a scoop and a lime wedge.
          <>
            <div className="absolute inset-[16%] rounded-full" style={{ background: `repeating-radial-gradient(circle at 50% 50%, ${rice} 0 3px, ${side} 3px 5px)` }} />
            <div className="absolute start-[30%] top-[24%] size-[34%] rounded-full shadow-md" style={{ background: rice }} />
            <div className="absolute bottom-[18%] end-[20%] size-[16%] rounded-full" style={{ background: herb }} />
          </>
        ) : (
          <>
            <div className="absolute start-[10%] top-[12%] size-[58%] rounded-full shadow-[inset_0_-6px_12px_rgb(0_0_0/0.15)]" style={{ background: `radial-gradient(circle at 45% 40%, ${saffron} 0 20%, ${rice} 23%)` }} />
            {kind === 0 ? (
              <>
                <div className="absolute end-[8%] top-[46%] h-[11%] w-[58%] -rotate-12 rounded-full shadow-sm" style={{ background: side }} />
                <div className="absolute end-[12%] top-[62%] h-[11%] w-[52%] -rotate-12 rounded-full shadow-sm" style={{ background: side }} />
                <div className="absolute end-[14%] top-[18%] size-[18%] rounded-full" style={{ background: "oklch(from var(--destructive) 0.62 0.18 h)" }} />
              </>
            ) : (
              <div className="absolute end-[8%] bottom-[8%] size-[48%] rounded-full border-4 border-card shadow-md" style={{ background: `radial-gradient(circle at 40% 35%, oklch(from ${side} calc(l + 0.08) c h), ${side} 60%)` }} />
            )}
            {[
              [22, 72],
              [30, 80],
              [70, 24],
            ].map(([x, y]) => (
              <span key={`${x}-${y}`} className="absolute size-[6%] rounded-full" style={{ insetInlineStart: `${x}%`, top: `${y}%`, background: herb }} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function Logo() {
  return (
    <span className="flex items-center gap-2">
      <span className="grid size-9 rotate-45 place-items-center rounded-lg border border-brand">
        <span className="-rotate-45 text-sm font-black text-brand">ن</span>
      </span>
      <span className="text-xl font-black">نارنج</span>
    </span>
  );
}

/** Header, mobile menu and patterned footer shared by every page. */
export function Shell({ active, children, overlay }: { active: string; children: React.ReactNode; overlay?: boolean }) {
  const href = useHref();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className={cn("z-40 w-full", overlay ? "absolute inset-x-0 top-0" : "sticky top-0 border-b border-border bg-background/85 backdrop-blur")}>
        <nav aria-label="اصلی" className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
          <a href={href("/")} aria-label="رستوران نارنج، خانه">
            <Logo />
          </a>
          <ul className="hidden items-center gap-8 md:flex">
            {NAV.map((l) => (
              <li key={l.href}>
                <a
                  href={href(l.href)}
                  aria-current={active === l.href ? "page" : undefined}
                  className={cn("text-sm transition-colors hover:text-brand", active === l.href ? "font-bold text-brand" : "text-foreground/80")}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <a href={href("/reserve")} className="inline-flex h-11 items-center rounded-full border border-brand px-5 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-brand-foreground">
              رزرو میز
            </a>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="باز کردن منو" onClick={() => setOpen(true)}>
              <Menu />
            </Button>
          </div>
        </nav>
      </header>
      <Sheet open={open} onOpenChange={setOpen} title={<Logo />}>
        <ul className="flex flex-col p-2">
          {[{ href: "/", label: "خانه" }, ...NAV, { href: "/reserve", label: "رزرو میز" }].map((l) => (
            <li key={l.href}>
              <a href={href(l.href)} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-base hover:bg-accent">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </Sheet>

      <main>{children}</main>

      <footer className="relative isolate mt-10 overflow-hidden border-t border-border">
        <GirihBackground size={48} className="-z-10 opacity-60" />
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-3">
          <div className="space-y-3">
            <Logo />
            <p className="text-sm leading-7 text-muted-foreground">آشپزی خانگی شیرازی از ۱۳۷۸. همه‌چیز همون روز پخته میشه.</p>
          </div>
          <div className="space-y-2 text-sm">
            <p className="font-semibold">ساعت سرو</p>
            <p className="text-muted-foreground">ناهار ۱۲ تا ۱۶</p>
            <p className="text-muted-foreground">شام ۱۹ تا ۲۴</p>
          </div>
          <div className="space-y-2 text-sm">
            <p className="font-semibold">شعبه‌ها</p>
            {BRANCHES.map((b) => (
              <a key={b.name} href={href("/contact")} className="block text-muted-foreground hover:text-foreground">
                {b.name}، {b.city}
              </a>
            ))}
          </div>
        </div>
        <p className="border-t border-border py-5 text-center text-xs text-muted-foreground">© ۱۴۰۵ رستوران نارنج</p>
      </footer>
    </div>
  );
}
