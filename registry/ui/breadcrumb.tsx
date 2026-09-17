import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Crumb { label: React.ReactNode; href?: string }

/** مسیر. Separators point left; the last item is the current page. */
export function Breadcrumb({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="مسیر" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {c.href && !last ? (
                <a href={c.href} className="text-muted-foreground transition-colors hover:text-foreground">{c.label}</a>
              ) : (
                <span aria-current={last ? "page" : undefined} className={cn(last ? "font-medium text-foreground" : "text-muted-foreground")}>{c.label}</span>
              )}
              {!last && <ChevronLeft className="size-3.5 text-muted-foreground/60" aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
