"use client";

import * as React from "react";
import { Download, Filter, MoreHorizontal, Pencil, Printer, Trash2 } from "lucide-react";
import { DataTable, type Column } from "@/registry/ui/data-table";
import { Badge } from "@/registry/ui/badge";
import { Button } from "@/registry/ui/button";
import { DatePicker } from "@/registry/ui/date-picker";
import { Select } from "@/registry/ui/select";
import { DropdownMenu } from "@/registry/ui/dropdown-menu";
import { Avatar } from "@/registry/ui/avatar";
import { Stat } from "@/registry/ui/stat";
import { fa, faNumber, formatToman } from "@/lib/utils";
import { formatJalali } from "@/lib/jalali";

type Status = "paid" | "pending" | "shipped" | "canceled";
type Order = { id: number; customer: string; amount: number; status: Status; date: Date; items: number; [k: string]: unknown };

const STATUS: Record<Status, { label: string; tone: "success" | "warning" | "brand" | "destructive" }> = {
  paid: { label: "پرداخت‌شده", tone: "success" }, pending: { label: "در انتظار", tone: "warning" }, shipped: { label: "ارسال‌شده", tone: "brand" }, canceled: { label: "لغو شده", tone: "destructive" },
};
const names = ["مریم احمدی", "علی رضایی", "نگار کریمی", "رضا موسوی", "سارا محمدی", "امیر حسینی", "مینا صادقی", "حسین نوری", "الهام رحیمی", "کامران زارع", "فاطمه یوسفی", "بهرام کاظمی"];
const statuses: Status[] = ["paid", "pending", "shipped", "paid", "canceled", "paid", "shipped", "pending", "paid", "paid", "shipped", "paid"];
const orders: Order[] = names.map((customer, i) => ({ id: 14052 - i, customer, amount: (i * 937 + 350) * 1000 + 240_000, status: statuses[i], date: new Date(Date.now() - i * 864e5 * 1.3), items: (i % 4) + 1 }));

/** مدیریت سفارش‌ها: جدول داده با فیلتر تاریخ شمسی، وضعیت، منوی عمل و آمار بالا. */
export function AdminOrdersPage() {
  const [status, setStatus] = React.useState("all");
  const [from, setFrom] = React.useState<Date | null>(null);
  const rows = orders.filter((o) => (status === "all" || o.status === status) && (!from || o.date >= from));

  const columns: Column<Order>[] = [
    { key: "id", header: "شماره", sortable: true, cell: (o) => <span className="font-mono text-xs text-muted-foreground" dir="ltr">#{fa(o.id)}</span> },
    { key: "customer", header: "مشتری", sortable: true, cell: (o) => <span className="flex items-center gap-2"><Avatar name={o.customer} size="sm" />{o.customer}</span> },
    { key: "date", header: "تاریخ", sortable: true, cell: (o) => formatJalali(o.date) },
    { key: "items", header: "اقلام", numeric: true, cell: (o) => fa(o.items) },
    { key: "amount", header: "مبلغ", sortable: true, numeric: true, cell: (o) => formatToman(o.amount) },
    { key: "status", header: "وضعیت", sortable: true, cell: (o) => <Badge variant={STATUS[o.status].tone}>{STATUS[o.status].label}</Badge> },
    { key: "actions", header: "", className: "w-10", cell: () => <DropdownMenu align="end" trigger={<Button variant="ghost" size="icon" className="size-8" aria-label="بیشتر"><MoreHorizontal /></Button>} items={[{ label: "ویرایش", icon: Pencil }, { label: "چاپ فاکتور", icon: Printer }, { type: "separator" }, { label: "لغو سفارش", icon: Trash2, danger: true }]} /> },
  ];

  return (
    <div className="min-h-dvh bg-background p-4 text-foreground sm:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div><h1 className="text-xl font-bold">سفارش‌ها</h1><p className="text-sm text-muted-foreground">{formatJalali(new Date(), { weekday: true })}</p></div>
          <Button variant="outline" size="sm"><Download />خروجی اکسل</Button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Stat label="فروش این هفته" value={faNumber(rows.reduce((s, o) => s + o.amount, 0))} unit="تومان" delta={12} />
          <Stat label="سفارش‌های باز" value={fa(rows.filter((o) => o.status === "pending").length)} delta={-3} />
          <Stat label="میانگین سبد" value={faNumber(Math.round(rows.reduce((s, o) => s + o.amount, 0) / Math.max(1, rows.length)))} unit="تومان" delta={6} />
        </div>
        <DataTable<Order>
          rows={rows}
          columns={columns}
          rowKey={(o) => String(o.id)}
          searchKeys={["customer", "id"]}
          searchPlaceholder="جست‌وجوی مشتری یا شماره…"
          pageSize={8}
          toolbar={
            <>
              <div className="w-40"><Select value={status} onChange={(e) => setStatus(e.target.value)} className="h-9" options={[{ value: "all", label: "همه‌ی وضعیت‌ها" }, ...Object.entries(STATUS).map(([v, s]) => ({ value: v, label: s.label }))]} /></div>
              <div className="w-56"><DatePicker value={from} onChange={setFrom} placeholder="از تاریخ" compact /></div>
              {(status !== "all" || from) && <Button variant="ghost" size="sm" onClick={() => { setStatus("all"); setFrom(null); }}><Filter />پاک کردن فیلتر</Button>}
            </>
          }
        />
      </div>
    </div>
  );
}
