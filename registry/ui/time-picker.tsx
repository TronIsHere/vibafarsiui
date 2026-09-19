"use client";

import * as React from "react";
import { Clock, X } from "lucide-react";
import { cn, en, fa } from "@/lib/utils";
import { eventInside, FloatPortal, useFloat } from "@/lib/float";

export interface TimePickerProps {
  /** «HH:mm» with Latin digits, e.g. "14:30". null when empty. */
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string | null) => void;
  /** Minute step of the picker column; typing accepts any minute. */
  step?: 1 | 5 | 10 | 15 | 30;
  /** Earliest / latest allowed time, «HH:mm». */
  min?: string;
  max?: string;
  clearable?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
}

const pad = (n: number | string) => String(n).padStart(2, "0");
const toMinutes = (t: string) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
const parseTime = (t: string | null | undefined) => (t && /^\d{1,2}:\d{2}$/.test(t) ? { h: pad(t.split(":")[0]), m: t.split(":")[1] } : { h: "", m: "" });
/** «14:30» when both segments are complete, otherwise null. */
const segValue = (s: { h: string; m: string }) => (s.h.length === 2 && s.m.length === 2 ? `${s.h}:${s.m}` : null);
/** Typing into a full segment starts it over with the new digit, wherever the caret was. */
function typedInto(old: string, next: string) {
  if (next.length <= 2 || old.length < 2) return next.slice(0, 2);
  let i = 0;
  while (i < old.length && old[i] === next[i]) i++;
  return next.slice(i, i + next.length - old.length).slice(0, 2);
}

/** «۱۴:۳۰» — Persian digits, 24-hour clock, for showing a stored «14:30». */
export function formatTime(value: string | null | undefined) {
  if (!value) return "";
  const { h, m } = parseTime(value);
  return h ? fa(`${h}:${m}`) : "";
}

/**
 * انتخاب ساعت. Two typed segments on a 24-hour clock (Iran does not use
 * AM/PM), Persian digits in and out, ↑/↓ to step, and a dropdown with hour
 * and minute columns for the mouse. The field is LTR because clock time is
 * read hours-then-minutes even inside Persian text.
 */
