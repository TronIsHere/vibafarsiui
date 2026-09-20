"use client";

import * as React from "react";
import { MessageSquarePlus, Paperclip, Search } from "lucide-react";
import { Avatar } from "@/registry/ui/avatar";
import { Badge } from "@/registry/ui/badge";
import { Button } from "@/registry/ui/button";
import { EmptyState } from "@/registry/ui/empty-state";
import { SearchInput } from "@/registry/ui/search-input";
import { Textarea } from "@/registry/ui/textarea";
import { Timeline } from "@/registry/ui/timeline";
import { cn, fa } from "@/lib/utils";
import { formatJalali } from "@/lib/jalali";

type Status = "open" | "waiting" | "done";
type Ticket = {
  id: string;
  subject: string;
  customer: string;
  status: Status;
  channel: string;
  updated: Date;
  messages: { from: "user" | "agent"; text: string; at: Date }[];
};

const statusLabel: Record<Status, string> = { open: "باز", waiting: "در انتظار شما", done: "بسته‌شده" };
const statusVariant: Record<Status, "brand" | "warning" | "secondary"> = {
  open: "brand",
  waiting: "warning",
  done: "secondary",
};

const tickets: Ticket[] = [
  {
    id: "TK-۴۸۲۱",
    subject: "واریز انجام شد ولی سفارش ثبت نشد",
    customer: "سارا محمدی",
    status: "open",
    channel: "درگاه زرین‌پال",
    updated: new Date(),
    messages: [
      { from: "user", text: "مبلغ ۸۹۰ هزار تومان از کارتم کم شد ولی صفحه رسید نیامد.", at: new Date(Date.now() - 2 * 3600e3) },
      { from: "agent", text: "کد پیگیری درگاه را اگر دارید بفرستید تا وضعیت را چک کنیم.", at: new Date(Date.now() - 90 * 60e3) },
      { from: "user", text: "کد: A000000000000000000000000000xyz", at: new Date(Date.now() - 40 * 60e3) },
    ],
  },
  {
    id: "TK-۴۸۱۰",
    subject: "تغییر آدرس ارسال قبل از پست",
    customer: "علی رضایی",
    status: "waiting",
    channel: "وب‌سایت",
    updated: new Date(Date.now() - 864e5),
    messages: [
      { from: "user", text: "سفارش هنوز ارسال نشده؛ می‌خواهم آدرس را عوض کنم.", at: new Date(Date.now() - 864e5) },
      { from: "agent", text: "آدرس جدید را بفرستید تا قبل از تحویل به پست اعمال شود.", at: new Date(Date.now() - 20 * 3600e3) },
    ],
  },
  {
    id: "TK-۴۷۹۲",
    subject: "درخواست فاکتور رسمی",
    customer: "نگار کریمی",
    status: "done",
    channel: "ایمیل",
    updated: new Date(Date.now() - 3 * 864e5),
    messages: [
      { from: "user", text: "برای حسابداری به فاکتور با کد اقتصادی نیاز دارم.", at: new Date(Date.now() - 4 * 864e5) },
      { from: "agent", text: "فاکتور به ایمیل‌تان ارسال شد.", at: new Date(Date.now() - 3 * 864e5) },
    ],
  },
];

