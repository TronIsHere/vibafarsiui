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
import { Button } from "@/registry/ui/button";
import { Skeleton } from "@/registry/ui/skeleton";
import { TextReveal } from "@/registry/animations/text-reveal";
import { HighlightText } from "@/registry/animations/highlight-text";
import { GradientText } from "@/registry/animations/gradient-text";
import { FlipCard } from "@/registry/animations/flip-card";
import { AnimatedBeam } from "@/registry/animations/animated-beam";
import { Confetti } from "@/registry/animations/confetti";
import { SwipeToConfirm } from "@/registry/animations/swipe-to-confirm";
import { Terminal } from "@/registry/animations/terminal";
import { CardStack } from "@/registry/animations/card-stack";
import { MorphButton } from "@/registry/animations/morph-button";
import { CompareSlider } from "@/registry/animations/compare-slider";
import { ScratchCard } from "@/registry/animations/scratch-card";
import { Sparkles as SparklesFx } from "@/registry/animations/sparkles";
import { ScrollProgress } from "@/registry/animations/scroll-progress";
import { PulseButton } from "@/registry/animations/pulse-button";
import { Avatar } from "@/registry/ui/avatar";
import { fa, faNumber } from "@/lib/utils";

function OdometerDemo() {
  const prices = [12_450_000, 12_980_000, 9_870_000, 13_120_000];
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    const id = window.setInterval(() => setI((x) => (x + 1) % prices.length), 2200);
    return () => window.clearInterval(id);
  }, [prices.length]);
  return <Odometer value={prices[i]} unit="تومان" className="text-3xl font-bold" />;
}

function BeamDemo() {
  const box = React.useRef<HTMLDivElement>(null);
  const hub = React.useRef<HTMLDivElement>(null);
  const a = React.useRef<HTMLDivElement>(null);
  const b = React.useRef<HTMLDivElement>(null);
  const c = React.useRef<HTMLDivElement>(null);
  const node = "flex size-11 items-center justify-center rounded-xl border border-border bg-card shadow-sm";
  return (
    <div ref={box} className="relative isolate flex h-40 w-full max-w-xs items-center justify-between">
      <div className="flex flex-col gap-5">
        <div ref={a} className={node}><Bell className="size-4" /></div>
        <div ref={b} className={node}><MessageSquare className="size-4" /></div>
        <div ref={c} className={node}><Calendar className="size-4" /></div>
      </div>
      <div ref={hub} className="flex size-14 items-center justify-center rounded-2xl bg-foreground text-background shadow-lg"><Sparkles className="size-5" /></div>
      <AnimatedBeam containerRef={box} fromRef={a} toRef={hub} curvature={-30} />
      <AnimatedBeam containerRef={box} fromRef={b} toRef={hub} delay={0.7} />
      <AnimatedBeam containerRef={box} fromRef={c} toRef={hub} curvature={30} delay={1.4} />
    </div>
  );
}

function ConfettiDemo() {
  const [n, setN] = React.useState(0);
  return (
    <div className="relative flex h-40 w-full items-end justify-center overflow-hidden rounded-xl border border-border bg-card pb-5">
      {n > 0 && <Confetti key={n} />}
      <Button onClick={() => setN((x) => x + 1)}>پرداخت انجام شد</Button>
    </div>
  );
}

function ScrollProgressDemo() {
  const box = React.useRef<HTMLDivElement>(null);
  return (
    <div ref={box} className="relative h-40 w-full max-w-xs overflow-auto rounded-xl border border-border bg-card text-xs leading-6 text-muted-foreground">
      <ScrollProgress targetRef={box} className="sticky inset-x-auto top-0 h-1" />
      <div className="space-y-3 p-4">
        <p className="font-semibold text-foreground">برای دیدن نوار، این جعبه را اسکرول کنید.</p>
        {Array.from({ length: 6 }, (_, i) => <p key={i}>بند {fa(i + 1)}: متن نمونه برای پر کردن جعبه. تا پایین که برسید نوار بالای جعبه کامل می‌شود و از راست پر شده است.</p>)}
      </div>
    </div>
  );
}

