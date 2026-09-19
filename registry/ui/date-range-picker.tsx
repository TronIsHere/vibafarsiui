"use client";

import * as React from "react";
import { CalendarRange, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn, fa } from "@/lib/utils";
import { eventInside, FloatPortal, useFloat } from "@/lib/float";
import { JALALI_MONTHS, JALALI_WEEKDAYS_SHORT, formatJalali, jalaliMonthLength, jalaliWeekday, toGregorian, toJalali } from "@/lib/jalali";

export type DateRange = { from: Date | null; to: Date | null };

export interface RangeCalendarProps {
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (range: DateRange) => void;
  min?: Date;
  max?: Date;
  /** Two months side by side (they stack under 640px). */
  months?: 1 | 2;
  /** Grey out Fridays (default true). */
  markWeekend?: boolean;
  compact?: boolean;
  /** No border, background or padding — for embedding in your own panel. */
  bare?: boolean;
  className?: string;
}

const EMPTY: DateRange = { from: null, to: null };
const day = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const sameDay = (a: Date | null | undefined, b: Date) => !!a && day(a).getTime() === day(b).getTime();
const ordered = (a: Date, b: Date): [Date, Date] => (a <= b ? [a, b] : [b, a]);

/** Days in the range, both ends included. */
export function rangeLength(range: DateRange) {
  if (!range.from || !range.to) return 0;
  const [a, b] = ordered(day(range.from), day(range.to));
  return Math.round((b.getTime() - a.getTime()) / 864e5) + 1;
}

/** «۱۲ تا ۲۵ مهر ۱۴۰۵»، «۲۸ شهریور تا ۳ مهر ۱۴۰۵»، «۲۵ اسفند ۱۴۰۴ تا ۵ فروردین ۱۴۰۵». */
export function formatJalaliRange(range: DateRange) {
  if (!range.from) return "";
  if (!range.to) return `از ${formatJalali(range.from)}`;
  const [a, b] = ordered(range.from, range.to);
  const ja = toJalali(a);
  const jb = toJalali(b);
  if (ja.jy === jb.jy && ja.jm === jb.jm) return `${fa(ja.jd)} تا ${fa(jb.jd)} ${JALALI_MONTHS[jb.jm - 1]} ${fa(jb.jy)}`;
  if (ja.jy === jb.jy) return `${fa(ja.jd)} ${JALALI_MONTHS[ja.jm - 1]} تا ${fa(jb.jd)} ${JALALI_MONTHS[jb.jm - 1]} ${fa(jb.jy)}`;
  return `${formatJalali(a)} تا ${formatJalali(b)}`;
}

/**
 * تقویم بازه‌ای شمسی. First click sets the start, second the end (clicking an
 * earlier day swaps them), a third click starts over. The band between the two
 * ends runs right-to-left with the week, so it is rounded on logical sides.
 */
