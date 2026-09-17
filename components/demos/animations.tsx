"use client";

import * as React from "react";
import {
  Bell,
  Calendar,
  Check,
  Folder,
  Home,
  MessageSquare,
  Search,
  Settings,
  Sparkles,
} from "lucide-react";
import { TextShimmer } from "@/registry/animations/text-shimmer";
import { Typewriter } from "@/registry/animations/typewriter";
import { Counter } from "@/registry/animations/counter";
import { BlurText } from "@/registry/animations/blur-text";
import { AnimatedTabs } from "@/registry/animations/animated-tabs";
import { BorderBeam } from "@/registry/animations/border-beam";
import { ShineButton } from "@/registry/animations/shine-button";
import { Dock } from "@/registry/animations/dock";
import { AnimatedList } from "@/registry/animations/animated-list";
import { Orbit } from "@/registry/animations/orbit";
import { TiltCard } from "@/registry/animations/tilt-card";
import { LoadingDots } from "@/registry/animations/loading-dots";
import { Marquee } from "@/registry/animations/marquee";
import { Reveal } from "@/registry/animations/reveal";
import { WordRotate } from "@/registry/animations/word-rotate";
import { TextScramble } from "@/registry/animations/text-scramble";
import { Odometer } from "@/registry/animations/odometer";
import { RippleButton } from "@/registry/animations/ripple-button";
import { MagneticButton } from "@/registry/animations/magnetic-button";
import { ProgressRing } from "@/registry/animations/progress-ring";
import { SuccessCheck } from "@/registry/animations/success-check";
import { Meteors } from "@/registry/animations/meteors";
import { SpotlightCard } from "@/registry/animations/spotlight-card";
import { GridReveal } from "@/registry/animations/grid-reveal";
import { Badge } from "@/registry/ui/badge";

function OdometerDemo() {
  const prices = [12_450_000, 12_980_000, 9_870_000, 13_120_000];
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    const id = window.setInterval(() => setI((x) => (x + 1) % prices.length), 2200);
    return () => window.clearInterval(id);
  }, [prices.length]);
  return <Odometer value={prices[i]} unit="تومان" className="text-3xl font-bold" />;
}

