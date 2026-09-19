import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/** Header row used by every showcase section; links to the section index unless already there. */
export function SectionHead({
  eyebrow,
  title,
  desc,
  href,
  standalone,
  aside,
}: {
  eyebrow: React.ReactNode;
  title: string;
  desc: React.ReactNode;
  href: string;
  standalone?: boolean;
  aside?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
        standalone ? "pb-8" : "border-b border-border px-5 py-8 sm:px-8",
      )}
    >
      <div>
        <p className="  text-xs text-muted-foreground">{eyebrow}</p>
        {standalone ? (
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{title}</h1>
        ) : (
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            <Link href={href} className="transition-colors hover:text-brand">
              {title}
            </Link>
          </h2>
        )}
        <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-[15px]">
          {desc}
        </p>
      </div>
      {aside}
    </div>
  );
}

export function SectionFoot({
  href,
  label,
  note,
}: {
  href: string;
  label: string;
  note?: string;
}) {
  return (
    <div className="flex items-center justify-between border-t border-border px-5 py-4 sm:px-8">
      <p className="text-xs text-muted-foreground">{note}</p>
      <Link
        href={href}
        className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium transition-colors hover:text-brand"
      >
        {label}
        <ArrowLeft className="size-4" />
      </Link>
    </div>
  );
}

/** Uniform catalog card: header strip + preview area, linking to the docs page. */
export function ItemCard({
  href,
  name,
  slug,
  desc,
  children,
  previewClass,
  className,
}: {
  href: string;
  name: string;
  slug: string;
  desc: string;
  children: React.ReactNode;
  previewClass?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative flex h-full flex-col rounded-xl border border-border bg-card transition-colors duration-200 hover:border-foreground/25",
        className,
      )}
    >
      <Link
        href={href}
        className="block rounded-t-xl border-b border-border bg-muted/50 px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
      >
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold">{name}</h3>
          <span className="  text-[11px] text-muted-foreground" dir="ltr">
            {slug}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
          {desc}
        </p>
      </Link>
      <div
        className={cn(
          "relative flex min-w-0 flex-1 items-center justify-center overflow-hidden",
          previewClass ?? "min-h-44 p-4",
        )}
      >
        {children}
      </div>
      <Link
        href={href}
        aria-label={`باز کردن ${name}`}
        className="absolute end-3 top-3 hidden size-7 items-center justify-center rounded-md border border-border bg-card text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 sm:flex"
      >
        <ArrowLeft className="size-3.5" />
      </Link>
    </div>
  );
}
