"use client";

import * as React from "react";
import { ArrowDownLeft, ArrowUpLeft, Bell, Eye, EyeOff, LineChart as LineIcon, PieChart, Repeat, Search, Settings, Wallet } from "lucide-react";
import { Sidebar, SidebarGroup, SidebarItem } from "@/registry/ui/sidebar";
import { Stat } from "@/registry/ui/stat";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/registry/ui/table";
import { Badge } from "@/registry/ui/badge";
import { Avatar } from "@/registry/ui/avatar";
import { Button } from "@/registry/ui/button";
import { Field, Input } from "@/registry/ui/input";
import { Select } from "@/registry/ui/select";
import { Slider } from "@/registry/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/ui/tabs";
import { LineChart, Sparkline, jalaliDayLabels } from "@/registry/ui/chart";
import { Odometer } from "@/registry/animations/odometer";
import { cn, en, fa, faNumber, faPercent, formatToman } from "@/lib/utils";
import { formatJalali } from "@/lib/jalali";

const assets = [
  { sym: "BTC", name: "بیت‌کوین", price: 6_120_000_000, change: 2.4, amount: 0.042, spark: [58, 60, 59, 62, 64, 63, 66, 68] },
  { sym: "ETH", name: "اتریوم", price: 312_000_000, change: -1.1, amount: 0.8, spark: [40, 42, 41, 39, 38, 40, 37, 36] },
  { sym: "USDT", name: "تتر", price: 98_400, change: 0.3, amount: 1_250, spark: [20, 20, 21, 20, 21, 21, 21, 22] },
  { sym: "XAU", name: "طلای ۱۸ عیار (گرم)", price: 9_850_000, change: 1.8, amount: 12, spark: [30, 31, 33, 32, 35, 36, 38, 39] },
  { sym: "USD", name: "دلار", price: 98_900, change: -0.4, amount: 400, spark: [25, 26, 25, 24, 24, 23, 23, 22] },
];
const dayLabels = jalaliDayLabels(14);
// every other label, so 14 points fit without overlapping
const history = [412, 418, 405, 430, 442, 438, 451, 460, 455, 472, 481, 476, 490, 503].map((v, i) => ({ label: i % 2 ? "" : dayLabels[i], value: v * 1_000_000 }));
const txs = [
  { id: 1, title: "خرید بیت‌کوین", amount: -12_000_000, date: new Date(), kind: "buy" as const },
  { id: 2, title: "واریز از کارت ۶۰۳۷", amount: 20_000_000, date: new Date(Date.now() - 864e5), kind: "in" as const },
  { id: 3, title: "فروش تتر", amount: 4_920_000, date: new Date(Date.now() - 2 * 864e5), kind: "sell" as const },
  { id: 4, title: "برداشت به شبا", amount: -8_000_000, date: new Date(Date.now() - 4 * 864e5), kind: "out" as const, pending: true },
];

function TradeForm({ side }: { side: "buy" | "sell" }) {
  const [asset, setAsset] = React.useState("BTC");
  const [pct, setPct] = React.useState(25);
  const [amount, setAmount] = React.useState("");
  const a = assets.find((x) => x.sym === asset)!;
  const toman = Number(en(amount).replace(/\D/g, ""));
  const qty = toman ? toman / a.price : 0;
  return (
    <div className="space-y-4 pt-4">
      <Field label="دارایی" htmlFor={`${side}-asset`}><Select id={`${side}-asset`} value={asset} onChange={(e) => setAsset(e.target.value)} options={assets.map((x) => ({ value: x.sym, label: `${x.name} · ${formatToman(x.price)}` }))} /></Field>
      <Field label="مبلغ (تومان)" htmlFor={`${side}-amt`} hint={qty ? `معادل ${fa(qty.toFixed(4)).replace(".", "٫")} ${a.sym}` : "موجودی قابل استفاده: ۲۶٬۴۰۰٬۰۰۰ تومان"}><Input id={`${side}-amt`} inputMode="numeric" value={amount ? faNumber(toman) : ""} onChange={(e) => setAmount(e.target.value)} placeholder="۵٬۰۰۰٬۰۰۰" /></Field>
      <Slider label="از موجودی" value={pct} onChange={setPct} step={5} format={(v) => faPercent(v)} />
      <Button className="w-full" variant={side === "buy" ? "default" : "outline"} disabled={!toman}>{side === "buy" ? "خرید" : "فروش"} {a.name}</Button>
    </div>
  );
}