const mockCard = (filled: boolean) => (
  <div className="h-44 w-full bg-card p-4">
    <div className="flex items-center gap-3">
      {filled ? <Avatar name="سارا محمدی" size="sm" /> : <Skeleton className="size-7 rounded-full" />}
      <div className="flex-1 space-y-1.5">{filled ? <><p className="text-sm font-semibold">سارا محمدی</p><p className="text-xs text-muted-foreground">۲ دقیقه پیش</p></> : <><Skeleton className="h-3 w-24" /><Skeleton className="h-2.5 w-14" /></>}</div>
    </div>
    <div className="mt-4 space-y-2">{filled ? <><p className="text-sm">سفارش #{fa(14052)} پرداخت شد.</p><p className="text-xs text-muted-foreground">{faNumber(2_480_000)} تومان · درگاه زرین‌پال</p></> : <><Skeleton className="h-3 w-full" /><Skeleton className="h-3 w-2/3" /></>}</div>
    <div className="mt-4 flex gap-2">{filled ? <><Button size="sm">مشاهده</Button><Button size="sm" variant="outline">رسید</Button></> : <><Skeleton className="h-8 w-16" /><Skeleton className="h-8 w-16" /></>}</div>
  </div>
);

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
  "text-reveal": (k) => (
    <h2 key={k} className="text-center text-2xl font-bold leading-snug">
      <TextReveal lines={["زیرساخت پرداخت", "برای محصول دیجیتال شما"]} />
    </h2>
  ),
  "highlight-text": (k) => (
    <p key={k} className="text-center text-xl font-bold">قیمت‌ها <HighlightText>ساده و شفاف</HighlightText> هستند</p>
  ),
  "gradient-text": () => <p className="text-center text-2xl font-bold"><GradientText>به‌زودی راه می‌افتیم</GradientText></p>,
  "flip-card": () => (
    <FlipCard
      className="h-36 w-full max-w-[240px]"
      front={<div className="flex h-36 flex-col justify-between rounded-xl border border-border bg-card p-4"><span className="text-sm font-semibold">پلن حرفه‌ای</span><span className="text-xs text-muted-foreground">برای دیدن قیمت، ماوس را روی کارت ببرید</span></div>}
      back={<div className="flex h-36 flex-col justify-between rounded-xl border border-foreground/30 bg-foreground p-4 text-background"><span className="text-sm font-semibold">{faNumber(290_000)} تومان / ماه</span><span className="text-xs opacity-70">همه‌ی کامپوننت‌ها و قالب‌ها</span></div>}
    />
  ),
  "animated-beam": () => <BeamDemo />,
  confetti: () => <ConfettiDemo />,
  "swipe-to-confirm": (k) => <SwipeToConfirm key={k} />,
  terminal: (k) => (
    <Terminal
      key={k}
      className="max-w-xs"
      lines={[
        { type: "cmd", text: "npx vibefarsi add otp-field" },
        { type: "out", text: "در حال دریافت از رجیستری…" },
        { type: "ok", text: "otp-field به components/ui اضافه شد" },
        { type: "ok", text: "وابستگی input از قبل بود" },
      ]}
    />
  ),
  "card-stack": () => (
    <CardStack
      className="h-40 max-w-[280px]"
      items={[
        { name: "مریم احمدی", role: "مدیر محصول", text: "مهاجرت یک بعدازظهر طول کشید و تقویم شمسی از روز اول درست بود." },
        { name: "علی رضایی", role: "بنیان‌گذار", text: "اولین کامپوننتی که دیدم اعداد را فارسی می‌نویسد بدون این‌که خودم چیزی بنویسم." },
        { name: "نگار کریمی", role: "طراح", text: "توکن‌ها را عوض کردم و همه‌ی صفحه‌ها با هم عوض شدند." },
      ].map((r) => (
        <div key={r.name} className="flex h-full flex-col justify-between p-4">
          <p className="text-sm leading-6">«{r.text}»</p>
          <div className="flex items-center gap-2"><Avatar name={r.name} size="sm" /><div className="text-xs"><p className="font-semibold">{r.name}</p><p className="text-muted-foreground">{r.role}</p></div></div>
        </div>
      ))}
    />
  ),
  "morph-button": () => <MorphButton loadingText="در حال ثبت…" doneText="ثبت شد">خبرم کن</MorphButton>,
  "compare-slider": () => <CompareSlider className="max-w-sm" before={mockCard(false)} after={mockCard(true)} beforeLabel="اسکلت" afterLabel="محتوا" />,
  "scratch-card": (k) => (
    <ScratchCard key={k} className="w-full max-w-[260px]" coverText="برای دیدن کد تخفیف، بخراشید">
      <div className="p-6 text-center"><p className="text-xs text-muted-foreground">کد تخفیف نوروزی</p><p className="mt-1 text-xl font-bold tracking-wider" dir="ltr">NOWRUZ40</p><p className="mt-1 text-xs text-success">{fa(40)}٪ تخفیف</p></div>
    </ScratchCard>
  ),
  sparkles: () => (
    <SparklesFx count={8}><Badge variant="brand" className="rounded-full border border-brand/30 px-3 text-sm">جدید</Badge></SparklesFx>
  ),
  "scroll-progress": () => <ScrollProgressDemo />,
  "pulse-button": () => <PulseButton size="lg">شروع رایگان</PulseButton>,
};

export const replayable = new Set([
  "typewriter",
  "counter",
  "blur-text",
  "animated-list",
  "reveal",
  "text-reveal",
  "highlight-text",
  "swipe-to-confirm",
  "terminal",
  "scratch-card",
]);
