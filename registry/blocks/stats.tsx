import { cn } from "@/lib/utils";

export interface StatItem { value: string; label: string; hint?: string }

/** آمار. A strip of key numbers with hairline dividers; numbers should already be Persian. */
export function StatsBlock({ items, className }: { items: StatItem[]; className?: string }) {
  return (
    <section className={cn("px-6 py-12", className)}>
      <dl className="mx-auto grid max-w-5xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-4">
        {items.map((s) => (
          <div key={s.label} className="bg-card p-6 text-center">
            <dd className="text-3xl font-bold tabular-nums">{s.value}</dd>
            <dt className="mt-1 text-sm text-muted-foreground">{s.label}</dt>
            {s.hint && <p className="mt-1 text-[11px] text-muted-foreground/70">{s.hint}</p>}
          </div>
        ))}
      </dl>
    </section>
  );
}