/** داشبورد مالی: ارزش دارایی با شماره‌انداز، نمودار ۱۴ روزه، جدول دارایی‌ها با اسپارک‌لاین، معامله‌ی سریع و تراکنش‌ها. */
export function FinanceDashboard() {
  const [hidden, setHidden] = React.useState(false);
  const total = assets.reduce((s, a) => s + a.price * a.amount, 0);
  return (
    <div className="flex min-h-dvh bg-background text-foreground">
      <Sidebar className="hidden h-dvh w-60 shrink-0 rounded-none border-0 border-e lg:flex" header={<span className="text-sm font-bold">صرافی نگاه</span>} footer={<div className="flex items-center gap-2 text-xs"><Avatar name="سارا محمدی" size="sm" /><span>سارا محمدی</span></div>}>
        <SidebarItem icon={PieChart} label="نمای کلی" active />
        <SidebarItem icon={Wallet} label="دارایی‌ها" />
        <SidebarItem icon={Repeat} label="معامله" badge="۳" />
        <SidebarGroup title="گزارش">
          <SidebarItem icon={LineIcon} label="سود و زیان" />
          <SidebarItem icon={Settings} label="تنظیمات" />
        </SidebarGroup>
      </Sidebar>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between gap-4 border-b border-border px-4 sm:px-6">
          <div className="w-full max-w-xs"><Input placeholder="جست‌وجوی دارایی…" startAddon={<Search className="size-4" />} className="h-9" /></div>
          <div className="flex items-center gap-2"><Badge variant="success" className="hidden rounded-full border border-success/30 px-2 sm:inline-flex">بازار باز است</Badge><Button variant="ghost" size="icon" aria-label="اعلان‌ها" className="size-9"><Bell /></Button><Avatar name="سارا محمدی" size="sm" /></div>
        </header>

        <main className="flex-1 space-y-6 p-4 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 lg:col-span-2" style={{ backgroundImage: "radial-gradient(70% 90% at 100% 0%, oklch(from var(--brand) l c h / 18%), transparent 70%)" }}>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">ارزش کل دارایی</span>
                <button type="button" onClick={() => setHidden((h) => !h)} aria-label={hidden ? "نمایش" : "پنهان"} className="cursor-pointer text-muted-foreground hover:text-foreground">{hidden ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>
              </div>
              <div className="mt-2 text-3xl font-bold sm:text-4xl">{hidden ? "•••••••••" : <Odometer value={Math.round(total)} unit="تومان" />}</div>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                <span className="flex items-center gap-1 text-success"><ArrowUpLeft className="size-4" />{faPercent(3.2, 1)} امروز</span>
                <span className="text-muted-foreground">{formatJalali(new Date(), { weekday: true })}</span>
              </div>
              <div className="mt-6 flex gap-2"><Button size="sm">واریز</Button><Button size="sm" variant="outline">برداشت</Button><Button size="sm" variant="ghost">تبدیل</Button></div>
            </div>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
              <Stat size="sm" label="سود امروز" value={faNumber(14_800_000)} unit="تومان" delta={3.2} />
              <Stat size="sm" label="سود ۳۰ روز" value={faNumber(96_400_000)} unit="تومان" delta={11.8} deltaLabel="نسبت به ماه قبل" />
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-5 xl:col-span-2">
              <div className="flex items-center justify-between"><h2 className="text-sm font-semibold">روند ارزش دارایی</h2><span className="text-xs text-muted-foreground">۱۴ روز گذشته</span></div>
              <LineChart data={history} height={220} className="mt-4" />
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-sm font-semibold">معامله‌ی سریع</h2>
              <Tabs defaultValue="buy" className="mt-3">
                <TabsList aria-label="نوع معامله" className="w-full *:flex-1"><TabsTrigger value="buy">خرید</TabsTrigger><TabsTrigger value="sell">فروش</TabsTrigger></TabsList>
                <TabsContent value="buy"><TradeForm side="buy" /></TabsContent>
                <TabsContent value="sell"><TradeForm side="sell" /></TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <div className="overflow-hidden rounded-2xl border border-border bg-card xl:col-span-2">
              <div className="flex items-center justify-between p-5 pb-3"><h2 className="text-sm font-semibold">دارایی‌ها</h2><Button variant="ghost" size="sm">همه‌ی بازار</Button></div>
              <Table>
                <TableHeader><TableRow><TableHead>دارایی</TableHead><TableHead>قیمت</TableHead><TableHead>۲۴ ساعت</TableHead><TableHead className="hidden md:table-cell">نمودار</TableHead><TableHead>ارزش شما</TableHead></TableRow></TableHeader>
                <TableBody>
                  {assets.map((a) => (
                    <TableRow key={a.sym}>
                      <TableCell><div className="flex items-center gap-2"><span className="flex size-8 items-center justify-center rounded-full bg-secondary text-[11px] font-bold" dir="ltr">{a.sym}</span><span className="text-sm font-medium">{a.name}</span></div></TableCell>
                      <TableCell numeric>{faNumber(a.price)}</TableCell>
                      <TableCell><span className={cn("inline-flex items-center gap-0.5 text-sm", a.change >= 0 ? "text-success" : "text-destructive")}>{a.change >= 0 ? <ArrowUpLeft className="size-3.5" /> : <ArrowDownLeft className="size-3.5" />}{faPercent(Math.abs(a.change), 1)}</span></TableCell>
                      <TableCell className="hidden md:table-cell"><Sparkline data={a.spark} positive={a.change >= 0} /></TableCell>
                      <TableCell numeric>{faNumber(Math.round(a.price * a.amount))}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-sm font-semibold">تراکنش‌های اخیر</h2>
              <ul className="mt-3 divide-y divide-border">
                {txs.map((t) => (
                  <li key={t.id} className="flex items-center gap-3 py-3">
                    <span className={cn("flex size-9 items-center justify-center rounded-full", t.amount > 0 ? "bg-success/15 text-success" : "bg-secondary")}>{t.amount > 0 ? <ArrowDownLeft className="size-4" /> : <ArrowUpLeft className="size-4" />}</span>
                    <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{t.title}</p><p className="text-xs text-muted-foreground">{formatJalali(t.date)}</p></div>
                    <div className="text-end"><p className={cn("text-sm font-semibold tabular-nums", t.amount > 0 && "text-success")}>{t.amount > 0 ? "+" : "−"}{faNumber(Math.abs(t.amount))}</p>{t.pending && <Badge variant="warning" className="text-[11px]">در انتظار</Badge>}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
