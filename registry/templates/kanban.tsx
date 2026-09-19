"use client";

import * as React from "react";
import { CalendarDays, Filter, GripVertical, MoreHorizontal, Plus, Search } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { Badge } from "@/registry/ui/badge";
import { Avatar, AvatarGroup } from "@/registry/ui/avatar";
import { Input } from "@/registry/ui/input";
import { DropdownMenu } from "@/registry/ui/dropdown-menu";
import { cn, fa } from "@/lib/utils";
import { formatJalali } from "@/lib/jalali";

type Card = { id: string; title: string; tag: string; tone: "brand" | "success" | "warning" | "destructive" | "secondary"; who: string; due: Date; done: number; total: number };
type Col = { id: string; title: string; cards: Card[] };
const day = (n: number) => new Date(Date.now() + n * 864e5);
const TODAY = new Date(); TODAY.setHours(0, 0, 0, 0); // a card due today is not overdue yet
const initial: Col[] = [
  { id: "backlog", title: "بک‌لاگ", cards: [
    { id: "c1", title: "بازطراحی صفحه‌ی پرداخت", tag: "طراحی", tone: "brand", who: "مریم احمدی", due: day(6), done: 0, total: 4 },
    { id: "c2", title: "اضافه‌کردن ورود با گوگل", tag: "بک‌اند", tone: "secondary", who: "علی رضایی", due: day(9), done: 0, total: 3 },
    { id: "c3", title: "متن خطاهای فرم ثبت‌نام", tag: "محتوا", tone: "warning", who: "نگار کریمی", due: day(3), done: 1, total: 2 },
  ] },
  { id: "doing", title: "در حال انجام", cards: [
    { id: "c4", title: "تقویم شمسی در رزرو نوبت", tag: "فرانت", tone: "success", who: "رضا موسوی", due: day(1), done: 3, total: 5 },
    { id: "c5", title: "باگ ارقام فارسی در فاکتور", tag: "باگ", tone: "destructive", who: "علی رضایی", due: day(0), done: 1, total: 1 },
  ] },
  { id: "review", title: "بازبینی", cards: [
    { id: "c6", title: "پیامک کد تأیید با الگوی جدید", tag: "بک‌اند", tone: "secondary", who: "مریم احمدی", due: day(2), done: 2, total: 2 },
  ] },
  { id: "done", title: "انجام‌شده", cards: [
    { id: "c7", title: "تم روشن برای پنل ادمین", tag: "طراحی", tone: "brand", who: "نگار کریمی", due: day(-2), done: 6, total: 6 },
    { id: "c8", title: "خروجی اکسل سفارش‌ها", tag: "فرانت", tone: "success", who: "رضا موسوی", due: day(-4), done: 3, total: 3 },
  ] },
];

