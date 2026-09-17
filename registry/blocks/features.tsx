import { cn } from "@/lib/utils";

export interface Feature { icon: React.ComponentType<{ className?: string }>; title: string; description: string }

/** ویژگی‌ها. Three-up (or four-up) grid with icon tiles; hairline dividers on large screens. */
export function FeaturesBlock({ eyebrow, title, features, columns = 3 }: { eyebrow?: string; title?: string; features: Feature[]; columns?: 3 | 4 }) {
  return (
    <section className="px-6 py-16">
      {(eyebrow || title) && (
        <div className="mx-auto mb-10 max-w-2xl text-center">
          {eyebrow && <p className="text-sm font-semibold text-brand">{eyebrow}</p>}
          {title && <h2 className="mt-2 text-3xl font-bold">{title}</h2>}
        </div>
      )}
      <ul className={cn("mx-auto grid max-w-5xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2", columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4")}>
        {features.map((f) => (
          <li key={f.title} className="bg-card p-6">
            <span className="flex size-10 items-center justify-center rounded-lg bg-secondary"><f.icon className="size-5" /></span>
            <h3 className="mt-4 font-semibold">{f.title}</h3>
            <p className="mt-1.5 text-sm leading-7 text-muted-foreground">{f.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