export function TimePicker({ value, defaultValue = null, onChange, step = 5, min, max, clearable = true, disabled, className, id }: TimePickerProps) {
  const [internal, setInternal] = React.useState<string | null>(defaultValue);
  const current = value === undefined ? internal : value;
  const [seg, setSeg] = React.useState(() => parseTime(current));
  const [open, setOpen] = React.useState(false);
  const root = React.useRef<HTMLDivElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourCol = React.useRef<HTMLDivElement>(null);
  const minuteCol = React.useRef<HTMLDivElement>(null);
  const listId = React.useId();
  const { mounted, style, theme, panel } = useFloat(open, root);

  // When the value changes from outside (and is not what the segments already spell), reset the segments.
  const [prev, setPrev] = React.useState(current);
  if (current !== prev) {
    setPrev(current);
    if (current !== segValue(seg)) setSeg(parseTime(current));
  }

  const inRange = (t: string) => (!min || toMinutes(t) >= toMinutes(min)) && (!max || toMinutes(t) <= toMinutes(max));
  const invalid = !!current && !inRange(current);

  function commit(next: string | null) {
    if (value === undefined) setInternal(next);
    onChange?.(next);
  }

  /** The value is «HH:mm» only while both segments are complete; anything partial reports null. */
  function setSegments(h: string, m: string) {
    setSeg({ h, m });
    const next = segValue({ h, m });
    if (next !== current) commit(next);
  }

  /** Types into a segment the way a native time input does: a high first digit pads itself. */
  function typeInto(kind: "h" | "m", raw: string) {
    const d = typedInto(seg[kind], en(raw).replace(/\D/g, ""));
    const limit = kind === "h" ? 23 : 59;
    const firstMax = kind === "h" ? 2 : 5;
    let out = d;
    let done = false;
    if (d.length === 1 && Number(d) > firstMax) { out = pad(d); done = true; }
    if (d.length === 2) { out = pad(Math.min(Number(d), limit)); done = true; }
    if (kind === "h") { setSegments(out, seg.m); if (done) minuteRef.current?.focus(); }
    else setSegments(seg.h, out);
  }

  function nudge(kind: "h" | "m", delta: number) {
    if (kind === "h") setSegments(pad((((Number(seg.h || 0) + delta) % 24) + 24) % 24), seg.m || "00");
    else setSegments(seg.h || "00", pad((((Number(seg.m || 0) + delta) % 60) + 60) % 60));
  }

  function onSegKey(e: React.KeyboardEvent<HTMLInputElement>, kind: "h" | "m") {
    if (e.key === "ArrowUp") { e.preventDefault(); nudge(kind, kind === "h" ? 1 : step); }
    else if (e.key === "ArrowDown") { e.preventDefault(); nudge(kind, kind === "h" ? -1 : -step); }
    else if (e.key === "Backspace" && kind === "m" && !seg.m) { e.preventDefault(); hourRef.current?.focus(); }
    else if (e.key === "Backspace" && kind === "h" && !seg.h && seg.m) { e.preventDefault(); setSegments("", ""); }
    else if (e.key === ":" || e.key === "ArrowRight") { if (kind === "h") { e.preventDefault(); minuteRef.current?.focus(); } }
    else if (e.key === "ArrowLeft" && kind === "m") { e.preventDefault(); hourRef.current?.focus(); }
  }

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (!eventInside(e, root.current, panel.current)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    const scrollTo = (col: HTMLDivElement | null) => col?.querySelector<HTMLElement>("[aria-selected=true]")?.scrollIntoView({ block: "center" });
    scrollTo(hourCol.current);
    scrollTo(minuteCol.current);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);

  const hours = Array.from({ length: 24 }, (_, i) => pad(i));
  const minutes = Array.from({ length: Math.ceil(60 / step) }, (_, i) => pad(i * step));
  const segClass = "w-7 bg-transparent text-center text-sm tabular-nums outline-none placeholder:text-muted-foreground/50 disabled:cursor-not-allowed";
  const optionClass = "flex h-8 w-full cursor-pointer items-center justify-center rounded-md text-sm tabular-nums transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-30 aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:font-semibold";

  return (
    <div ref={root} className={cn("relative", className)}>
      <div
        role="group"
        aria-label="ساعت"
        dir="ltr"
        className={cn(
          "flex h-10 items-center gap-1 rounded-lg border bg-background/60 px-3 transition-colors focus-within:ring-2 focus-within:ring-ring/60",
          invalid ? "border-destructive/60" : "border-input",
          disabled && "opacity-50",
        )}
      >
        <button
          type="button"
          aria-label="باز کردن انتخاب ساعت"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          className="me-1 flex cursor-pointer items-center text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed"
        >
          <Clock className="size-4" />
        </button>
        <input
          ref={hourRef}
          id={id}
          aria-label="ساعت"
          inputMode="numeric"
          autoComplete="off"
          disabled={disabled}
          value={fa(seg.h)}
          placeholder="۰۰"
          onChange={(e) => typeInto("h", e.target.value)}
          onKeyDown={(e) => onSegKey(e, "h")}
          onFocus={(e) => e.target.select()}
          onBlur={() => seg.h.length === 1 && setSegments(pad(seg.h), seg.m)}
          className={segClass}
          aria-invalid={invalid ? true : undefined}
        />
        <span className="text-sm text-muted-foreground">:</span>
        <input
          ref={minuteRef}
          aria-label="دقیقه"
          inputMode="numeric"
          autoComplete="off"
          disabled={disabled}
          value={fa(seg.m)}
          placeholder="۰۰"
          onChange={(e) => typeInto("m", e.target.value)}
          onKeyDown={(e) => onSegKey(e, "m")}
          onFocus={(e) => e.target.select()}
          onBlur={() => seg.m.length === 1 && setSegments(seg.h, pad(seg.m))}
          className={segClass}
          aria-invalid={invalid ? true : undefined}
        />
        <span className="flex-1" />
        {clearable && current && !disabled && (
          <button type="button" aria-label="پاک کردن" onClick={() => setSegments("", "")} className="cursor-pointer rounded p-0.5 text-muted-foreground hover:text-foreground">
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {(min || max) && (
        <p className={cn("mt-1.5 text-[11px]", invalid ? "text-destructive" : "text-muted-foreground")}>
          {min && max ? `از ${formatTime(min)} تا ${formatTime(max)}` : min ? `از ${formatTime(min)} به بعد` : `تا ${formatTime(max)}`}
        </p>
      )}

      <FloatPortal
        open={open}
        mounted={mounted}
        style={style}
        theme={theme}
        panelRef={panel}
        id={listId}
        role="dialog"
        aria-label="انتخاب ساعت"
        dir="ltr"
        className="fixed z-50 w-40 rounded-xl border border-border bg-popover p-2 text-popover-foreground shadow-[0_20px_50px_-20px_oklch(0_0_0/80%)] animate-fade-up [animation-duration:180ms]"
      >
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ["h", "ساعت", hours, hourCol],
                ["m", "دقیقه", minutes, minuteCol],
              ] as const
            ).map(([kind, label, items, ref]) => (
              <div key={kind}>
                <p className="mb-1 text-center text-[11px] text-muted-foreground">{label}</p>
                <div ref={ref} role="listbox" aria-label={label} className="max-h-48 space-y-0.5 overflow-y-auto pe-0.5 [scrollbar-width:thin]">
                  {items.map((it) => {
                    const candidate = kind === "h" ? `${it}:${seg.m || "00"}` : `${seg.h || "00"}:${it}`;
                    const selected = kind === "h" ? seg.h === it : seg.m === it;
                    return (
                      <button
                        key={it}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        disabled={!inRange(candidate)}
                        onClick={() => {
                          if (kind === "h") setSegments(it, seg.m || "00");
                          else { setSegments(seg.h || "00", it); setOpen(false); }
                        }}
                        className={optionClass}
                      >
                        {fa(it)}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-border pt-2" dir="rtl">
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                const m = Math.round(now.getMinutes() / step) * step;
                setSegments(pad((now.getHours() + Math.floor(m / 60)) % 24), pad(m % 60));
                setOpen(false);
              }}
              className="cursor-pointer rounded-md px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              الان
            </button>
            <button type="button" onClick={() => setOpen(false)} className="cursor-pointer rounded-md px-2 py-1 text-[11px] font-medium transition-colors hover:bg-accent">
              تأیید
            </button>
          </div>
      </FloatPortal>
    </div>
  );
}
