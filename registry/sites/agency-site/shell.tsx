"use client";

import * as React from "react";
import { ArrowUpLeft, Menu } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { Sheet } from "@/registry/ui/sheet";
import { cn } from "@/lib/utils";

const BaseContext = React.createContext("");

/** Mounts the site under a path prefix, e.g. the docs preview at /preview/site/agency-site. Your app doesn't need it. */
export function SiteBase({ base, children }: { base: string; children: React.ReactNode }) {
  return <BaseContext value={base}>{children}</BaseContext>;
}

/** Internal links: href("/work") is "/work" in your app and gets the base prefix inside the preview. */
export function useHref() {
  const base = React.useContext(BaseContext);
  return React.useCallback((to: string) => (to === "/" ? base || "/" : `${base}${to}`), [base]);
}

/** Photos ship in public/sites/agency-site/. Replace the files with your own and keep the names, or change them here. */
export function Photo({ name, alt, className, eager }: { name: string; alt: string; className?: string; eager?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- a plain <img> keeps the site framework-agnostic
    <img src={`/sites/agency-site/${name}.webp`} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" className={cn("block size-full object-cover", className)} />
  );
}

export const NAV = [
  { href: "/", label: "خانه" },
  { href: "/work", label: "نمونه‌کارها" },
  { href: "/services", label: "خدمات" },
  { href: "/about", label: "درباره‌ی ما" },
];

export type Category = "برند" | "وب" | "اپ" | "محصول";

export type Project = { client: string; title: string; cat: Category; year: string; metric: string; art: number; photo?: string };

export const PROJECTS: Project[] = [
  { client: "بازارچه", title: "بازطراحی تجربه‌ی خرید موبایل", cat: "اپ", year: "۱۴۰۴", metric: "۳۴٪ افزایش نرخ تبدیل", art: 0, photo: "work-app" },
  { client: "ره‌نگار", title: "هویت بصری و سامانه‌ی طراحی", cat: "برند", year: "۱۴۰۴", metric: "۲۱۰ کامپوننت در یک سیستم", art: 1, photo: "work-brand" },
  { client: "سپیدار", title: "داشبورد مدیریت ناوگان", cat: "محصول", year: "۱۴۰۳", metric: "۴۰٪ کاهش زمان گزارش‌گیری", art: 3, photo: "work-web" },
  { client: "پادکست‌باز", title: "وب‌اپ پخش و اشتراک ماهانه", cat: "وب", year: "۱۴۰۳", metric: "۴۸ هزار مشترک در سه ماه", art: 2 },
  { client: "نان‌آور", title: "برند و بسته‌بندی نانوایی زنجیره‌ای", cat: "برند", year: "۱۴۰۳", metric: "۱۲ شعبه با یک زبان بصری", art: 4 },
  { client: "کاروان", title: "سایت رزرو تور با پرداخت اقساطی", cat: "وب", year: "۱۴۰۲", metric: "۲٫۳ برابر رزرو آنلاین", art: 5 },
  { client: "دفترچه", title: "اپ حسابداری شخصی", cat: "اپ", year: "۱۴۰۲", metric: "امتیاز ۴٫۸ در کافه‌بازار", art: 2 },
  { client: "آوند", title: "پنل پزشک و پرونده‌ی الکترونیک", cat: "محصول", year: "۱۴۰۲", metric: "۶ هزار ویزیت در روز", art: 0 },
];

const ART = [
  "radial-gradient(120% 90% at 85% 10%, color-mix(in oklch, var(--brand) 70%, transparent), transparent 55%), radial-gradient(90% 80% at 10% 100%, color-mix(in oklch, var(--foreground) 18%, transparent), transparent 60%), var(--secondary)",
  "conic-gradient(from 210deg at 70% 40%, var(--brand), color-mix(in oklch, var(--brand) 18%, var(--background)), var(--secondary), var(--brand))",
  "repeating-linear-gradient(135deg, color-mix(in oklch, var(--foreground) 9%, transparent) 0 2px, transparent 2px 14px), radial-gradient(70% 70% at 30% 30%, color-mix(in oklch, var(--brand) 55%, transparent), transparent 70%), var(--card)",
  "linear-gradient(160deg, color-mix(in oklch, var(--brand) 80%, var(--background)), var(--background) 72%)",
  "radial-gradient(circle at 50% 120%, var(--brand) 0 22%, transparent 22.5%), radial-gradient(circle at 50% 120%, color-mix(in oklch, var(--brand) 50%, transparent) 0 38%, transparent 38.5%), radial-gradient(circle at 50% 120%, color-mix(in oklch, var(--brand) 22%, transparent) 0 55%, transparent 55.5%), var(--secondary)",
  "linear-gradient(90deg, color-mix(in oklch, var(--foreground) 8%, transparent) 1px, transparent 1px) 0 0 / 28px 28px, linear-gradient(color-mix(in oklch, var(--foreground) 8%, transparent) 1px, transparent 1px) 0 0 / 28px 28px, radial-gradient(60% 60% at 70% 60%, color-mix(in oklch, var(--brand) 60%, transparent), transparent 70%), var(--card)",
];

/** Abstract cover art drawn only with theme tokens, so it follows whichever theme is active. */
export function Art({ variant = 0, className, children }: { variant?: number; className?: string; children?: React.ReactNode }) {
  return (
    <div className={cn("relative isolate overflow-hidden", className)} style={{ background: ART[variant % ART.length] }}>
      {children}
    </div>
  );
}

