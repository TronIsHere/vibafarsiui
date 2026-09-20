import { cn } from "@/lib/utils";

export interface BentoCell {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  /** Column span on large screens out of six. */
  span?: 2 | 3 | 4;
  /** Anything visual for the top of the cell: a chart, a mock, a number. */
  visual?: React.ReactNode;
}

const spans = { 2: "lg:col-span-2", 3: "lg:col-span-3", 4: "lg:col-span-4" };

/** شبکه‌ی بنتو. Six-column grid of unequal cards; each holds a visual plus a title and a line. */
export function BentoGrid({ eyebrow, title, cells }: { eyebrow?: string; title?: string; cells: BentoCell[] }) {
  return (
    <section className="px-6 py-16">
      {(eyebrow || title) && (
        <div className="mx-auto mb-10 max-w-2xl text-center">
          {eyebrow && <p className="text-sm font-semibold text-brand">{eyebrow}</p>}
          {title && <h2 className="mt-2 text-3xl font-bold">{title}</h2>}
        </div>
      )}
      <ul className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {cells.map((c) => (
          <li key={c.title} className={cn("flex flex-col overflow-hidden rounded-2xl border border-border bg-card", spans[c.span ?? 2])}>
            {c.visual && <div className="flex h-36 items-end justify-center overflow-hidden border-b border-border bg-secondary/50 px-5 pt-5">{c.visual}</div>}
            <div className="p-5">
              <div className="flex items-center gap-2">
                {c.icon && <c.icon className="size-4 text-brand" />}
                <h3 className="font-semibold">{c.title}</h3>
              </div>
              <p className="mt-1.5 text-sm leading-7 text-muted-foreground">{c.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
