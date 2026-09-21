"use client";

import * as React from "react";
import { ArrowLeft, Check, FileText, Globe, Repeat, ShieldCheck, Webhook, Zap } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { Badge } from "@/registry/ui/badge";
import { Price } from "@/registry/ui/price";
import { Avatar } from "@/registry/ui/avatar";
import { Progress } from "@/registry/ui/progress";
import { GridBackground } from "@/registry/backgrounds/grid";
import { TextReveal } from "@/registry/animations/text-reveal";
import { GradientText } from "@/registry/animations/gradient-text";
import { PulseButton } from "@/registry/animations/pulse-button";
import { Terminal } from "@/registry/animations/terminal";
import { BorderBeam } from "@/registry/animations/border-beam";
import { Marquee } from "@/registry/animations/marquee";
import { SpotlightCard } from "@/registry/animations/spotlight-card";
import { Odometer } from "@/registry/animations/odometer";
import { AnimatedBeam } from "@/registry/animations/animated-beam";
import { CardStack } from "@/registry/animations/card-stack";
import { HighlightText } from "@/registry/animations/highlight-text";
import { Sparkles } from "@/registry/animations/sparkles";
import { Reveal } from "@/registry/animations/reveal";
import { cn, fa, faNumber } from "@/lib/utils";

const customers = ["دیجی‌کالا", "اسنپ", "تپسی", "علی‌بابا", "کافه‌بازار", "دیوار", "ترب", "فیلیمو"];
const reviews = [
  { name: "مریم احمدی", role: "مدیر محصول، بازارچه", text: "فاکتور شمسی و تسویه‌ی روزانه دقیقاً همان دو چیزی بود که با درگاه قبلی نداشتیم. مهاجرت یک بعدازظهر طول کشید." },
  { name: "علی رضایی", role: "بنیان‌گذار پادکست‌باز", text: "اشتراک ماهانه را در نیم ساعت راه انداختیم. وبهوک‌ها به‌موقع می‌رسند و لاگ هر رویداد داخل پنل هست." },
  { name: "نگار کریمی", role: "مدیر مالی، رایان", text: "گزارش مالی خروجی اکسل می‌دهد و حسابدار ما دیگر چیزی را دستی وارد نمی‌کند." },
];
const plans = [
  { name: "شروع", price: 0, desc: "برای امتحان کردن", items: ["تا ۱۰۰ تراکنش در ماه", "فاکتور شمسی", "پشتیبانی تلگرامی"] },
  { name: "رشد", price: 490_000, desc: "برای محصولی که مشتری دارد", items: ["تراکنش نامحدود", "اشتراک و وبهوک", "تسویه‌ی روزانه", "پشتیبانی تلفنی"], hot: true },
  { name: "سازمانی", price: 1_900_000, desc: "برای تیم‌های بزرگ", items: ["چند کسب‌وکار", "قرارداد و SLA", "مدیر حساب اختصاصی"] },
];

function Node({ label, icon: Icon, className }: { label: string; icon?: React.ComponentType<{ className?: string }>; className?: string }) {
  return (
    <div className={cn("flex size-14 flex-col items-center justify-center rounded-xl border border-border bg-card text-[10px] font-medium shadow-sm", className)}>
      {Icon ? <Icon className="size-4" /> : null}
      <span className="mt-0.5">{label}</span>
    </div>
  );
}

