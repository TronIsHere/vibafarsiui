"use client";

import * as React from "react";
import { ArrowRight, Home, Inbox, RefreshCw, SearchX, ServerCrash, WifiOff } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { Input } from "@/registry/ui/input";
import { cn, fa } from "@/lib/utils";

export type ErrorKind = "404" | "500" | "offline" | "empty";

const COPY: Record<ErrorKind, { code?: string; icon: React.ComponentType<{ className?: string }>; title: string; body: string; primary: string; secondary?: string }> = {
  "404": { code: "۴۰۴", icon: SearchX, title: "این صفحه وجود ندارد", body: "شاید لینک قدیمی باشد یا آدرس اشتباه تایپ شده. از جست‌وجو یا صفحه‌ی اصلی ادامه دهید.", primary: "صفحه‌ی اصلی", secondary: "بازگشت" },
  "500": { code: "۵۰۰", icon: ServerCrash, title: "مشکلی از سمت ما پیش آمد", body: "تیم فنی خبردار شده. چند لحظه‌ی دیگر دوباره امتحان کنید؛ اگر ادامه داشت با پشتیبانی تماس بگیرید.", primary: "تلاش دوباره", secondary: "صفحه‌ی اصلی" },
  offline: { icon: WifiOff, title: "اینترنت قطع است", body: "اتصال‌تان را بررسی کنید. تغییرات ذخیره‌نشده تا وصل شدن دوباره نگه داشته می‌شود.", primary: "تلاش دوباره" },
  empty: { icon: Inbox, title: "هنوز چیزی این‌جا نیست", body: "اولین مورد را اضافه کنید تا این صفحه پر شود. بعداً می‌توانید فیلتر و مرتب کنید.", primary: "افزودن مورد جدید", secondary: "راهنما" },
};

/** صفحه‌های خطا و خالی: ۴۰۴، ۵۰۰، آفلاین و حالت خالی؛ فارسی ساده و طبیعی، نه «اوپس». */
export function ErrorPage({ kind = "404", className }: { kind?: ErrorKind; className?: string }) {
  const c = COPY[kind];
  return (
    <div className={cn("relative flex min-h-dvh items-center justify-center overflow-hidden bg-background px-6 py-16 text-foreground", className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_65%)]" style={{ backgroundImage: "repeating-radial-gradient(circle at 50% 50%, oklch(from var(--foreground) l c h / 14%) 0 1px, transparent 1px 26px)" }} />
      <div className="relative w-full max-w-md text-center">
        {c.code ? <p className="font-mono text-7xl font-bold tabular-nums text-foreground/15 sm:text-8xl">{c.code}</p> : <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-secondary"><c.icon className="size-7 text-muted-foreground" /></span>}
        <h1 className="mt-4 text-2xl font-bold">{c.title}</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">{c.body}</p>
        {kind === "404" && <div className="mx-auto mt-6 max-w-xs"><Input placeholder="جست‌وجو در سایت…" /></div>}
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <Button>{kind === "500" || kind === "offline" ? <RefreshCw /> : kind === "404" ? <Home /> : null}{c.primary}</Button>
          {c.secondary && <Button variant="outline"><ArrowRight />{c.secondary}</Button>}
        </div>
        {kind === "500" && <p className="mt-6 font-mono text-[11px] text-muted-foreground" dir="ltr">ref: {fa("14052")}-{fa("0917")}</p>}
      </div>
    </div>
  );
}

/** Preview helper: all four states with a switcher. */
export function ErrorPagesDemo() {
  const [kind, setKind] = React.useState<ErrorKind>("404");
  return (
    <div className="relative">
      <div className="absolute left-1/2 top-4 z-10 inline-flex -translate-x-1/2 rounded-lg border border-border bg-card p-0.5 text-xs">
        {(Object.keys(COPY) as ErrorKind[]).map((k) => <button key={k} type="button" onClick={() => setKind(k)} className={cn("cursor-pointer rounded-md px-2.5 py-1 font-mono", kind === k ? "bg-secondary font-semibold" : "text-muted-foreground")}>{k}</button>)}
      </div>
      <ErrorPage kind={kind} />
    </div>
  );
}
