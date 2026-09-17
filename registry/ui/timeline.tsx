import { cn } from "@/lib/utils";
import { formatJalali } from "@/lib/jalali";

export interface TimelineItem {
  date: Date | string;
  title: React.ReactNode;
  description?: React.ReactNode;
}

/** خط زمان. The rail sits at the inline-start; dates render in Jalali when given a Date. */
export function Timeline({ items, activeIndex = 0, className }: { items: TimelineItem[]; activeIndex?: number; className?: string }) {
  return (
    <ol className={cn("relative space-y-4 border-s border-border ps-5", className)}>
      {items.map((it, i) => (
        <li key={i} className="relative">
          <span className={cn("absolute -start-[25px] top-1.5 size-2.5 rounded-full border-2 border-background", i === activeIndex ? "bg-primary" : "bg-muted-foreground/50")} />
          <p className="text-sm font-medium leading-5">{it.title}</p>
          <p className="text-[11px] text-muted-foreground">{it.date instanceof Date ? formatJalali(it.date) : it.date}</p>
          {it.description && <p className="mt-1 text-xs text-muted-foreground">{it.description}</p>}
        </li>
      ))}
    </ol>
  );
}
