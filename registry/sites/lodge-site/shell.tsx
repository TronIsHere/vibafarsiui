"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { Sheet } from "@/registry/ui/sheet";
import { cn } from "@/lib/utils";

const BaseContext = React.createContext("");

/** Mounts the site under a path prefix, e.g. the docs preview at /preview/site/lodge-site. Your app doesn't need it. */
export function SiteBase({ base, children }: { base: string; children: React.ReactNode }) {
  return <BaseContext value={base}>{children}</BaseContext>;
}

/** Internal links: href("/rooms") is "/rooms" in your app and gets the base prefix inside the preview. */
export function useHref() {
  const base = React.useContext(BaseContext);
  return React.useCallback((to: string) => (to === "/" ? base || "/" : `${base}${to}`), [base]);
}

/** Photos ship in public/sites/lodge-site/. Replace the files with your own and keep the names, or change them here. */
export function Photo({ name, alt, className, eager }: { name: string; alt: string; className?: string; eager?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- a plain <img> keeps the site framework-agnostic
    <img src={`/sites/lodge-site/${name}.webp`} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" className={cn("block size-full object-cover", className)} />
  );
}

export const NAV = [
  { href: "/rooms", label: "اتاق‌ها" },
  { href: "/experiences", label: "تجربه‌ها" },
  { href: "/about", label: "درباره‌ی ما" },
];

export type Room = { id: string; photo: string; name: string; desc: string; guests: number; meters: number; beds: string; price: number; amenities: string[]; tone: number };

export const ROOMS: Room[] = [
  { id: "shah-neshin", photo: "room-shah", name: "اتاق شاه‌نشین", desc: "بزرگ‌ترین اتاق خونه با پنجره‌های ارسی و سقف گنبدی.", guests: 4, meters: 42, beds: "یک تخت دونفره و دو رختخواب سنتی", price: 4_800_000, amenities: ["حمام اختصاصی", "کرسی زمستونی", "صبحانه‌ی محلی", "چشم‌انداز حیاط"], tone: 0 },
  { id: "badgir", photo: "room-badgir", name: "اتاق بادگیر", desc: "زیر بادگیر خونه، خنک‌ترین اتاق در روزهای گرم تابستون.", guests: 2, meters: 24, beds: "یک تخت دونفره", price: 3_200_000, amenities: ["حمام اختصاصی", "صبحانه‌ی محلی", "پشت‌بام اختصاصی"], tone: 1 },
  { id: "hoz-khaneh", photo: "room-hoz", name: "اتاق حوض‌خانه", desc: "کنار حوض و درخت انار، با درِ چوبی رو به حیاط.", guests: 3, meters: 30, beds: "یک تخت دونفره و یک تخت یک‌نفره", price: 3_900_000, amenities: ["حمام اختصاصی", "صبحانه‌ی محلی", "ایوان"], tone: 2 },
  { id: "kalbe", photo: "room-kalbe", name: "کلبه‌ی کاهگلی", desc: "خانه‌ای کوچک و مستقل در انتهای باغ، برای خانواده‌ها.", guests: 5, meters: 55, beds: "دو تخت دونفره و یک رختخواب", price: 5_900_000, amenities: ["آشپزخانه‌ی کوچک", "حمام اختصاصی", "حیاط اختصاصی", "صبحانه‌ی محلی"], tone: 3 },
];

export const EXPERIENCES = [
  { id: "stars", photo: "stars", title: "شب‌گردی و رصد ستاره", desc: "با راهنمای نجوم و تلسکوپ، دور از هر نوری.", hours: "۳ ساعت", group: "تا ۱۲ نفر", level: "آسان", price: 650_000 },
  { id: "camel", photo: "camel", title: "شترسواری در غروب", desc: "از روستا تا بلندترین تپه‌ی ماسه‌ای برای تماشای غروب.", hours: "۲ ساعت", group: "تا ۸ نفر", level: "آسان", price: 900_000 },
  { id: "salt", photo: "salt", title: "تور دریاچه‌ی نمک", desc: "با ماشین آفرود تا کویر نمک و عکاسی در بازتاب آسمون.", hours: "۵ ساعت", group: "تا ۶ نفر", level: "متوسط", price: 2_400_000 },
  { id: "bread", photo: "bread", title: "پخت نان محلی", desc: "همراه با مادربزرگ روستا، از خمیر تا تنور.", hours: "۱٫۵ ساعت", group: "تا ۱۰ نفر", level: "آسان", price: 350_000 },
  { id: "hike", photo: "hike", title: "کوه‌پیمایی تا قلعه‌ی متروکه", desc: "مسیر سنگی کوتاه تا قلعه‌ای ۳۰۰ ساله با چشم‌انداز کویر.", hours: "۴ ساعت", group: "تا ۱۰ نفر", level: "سخت", price: 800_000 },
  { id: "sand", photo: "sand", title: "سندبورد", desc: "سُر خوردن روی تپه‌های ماسه با تخته و آموزش.", hours: "۲ ساعت", group: "تا ۸ نفر", level: "متوسط", price: 700_000 },
];

