"use client";

import * as React from "react";
import { cn, fa } from "@/lib/utils";

export type CountdownUnit = "days" | "hours" | "minutes" | "seconds";

export type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
};

const DEFAULT_LABELS: Record<CountdownUnit, string> = {
  days: "روز",
  hours: "ساعت",
  minutes: "دقیقه",
  seconds: "ثانیه",
};

const DEFAULT_UNITS: CountdownUnit[] = ["days", "hours", "minutes", "seconds"];

function split(totalSec: number): CountdownParts {
  const total = Math.max(0, totalSec);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    total,
  };
}

/** Tick every second; server and first client paint stay at null so HTML matches. */
export function useCountdown(target: Date | number | string): CountdownParts | null {
  const end = typeof target === "object" ? target.getTime() : new Date(target).getTime();
  const [now, setNow] = React.useState(0);

  React.useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!now || Number.isNaN(end)) return null;
  return split(Math.floor((end - now) / 1000));
}

export interface CountdownProps {
  /** End date, ISO string, or timestamp. */
  target: Date | number | string;
  /** Which cells to show, in visual LTR order. */
  units?: CountdownUnit[];
  labels?: Partial<Record<CountdownUnit, string>>;
  /** Pad each number to two digits (۰۰). Days stay unpadded unless true. */
  pad?: boolean;
  size?: "sm" | "md" | "lg";
  /** cards = bordered cells; inline = ۱۲:۳۴:۵۶ with colons. */
  variant?: "cards" | "inline";
  onComplete?: () => void;
  className?: string;
}

const sizeCls = {
  sm: { num: "text-xl", cell: "rounded-lg py-2", gap: "gap-1.5", label: "text-[10px]" },
  md: { num: "text-3xl sm:text-4xl", cell: "rounded-2xl py-4", gap: "gap-2 sm:gap-3", label: "text-xs" },
  lg: { num: "text-4xl sm:text-5xl", cell: "rounded-2xl py-5", gap: "gap-3", label: "text-sm" },
} as const;

/**
 * شمارش معکوس. Flash-sale / launch timer with Persian digits.
 * Renders placeholders until mounted so SSR and the first client paint match.
 */
export function Countdown({
  target,
  units = DEFAULT_UNITS,
  labels,
  pad = true,
  size = "md",
  variant = "cards",
  onComplete,
  className,
}: CountdownProps) {
  const t = useCountdown(target);
  const done = React.useRef(false);
  const s = sizeCls[size];
  const labelMap = { ...DEFAULT_LABELS, ...labels };

  React.useEffect(() => {
    if (t && t.total === 0 && !done.current) {
      done.current = true;
      onComplete?.();
    }
  }, [t, onComplete]);

  function format(unit: CountdownUnit, n: number | null) {
    if (n === null) return pad || unit !== "days" ? "--" : "-";
    const raw = pad || unit !== "days" ? String(n).padStart(2, "0") : String(n);
    return fa(raw);
  }

  const values: Record<CountdownUnit, number | null> = {
    days: t?.days ?? null,
    hours: t?.hours ?? null,
    minutes: t?.minutes ?? null,
    seconds: t?.seconds ?? null,
  };

  if (variant === "inline") {
    return (
      <time
        dateTime={typeof target === "object" ? target.toISOString() : new Date(target).toISOString()}
        aria-live="off"
        dir="ltr"
        className={cn("inline-flex items-baseline tabular-nums", s.num, "font-bold", className)}
      >
        {units.map((u, i) => (
          <React.Fragment key={u}>
            {i > 0 && <span className="mx-0.5 text-muted-foreground" aria-hidden>:</span>}
            <span>{format(u, values[u])}</span>
          </React.Fragment>
        ))}
      </time>
    );
  }

  return (
    <div
      role="timer"
      aria-live="off"
      dir="ltr"
      className={cn("grid w-full", s.gap, className)}
      style={{ gridTemplateColumns: `repeat(${units.length}, minmax(0, 1fr))` }}
    >
      {units.map((u) => (
        <div key={u} className={cn("border border-border bg-card/70 text-center backdrop-blur", s.cell)}>
          <p className={cn("font-bold tabular-nums", s.num)}>{format(u, values[u])}</p>
          <p className={cn("mt-1 text-muted-foreground", s.label)}>{labelMap[u]}</p>
        </div>
      ))}
    </div>
  );
}