function Integrations() {
  const box = React.useRef<HTMLDivElement>(null);
  const hub = React.useRef<HTMLDivElement>(null);
  const in0 = React.useRef<HTMLDivElement>(null), in1 = React.useRef<HTMLDivElement>(null), in2 = React.useRef<HTMLDivElement>(null);
  const out0 = React.useRef<HTMLDivElement>(null), out1 = React.useRef<HTMLDivElement>(null), out2 = React.useRef<HTMLDivElement>(null);
  return (
    <div ref={box} className="relative isolate mx-auto flex h-64 w-full max-w-lg items-center justify-between">
      <div className="flex flex-col gap-4">
        <div ref={in0}><Node label="زرین‌پال" /></div>
        <div ref={in1}><Node label="شاپرک" /></div>
        <div ref={in2}><Node label="بانک ملت" /></div>
      </div>
      <div ref={hub} className="flex size-16 items-center justify-center rounded-2xl bg-foreground text-background shadow-xl"><Zap className="size-6" /></div>
      <div className="flex flex-col gap-4">
        <div ref={out0}><Node label="گوگل‌شیت" /></div>
        <div ref={out1}><Node label="تلگرام" /></div>
        <div ref={out2}><Node label="ایمیل" /></div>
      </div>
      <AnimatedBeam containerRef={box} fromRef={in0} toRef={hub} curvature={-30} />
      <AnimatedBeam containerRef={box} fromRef={in1} toRef={hub} delay={0.6} />
      <AnimatedBeam containerRef={box} fromRef={in2} toRef={hub} curvature={30} delay={1.2} />
      <AnimatedBeam containerRef={box} fromRef={hub} toRef={out0} curvature={-30} delay={0.3} />
      <AnimatedBeam containerRef={box} fromRef={hub} toRef={out1} delay={0.9} />
      <AnimatedBeam containerRef={box} fromRef={hub} toRef={out2} curvature={30} delay={1.5} />
    </div>
  );
}

