import { Stat } from "@/registry/ui/stat";
import { cn } from "@/lib/utils";

export interface DashboardStat {
  label: string;
  value: React.ReactNode;
  unit?: string;
  /** Percent change versus the previous period; sign picks the colour and arrow. */
  delta?: number;
  /** Twelve or so numbers, drawn as a tiny bar trend under the figure. */
  trend?: number[];
}

/** کارت‌های آمار داشبورد. Four KPI cards with change arrows and a small bar trend. */
export function DashboardStats({ items, className }: { items: DashboardStat[]; className?: string }) {
  return (
    <section className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {items.map((s) => {
        const max = s.trend ? Math.max(...s.trend, 1) : 1;
        return (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
            <Stat label={s.label} value={s.value} unit={s.unit} delta={s.delta} size="sm" />
            {s.trend && (
              <div aria-hidden className="mt-4 flex h-8 items-end gap-1">
                {s.trend.map((v, i) => <span key={i} className={cn("flex-1 rounded-sm bg-foreground/15", i === s.trend!.length - 1 && "bg-brand")} style={{ height: `${Math.max(8, (v / max) * 100)}%` }} />)}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
