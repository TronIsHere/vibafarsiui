import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SplitFeature {
  eyebrow?: string;
  title: string;
  description: string;
  bullets?: string[];
  /** Screenshot or illustration; a soft placeholder is drawn when absent. */
  media?: React.ReactNode;
}

/** ویژگی دو ستونه. Text beside media, sides alternating row by row; stacks on mobile. */
export function FeatureSplit({ items }: { items: SplitFeature[] }) {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-20">
        {items.map((f, i) => (
          <div key={f.title} className={cn("grid items-center gap-10 md:grid-cols-2", i % 2 === 1 && "md:[&>*:first-child]:order-last")}>
            <div>
              {f.eyebrow && <p className="text-sm font-semibold text-brand">{f.eyebrow}</p>}
              <h3 className="mt-2 text-2xl font-bold sm:text-3xl">{f.title}</h3>
              <p className="mt-3 leading-8 text-muted-foreground">{f.description}</p>
              {f.bullets && (
                <ul className="mt-5 space-y-2 text-sm">
                  {f.bullets.map((b) => <li key={b} className="flex items-start gap-2"><Check className="mt-1 size-4 shrink-0 text-brand" />{b}</li>)}
                </ul>
              )}
            </div>
            <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-secondary">
              {f.media ?? <div aria-hidden className="size-full" style={{ background: "radial-gradient(80% 80% at 30% 20%, oklch(from var(--brand) l c h / 25%), transparent 70%)" }} />}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
