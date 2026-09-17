import { Avatar } from "@/registry/ui/avatar";
import { Rating } from "@/registry/ui/rating";

export interface Testimonial { name: string; role: string; quote: string; rating?: number }

/** نظر مشتریان. Masonry-ish three columns; quotes in «گیومه», Persian names on avatars. */
export function TestimonialsBlock({ title = "حرف مشتری‌ها", items }: { title?: string; items: Testimonial[] }) {
  return (
    <section className="px-6 py-16">
      <h2 className="mb-10 text-center text-3xl font-bold">{title}</h2>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((t) => (
          <figure key={t.name} className="flex flex-col rounded-2xl border border-border bg-card p-5">
            {t.rating !== undefined && <Rating value={t.rating} readOnly size="sm" />}
            <blockquote className="mt-3 flex-1 text-sm leading-7 text-foreground/90">«{t.quote}»</blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <Avatar name={t.name} size="sm" />
              <div><p className="text-sm font-medium">{t.name}</p><p className="text-xs text-muted-foreground">{t.role}</p></div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
