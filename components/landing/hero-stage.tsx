"use client";

import * as React from "react";
import Link from "next/link";
import {
  Home,
  Package,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react";
import { Avatar } from "@/registry/ui/avatar";
import { Badge } from "@/registry/ui/badge";
import { Button } from "@/registry/ui/button";
import { Calendar } from "@/registry/ui/calendar";
import { Input } from "@/registry/ui/input";
import { PhoneInput } from "@/registry/ui/phone-input";
import { Progress } from "@/registry/ui/progress";
import {
  Sidebar,
  SidebarGroup,
  SidebarItem,
} from "@/registry/ui/sidebar";
import { Stat } from "@/registry/ui/stat";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/ui/table";
import { GradientMeshBackground } from "@/registry/backgrounds/gradient-mesh";
import { GridBackground } from "@/registry/backgrounds/grid";
import { formatJalali } from "@/lib/jalali";
import { fa, faNumber, formatToman } from "@/lib/utils";

const ORDERS = [
  { id: "14052", name: "مریم احمدی", amount: 2_890_000, status: "پرداخت‌شده", tone: "success" as const },
  { id: "14051", name: "علی رضایی", amount: 640_000, status: "در انتظار", tone: "warning" as const },
  { id: "14050", name: "نگار کریمی", amount: 1_215_000, status: "ارسال‌شده", tone: "brand" as const },
  { id: "14049", name: "رضا موسوی", amount: 3_400_000, status: "پرداخت‌شده", tone: "success" as const },
];

const WEEK = [
  { d: "ش", h: 44 },
  { d: "ی", h: 62 },
  { d: "د", h: 54 },
  { d: "س", h: 78 },
  { d: "چ", h: 70 },
  { d: "پ", h: 96 },
  { d: "ج", h: 64 },
];

function stay(e: React.MouseEvent) {
  e.preventDefault();
}

/**
 * Full-width live shop: RTL sidebar, Jalali calendar, toman stats,
 * Iran mobile input, Saturday-first week. Real registry components.
 */
export function HeroStage() {
  const [phone, setPhone] = React.useState("9123456789");

  return (
    <div className="relative overflow-hidden">
      <GridBackground
        size={40}
        className="opacity-70 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_90%)]"
      />
      <GradientMeshBackground className="opacity-50" />

      <div className="relative p-4 sm:p-6 lg:p-8">
        <div className="flex overflow-hidden rounded-xl border border-border bg-card/95 shadow-[0_24px_80px_-36px_oklch(0_0_0/0.55)] animate-fade-up">
          <Sidebar
            className="hidden shrink-0 rounded-none border-0 border-e md:flex md:flex-col"
            header={<span className="text-sm font-bold">فروشگاه من</span>}
          >
            <SidebarItem icon={Home} label="خانه" active onClick={stay} />
            <SidebarGroup title="فروش">
              <SidebarItem icon={ShoppingBag} label="سفارش‌ها" badge={12} onClick={stay} />
              <SidebarItem icon={Package} label="محصولات" onClick={stay} />
              <SidebarItem icon={Users} label="مشتریان" onClick={stay} />
            </SidebarGroup>
            <SidebarGroup title="حساب">
              <SidebarItem icon={Settings} label="تنظیمات" onClick={stay} />
            </SidebarGroup>
          </Sidebar>

          <div className="min-w-0 flex-1">
            <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold">داشبورد فروش</p>
                <p className="text-xs text-muted-foreground">
                  {formatJalali(new Date(), { weekday: true })}
                </p>
              </div>
              <div className="hidden min-w-0 max-w-xs flex-1 sm:block">
                <Input
                  placeholder="جست‌وجو در سفارش‌ها…"
                  startAddon={<Search className="size-4" />}
                  className="h-9"
                />
              </div>
              <Button size="sm" className="shrink-0">
                <Plus />
                محصول جدید
              </Button>
            </header>

            <div className="grid grid-cols-2 gap-3 p-3 sm:p-4 lg:grid-cols-4">
              <Stat
                size="sm"
                label="فروش امروز"
                value={faNumber(12_450_000)}
                unit="تومان"
                delta={18}
              />
              <Stat size="sm" label="سفارش‌های باز" value={fa(246)} delta={12} />
              <Stat size="sm" label="مشتریان جدید" value={fa(38)} delta={-4} />
              <Stat
                size="sm"
                label="میانگین سبد"
                value={faNumber(1_860_000)}
                unit="تومان"
                delta={6}
              />
            </div>

            <div className="grid gap-3 px-3 sm:px-4 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start">
              <Calendar
                defaultValue={new Date()}
                className="mx-auto shrink-0 bg-background sm:mx-0"
              />
              <div className="flex min-h-[248px] flex-col rounded-xl border border-border bg-background/60 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">فروش هفتگی</p>
                    <p className="text-[11px] text-muted-foreground">شنبه تا جمعه</p>
                  </div>
                  <Badge variant="success">رشد ۲۳٪</Badge>
                </div>
                <div className="mt-3 flex min-h-[120px] flex-1 items-stretch gap-1.5 sm:gap-2.5">
                  {WEEK.map((b, i) => (
                    <div key={b.d} className="flex flex-1 flex-col gap-1.5">
                      <div className="flex min-h-0 flex-1 items-end">
                        <div
                          className={`w-full rounded-md ${i === 5 ? "bg-primary" : "bg-foreground/30"}`}
                          style={{ height: `${Math.max(22, (b.h / 96) * 100)}%` }}
                        />
                      </div>
                      <span className="text-center text-[11px] text-muted-foreground">{b.d}</span>
                    </div>
                  ))}
                </div>
                <Progress
                  className="mt-4"
                  size="sm"
                  value={72}
                  label="هدف ماه"
                  showValue
                />
              </div>
            </div>

            <div className="grid gap-3 p-3 sm:p-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div className="rounded-xl border border-border bg-background/60 p-3">
                <p className="text-sm font-medium">لینک پرداخت پیامکی</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  پیش‌شماره‌ی ایران، با تشخیص اپراتور
                </p>
                <div className="mt-2.5">
                  <PhoneInput
                    id="hero-phone"
                    value={phone}
                    onChange={(digits) => setPhone(digits)}
                  />
                </div>
              </div>
              <div className="min-w-0">
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
                    {ORDERS.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="text-xs text-muted-foreground" dir="ltr">
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
            </div>
          </div>
        </div>

        <p
          className="mt-3 text-center text-[11px] text-muted-foreground animate-fade-up"
          style={{ animationDelay: "80ms" }}
        >
          <Link
            href="/templates/shop-dashboard"
            className="cursor-pointer underline-offset-4 transition-colors duration-200 hover:text-foreground hover:underline"
          >
            قالب داشبورد فروشگاه
          </Link>
          {" · "}
          تقویم شمسی، تومان و شماره‌ی ایران، همه زنده و واقعی
        </p>
      </div>
    </div>
  );
}