/** لندینگ حرفه‌ای: هیرو ماسکی، ترمینال، بنتو، پرتو اتصال، پشته‌ی نظرات و قیمت. */
export function SaasLanding() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <span className="flex items-center gap-2 text-base font-bold"><span className="flex size-7 items-center justify-center rounded-lg bg-foreground text-background"><Zap className="size-4" /></span>لایه</span>
          <nav className="hidden gap-6 text-sm text-muted-foreground md:flex"><a href="#features">امکانات</a><a href="#pricing">قیمت</a><a href="#">مستندات</a><a href="#">وبلاگ</a></nav>
          <div className="flex items-center gap-2"><Button variant="ghost" size="sm">ورود</Button><PulseButton size="sm">شروع رایگان</PulseButton></div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <GridBackground />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-20 pt-16 lg:grid-cols-2 lg:pt-24">
          <div>
            <Sparkles count={5}><Badge variant="brand" className="rounded-full border border-brand/30 px-3">نسخه‌ی ۳ منتشر شد</Badge></Sparkles>
            <h1 className="mt-5 text-4xl font-bold leading-[1.25] sm:text-5xl"><TextReveal lines={["زیرساخت پرداخت", "برای محصول دیجیتال شما"]} /></h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground" style={{ animation: "fade-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.4s both" }}>
              درگاه، فاکتور شمسی، اشتراک ماهانه و تسویه‌ی روزانه؛ همه با <GradientText className="font-semibold">یک API فارسی</GradientText> که در یک بعدازظهر وصل می‌شود.
            </p>
            <div className="mt-8 flex flex-col items-start gap-2 sm:flex-row sm:items-center" style={{ animation: "fade-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.55s both" }}>
              <PulseButton size="lg">ساخت حساب رایگان</PulseButton>
              <Button size="lg" variant="ghost">خواندن مستندات<ArrowLeft /></Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">بدون کارت بانکی. تا ۱۰۰ تراکنش در ماه رایگان.</p>
          </div>
          <BorderBeam className="mx-auto w-full max-w-md" duration={6}>
            <Terminal
              className="max-w-none rounded-[calc(var(--radius)+1px)] border-0"
              title="layeh init"
              lines={[
                { type: "cmd", text: "npx layeh init" },
                { type: "out", text: "کلید API از پنل خوانده شد" },
                { type: "ok", text: "درگاه زرین‌پال وصل شد" },
                { type: "ok", text: "قالب فاکتور شمسی ساخته شد" },
                { type: "cmd", text: "npx layeh charge --amount 490000" },
                { type: "ok", text: "پرداخت ۴۹۰٬۰۰۰ تومان تأیید شد · کد پیگیری ۸۸۱۲۰۴" },
              ]}
            />
          </BorderBeam>
        </div>
      </section>

      <section className="border-y border-border py-8">
        <p className="mb-4 text-center text-xs text-muted-foreground">بیش از {fa(2_400)} تیم روی لایه پرداخت می‌گیرند</p>
        <Marquee duration={28}>{customers.map((c) => <span key={c} className="text-lg font-bold text-muted-foreground/70">{c}</span>)}</Marquee>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 py-20">
        <Reveal><h2 className="text-center text-3xl font-bold">هر چیزی که برای پول گرفتن لازم دارید</h2></Reveal>
        <Reveal delay={100}><p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">نه یک درگاه ساده؛ لایه‌ی مالی کامل محصول شما، از اولین پرداخت تا گزارش پایان سال.</p></Reveal>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-6">
          <Reveal className="md:col-span-4"><SpotlightCard className="h-full"><div className="p-6">
            <div className="flex items-center gap-2"><FileText className="size-4" /><h3 className="font-semibold">فاکتور شمسی، خودکار</h3></div>
            <p className="mt-2 text-sm text-muted-foreground">برای هر پرداخت یک فاکتور با تاریخ شمسی، مالیات و شماره‌ی پیگیری ساخته می‌شود و با پیامک برای مشتری می‌رود.</p>
            <div className="mt-5 rounded-lg border border-border bg-background p-4 text-xs">
              <div className="flex justify-between"><span className="font-semibold">فاکتور #{fa(14052)}</span><span className="text-muted-foreground">۲۷ شهریور ۱۴۰۵</span></div>
              <div className="mt-3 space-y-1.5 text-muted-foreground"><div className="flex justify-between"><span>اشتراک ماهانه</span><span>{faNumber(490_000)}</span></div><div className="flex justify-between"><span>مالیات ({fa(10)}٪)</span><span>{faNumber(49_000)}</span></div></div>
              <div className="mt-3 flex justify-between border-t border-border pt-2 font-semibold"><span>قابل پرداخت</span><span>{faNumber(539_000)} تومان</span></div>
            </div>
          </div></SpotlightCard></Reveal>
          <Reveal delay={80} className="md:col-span-2"><SpotlightCard className="h-full"><div className="p-6">
            <div className="flex items-center gap-2"><Zap className="size-4" /><h3 className="font-semibold">تسویه‌ی روزانه</h3></div>
            <p className="mt-2 text-sm text-muted-foreground">هر روز ساعت ۱۰ صبح، بدون درخواست.</p>
            <div className="mt-6 text-2xl font-bold"><Odometer value={12_450_000} unit="تومان" /></div>
            <p className="mt-1 text-xs text-muted-foreground">تسویه‌ی امروز</p>
          </div></SpotlightCard></Reveal>
          <Reveal delay={120} className="md:col-span-2"><SpotlightCard className="h-full"><div className="p-6">
            <div className="flex items-center gap-2"><Repeat className="size-4" /><h3 className="font-semibold">اشتراک ماهانه</h3></div>
            <p className="mt-2 text-sm text-muted-foreground">تمدید خودکار با یادآوری پیامکی سه روز قبل.</p>
            <Progress className="mt-6" value={72} label="تمدیدشده در این ماه" showValue />
          </div></SpotlightCard></Reveal>
          <Reveal delay={160} className="md:col-span-2"><SpotlightCard className="h-full"><div className="p-6">
            <div className="flex items-center gap-2"><Webhook className="size-4" /><h3 className="font-semibold">وبهوک قابل اعتماد</h3></div>
            <p className="mt-2 text-sm text-muted-foreground">تا ۲۴ ساعت تلاش دوباره و لاگ هر رویداد.</p>
            <div className="mt-5 space-y-1 text-[11px]" dir="ltr">{["payment.succeeded", "invoice.created", "subscription.renewed"].map((e) => <div key={e} className="flex items-center gap-2 rounded-md bg-background px-2 py-1"><span className="size-1.5 rounded-full bg-success" />{e}</div>)}</div>
          </div></SpotlightCard></Reveal>
          <Reveal delay={200} className="md:col-span-2"><SpotlightCard className="h-full"><div className="p-6">
            <div className="flex items-center gap-2"><ShieldCheck className="size-4" /><h3 className="font-semibold">امن و مطابق مقررات</h3></div>
            <p className="mt-2 text-sm text-muted-foreground">مجوز شاپرک، رمزنگاری کارت و گزارش مالیاتی آماده.</p>
            <div className="mt-5 flex flex-wrap gap-1.5">{["شاپرک", "PCI", "سامانه‌ی مؤدیان"].map((t) => <span key={t} className="rounded-full border border-border px-2 py-0.5 text-[11px]">{t}</span>)}</div>
          </div></SpotlightCard></Reveal>
        </div>
      </section>

      <section className="border-y border-border bg-card/40 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal><h2 className="text-center text-3xl font-bold">به ابزارهایی که دارید وصل می‌شود</h2></Reveal>
          <Reveal delay={100}><p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">پول از درگاه و بانک می‌آید، رویدادها به جایی می‌روند که تیم شما کار می‌کند.</p></Reveal>
          <Reveal delay={200} className="mt-10"><Integrations /></Reveal>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 lg:grid-cols-2">
        <div>
          <Reveal><h2 className="text-3xl font-bold">تیم‌ها چه می‌گویند</h2></Reveal>
          <Reveal delay={100}><p className="mt-3 text-muted-foreground">از فروشگاه دونفره تا پلتفرم‌های میلیونی، همه با همین API.</p></Reveal>
          <Reveal delay={200}><div className="mt-6 flex items-center gap-3"><Globe className="size-4 text-muted-foreground" /><span className="text-sm text-muted-foreground">{fa(99.98)}٪ در دسترس بودن در ۱۲ ماه گذشته</span></div></Reveal>
        </div>
        <Reveal delay={150}>
          <CardStack className="h-48" items={reviews.map((r) => (
            <div key={r.name} className="flex h-full flex-col justify-between p-5">
              <p className="text-sm leading-7">«{r.text}»</p>
              <div className="flex items-center gap-3"><Avatar name={r.name} size="sm" /><div><p className="text-sm font-semibold">{r.name}</p><p className="text-xs text-muted-foreground">{r.role}</p></div></div>
            </div>
          ))} />
        </Reveal>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-4 py-20">
        <Reveal><h2 className="text-center text-3xl font-bold">قیمت‌ها <HighlightText>ساده و شفاف</HighlightText> هستند</h2></Reveal>
        <Reveal delay={100}><p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">کارمزد هر تراکنش همان کارمزد شاپرک است؛ ما فقط برای ابزارها پول می‌گیریم.</p></Reveal>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {plans.map((p, i) => (
            <Reveal key={p.name} delay={i * 100}>
              <div className={cn("flex h-full flex-col rounded-2xl border bg-card p-6", p.hot ? "border-foreground/40 shadow-xl" : "border-border")}>
                <div className="flex items-center justify-between"><h3 className="font-semibold">{p.name}</h3>{p.hot && <Badge variant="brand">پیشنهاد ما</Badge>}</div>
                <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
                <div className="mt-5"><Price amount={p.price} unit="تومان / ماه" size="lg" /></div>
                <ul className="mt-6 flex-1 space-y-2.5 text-sm">{p.items.map((it) => <li key={it} className="flex items-center gap-2"><Check className="size-4 text-brand" />{it}</li>)}</ul>
                <Button className="mt-6" variant={p.hot ? "default" : "outline"}>شروع با {p.name}</Button>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 text-center">
          <GridBackground size={40} />
          <div className="relative">
            <h2 className="text-3xl font-bold">اولین پرداخت را امروز بگیرید</h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">ثبت‌نام، اتصال درگاه و اولین فاکتور، همه در کمتر از یک ساعت.</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2"><PulseButton size="lg">شروع رایگان</PulseButton><Button size="lg" variant="ghost">گفت‌وگو با فروش</Button></div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-xs text-muted-foreground sm:flex-row">
          <span>© ۱۴۰۵ لایه · همه‌ی حقوق محفوظ است</span>
          <nav className="flex gap-4"><a href="#">قوانین</a><a href="#">حریم خصوصی</a><a href="#">وضعیت سرویس</a><a href="#">تماس</a></nav>
        </div>
      </footer>
    </div>
  );
}
