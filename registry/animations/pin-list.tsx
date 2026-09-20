"use client";

import * as React from "react";
import { Pin } from "lucide-react";
import { cn } from "@/lib/utils";

export type PinListItem = {
  id: string;
  name: string;
  info: string;
  icon: React.ElementType;
  pinned: boolean;
};

export type PinListProps = {
  items: PinListItem[];
  labels?: { pinned?: string; unpinned?: string };
  className?: string;
  onChange?: (items: PinListItem[]) => void;
};

type RectMap = Map<string, DOMRect>;

/**
 * فهرست سنجاق. Click a row to pin / unpin it; items animate between the two
 * groups with a lightweight FLIP so the motion stays springy without a library.
 */
export function PinList({
  items: initial,
  labels = { pinned: "سنجاق‌شده", unpinned: "همه" },
  className,
  onChange,
}: PinListProps) {
  const [items, setItems] = React.useState(initial);
  const root = React.useRef<HTMLDivElement>(null);
  const pending = React.useRef<RectMap | null>(null);

  const pinned = items.filter((i) => i.pinned);
  const unpinned = items.filter((i) => !i.pinned);

  const measure = (): RectMap => {
    const map: RectMap = new Map();
    root.current?.querySelectorAll<HTMLElement>("[data-pin-id]").forEach((el) => {
      map.set(el.dataset.pinId!, el.getBoundingClientRect());
    });
    return map;
  };

  React.useLayoutEffect(() => {
    const first = pending.current;
    if (!first || !root.current) return;
    pending.current = null;
    root.current.querySelectorAll<HTMLElement>("[data-pin-id]").forEach((el) => {
      const id = el.dataset.pinId!;
      const a = first.get(id);
      if (!a) return;
      const b = el.getBoundingClientRect();
      const dx = a.left - b.left;
      const dy = a.top - b.top;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
      el.style.transition = "none";
      requestAnimationFrame(() => {
        el.style.transition = "transform 420ms cubic-bezier(0.16, 1, 0.3, 1)";
        el.style.transform = "";
        const clear = () => {
          el.style.transition = "";
          el.removeEventListener("transitionend", clear);
        };
        el.addEventListener("transitionend", clear);
      });
    });
  }, [items]);

  const toggle = (id: string) => {
    pending.current = measure();
    setItems((prev) => {
      const idx = prev.findIndex((u) => u.id === id);
      if (idx === -1) return prev;
      const next = [...prev];
      const [item] = next.splice(idx, 1);
      const toggled = { ...item, pinned: !item.pinned };
      if (toggled.pinned) next.push(toggled);
      else next.unshift(toggled);
      onChange?.(next);
      return next;
    });
  };

  const row = (item: PinListItem, showPin: boolean) => (
    <button
      key={item.id}
      type="button"
      data-pin-id={item.id}
      onClick={() => toggle(item.id)}
      className={cn(
        "flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl bg-secondary p-2 text-start will-change-transform",
        !showPin && "group",
      )}
    >
      <span className="flex min-w-0 items-center gap-2">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background">
          <item.icon className="size-4 text-muted-foreground" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold">{item.name}</span>
          <span className="block truncate text-xs text-muted-foreground">{item.info}</span>
        </span>
      </span>
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full bg-muted-foreground/40 transition-opacity duration-200",
          showPin ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100",
        )}
      >
        <Pin className={cn("size-3.5 text-background", showPin && "fill-background")} />
      </span>
    </button>
  );

  return (
    <div ref={root} className={cn("space-y-8", className)}>
      {pinned.length > 0 && (
        <div className="space-y-2">
          <p className="px-2 text-xs font-medium text-muted-foreground">{labels.pinned}</p>
          <div className="space-y-2">{pinned.map((i) => row(i, true))}</div>
        </div>
      )}
      {unpinned.length > 0 && (
        <div className="space-y-2">
          <p className="px-2 text-xs font-medium text-muted-foreground">{labels.unpinned}</p>
          <div className="space-y-2">{unpinned.map((i) => row(i, false))}</div>
        </div>
      )}
    </div>
  );
}
