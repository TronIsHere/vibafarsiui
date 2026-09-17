"use client";

import * as React from "react";
import { Bell, CheckCheck } from "lucide-react";
import { cn, fa } from "@/lib/utils";
import { timeAgo } from "@/lib/persian";
import { Popover } from "./popover";

export interface Notification {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  date: Date;
  read?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  href?: string;
}

function bucket(d: Date, now: Date) {
  const days = Math.floor((now.setHours(0, 0, 0, 0) - new Date(d).setHours(0, 0, 0, 0)) / 864e5);
  return days <= 0 ? "امروز" : days === 1 ? "دیروز" : "قدیمی‌تر";
}

/** صندوق اعلان. Bell with unread badge; panel groups by امروز / دیروز / قدیمی‌تر with «همه» and «نخوانده» tabs. */
export function NotificationInbox({ items, onRead, onReadAll, className }: { items: Notification[]; onRead?: (id: string) => void; onReadAll?: () => void; className?: string }) {
  const [tab, setTab] = React.useState<"all" | "unread">("all");
  const unread = items.filter((i) => !i.read).length;
  const list = tab === "all" ? items : items.filter((i) => !i.read);
  const groups = ["امروز", "دیروز", "قدیمی‌تر"].map((g) => [g, list.filter((i) => bucket(i.date, new Date()) === g)] as const).filter(([, l]) => l.length);

  return (
    <Popover
      className={cn("w-80 p-0", className)}
      align="end"
      trigger={
        <span className="relative inline-flex size-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground">
          <Bell className="size-4" />
          {unread > 0 && <span className="absolute -end-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-brand-foreground">{fa(unread)}</span>}
        </span>
      }
    >
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <div className="inline-flex rounded-md bg-background p-0.5 text-xs">
          {(["all", "unread"] as const).map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)} className={cn("cursor-pointer rounded px-2 py-1 transition-colors", tab === t ? "bg-secondary font-semibold" : "text-muted-foreground")}>
              {t === "all" ? "همه" : `نخوانده (${fa(unread)})`}
            </button>
          ))}
        </div>
        <button type="button" onClick={onReadAll} disabled={!unread} className="inline-flex cursor-pointer items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground disabled:opacity-40">
          <CheckCheck className="size-3.5" />خواندن همه
        </button>
      </div>
      <div className="max-h-80 overflow-auto">
        {groups.length === 0 && <p className="p-6 text-center text-xs text-muted-foreground">اعلانی نیست.</p>}
        {groups.map(([g, l]) => (
          <div key={g}>
            <p className="px-3 pb-1 pt-2 text-[11px] text-muted-foreground">{g}</p>
            {l.map((n) => (
              <a key={n.id} href={n.href ?? "#"} onClick={() => onRead?.(n.id)} className={cn("flex gap-3 px-3 py-2.5 transition-colors hover:bg-accent/60", !n.read && "bg-accent/30")}>
                <span className="relative mt-0.5">
                  <span className="flex size-8 items-center justify-center rounded-full bg-secondary">{n.icon ? <n.icon className="size-4" /> : <Bell className="size-4" />}</span>
                  {!n.read && <span className="absolute -end-0.5 -top-0.5 size-2 rounded-full bg-brand" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium leading-5">{n.title}</span>
                  {n.description && <span className="block truncate text-xs text-muted-foreground">{n.description}</span>}
                  <span className="block text-[11px] text-muted-foreground">{timeAgo(n.date)}</span>
                </span>
              </a>
            ))}
          </div>
        ))}
      </div>
    </Popover>
  );
}