/** پشتیبانی: فهرست تیکت، جزئیات گفت‌وگو، خط زمان وضعیت و پاسخ سریع. */
export function SupportPage() {
  const [q, setQ] = React.useState("");
  const [active, setActive] = React.useState(tickets[0].id);
  const [draft, setDraft] = React.useState("");
  const filtered = tickets.filter((t) => !q || t.subject.includes(q) || t.customer.includes(q) || t.id.includes(q));
  const ticket = tickets.find((t) => t.id === active) ?? filtered[0];

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="flex h-14 items-center gap-3 border-b border-border px-4">
        <p className="font-bold">پشتیبانی دکان</p>
        <Badge variant="secondary" className="ms-1">{fa(tickets.filter((t) => t.status !== "done").length)} باز</Badge>
        <Button size="sm" className="ms-auto"><MessageSquarePlus />تیکت جدید</Button>
      </header>

      <div className="mx-auto grid max-w-6xl lg:grid-cols-[20rem_1fr_16rem]">
        <aside className="border-b border-border lg:border-b-0 lg:border-e">
          <div className="p-3"><SearchInput value={q} onChange={setQ} placeholder="جست‌وجوی تیکت…" /></div>
          <ul className="max-h-[40vh] overflow-auto lg:max-h-[calc(100dvh-7rem)]">
            {filtered.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => setActive(t.id)}
                  className={cn(
                    "flex w-full cursor-pointer flex-col gap-1 border-b border-border px-4 py-3 text-start transition-colors hover:bg-accent/50",
                    ticket?.id === t.id && "bg-accent/60",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] text-muted-foreground" dir="ltr">{t.id}</span>
                    <Badge variant={statusVariant[t.status]} className="shrink-0">{statusLabel[t.status]}</Badge>
                  </div>
                  <p className="line-clamp-1 text-sm font-medium">{t.subject}</p>
                  <p className="text-xs text-muted-foreground">{t.customer} · {formatJalali(t.updated)}</p>
                </button>
              </li>
            ))}
          </ul>
          {filtered.length === 0 && (
            <div className="p-4">
              <EmptyState icon={Search} title="تیکتی پیدا نشد" description="عبارت دیگری امتحان کنید یا فیلتر را پاک کنید." />
            </div>
          )}
        </aside>

        {ticket ? (
          <>
            <section className="flex min-h-112 flex-col">
              <div className="border-b border-border px-5 py-4">
                <h1 className="text-base font-bold leading-6">{ticket.subject}</h1>
                <p className="mt-1 text-xs text-muted-foreground">
                  {ticket.customer} · از طریق {ticket.channel} · آخرین به‌روزرسانی {formatJalali(ticket.updated, { weekday: true })}
                </p>
              </div>
              <div className="flex-1 space-y-4 overflow-auto p-5">
                {ticket.messages.map((m, i) => (
                  <div key={i} className={cn("flex gap-3", m.from === "agent" && "flex-row-reverse")}>
                    <Avatar name={m.from === "agent" ? "پشتیبان" : ticket.customer} size="sm" />
                    <div className={cn("max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-7", m.from === "agent" ? "bg-primary text-primary-foreground" : "bg-secondary")}>
                      <p>{m.text}</p>
                      <p className={cn("mt-1 text-[11px]", m.from === "agent" ? "text-primary-foreground/70" : "text-muted-foreground")}>
                        {formatJalali(m.at)} · {fa(m.at.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border p-4">
                <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="پاسخ‌تان را بنویسید…" autoResize rows={3} maxLength={1000} showCount />
                <div className="mt-3 flex items-center gap-2">
                  <Button disabled={!draft.trim()} onClick={() => setDraft("")}>ارسال پاسخ</Button>
                  <Button variant="ghost" size="icon" aria-label="پیوست"><Paperclip /></Button>
                </div>
              </div>
            </section>

            <aside className="hidden border-s border-border p-5 lg:block">
              <h2 className="mb-4 text-sm font-semibold">وضعیت پرونده</h2>
              <Timeline
                activeIndex={ticket.status === "done" ? 2 : ticket.status === "waiting" ? 1 : 0}
                items={[
                  { date: ticket.messages[0].at, title: "ثبت تیکت", description: "توسط مشتری" },
                  { date: ticket.messages[1]?.at ?? ticket.updated, title: "پاسخ پشتیبان", description: "در صف بررسی" },
                  { date: ticket.status === "done" ? ticket.updated : "هنوز بسته نشده", title: "بستن پرونده" },
                ]}
              />
              <dl className="mt-8 space-y-3 text-sm">
                <div className="flex justify-between gap-2"><dt className="text-muted-foreground">اولویت</dt><dd>بالا</dd></div>
                <div className="flex justify-between gap-2"><dt className="text-muted-foreground">مسئول</dt><dd>مینا احمدی</dd></div>
                <div className="flex justify-between gap-2"><dt className="text-muted-foreground">کانال</dt><dd>{ticket.channel}</dd></div>
              </dl>
            </aside>
          </>
        ) : null}
      </div>
    </div>
  );
}
