import { ArrowDownLeft, ArrowUpLeft } from "lucide-react";
import { cn, faPercent } from "@/lib/utils";

export interface StatProps {
  label: React.ReactNode;
  value: React.ReactNode;
  unit?: React.ReactNode;
  /** Percent change vs. the previous period; sign decides the arrow and color. */
  delta?: number;
  deltaLabel?: React.ReactNode;
  size?: "sm" | "md";
  className?: string;
}

/** آمار. A key number with its change; the arrow points up-left, the RTL "up and forward". */
export function Stat({ label, value, unit, delta, deltaLabel = "نسبت به دوره‌ی قبل", size = "md", className }: StatProps) {
  const up = (delta ?? 0) >= 0;
  return (
    <div className={cn("min-w-0 overflow-hidden rounded-xl border border-border bg-card", size === "sm" ? "p-3" : "p-4", className)}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-end justify-between gap-2">
        <p className={cn("min-w-0 font-bold leading-tight wrap-break-word", size === "sm" ? "text-lg" : "text-xl sm:text-2xl")}>
          <span className="tabular-nums">{value}</span>
          {unit && <span className="ms-1 inline-block text-xs font-normal text-muted-foreground">{unit}</span>}
        </p>
        {delta !== undefined && (
          <span className={cn("inline-flex shrink-0 items-center gap-0.5 text-xs font-semibold", up ? "text-success" : "text-destructive")} title={String(deltaLabel)}>
            {up ? <ArrowUpLeft className="size-3.5" /> : <ArrowDownLeft className="size-3.5" />}
            {faPercent(Math.abs(delta))}
          </span>
        )}
      </div>
    </div>
  );
}