/** Desert dunes under a sky, drawn with theme tokens. `night` darkens the sky and adds a moon. */
export function Dunes({ tone = 0, night, className, children }: { tone?: number; night?: boolean; className?: string; children?: React.ReactNode }) {
  const sky = night
    ? "linear-gradient(to bottom, oklch(from var(--background) calc(l - 0.04) c h), var(--card))"
    : [
        "linear-gradient(to bottom, color-mix(in oklch, var(--brand) 35%, var(--card)), var(--card))",
        "linear-gradient(to bottom, color-mix(in oklch, var(--warning) 25%, var(--card)), var(--card))",
        "linear-gradient(to bottom, var(--secondary), var(--card))",
        "linear-gradient(to bottom, color-mix(in oklch, var(--destructive) 18%, var(--card)), var(--card))",
      ][tone % 4];
  return (
    <div className={cn("relative isolate overflow-hidden", className)} style={{ background: sky }}>
      {night && <div aria-hidden className="absolute top-[14%] end-[16%] size-12 rounded-full bg-foreground/90 shadow-[0_0_60px_10px_color-mix(in_oklch,var(--foreground)_25%,transparent)] sm:size-16" />}
      {!night && <div aria-hidden className="absolute top-[22%] start-[22%] size-14 rounded-full bg-brand/80 blur-[1px]" />}
      <svg viewBox="0 0 800 300" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-3/5 w-full" aria-hidden>
        <path d="M0 170 C 120 110, 240 110, 360 160 S 620 230, 800 140 L800 300 L0 300Z" fill="color-mix(in oklch, var(--brand) 55%, var(--background))" opacity={night ? 0.35 : 0.55} />
        <path d="M0 220 C 160 170, 300 200, 420 230 S 680 190, 800 220 L800 300 L0 300Z" fill="color-mix(in oklch, var(--brand) 70%, var(--background))" opacity={night ? 0.5 : 0.8} />
        <path d="M0 260 C 200 240, 420 280, 800 250 L800 300 L0 300Z" fill="color-mix(in oklch, var(--brand) 40%, var(--background))" />
      </svg>
      {children}
    </div>
  );
}

function Logo() {
  return (
    <span className="flex items-baseline gap-2">
      <span className="text-2xl font-black">کاهگل</span>
      <span className="text-xs opacity-70">اقامتگاه بوم‌گردی</span>
    </span>
  );
}

/** Header (transparent over the home hero), mobile menu and footer shared by every page. */
export function Shell({ active, children, overlay }: { active: string; children: React.ReactNode; overlay?: boolean }) {
  const href = useHref();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className={cn("z-40 w-full", overlay ? "absolute inset-x-0 top-0" : "sticky top-0 border-b border-border bg-background/85 backdrop-blur")}>
        <nav aria-label="اصلی" className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
          <a href={href("/")} aria-label="اقامتگاه کاهگل، خانه">
            <Logo />
          </a>
          <ul className="hidden items-center gap-8 md:flex">
            {NAV.map((l) => (
              <li key={l.href}>
                <a
                  href={href(l.href)}
                  aria-current={active === l.href ? "page" : undefined}
                  className={cn("border-b-2 py-1 text-sm transition-colors", active === l.href ? "border-brand font-semibold" : "border-transparent text-foreground/75 hover:text-foreground")}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <a href={href("/book")} className="inline-flex h-11 items-center rounded-full bg-foreground px-6 text-sm font-semibold text-background transition-transform hover:scale-[1.03]">
              رزرو اقامت
            </a>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="باز کردن منو" onClick={() => setOpen(true)}>
              <Menu />
            </Button>
          </div>
        </nav>
      </header>
      <Sheet open={open} onOpenChange={setOpen} title={<Logo />}>
        <ul className="flex flex-col p-2">
          {[{ href: "/", label: "خانه" }, ...NAV, { href: "/book", label: "رزرو اقامت" }].map((l) => (
            <li key={l.href}>
              <a href={href(l.href)} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-base hover:bg-accent">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </Sheet>

      <main>{children}</main>

      <footer className="border-t border-border">
        <Dunes tone={2} className="h-24" />
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
          <div className="space-y-3">
            <Logo />
            <p className="text-sm leading-7 text-muted-foreground">روستای مصر، بخش خور و بیابانک، استان اصفهان. ۴۵ کیلومتر مونده به جندق.</p>
          </div>
          <div className="space-y-2 text-sm">
            <p className="font-semibold">رزرو و هماهنگی</p>
            <p className="text-muted-foreground">
              <span dir="ltr">۰۹۱۳ ۲۰۰ ۴۵۶۷</span>
            </p>
            <p className="text-muted-foreground">پاسخ‌گویی هر روز ۹ تا ۲۱</p>
          </div>
          <div className="space-y-2 text-sm">
            <p className="font-semibold">صفحه‌ها</p>
            {[...NAV, { href: "/book", label: "رزرو" }].map((l) => (
              <a key={l.href} href={href(l.href)} className="block text-muted-foreground hover:text-foreground">
                {l.label}
              </a>
            ))}
          </div>
        </div>
        <p className="border-t border-border py-5 text-center text-xs text-muted-foreground">© ۱۴۰۵ اقامتگاه بوم‌گردی کاهگل · دارای مجوز میراث فرهنگی و گردشگری</p>
      </footer>
    </div>
  );
}
