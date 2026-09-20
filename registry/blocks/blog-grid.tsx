import { Avatar } from "@/registry/ui/avatar";
import { Badge } from "@/registry/ui/badge";
import { fa } from "@/lib/utils";
import { formatJalali } from "@/lib/jalali";

export interface Post {
  href: string;
  title: string;
  excerpt: string;
  category: string;
  date: Date;
  /** Minutes; shown as «۵ دقیقه». */
  readingTime: number;
  author: { name: string; src?: string };
  cover?: React.ReactNode;
}

/** مقالات. Three article cards with a category, Jalali date, reading time and the author. */
export function BlogGrid({ title = "آخرین مطالب", posts }: { title?: string; posts: Post[] }) {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto mb-8 flex max-w-5xl items-center justify-between"><h2 className="text-2xl font-bold">{title}</h2><a href="#" className="text-sm text-muted-foreground hover:text-foreground">همه‌ی مطالب</a></div>
      <ul className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
        {posts.map((p) => (
          <li key={p.title}>
            <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card">
              <a href={p.href} className="aspect-[16/10] bg-secondary">
                {p.cover ?? <div aria-hidden className="size-full transition-transform duration-500 group-hover:scale-105" style={{ background: "linear-gradient(135deg, oklch(from var(--brand) l c h / 30%), oklch(from var(--foreground) l c h / 6%))" }} />}
              </a>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="brand" className="text-xs">{p.category}</Badge>
                  <span>·</span>
                  <span>{fa(p.readingTime)} دقیقه</span>
                </div>
                <h3 className="mt-2 text-lg font-semibold leading-7"><a href={p.href} className="hover:underline underline-offset-4">{p.title}</a></h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{p.excerpt}</p>
                <div className="mt-auto flex items-center gap-2 pt-4 text-xs text-muted-foreground">
                  <Avatar name={p.author.name} src={p.author.src} size="sm" />
                  <span className="text-foreground">{p.author.name}</span>
                  <span>·</span>
                  <time dateTime={p.date.toISOString()}>{formatJalali(p.date)}</time>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
