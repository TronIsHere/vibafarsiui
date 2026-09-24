import Link from "next/link";
import { Plus } from "lucide-react";
import { cn, fa } from "@/lib/utils";

/** Switches between the two community galleries and links to the matching submit form. */
export function CommunityNav({
  active,
  counts,
}: {
  active: "community" | "showcase";
  counts: { community: number; showcase: number };
}) {
  const tabs = [
    { id: "community", href: "/community", label: "کامپوننت‌ها و بلاک‌ها", count: counts.community },
    { id: "showcase", href: "/showcase", label: "ساخته‌شده با وایب‌فارسی", count: counts.showcase },
  ] as const;
  const submit = active === "community"
    ? { href: "/community/submit", label: "کامپوننت بفرستید" }
    : { href: "/showcase/submit", label: "سایتتون را معرفی کنید" };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
      <nav aria-label="بخش‌های جامعه" className="inline-flex rounded-lg bg-card p-0.5 text-sm">
        {tabs.map((t) => (
          <Link
            key={t.id}
            href={t.href}
            aria-current={active === t.id ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors duration-200",
              active === t.id ? "bg-secondary font-semibold text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
            <span className="text-[11px] text-muted-foreground">{fa(t.count)}</span>
          </Link>
        ))}
      </nav>
      <Link
        href={submit.href}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        <Plus className="size-4" />
        {submit.label}
      </Link>
    </div>
  );
}

export function EmptyState({ title, desc, href, cta }: { title: string; desc: string; href: string; cta: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-6 py-16 text-center">
      <p className="text-lg font-semibold">{title}</p>
      <p className="max-w-md text-sm text-muted-foreground">{desc}</p>
      <Link
        href={href}
        className="mt-2 inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3.5 text-sm font-medium transition-colors hover:bg-accent"
      >
        <Plus className="size-4" />
        {cta}
      </Link>
    </div>
  );
}
