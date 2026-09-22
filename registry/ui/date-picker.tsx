"use client";

import * as React from "react";
import { CalendarDays, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { eventInside, FloatPortal, useFloat } from "@/lib/float";
import { formatJalali } from "@/lib/jalali";
import { Calendar, type CalendarProps } from "./calendar";

export interface DatePickerProps extends Omit<CalendarProps, "value" | "onChange" | "className"> {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  clearable?: boolean;
  /** Include the weekday, e.g. «شنبه، ۳۱ شهریور ۱۴۰۵». */
  weekday?: boolean;
  className?: string;
}

/** انتخاب تاریخ: a field that opens the Jalali calendar in a popover. */
export function DatePicker({ value, onChange, placeholder = "انتخاب تاریخ", clearable = true, weekday = true, className, ...cal }: DatePickerProps) {
  const [internal, setInternal] = React.useState<Date | null>(null);
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const date = value === undefined ? internal : value;
  const { mounted, style, theme, panel } = useFloat(open, ref);

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (!eventInside(e, ref.current, panel.current)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open, panel]);

  function set(d: Date | null) {
    if (value === undefined) setInternal(d);
    onChange?.(d);
  }

  return (
    <div ref={ref} className={cn("relative min-w-0", className)}>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-10 w-full min-w-0 cursor-pointer items-center justify-between gap-2 overflow-hidden rounded-field border-line-field border-input bg-field shadow-field px-3 text-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
        )}
      >
        <span className={cn("flex min-w-0 items-center gap-2", !date && "text-muted-foreground/70")}>
          <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
          <span className="truncate whitespace-nowrap">{date ? formatJalali(date, { weekday }) : placeholder}</span>
        </span>
        {clearable && date && (
          <span role="button" aria-label="پاک کردن" onClick={(e) => { e.stopPropagation(); set(null); }} className="rounded p-0.5 text-muted-foreground hover:text-foreground">
            <X className="size-3.5" />
          </span>
        )}
      </button>
      <FloatPortal open={open} mounted={mounted} style={style} theme={theme} panelRef={panel} role="dialog" className="fixed z-50 shadow-xl">
        <Calendar {...cal} value={date} onChange={(d) => { set(d); setOpen(false); }} />
      </FloatPortal>
    </div>
  );
}
