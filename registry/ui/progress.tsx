import { cn, faPercent } from "@/lib/utils";

export interface ProgressProps {
  value: number;
  max?: number;
  label?: React.ReactNode;
  showValue?: boolean;
  size?: "sm" | "md";
  className?: string;
}

/** پیشرفت. Fills from the inline-start; the percent label uses Persian digits. */
export function Progress({ value, max = 100, label, showValue, size = "md", className }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn("space-y-1.5", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs">
          <span>{label}</span>
          {showValue && <span className="text-muted-foreground tabular-nums">{faPercent(pct)}</span>}
        </div>
      )}
      <div role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} className={cn("w-full overflow-hidden rounded-full bg-input", size === "sm" ? "h-1.5" : "h-2")}>
        <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
