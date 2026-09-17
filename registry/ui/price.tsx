import { cn, faNumber, faPercent } from "@/lib/utils";

export interface PriceProps {
  amount: number;
  /** Original price before discount; renders struck through with the computed percent. */
  original?: number;
  unit?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = { sm: "text-base", md: "text-2xl", lg: "text-4xl" };

/** قیمت. Thousands separator «٬», unit after the number, discount computed for you. */
export function Price({ amount, original, unit = "تومان", size = "md", className }: PriceProps) {
  const off = original && original > amount ? Math.round((1 - amount / original) * 100) : 0;
  return (
    <div className={cn("inline-flex flex-col", className)}>
      <span className="flex items-baseline gap-1.5">
        <span className={cn("font-bold tabular-nums", sizes[size])}>{faNumber(amount)}</span>
        <span className="text-sm text-muted-foreground">{unit}</span>
      </span>
      {off > 0 && (
        <span className="mt-0.5 flex items-center gap-2 text-xs">
          <span className="text-muted-foreground line-through tabular-nums">{faNumber(original!)}</span>
          <span className="rounded-full bg-foreground px-1.5 py-px text-[11px] font-semibold text-background">{faPercent(off)} تخفیف</span>
        </span>
      )}
    </div>
  );
}
