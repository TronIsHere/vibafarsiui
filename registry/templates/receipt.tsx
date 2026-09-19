"use client";

import * as React from "react";
import { ArrowLeft, Copy, Download, Share2 } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { Badge } from "@/registry/ui/badge";
import { SuccessCheck } from "@/registry/animations/success-check";
import { Confetti } from "@/registry/animations/confetti";
import { fa, faNumber } from "@/lib/utils";
import { formatJalali } from "@/lib/jalali";

const receipt = { amount: 2_480_000, ref: "882104-7731", merchant: "فروشگاه دکان", card: "6037", gateway: "زرین‌پال", order: 14052, date: new Date() };
const TIME = receipt.date.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });
const noop = () => () => {};

/** رسید پرداخت: تیک موفقیت و کاغذ رنگی، مبلغ، کد پیگیری و دانلود یا اشتراک‌گذاری. */
export function PaymentReceipt() {
  const [copied, setCopied] = React.useState(false);
  const [burst, setBurst] = React.useState(0);
  const time = React.useSyncExternalStore(noop, () => TIME, () => ""); // client-only, so server and client HTML match
  const copy = () => { navigator.clipboard?.writeText(receipt.ref).catch(() => {}); setCopied(true); window.setTimeout(() => setCopied(false), 1500); };
  const rows: [string, React.ReactNode][] = [
    ["شماره‌ی پیگیری", <button key="ref" type="button" onClick={copy} className="inline-flex cursor-pointer items-center gap-1.5 font-mono tabular-nums hover:text-foreground" dir="ltr"><Copy className="size-3.5" />{receipt.ref}</button>],
    ["شماره‌ی سفارش", <span key="o" className="tabular-nums">{fa(receipt.order)}</span>],
    ["تاریخ و ساعت", `${formatJalali(receipt.date, { weekday: true })} · ${time}`],
    ["پذیرنده", receipt.merchant],
    ["کارت", <span key="c" dir="ltr" className="tabular-nums">{fa(receipt.card)} •••• •••• ••••</span>],
    ["درگاه", receipt.gateway],
  ];
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background p-4 text-foreground">
      <Confetti key={burst} count={70} />
      <div className="relative w-full max-w-sm">
        <div className="rounded-t-3xl border border-b-0 border-border bg-card px-6 pb-6 pt-8 text-center">
          <SuccessCheck size={80} />
          <h1 className="mt-4 text-lg font-bold">پرداخت با موفقیت انجام شد</h1>
          <p className="mt-1 text-sm text-muted-foreground">رسید برای شما پیامک شد</p>
          <div className="mt-6 text-3xl font-bold tabular-nums">{faNumber(receipt.amount)} <span className="text-base font-medium text-muted-foreground">تومان</span></div>
          <Badge variant="success" className="mt-2 rounded-full border border-success/30 px-2.5">تسویه‌شده</Badge>
        </div>
        {/* ticket notches */}
        <div className="relative flex items-center bg-card">
          <span className="absolute -start-3 size-6 rounded-full border border-border bg-background" style={{ clipPath: "inset(0 0 0 50%)" }} />
          <span className="mx-6 h-px flex-1 border-t border-dashed border-border" />
          <span className="absolute -end-3 size-6 rounded-full border border-border bg-background" style={{ clipPath: "inset(0 50% 0 0)" }} />
        </div>
        <div className="rounded-b-3xl border border-t-0 border-border bg-card px-6 pb-6 pt-5">
          <dl className="space-y-3 text-sm">
            {rows.map(([k, v]) => <div key={k} className="flex items-center justify-between gap-3"><dt className="text-muted-foreground">{k}</dt><dd className="text-end font-medium text-foreground/90">{v}</dd></div>)}
          </dl>
          {copied && <p className="mt-2 text-end text-xs text-success" role="status">کد پیگیری کپی شد</p>}
          <div className="mt-6 grid grid-cols-2 gap-2">
            <Button variant="outline"><Download />دانلود رسید</Button>
            <Button variant="outline"><Share2 />اشتراک‌گذاری</Button>
          </div>
          <Button className="mt-2 w-full" onClick={() => setBurst((b) => b + 1)}>بازگشت به فروشگاه<ArrowLeft /></Button>
          <p className="mt-4 text-center text-[11px] leading-5 text-muted-foreground">این رسید تا ۳۰ روز در بخش «سفارش‌های من» نگه‌داری می‌شود. برای پیگیری، شماره‌ی پیگیری را همراه داشته باشید.</p>
        </div>
      </div>
    </div>
  );
}