/** A small device mock that sits on the cover art. */
export function ScreenMock({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border bg-background/85 p-3 shadow-2xl backdrop-blur", className)}>
      <div className="mb-3 flex gap-1">
        <span className="size-1.5 rounded-full bg-foreground/30" />
        <span className="size-1.5 rounded-full bg-foreground/20" />
        <span className="size-1.5 rounded-full bg-foreground/10" />
      </div>
      <div className="space-y-2">
        <div className="h-2 w-2/3 rounded-full bg-foreground/80" />
        <div className="h-2 w-1/2 rounded-full bg-foreground/25" />
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          <div className="h-8 rounded-md bg-brand/70" />
          <div className="h-8 rounded-md bg-foreground/10" />
          <div className="h-8 rounded-md bg-foreground/10" />
        </div>
      </div>
    </div>
  );
}

/** Project cover: the photo when there is one, otherwise token art with a screen mock. */
export function Cover({ project, className, children }: { project: Project; className?: string; children?: React.ReactNode }) {
  return (
    <Art variant={project.art} className={className}>
      {project.photo ? (
        <Photo name={project.photo} alt={`${project.client}، ${project.title}`} className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
      ) : (
        <ScreenMock className="absolute inset-x-0 bottom-0 mx-auto w-3/5 max-w-sm translate-y-8 rounded-b-none transition-transform duration-500 group-hover:translate-y-3" />
      )}
      {children}
    </Art>
  );
}

function Logo() {
  return (
    <span className="flex items-center gap-2 text-lg font-black">
      <span className="grid size-7 place-items-center rounded-lg bg-foreground text-sm text-background">ن</span>
      نقش
      <span className="size-1.5 rounded-full bg-brand" />
    </span>
  );
}

/** Header, mobile menu and footer shared by every page. `active` is the current route. */
export function Shell({ active, children }: { active: string; children: React.ReactNode }) {
  const href = useHref();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 backdrop-blur-md">
        <nav aria-label="اصلی" className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
          <a href={href("/")} aria-label="استودیو نقش، خانه">
            <Logo />
          </a>
          <ul className="hidden items-center gap-1 md:flex">
            {NAV.map((l) => (
              <li key={l.href}>
                <a
                  href={href(l.href)}
                  aria-current={active === l.href ? "page" : undefined}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-sm transition-colors hover:text-foreground",
                    active === l.href ? "bg-secondary text-foreground" : "text-muted-foreground",
                  )}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={href("/contact")}
            className="hidden h-10 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-semibold text-background transition-transform hover:scale-[1.03] md:inline-flex"
          >
            شروع پروژه
            <ArrowUpLeft className="size-4" />
          </a>
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="باز کردن منو" onClick={() => setOpen(true)}>
            <Menu />
          </Button>
        </nav>
      </header>
      {/* A sibling of the header: backdrop-blur would otherwise trap the fixed sheet inside it. */}
      <Sheet open={open} onOpenChange={setOpen} title={<Logo />}>
        <ul className="flex flex-col p-2">
          {[...NAV, { href: "/contact", label: "شروع پروژه" }].map((l) => (
            <li key={l.href}>
              <a
                href={href(l.href)}
                aria-current={active === l.href ? "page" : undefined}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-3 text-base aria-[current=page]:bg-secondary aria-[current=page]:font-semibold"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </Sheet>

      <main>{children}</main>

      <footer className="border-t border-border">
        {active !== "/contact" && (
          <a href={href("/contact")} className="group mx-auto block max-w-6xl px-4 pt-20 pb-16 sm:px-6">
            <p className="text-sm text-muted-foreground">پروژه‌ی بعدی</p>
            <p className="mt-3 flex items-center gap-4 text-4xl font-black leading-tight sm:text-6xl lg:text-7xl">
              بیایید حرف بزنیم
              <ArrowUpLeft className="size-10 shrink-0 text-brand transition-transform duration-300 group-hover:-translate-x-2 group-hover:-translate-y-2 sm:size-14" />
            </p>
          </a>
        )}
        <div className="mx-auto grid max-w-6xl gap-8 border-t border-border px-4 py-10 text-sm sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          <div className="space-y-3">
            <Logo />
            <p className="leading-7 text-muted-foreground">استودیوی طراحی و ساخت محصول دیجیتال، از ۱۳۹۱ در تهران.</p>
          </div>
          <div className="space-y-2">
            <p className="font-semibold">صفحه‌ها</p>
            {NAV.map((l) => (
              <a key={l.href} href={href(l.href)} className="block text-muted-foreground hover:text-foreground">
                {l.label}
              </a>
            ))}
          </div>
          <div className="space-y-2">
            <p className="font-semibold">دفتر</p>
            <p className="leading-7 text-muted-foreground">تهران، خیابان ولیعصر، کوچه‌ی بهار، پلاک ۱۲</p>
            <p className="text-muted-foreground">
              <span dir="ltr">۰۲۱ ۸۸۸۸ ۱۲۱۲</span>
            </p>
          </div>
          <div className="space-y-2">
            <p className="font-semibold">شبکه‌ها</p>
            {["اینستاگرام", "لینکدین", "دریبل"].map((s) => (
              <a key={s} href="#" className="block text-muted-foreground hover:text-foreground">
                {s}
              </a>
            ))}
          </div>
        </div>
        <p className="border-t border-border py-5 text-center text-xs text-muted-foreground">© ۱۴۰۵ استودیو نقش. همه‌ی حقوق محفوظ است.</p>
      </footer>
    </div>
  );
}
