"use client";

import * as React from "react";
import { CalendarDays, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatJalali } from "@/lib/jalali";
import { Calendar, type CalendarProps } from "./calendar";

export interface DatePickerProps extends Omit<CalendarProps, "value" | "onChange" | "className"> {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  clearable?: boolean;
  className?: string;
}

/** انتخاب تاریخ: a field that opens the Jalali calendar in a popover. */
export function DatePicker({ value, onChange, placeholder = "انتخاب تاریخ", clearable = true, className, ...cal }: DatePickerProps) {
  const [internal, setInternal] = React.useState<Date | null>(null);
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const date = value === undefined ? internal : value;

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);

  function set(d: Date | null) {
    if (value === undefined) setInternal(d);
    onChange?.(d);
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
        <span className={cn("flex items-center gap-2", !date && "text-muted-foreground/70")}>
          <CalendarDays className="size-4 text-muted-foreground" />
          {date ? formatJalali(date, { weekday: true }) : placeholder}
        </span>
        {clearable && date && (
          <span role="button" aria-label="پاک کردن" onClick={(e) => { e.stopPropagation(); set(null); }} className="rounded p-0.5 text-muted-foreground hover:text-foreground">
            <X className="size-3.5" />
          </span>
        )}
      </button>
      {open && (
        <div role="dialog" className="absolute start-0 top-full z-40 mt-1 shadow-xl">
          <Calendar {...cal} value={date} onChange={(d) => { set(d); setOpen(false); }} />
        </div>
      )}
    </div>
  );
}