/** برد کارها: چهار ستون با کشیدن و رها کردن، منوی انتقال برای کیبورد، تاریخ شمسی و پیشرفت زیرکارها. */
export function KanbanBoard() {
  const [cols, setCols] = React.useState(initial);
  const [dragging, setDragging] = React.useState<string | null>(null);
  const [over, setOver] = React.useState<string | null>(null);
  const [adding, setAdding] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState("");

  function move(cardId: string, toCol: string) {
    setCols((cs) => {
      const from = cs.find((c) => c.cards.some((k) => k.id === cardId));
      const card = from?.cards.find((k) => k.id === cardId);
      if (!from || !card || from.id === toCol) return cs;
      return cs.map((c) => c.id === from.id ? { ...c, cards: c.cards.filter((k) => k.id !== cardId) } : c.id === toCol ? { ...c, cards: [...c.cards, card] } : c);
    });
  }
  function add(colId: string) {
    const title = draft.trim();
    if (title) setCols((cs) => cs.map((c) => c.id === colId ? { ...c, cards: [...c.cards, { id: `n${Date.now()}`, title, tag: "جدید", tone: "secondary", who: "سارا محمدی", due: day(7), done: 0, total: 1 }] } : c));
    setDraft(""); setAdding(null);
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3 sm:px-6">
        <div><h1 className="text-lg font-bold">بازطراحی اپ فروشگاه</h1><p className="text-xs text-muted-foreground">اسپرینت ۱۴ · {formatJalali(new Date(), { weekday: true })}</p></div>
        <div className="ms-auto flex items-center gap-2">
          <AvatarGroup people={[{ name: "مریم احمدی" }, { name: "علی رضایی" }, { name: "نگار کریمی" }, { name: "رضا موسوی" }, { name: "سارا محمدی" }]} max={4} size="sm" />
          <div className="hidden w-56 md:block"><Input placeholder="جست‌وجوی کار…" startAddon={<Search className="size-4" />} className="h-9" /></div>
          <Button variant="outline" size="sm"><Filter />فیلتر</Button>
          <Button size="sm" onClick={() => setAdding("backlog")}><Plus />کار جدید</Button>
        </div>
      </header>

      <div className="flex flex-1 gap-4 overflow-x-auto p-4 sm:p-6">
        {cols.map((col) => (
          <section
            key={col.id}
            aria-label={col.title}
            onDragOver={(e) => { e.preventDefault(); setOver(col.id); }}
            onDragLeave={() => setOver((o) => (o === col.id ? null : o))}
            onDrop={(e) => { e.preventDefault(); if (dragging) move(dragging, col.id); setDragging(null); setOver(null); }}
            className={cn("flex w-72 shrink-0 flex-col rounded-2xl border bg-card/60 transition-colors", over === col.id && dragging ? "border-foreground/40 bg-accent/40" : "border-border")}
          >
            <div className="flex items-center gap-2 px-3 py-3"><h2 className="text-sm font-semibold">{col.title}</h2><span className="rounded-full bg-secondary px-2 text-[11px] text-muted-foreground">{fa(col.cards.length)}</span><button type="button" aria-label="افزودن کار" onClick={() => setAdding(col.id)} className="ms-auto flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"><Plus className="size-4" /></button></div>
            <ul className="flex flex-1 flex-col gap-2 px-2 pb-2">
              {col.cards.map((card) => {
                const overdue = card.due < TODAY && col.id !== "done";
                return (
                  <li
                    key={card.id}
                    draggable
                    onDragStart={(e) => { setDragging(card.id); e.dataTransfer.effectAllowed = "move"; }}
                    onDragEnd={() => { setDragging(null); setOver(null); }}
                    className={cn("group cursor-grab rounded-xl border border-border bg-card p-3 shadow-sm transition-[opacity,transform] active:cursor-grabbing", dragging === card.id && "scale-[0.98] opacity-50")}
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical className="mt-0.5 size-4 shrink-0 text-muted-foreground/50" aria-hidden />
                      <p className="flex-1 text-sm font-medium leading-5">{card.title}</p>
                      <DropdownMenu
                        align="end"
                        trigger={<button type="button" aria-label="گزینه‌ها" className="flex size-6 cursor-pointer items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-accent group-hover:opacity-100 focus-visible:opacity-100"><MoreHorizontal className="size-4" /></button>}
                        items={[{ type: "label", label: "انتقال به" }, ...cols.filter((c) => c.id !== col.id).map((c) => ({ label: c.title, onSelect: () => move(card.id, c.id) }))]}
                      />
                    </div>
                    <div className="mt-3 flex items-center gap-2"><Badge variant={card.tone} className="rounded-md bg-secondary px-1.5 text-[11px] leading-5">{card.tag}</Badge><span className="text-[11px] text-muted-foreground">{fa(card.done)}/{fa(card.total)}</span><div className="h-1 flex-1 overflow-hidden rounded-full bg-input"><div className="h-full rounded-full bg-primary" style={{ width: `${(card.done / card.total) * 100}%` }} /></div></div>
                    <div className="mt-3 flex items-center justify-between"><span className={cn("flex items-center gap-1 text-[11px]", overdue ? "text-destructive" : "text-muted-foreground")}><CalendarDays className="size-3.5" />{formatJalali(card.due)}</span><Avatar name={card.who} size="sm" /></div>
                  </li>
                );
              })}
              {adding === col.id && (
                <li className="rounded-xl border border-dashed border-border p-2">
                  <Input autoFocus placeholder="عنوان کار…" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") add(col.id); if (e.key === "Escape") { setAdding(null); setDraft(""); } }} className="h-9" />
                  <div className="mt-2 flex gap-1.5"><Button size="sm" onClick={() => add(col.id)}>افزودن</Button><Button size="sm" variant="ghost" onClick={() => { setAdding(null); setDraft(""); }}>انصراف</Button></div>
                </li>
              )}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