export function RangeCalendar({ value, defaultValue = EMPTY, onChange, min, max, months = 1, markWeekend = true, compact, bare, className }: RangeCalendarProps) {
  const [internal, setInternal] = React.useState<DateRange>(defaultValue);
  const range = value ?? internal;
  const [hover, setHover] = React.useState<Date | null>(null);
  const today = React.useMemo(() => day(new Date()), []);
  const initial = toJalali(range.from ?? today);
  const [view, setView] = React.useState({ jy: initial.jy, jm: initial.jm });

  function commit(next: DateRange) {
    if (value === undefined) setInternal(next);
    onChange?.(next);
  }

  function pick(date: Date) {
    if (!range.from || range.to) return commit({ from: date, to: null });
    const [from, to] = ordered(range.from, date);
    commit({ from, to });
  }

  function move(delta: number) {
    setView((v) => {
      let jm = v.jm + delta;
      let jy = v.jy;
      if (jm < 1) { jm = 12; jy -= 1; }
      if (jm > 12) { jm = 1; jy += 1; }
      return { jy, jm };
    });
  }

  // Effective ends: the committed range, or the start plus the hovered day while choosing the end.
  const [start, end] = React.useMemo<[Date | null, Date | null]>(() => {
    if (range.from && range.to) return ordered(range.from, range.to);
    if (range.from && hover) return ordered(range.from, hover);
    return [range.from, null];
  }, [range.from, range.to, hover]);
  const previewing = !!range.from && !range.to && !!hover;

  const views = Array.from({ length: months }, (_, i) => {
    let jm = view.jm + i;
    let jy = view.jy;
    if (jm > 12) { jm -= 12; jy += 1; }
    return { jy, jm };
  });

  const nav = "flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground";
  const length = rangeLength(range);

  return (
    <div className={cn("inline-flex flex-col", !bare && "rounded-xl border border-border bg-card p-3", className)}>
      <div className={cn("flex flex-col gap-4 sm:flex-row", compact ? "sm:gap-3" : "sm:gap-5")} onMouseLeave={() => setHover(null)}>
        {views.map((m, mi) => {
          const first = toGregorian(m.jy, m.jm, 1);
          const offset = jalaliWeekday(first);
          const days = jalaliMonthLength(m.jy, m.jm);
          const cells = Array.from({ length: offset + days }, (_, i) => (i < offset ? null : i - offset + 1));
          return (
            <div key={`${m.jy}-${m.jm}`} className={compact ? "w-[220px]" : "w-[260px]"}>
              <div className="flex items-center justify-between px-1">
                {mi === 0 ? (
                  <button type="button" aria-label="ماه قبل" onClick={() => move(-1)} className={nav}><ChevronRight className="size-4" /></button>
                ) : <span className="size-7" />}
                <span className={cn("font-semibold", compact ? "text-xs" : "text-sm")}>
                  {JALALI_MONTHS[m.jm - 1]} {fa(m.jy)}
                </span>
                {mi === months - 1 ? (
                  <button type="button" aria-label="ماه بعد" onClick={() => move(1)} className={nav}><ChevronLeft className="size-4" /></button>
                ) : <span className="size-7" />}
              </div>
              <div className={cn("mt-2 grid grid-cols-7 gap-y-0.5 overflow-hidden text-center", compact ? "text-[10px]" : "text-[11px]")} role="grid">
                {JALALI_WEEKDAYS_SHORT.map((d) => (
                  <span key={d} className="py-1 text-muted-foreground/80" aria-hidden>{d}</span>
                ))}
                {cells.map((d, i) => {
                  if (d === null) return <span key={`e${i}`} className={compact ? "h-6" : "h-8"} />;
                  const date = toGregorian(m.jy, m.jm, d);
                  const isStart = sameDay(start, date);
                  const isEnd = sameDay(end, date);
                  const between = !!start && !!end && date > start && date < end;
                  const banded = between || (isStart && !!end) || (isEnd && !!start);
                  const isToday = sameDay(today, date);
                  const fri = i % 7 === 6;
                  const disabled = (min && date < day(min)) || (max && date > day(max));
                  return (
                    <div
                      key={d}
                      className={cn(
                        compact ? "h-6" : "h-8",
                        banded && (previewing ? "bg-accent/50" : "bg-accent"),
                        isStart && "rounded-s-md",
                        isEnd && "rounded-e-md",
                      )}
                    >
                      <button
                        type="button"
                        role="gridcell"
                        aria-selected={isStart || isEnd}
                        aria-label={`${fa(d)} ${JALALI_MONTHS[m.jm - 1]}`}
                        disabled={!!disabled}
                        onClick={() => pick(date)}
                        onMouseEnter={() => setHover(date)}
                        onFocus={() => setHover(date)}
                        className={cn(
                          "flex size-full min-w-0 items-center justify-center rounded-md leading-none whitespace-nowrap tabular-nums transition-colors",
                          (isStart || isEnd) && !previewing && "bg-primary font-semibold text-primary-foreground",
                          (isStart || isEnd) && previewing && "bg-primary/80 font-semibold text-primary-foreground",
                          between && "rounded-none",
                          !isStart && !isEnd && isToday && "ring-1 ring-inset ring-foreground/40",
                          !isStart && !isEnd && markWeekend && fri && "text-muted-foreground/60",
                          !isStart && !isEnd && !disabled && "cursor-pointer hover:bg-accent",
                          disabled && "cursor-not-allowed opacity-30",
                        )}
                      >
                        {fa(d)}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-2 min-h-4 px-1 text-[11px] text-muted-foreground" aria-live="polite">
        {length ? `${fa(length)} روز` : range.from ? "روز پایان را انتخاب کنید" : "روز شروع را انتخاب کنید"}
      </p>
    </div>
  );
}

export type RangePreset = { label: string; range: () => DateRange };

const ago = (n: number) => { const d = day(new Date()); d.setDate(d.getDate() - n); return d; };

/** «امروز»، «۷ روز گذشته»، «۳۰ روز گذشته»، «این ماه». */
export const defaultRangePresets: RangePreset[] = [
  { label: "امروز", range: () => ({ from: ago(0), to: ago(0) }) },
  { label: "۷ روز گذشته", range: () => ({ from: ago(6), to: ago(0) }) },
  { label: "۳۰ روز گذشته", range: () => ({ from: ago(29), to: ago(0) }) },
  { label: "این ماه", range: () => { const { jy, jm } = toJalali(new Date()); return { from: toGregorian(jy, jm, 1), to: ago(0) }; } },
];

export interface DateRangePickerProps extends Omit<RangeCalendarProps, "value" | "onChange" | "className" | "defaultValue"> {
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (range: DateRange) => void;
  placeholder?: string;
  clearable?: boolean;
  /** Quick ranges shown above the calendar; pass [] to hide. */
  presets?: RangePreset[];
  className?: string;
}

/** انتخاب بازه‌ی تاریخ: a field that opens the range calendar; closes once both ends are chosen. */
export function DateRangePicker({ value, defaultValue = EMPTY, onChange, placeholder = "انتخاب بازه", clearable = true, presets = defaultRangePresets, months = 2, className, ...cal }: DateRangePickerProps) {
  const [internal, setInternal] = React.useState<DateRange>(defaultValue);
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const range = value ?? internal;
  const { mounted, style, theme, panel } = useFloat(open, ref);

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (!eventInside(e, ref.current, panel.current)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open, panel]);

  function set(r: DateRange, close = false) {
    if (value === undefined) setInternal(r);
    onChange?.(r);
    if (close) setOpen(false);
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-input bg-background/60 px-3 text-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
        )}
      >
        <span className={cn("flex min-w-0 items-center gap-2", !range.from && "text-muted-foreground/70")}>
          <CalendarRange className="size-4 shrink-0 text-muted-foreground" />
          <span className="truncate">{formatJalaliRange(range) || placeholder}</span>
        </span>
        {clearable && range.from && (
          <span role="button" aria-label="پاک کردن" onClick={(e) => { e.stopPropagation(); set(EMPTY); }} className="rounded p-0.5 text-muted-foreground hover:text-foreground">
            <X className="size-3.5" />
          </span>
        )}
      </button>
      <FloatPortal open={open} mounted={mounted} style={style} theme={theme} panelRef={panel} role="dialog" className="fixed z-50 rounded-xl border border-border bg-card p-3 shadow-xl">
          {presets.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {presets.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => set(p.range(), true)}
                  className="cursor-pointer rounded-full border border-border px-2.5 py-0.5 text-[11px] text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
          <RangeCalendar {...cal} bare months={months} value={range} onChange={(r) => set(r, !!(r.from && r.to))} />
      </FloatPortal>
    </div>
  );
}
