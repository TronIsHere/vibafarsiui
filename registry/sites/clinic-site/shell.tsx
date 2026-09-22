"use client";

import * as React from "react";
import { Baby, Clock, Crown, Menu, Phone, ScanLine, Smile, Sparkles, Stethoscope } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { Sheet } from "@/registry/ui/sheet";
import { cn } from "@/lib/utils";

const BaseContext = React.createContext("");

/** Mounts the site under a path prefix, e.g. the docs preview at /preview/site/clinic-site. Your app doesn't need it. */
export function SiteBase({ base, children }: { base: string; children: React.ReactNode }) {
  return <BaseContext value={base}>{children}</BaseContext>;
}

/** Internal links: href("/booking") is "/booking" in your app and gets the base prefix inside the preview. */
export function useHref() {
  const base = React.useContext(BaseContext);
  return React.useCallback((to: string) => (to === "/" ? base || "/" : `${base}${to}`), [base]);
}

/** Photos ship in public/sites/clinic-site/. Replace the files with your own and keep the names, or change them here. */
export function Photo({ name, alt, className, eager }: { name: string; alt: string; className?: string; eager?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- a plain <img> keeps the site framework-agnostic
    <img src={`/sites/clinic-site/${name}.webp`} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" className={cn("block size-full object-cover", className)} />
  );
}

export const NAV = [
  { href: "/", label: "خانه" },
  { href: "/services", label: "خدمات و تعرفه" },
  { href: "/doctors", label: "پزشکان" },
  { href: "/contact", label: "تماس" },
];

export const SERVICES = [
  { id: "checkup", icon: Stethoscope, name: "معاینه و جرم‌گیری", desc: "معاینه‌ی کامل، عکس دیجیتال و جرم‌گیری با اولتراسونیک.", from: 850_000, to: 1_400_000, min: 45 },
  { id: "whitening", icon: Sparkles, name: "سفید کردن", desc: "بلیچینگ مطب با لامپ LED در یک جلسه.", from: 4_500_000, to: 6_000_000, min: 90 },
  { id: "implant", icon: Crown, name: "ایمپلنت", desc: "جراحی با راهنمای دیجیتال و پایه‌ی سوئیسی.", from: 28_000_000, to: 42_000_000, min: 120 },
  { id: "ortho", icon: Smile, name: "ارتودنسی", desc: "براکت ثابت یا الاینر شفاف، با پیگیری ماهانه.", from: 45_000_000, to: 90_000_000, min: 60 },
  { id: "rootcanal", icon: ScanLine, name: "عصب‌کشی", desc: "درمان ریشه با میکروسکوپ و روتاری.", from: 3_800_000, to: 6_500_000, min: 75 },
  { id: "kids", icon: Baby, name: "دندانپزشکی کودکان", desc: "فضای دوستانه، فیشورسیلانت و وارنیش فلوراید.", from: 700_000, to: 2_500_000, min: 40 },
];

export const DOCTORS = [
  { id: "sadri", photo: "dr-sadri", name: "دکتر نگار صدری", role: "متخصص ارتودنسی", years: 14, rating: 4.9, reviews: 612, days: ["شنبه", "دوشنبه", "چهارشنبه"], bio: "فارغ‌التحصیل دانشگاه علوم پزشکی شهید بهشتی، با تمرکز روی درمان با الاینر شفاف." },
  { id: "moein", photo: "dr-moein", name: "دکتر آرمان معین", role: "جراح لثه و ایمپلنت", years: 17, rating: 4.8, reviews: 489, days: ["یکشنبه", "سه‌شنبه", "پنجشنبه"], bio: "بیش از ۳٬۰۰۰ ایمپلنت موفق و عضو انجمن ایمپلنتولوژیست‌های ایران." },
  { id: "rahimi", photo: "dr-rahimi", name: "دکتر سپیده رحیمی", role: "دندانپزشک کودکان", years: 9, rating: 5, reviews: 356, days: ["شنبه", "یکشنبه", "سه‌شنبه"], bio: "کودک‌ها را بدون ترس و با حوصله درمان می‌کنه، از اولین دندان تا نوجوانی." },
  { id: "karimi", photo: "dr-karimi", name: "دکتر بهراد کریمی", role: "متخصص درمان ریشه", years: 11, rating: 4.9, reviews: 274, days: ["دوشنبه", "چهارشنبه", "پنجشنبه"], bio: "درمان‌های ریشه‌ی دشوار را با میکروسکوپ جراحی انجام میده." },
];

