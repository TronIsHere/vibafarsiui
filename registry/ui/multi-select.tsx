"use client";

import * as React from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { cn, fa } from "@/lib/utils";
import { eventInside, FloatPortal, useFloat } from "@/lib/float";

export type MultiSelectOption = { value: string; label: string; disabled?: boolean };

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  /** Adds a filter box at the top of the list. */
  searchable?: boolean;
  /** Chips shown in the field before they collapse into «+۳ مورد دیگر». */
  maxVisible?: number;
  /** Upper limit on selections; the rest of the list is disabled once reached. */
  max?: number;
  emptyText?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

/**
 * چندانتخابی. A listbox with checkmarks; picked items show as chips in the
 * field. Arrow keys move, Space/Enter toggles, Escape closes, Backspace
 * removes the last chip when the filter is empty.
 */
export function MultiSelect({
  options,
  value,
  defaultValue = [],
  onChange,
  placeholder = "انتخاب کنید…",
  searchable = true,
  maxVisible = 3,
  max,
  emptyText = "چیزی پیدا نشد",
  disabled,
  className,
  ...aria
}: MultiSelectProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const selected = value ?? internal;
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [index, setIndex] = React.useState(0);
  const root = React.useRef<HTMLDivElement>(null);
  const search = React.useRef<HTMLInputElement>(null);
  const listId = React.useId();
  const { mounted, style, theme, panel, update } = useFloat(open, root, { matchWidth: true, gap: 4 });

  const q = query.trim();
  const filtered = React.useMemo(() => (q ? options.filter((o) => o.label.includes(q)) : options), [options, q]);
  const full = max !== undefined && selected.length >= max;

  function commit(next: string[]) {
    if (value === undefined) setInternal(next);
    onChange?.(next);
  }

  function toggle(v: string) {
    if (selected.includes(v)) commit(selected.filter((x) => x !== v));
    else if (!full) commit([...selected, v]);
  }

  function show(next: boolean) {
    if (disabled) return;
    if (next) update();
    setOpen(next);
    setQuery("");
    setIndex(0);
  }

  React.useEffect(() => {
    if (!open) return;
    search.current?.focus();
    const onDoc = (e: MouseEvent) => { if (!eventInside(e, root.current, panel.current)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, panel]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") { e.preventDefault(); show(false); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); if (!open) show(true); else setIndex((i) => Math.min(filtered.length - 1, i + 1)); return; }
    if (e.key === "ArrowUp") { e.preventDefault(); setIndex((i) => Math.max(0, i - 1)); return; }
    if ((e.key === "Enter" || (e.key === " " && !q)) && open && filtered[index] && !filtered[index].disabled) { e.preventDefault(); toggle(filtered[index].value); return; }
    if (e.key === "Backspace" && !q && selected.length) { e.preventDefault(); commit(selected.slice(0, -1)); }
  }

  const chips = selected.map((v) => options.find((o) => o.value === v)).filter((o): o is MultiSelectOption => Boolean(o));
  const hidden = Math.max(0, chips.length - maxVisible);

  return (
    <div ref={root} className={cn("relative", className)}>
      <div
        role="combobox"
        tabIndex={disabled ? -1 : 0}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={aria["aria-label"]}
        aria-disabled={disabled || undefined}
        onClick={() => show(!open)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(true); } else onKeyDown(e); }}
        className={cn(
          "flex min-h-10 w-full cursor-pointer flex-wrap items-center gap-1.5 rounded-lg border border-input bg-background/60 py-1.5 pe-2 ps-2 text-sm transition-colors",
          "focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
          open && "border-transparent ring-2 ring-ring/60",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        {chips.length === 0 && <span className="px-1 text-muted-foreground/70">{placeholder}</span>}
        {chips.slice(0, maxVisible).map((o) => (
          <span key={o.value} className="inline-flex h-6 items-center gap-1 rounded-md bg-secondary ps-2 pe-1 text-xs font-medium text-secondary-foreground">
            {o.label}
            <button
              type="button"
              aria-label={`حذف ${o.label}`}
              tabIndex={-1}
              disabled={disabled}
              onClick={(e) => { e.stopPropagation(); toggle(o.value); }}
              className="flex size-4 cursor-pointer items-center justify-center rounded text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
        {hidden > 0 && <span className="px-1 text-xs text-muted-foreground">+{fa(hidden)} مورد دیگر</span>}
        <ChevronDown className={cn("ms-auto size-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} aria-hidden />
      </div>

      <FloatPortal open={open} mounted={mounted} style={style} theme={theme} panelRef={panel} className="fixed z-50">
        <div className="overflow-hidden rounded-lg border border-border bg-popover text-sm shadow-lg">
          {searchable && (
            <div className="flex items-center gap-2 border-b border-border px-2.5">
              <Search className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
              <input
                ref={search}
                value={query}
                placeholder="جست‌وجو…"
                aria-controls={listId}
                onChange={(e) => { setQuery(e.target.value); setIndex(0); }}
                onKeyDown={onKeyDown}
                className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
              />
            </div>
          )}
          <ul id={listId} role="listbox" aria-multiselectable className="max-h-56 overflow-auto p-1 leading-7">
            {filtered.length === 0 && <li className="px-2.5 py-2 text-muted-foreground">{emptyText}</li>}
            {filtered.map((o, i) => {
              const on = selected.includes(o.value);
              const off = o.disabled || (full && !on);
              return (
                <li
                  key={o.value}
                  role="option"
                  aria-selected={on}
                  aria-disabled={off || undefined}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { if (!off) toggle(o.value); }}
                  onMouseEnter={() => setIndex(i)}
                  className={cn(
                    "flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5",
                    i === index && "bg-accent",
                    off && "cursor-not-allowed opacity-40",
                  )}
                >
                  <span className={cn("flex size-4 shrink-0 items-center justify-center rounded border transition-colors", on ? "border-primary bg-primary text-primary-foreground" : "border-input")}>
                    {on && <Check className="size-3" />}
                  </span>
                  <span className="flex-1 truncate">{o.label}</span>
                </li>
              );
            })}
          </ul>
          {selected.length > 0 && (
            <div className="flex items-center justify-between border-t border-border px-3 py-1.5 text-xs text-muted-foreground">
              <span>{fa(selected.length)} مورد انتخاب شده{max !== undefined && ` از ${fa(max)}`}</span>
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => commit([])} className="cursor-pointer hover:text-foreground">
                پاک کردن
              </button>
            </div>
          )}
        </div>
      </FloatPortal>
    </div>
  );
}