/** Demos that restart when `k` changes (the docs page passes a replay counter). */
export const animationDemos: Record<string, (k: number) => React.ReactNode> = {
  "text-shimmer": () => (
    <TextShimmer className="text-lg font-semibold">
      در حال فکر کردن…
    </TextShimmer>
  ),
  typewriter: (k) => (
    <Typewriter
      key={k}
      text="یک فرم ثبت‌نام فارسی بساز."
      className="text-base"
    />
  ),
  counter: (k) => (
    <div key={k} className="text-center">
      <Counter to={12_450_000} unit="تومان" className="text-4xl font-bold" />
      <p className="text-xs text-muted-foreground">فروش امروز</p>
    </div>
  ),
  "blur-text": (k) => (
    <p key={k} className="text-center text-xl font-bold leading-relaxed">
      <BlurText text="کامپوننت‌هایی که فارسی را می‌فهمند" />
    </p>
  ),
  "animated-tabs": () => <AnimatedTabs items={["همه", "فعال", "بایگانی"]} />,
  "border-beam": () => (
    <BorderBeam className="w-full max-w-[240px]">
      <div className="p-4">
        <p className="text-sm font-semibold">پلن حرفه‌ای</p>
        <p className="mt-1 text-xs text-muted-foreground">
          همه‌ی کامپوننت‌ها، تم‌ها و قالب‌ها
        </p>
      </div>
    </BorderBeam>
  ),
  "shine-button": () => (
    <ShineButton>
      <Sparkles />
      ارتقا به پرو
    </ShineButton>
  ),
  dock: () => (
    <Dock
      items={[
        { icon: Home, label: "خانه" },
        { icon: Search, label: "جست‌وجو" },
        { icon: MessageSquare, label: "پیام‌ها" },
        { icon: Calendar, label: "تقویم" },
        { icon: Folder, label: "فایل‌ها" },
        { icon: Settings, label: "تنظیمات" },
      ]}
    />
  ),
  "animated-list": (k) => (
    <AnimatedList key={k} className="w-full max-w-[250px]">
      {[
        { i: Check, t: "پرداخت تأیید شد", s: "همین حالا" },
        { i: Bell, t: "سفارش جدید #۱۴۰۵۳", s: "۲ دقیقه پیش" },
        { i: MessageSquare, t: "پیام از مریم احمدی", s: "۵ دقیقه پیش" },
      ].map((it) => (
        <div
          key={it.t}
          className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2"
        >
          <span className="flex size-7 items-center justify-center rounded-full bg-secondary">
            <it.i className="size-3.5" />
          </span>
          <span className="flex-1 text-xs">
            <span className="block font-medium">{it.t}</span>
            <span className="text-muted-foreground">{it.s}</span>
          </span>
        </div>
      ))}
    </AnimatedList>
  ),
  orbit: () => {
    const dot = (I: React.ComponentType<{ className?: string }>) => (
      <span className="flex size-6 items-center justify-center rounded-full border border-border bg-card">
        <I className="size-3" />
      </span>
    );
    return (
      <Orbit
        size={150}
        center={
          <span className="flex size-8 items-center justify-center rounded-full bg-foreground text-background">
            <Sparkles className="size-4" />
          </span>
        }
        items={[
          { node: dot(Home), radius: 62, duration: 9 },
          { node: dot(Settings), radius: 62, duration: 9, delay: -4.5 },
          { node: dot(Bell), radius: 42, duration: 6, delay: -2 },
        ]}
      />
    );
  },
  "tilt-card": () => (
    <TiltCard className="w-full max-w-[220px] cursor-pointer p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">کارت اعتباری</span>
        <span className="size-5 rounded-full bg-secondary" />
      </div>
      <p className="mt-5   text-sm tracking-wider" dir="ltr">
        •••• •••• •••• ۴۸۲۱
      </p>
      <p className="mt-2 text-[11px] text-muted-foreground">
        سارا محمدی · ۰۸/۰۷
      </p>
    </TiltCard>
  ),
  "loading-dots": () => <LoadingDots label="در حال دریافت پاسخ" />,
  marquee: () => (
    <Marquee duration={18} className="max-w-full">
      {[
        "راست‌چین",
        "تقویم شمسی",
        "ارقام فارسی",
        "تومان",
        "IRANSans",
        "Vazirmatn",
        "MCP",
        "Tailwind",
      ].map((t) => (
        <Badge key={t} variant="outline">
          {t}
        </Badge>
      ))}
    </Marquee>
  ),
  "word-rotate": () => (
    <p className="text-center text-xl font-bold">
      برای <WordRotate words={["توسعه‌دهنده", "طراح", "وایب‌کدر", "فروشگاه"]} className="text-brand" /> ساخته شده
    </p>
  ),
  "text-scramble": (k) => <TextScramble key={k} text="کامپوننت‌هایی که فارسی را می‌فهمند" className="text-center text-lg font-bold" />,
  odometer: () => <OdometerDemo />,
  "ripple-button": () => <RippleButton size="lg">پرداخت ۲٬۴۸۰٬۰۰۰ تومان</RippleButton>,
  "magnetic-button": () => <MagneticButton>شروع کنید</MagneticButton>,
  "progress-ring": (k) => <ProgressRing key={k} value={72} label="هدف ماهانه" />,
  "success-check": (k) => <SuccessCheck key={k} label="پرداخت انجام شد" />,
  meteors: () => (
    <div className="relative h-40 w-full overflow-hidden rounded-xl border border-border bg-background">
      <Meteors count={10} />
      <div className="relative flex h-full items-center justify-center text-sm font-semibold">شب یلدا مبارک</div>
    </div>
  ),
  "spotlight-card": () => (
    <SpotlightCard className="w-full max-w-[260px]">
      <div className="p-4"><p className="text-sm font-semibold">پلن حرفه‌ای</p><p className="mt-1 text-xs text-muted-foreground">ماوس را روی کارت بچرخانید</p></div>
    </SpotlightCard>
  ),
  "grid-reveal": (k) => <GridReveal key={k} className="w-full max-w-[240px]" />,
  reveal: (k) => (
    <div key={k} className="w-full max-w-[260px] space-y-2">
      {["راست‌چین از پایه", "ارقام فارسی", "توکن‌های تم"].map((t, i) => (
        <Reveal key={t} delay={i * 120}>
          <div className="rounded-lg border border-border bg-card px-3 py-2 text-sm">
            {t}
          </div>
        </Reveal>
      ))}
    </div>
  ),
};

export const replayable = new Set([
  "typewriter",
  "counter",
  "blur-text",
  "animated-list",
  "reveal",
]);