export const INSURANCES = ["تأمین اجتماعی تکمیلی", "دی", "آسیا", "ایران", "البرز", "بانک ملی", "نیروهای مسلح", "کانون وکلا"];

function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-full bg-brand/15 text-brand">
        <Smile className="size-5" />
      </span>
      <span className="leading-tight">
        <span className="block text-base font-black">کلینیک لبخند</span>
        <span className="block text-[11px] text-muted-foreground">دندانپزشکی خانواده</span>
      </span>
    </span>
  );
}

/** Info strip, header, mobile menu and footer shared by every page. */
export function Shell({ active, children }: { active: string; children: React.ReactNode }) {
  const href = useHref();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="border-b border-border bg-card/60 text-xs text-muted-foreground">
        <div className="mx-auto flex h-9 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" />
            شنبه تا پنجشنبه، ۹ تا ۲۱
          </span>
          <a href="tel:03136281000" className="flex items-center gap-1.5 hover:text-foreground">
            <Phone className="size-3.5" />
            اورژانس: <span dir="ltr">۰۳۱ ۳۶۲۸ ۱۰۰۰</span>
          </a>
        </div>
      </div>
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <nav aria-label="اصلی" className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
          <a href={href("/")} aria-label="کلینیک لبخند، خانه">
            <Logo />
          </a>
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV.map((l) => (
              <li key={l.href}>
                <a
                  href={href(l.href)}
                  aria-current={active === l.href ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm transition-colors hover:text-foreground",
                    active === l.href ? "font-semibold text-foreground" : "text-muted-foreground",
                  )}
                >
                  {l.label}
                  {active === l.href && <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-brand" />}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <a href={href("/booking")} className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
              نوبت بگیرید
            </a>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="باز کردن منو" onClick={() => setOpen(true)}>
              <Menu />
            </Button>
          </div>
        </nav>
      </header>
      <Sheet open={open} onOpenChange={setOpen} title={<Logo />}>
        <ul className="flex flex-col p-2">
          {[...NAV, { href: "/booking", label: "نوبت‌دهی آنلاین" }].map((l) => (
            <li key={l.href}>
              <a href={href(l.href)} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-base hover:bg-accent">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </Sheet>

      <main>{children}</main>

      <footer className="border-t border-border bg-card/40">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm leading-7 text-muted-foreground">اصفهان، خیابان شیخ صدوق شمالی، ساختمان پزشکان ارغوان، طبقه‌ی دوم</p>
          </div>
          <div className="text-sm">
            <p className="font-semibold">ساعت کاری</p>
            <dl className="mt-3 space-y-2">
              {[
                ["شنبه تا چهارشنبه", "۹ تا ۲۱"],
                ["پنجشنبه", "۹ تا ۱۴"],
                ["جمعه", "تعطیل"],
              ].map(([d, h]) => (
                <div key={d} className="flex justify-between gap-4 border-b border-dashed border-border pb-2">
                  <dt className="text-muted-foreground">{d}</dt>
                  <dd>{h}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="text-sm">
            <p className="font-semibold">دسترسی سریع</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[...NAV, { href: "/booking", label: "نوبت‌دهی" }].map((l) => (
                <a key={l.href} href={href(l.href)} className="text-muted-foreground hover:text-foreground">
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <p className="border-t border-border py-5 text-center text-xs text-muted-foreground">© ۱۴۰۵ کلینیک دندانپزشکی لبخند · دارای مجوز از وزارت بهداشت</p>
      </footer>
    </div>
  );
}
