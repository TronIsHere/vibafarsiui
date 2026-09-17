"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { CornerDownLeft, Search } from "lucide-react";
import { cn, en } from "@/lib/utils";

function fold(s: string) {
  return en(s)
    .toLowerCase()
    .replace(/\u200c/g, "")
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/آ/g, "ا")
    .replace(/[_\s-]+/g, " ")
    .trim();
}

export interface CommandItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  shortcut?: string;
  keywords?: string[];
  group?: string;
  onSelect?: () => void;
}

export interface CommandProps {
  items: CommandItem[];
  placeholder?: string;
  emptyText?: string;
  onSelect?: (item: CommandItem) => void;
  className?: string;
  autoFocus?: boolean;
}

/** پالت دستور: filterable list with keyboard navigation. Wrap in CommandDialog for ⌘K. */
export function Command({
  items,
  placeholder = "دستور یا جست‌وجو…",
  emptyText = "چیزی پیدا نشد",
  onSelect,
  className,
  autoFocus,
}: CommandProps) {
  const [q, setQ] = React.useState("");
  const [index, setIndex] = React.useState(0);
  const listId = React.useId();
  const filtered = React.useMemo(() => {
    const t = fold(q);
    if (!t) return items;
    return items.filter((i) => fold(i.label).includes(t) || i.keywords?.some((k) => fold(k).includes(t)));
  }, [items, q]);

  function run(item: CommandItem) {
    item.onSelect?.();
    onSelect?.(item);
  }

  const groups = Array.from(new Set(filtered.map((i) => i.group ?? "")));

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border px-3">
        <Search className="size-4 text-muted-foreground" />
        <input
          autoFocus={autoFocus}
          value={q}
          onChange={(e) => { setQ(e.target.value); setIndex(0); }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setIndex((i) => Math.min(filtered.length - 1, i + 1));
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              setIndex((i) => Math.max(0, i - 1));
            }
            if (e.key === "Enter" && filtered[index]) run(filtered[index]);
          }}
          placeholder={placeholder}
          role="combobox"
          aria-expanded
          aria-controls={listId}
          aria-autocomplete="list"
          className="h-11 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
        />
        <kbd className="rounded border border-border px-1.5   text-[10px] text-muted-foreground">
          Esc
        </kbd>
      </div>
      <div id={listId} role="listbox" className="max-h-72 overflow-auto p-1.5 text-sm">
        {filtered.length === 0 && (
          <p className="px-2 py-6 text-center text-muted-foreground">
            {emptyText}
          </p>
        )}
        {groups.map((g) => (
          <div key={g}>
            {g && (
              <p className="px-2 pb-1 pt-2 text-[11px] text-muted-foreground">
                {g}
              </p>
            )}
            {filtered
              .filter((i) => (i.group ?? "") === g)
              .map((item) => {
                const i = filtered.indexOf(item);
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="option"
                    aria-selected={i === index}
                    onMouseEnter={() => setIndex(i)}
                    onClick={() => run(item)}
                    className={cn(
                      "flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-start",
                      i === index && "bg-accent",
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      {item.icon && (
                        <item.icon className="size-4 text-muted-foreground" />
                      )}
                      {item.label}
                    </span>
                    {i === index ? (
                      <CornerDownLeft className="size-3.5 text-muted-foreground" />
                    ) : (
                      item.shortcut && (
                        <kbd className="  text-[10px] text-muted-foreground">
                          {item.shortcut}
                        </kbd>
                      )
                    )}
                  </button>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Opens Command in a centered overlay on ⌘K / Ctrl+K. */
export function CommandDialog({
  open,
  onOpenChange,
  hotkey = true,
  ...props
}: CommandProps & { open: boolean; onOpenChange: (open: boolean) => void; hotkey?: boolean }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (hotkey && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === "Escape" && open) onOpenChange(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onOpenChange, hotkey]);

  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!mounted || !open) return null;
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-[15vh] backdrop-blur-sm"
      onClick={() => onOpenChange(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="جست‌وجو"
        className="w-full max-w-lg animate-fade-up [animation-duration:250ms]"
        onClick={(e) => e.stopPropagation()}
      >
        <Command
          autoFocus
          {...props}
          onSelect={(i) => {
            props.onSelect?.(i);
            onOpenChange(false);
          }}
        />
      </div>
    </div>,
    document.body,
  );
}
