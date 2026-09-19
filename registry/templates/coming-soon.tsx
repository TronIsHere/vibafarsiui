"use client";

import * as React from "react";
import { Bell, Send } from "lucide-react";
import { AvatarGroup } from "@/registry/ui/avatar";
import { PhoneInput } from "@/registry/ui/phone-input";
import { AuroraBackground } from "@/registry/backgrounds/aurora";
import { StarsBackground } from "@/registry/backgrounds/stars";
import { GradientText } from "@/registry/animations/gradient-text";
import { Sparkles } from "@/registry/animations/sparkles";
import { MorphButton } from "@/registry/animations/morph-button";
import { fa, faNumber } from "@/lib/utils";
import { formatJalali } from "@/lib/jalali";

const LAUNCH = new Date(Date.now() + 23 * 864e5 + 5 * 36e5); // ۲۳ روز دیگر

let clock = 0;
function subscribe(onChange: () => void) {
  clock = Date.now();
  const id = window.setInterval(() => { clock = Date.now(); onChange(); }, 1000);
  return () => window.clearInterval(id);
}
/** Server snapshot is 0, so the first client render matches the HTML; the store ticks once mounted. */
function useCountdown(target: Date) {
  const now = React.useSyncExternalStore(subscribe, () => clock, () => 0);
  if (!now) return null;
  const s = Math.max(0, Math.floor((target.getTime() - now) / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

/** به‌زودی: شمارش معکوس تا تاریخ شمسی، شفق و ستاره در پس‌زمینه، دریافت شماره‌ی موبایل برای خبررسانی. */
export function ComingSoon() {
  const t = useCountdown(LAUNCH);
  const [ok, setOk] = React.useState(false);
  const cells: [number | null, string][] = [[t?.d ?? null, "روز"], [t?.h ?? null, "ساعت"], [t?.m ?? null, "دقیقه"], [t?.s ?? null, "ثانیه"]];
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background text-foreground">
      <StarsBackground count={70} />
      <AuroraBackground className="opacity-70" />
      <header className="relative mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4">
        <span className="flex items-center gap-2 text-base font-bold"><span className="size-6 rounded-md bg-foreground" />نبض</span>
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground">تماس با ما</a>
      </header>

      <main className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-12 text-center">
        <Sparkles count={8}><span className="rounded-full border border-border bg-card/60 px-3 py-1 text-xs backdrop-blur">نسخه‌ی اول، {formatJalali(LAUNCH)}</span></Sparkles>
        <h1 className="mt-6 text-4xl font-bold leading-[1.2] sm:text-6xl"><GradientText>داشبورد فروش‌تان</GradientText><br />به‌زودی راه می‌افتد</h1>
        <p className="mt-5 max-w-lg text-lg text-muted-foreground">همه‌ی فروشگاه‌ها و درگاه‌ها در یک صفحه، با اعداد فارسی و تاریخ شمسی. شماره‌تان را بگذارید؛ روز انتشار یک پیامک می‌فرستیم، نه بیشتر.</p>

        <div className="mt-10 grid w-full max-w-md grid-cols-4 gap-2 sm:gap-3" dir="rtl" aria-live="off">
          {cells.map(([n, l]) => (
            <div key={l} className="rounded-2xl border border-border bg-card/70 py-4 backdrop-blur">
              <p className="text-3xl font-bold tabular-nums sm:text-4xl">{n === null ? "--" : fa(String(n).padStart(2, "0"))}</p>
              <p className="mt-1 text-xs text-muted-foreground">{l}</p>
            </div>
          ))}
        </div>

        <form className="mt-10 flex w-full max-w-md flex-col gap-2 sm:flex-row sm:items-start" onSubmit={(e) => e.preventDefault()}>
          <PhoneInput className="flex-1" onChange={(_, valid) => setOk(valid)} />
          <MorphButton className="h-10 sm:w-40" loadingText="در حال ثبت…" doneText="ثبت شد" onAction={() => new Promise((r) => setTimeout(r, 1100))}>
            {ok ? <Send className="size-4" /> : <Bell className="size-4" />}خبرم کن
          </MorphButton>
        </form>
        <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
          <AvatarGroup people={[{ name: "مریم" }, { name: "علی" }, { name: "نگار" }, { name: "رضا" }]} size="sm" />
          <span>{faNumber(1_240)} نفر زودتر از شما در صف‌اند</span>
        </div>
      </main>

      <footer className="relative mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-xs text-muted-foreground">
        <span>© ۱۴۰۵ نبض</span>
        <nav className="flex gap-4"><a href="#">تلگرام</a><a href="#">اینستاگرام</a><a href="#">لینکدین</a></nav>
      </footer>
    </div>
  );
}
