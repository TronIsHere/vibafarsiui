"use client";

import {
  Bell,
  Home,
  Package,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react";
import { Sidebar, SidebarGroup, SidebarItem } from "@/registry/ui/sidebar";
import { Stat } from "@/registry/ui/stat";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/ui/table";
import { Badge } from "@/registry/ui/badge";
import { Avatar } from "@/registry/ui/avatar";
import { Progress } from "@/registry/ui/progress";
import { Button } from "@/registry/ui/button";
import { Input } from "@/registry/ui/input";
import { fa, faNumber, formatToman } from "@/lib/utils";
import { formatJalali } from "@/lib/jalali";

const stats = [
  {
    label: "فروش امروز",
    value: faNumber(12_450_000),
    unit: "تومان",
    delta: 18,
  },
  { label: "سفارش‌های باز", value: fa(246), delta: 12 },
  { label: "مشتریان جدید", value: fa(38), delta: -4 },
  { label: "میانگین سبد", value: faNumber(1_860_000), unit: "تومان", delta: 6 },
];
const bars = [44, 62, 54, 78, 70, 96, 64];
const days = ["ش", "ی", "د", "س", "چ", "پ", "ج"];
const orders = [
  {
    id: "14052",
    name: "مریم احمدی",
    amount: 2_890_000,
    status: "پرداخت‌شده",
    tone: "success" as const,
  },
  {
    id: "14051",
    name: "علی رضایی",
    amount: 640_000,
    status: "در انتظار",
    tone: "warning" as const,
  },
  {
    id: "14050",
    name: "نگار کریمی",
    amount: 1_215_000,
    status: "ارسال‌شده",
    tone: "brand" as const,
  },
  {
    id: "14049",
    name: "رضا موسوی",
    amount: 3_400_000,
    status: "پرداخت‌شده",
    tone: "success" as const,
  },
];

/** داشبورد فروشگاه: نوار کناری، آمار، نمودار هفتگی، سفارش‌های اخیر و هدف ماهانه. */
export function ShopDashboard() {
  return (
    <div className="flex min-h-dvh bg-background text-foreground">
      <Sidebar
        className="hidden h-dvh w-60 shrink-0 rounded-none border-0 border-e lg:flex"
        header={<span className="text-sm font-bold">فروشگاه من</span>}
      >
        <SidebarItem icon={Home} label="خانه" active />
        <SidebarGroup title="فروش">
          <SidebarItem icon={ShoppingBag} label="سفارش‌ها" badge={12} />
          <SidebarItem icon={Package} label="محصولات" />
          <SidebarItem icon={Users} label="مشتریان" />
        </SidebarGroup>
        <SidebarGroup title="حساب">
          <SidebarItem icon={Settings} label="تنظیمات" />
        </SidebarGroup>
      </Sidebar>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between gap-4 border-b border-border px-4 sm:px-6">
          <div className="w-full max-w-xs">
            <Input
              placeholder="جست‌وجو در سفارش‌ها…"
              startAddon={<Search className="size-4" />}
              className="h-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="اعلان‌ها"
              className="size-9"
            >
              <Bell />
            </Button>
            <Avatar name="سارا محمدی" size="sm" />
          </div>
        </header>

        <main className="flex-1 space-y-6 p-4 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold">داشبورد فروش</h1>
              <p className="text-sm text-muted-foreground">
                {formatJalali(new Date(), { weekday: true })}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                خروجی اکسل
              </Button>
              <Button size="sm">
                <Plus />
                محصول جدید
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((s) => (
              <Stat key={s.label} {...s} />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
            <div className="rounded-xl border border-border bg-card p-4 lg:col-span-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">فروش هفتگی</p>
                  <p className="text-xs text-muted-foreground">
                    ۱۹ تا ۲۵ شهریور
                  </p>
                </div>
                <Badge variant="success">رشد ۲۳٪</Badge>
              </div>
              <div className="mt-6 flex items-end gap-2 sm:gap-3">
                {bars.map((h, i) => (
                  <div
                    key={i}
                    className="flex flex-1 flex-col items-center gap-2"
                  >
                    <div
                      className={`w-full rounded-md ${i === 5 ? "bg-primary" : "bg-foreground/15"}`}
                      style={{ height: h }}
                    />
                    <span className="text-[11px] text-muted-foreground">
                      {days[i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-4 lg:col-span-2">
              <div>
                <p className="text-sm font-semibold">هدف ماهانه</p>
                <p className="text-xs text-muted-foreground">
                  ۷۲٪ از هدف ۳۰۰ میلیون تومانی
                </p>
              </div>
              <div className="mt-6 space-y-2">
                <Progress value={72} />
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>۲۱۶ میلیون</span>
                  <span>۳۰۰ میلیون</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">سفارش‌های اخیر</h2>
              <a
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                مشاهده‌ی همه
              </a>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>شماره</TableHead>
                  <TableHead>مشتری</TableHead>
                  <TableHead>مبلغ</TableHead>
                  <TableHead>وضعیت</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell
                      className="  text-xs text-muted-foreground"
                      dir="ltr"
                    >
                      #{fa(o.id)}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <Avatar name={o.name} size="sm" />
                        {o.name}
                      </span>
                    </TableCell>
                    <TableCell numeric>{formatToman(o.amount)}</TableCell>
                    <TableCell>
                      <Badge variant={o.tone}>{o.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </div>
  );
}
