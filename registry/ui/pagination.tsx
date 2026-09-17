import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, fa } from "@/lib/utils";

export interface PaginationProps {
  page: number;
  total: number;
  onChange: (page: number) => void;
  /** Pages shown around the current one. */
  siblings?: number;
  size?: "sm" | "md";
  className?: string;
}

function range(page: number, total: number, siblings: number): (number | "…")[] {
  const pages = new Set<number>([1, total]);
  for (let p = page - siblings; p <= page + siblings; p++) if (p >= 1 && p <= total) pages.add(p);
  const sorted = Array.from(pages).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push("…");
    out.push(p);
  });
  return out;
}

/** صفحه‌بندی. «قبلی» points right and «بعدی» points left, as reading order demands. */
export function Pagination({ page, total, onChange, siblings = 1, size = "md", className }: PaginationProps) {
  const btn = cn(size === "sm" ? "size-8 text-xs" : "size-9 text-sm", "flex cursor-pointer items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40");
  return (
    <nav aria-label="صفحه‌بندی" className={cn("flex items-center gap-1", className)}>
      <button type="button" aria-label="صفحه‌ی قبل" disabled={page <= 1} onClick={() => onChange(page - 1)} className={btn}>
        <ChevronRight className="size-4" />
      </button>
      {range(page, total, siblings).map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="px-1 text-muted-foreground">…</span>
        ) : (
          <button
            key={p}
            type="button"
            aria-current={p === page ? "page" : undefined}
            onClick={() => onChange(p)}
            className={cn(btn, p === page && "border-primary bg-primary font-semibold text-primary-foreground hover:bg-primary hover:text-primary-foreground")}
          >
            {fa(p)}
          </button>
        ),
      )}
      <button type="button" aria-label="صفحه‌ی بعد" disabled={page >= total} onClick={() => onChange(page + 1)} className={btn}>
        <ChevronLeft className="size-4" />
      </button>
    </nav>
  );
}
