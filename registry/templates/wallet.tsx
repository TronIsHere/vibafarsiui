"use client";

import * as React from "react";
import { ArrowDownLeft, ArrowUpLeft, Eye, EyeOff, Plus, Wallet } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { Badge } from "@/registry/ui/badge";
import { Dialog } from "@/registry/ui/dialog";
import { IbanInput } from "@/registry/ui/iban-input";
import { Field, Input } from "@/registry/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/ui/tabs";
import { Odometer } from "@/registry/animations/odometer";
import { cn, en, fa, faNumber, formatToman } from "@/lib/utils";
import { formatJalali } from "@/lib/jalali";

const tx = [
  { id: 1, title: "واریز از کارت ۶۰۳۷", amount: 2_000_000, date: new Date(), kind: "in" as const },
  { id: 2, title: "خرید از دکان", amount: -890_000, date: new Date(Date.now() - 864e5), kind: "out" as const },
  { id: 3, title: "برداشت به شبا", amount: -1_500_000, date: new Date(Date.now() - 3 * 864e5), kind: "out" as const, pending: true },
  { id: 4, title: "بازگشت وجه سفارش #۱۴۰۴۹", amount: 640_000, date: new Date(Date.now() - 6 * 864e5), kind: "in" as const },
];

/** کیف پول: موجودی، تراکنش‌ها با تاریخ شمسی، شارژ سریع و برداشت به شبا. */
export function WalletPage() {
  const [hidden, setHidden] = React.useState(false);
  const [withdraw, setWithdraw] = React.useState(false);
  const [iban, setIban] = React.useState("");
  const [ibanOk, setIbanOk] = React.useState(false);
  const [amount, setAmount] = React.useState("");
  const balance = 2_100_000;
  const amt = Number(en(amount).replace(/\D/g, ""));
  return (
    <div className="min-h-dvh bg-background p-4 text-foreground sm:p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6" style={{ backgroundImage: "radial-gradient(60% 80% at 100% 0%, oklch(from var(--brand) l c h / 22%), transparent 70%)" }}>
          <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-sm text-muted-foreground"><Wallet className="size-4" />موجودی کیف پول</span><button type="button" onClick={() => setHidden((h) => !h)} aria-label={hidden ? "نمایش" : "پنهان"} className="cursor-pointer text-muted-foreground hover:text-foreground">{hidden ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div>
          <div className="mt-3 text-3xl font-bold">{hidden ? "•••••••" : <Odometer value={balance} unit="تومان" />}</div>
          <div className="mt-5 flex gap-2"><Button size="sm"><Plus />افزایش موجودی</Button><Button size="sm" variant="outline" onClick={() => setWithdraw(true)}>برداشت</Button></div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm font-semibold">شارژ سریع</p>
          <div className="mt-3 flex flex-wrap gap-2">{[100_000, 200_000, 500_000, 1_000_000].map((v) => <button key={v} type="button" className="cursor-pointer rounded-full border border-border px-3 py-1.5 text-sm transition-colors hover:bg-accent">{faNumber(v)} تومان</button>)}</div>
        </div>

        <Tabs defaultValue="all" variant="underline">
          <TabsList aria-label="تراکنش‌ها"><TabsTrigger value="all">همه</TabsTrigger><TabsTrigger value="in">واریز</TabsTrigger><TabsTrigger value="out">برداشت</TabsTrigger></TabsList>
          {(["all", "in", "out"] as const).map((k) => (
            <TabsContent key={k} value={k}>
              <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
                {tx.filter((t) => k === "all" || t.kind === k).map((t) => (
                  <li key={t.id} className="flex items-center gap-3 p-4">
                    <span className={cn("flex size-9 items-center justify-center rounded-full", t.kind === "in" ? "bg-success/15 text-success" : "bg-secondary text-foreground")}>{t.kind === "in" ? <ArrowDownLeft className="size-4" /> : <ArrowUpLeft className="size-4" />}</span>
                    <div className="min-w-0 flex-1"><p className="text-sm font-medium">{t.title}</p><p className="text-xs text-muted-foreground">{formatJalali(t.date, { weekday: true })}</p></div>
                    <div className="text-end"><p className={cn("text-sm font-semibold tabular-nums", t.kind === "in" ? "text-success" : "")}>{t.kind === "in" ? "+" : "−"}{formatToman(Math.abs(t.amount))}</p>{t.pending && <Badge variant="warning" className="mt-1">در انتظار تسویه</Badge>}</div>
                  </li>
                ))}
              </ul>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Dialog open={withdraw} onOpenChange={setWithdraw} title="برداشت به حساب بانکی" description="تسویه‌ی شبا معمولاً تا ۲۴ ساعت کاری طول می‌کشد." footer={<><Button disabled={!ibanOk || !amt || amt > balance} onClick={() => setWithdraw(false)}>ثبت درخواست</Button><Button variant="ghost" onClick={() => setWithdraw(false)}>انصراف</Button></>}>
        <div className="space-y-4">
          <div className="space-y-1.5"><span className="text-sm font-medium">شماره‌ی شبا</span><IbanInput value={iban} onChange={(v, ok) => { setIban(v); setIbanOk(ok); }} /></div>
          <Field label="مبلغ (تومان)" htmlFor="w-a" hint={`حداکثر ${formatToman(balance)}`}><Input id="w-a" inputMode="numeric" value={amount ? faNumber(amt) : ""} onChange={(e) => setAmount(e.target.value)} placeholder="۵۰۰٬۰۰۰" error={amt > balance ? "بیشتر از موجودی است" : undefined} /></Field>
          <p className="text-xs text-muted-foreground">کارمزد: {fa(0)} تومان · واریز به نام صاحب حساب کیف پول</p>
        </div>
      </Dialog>
    </div>
  );
}
