import { ArrowLeft } from "lucide-react";
import type { Sponsor } from "@/lib/sponsors";

export function SponsorMark({
  sponsor,
  large,
}: {
  sponsor: Sponsor;
  large?: boolean;
}) {
  if (sponsor.logo) {
    return (
      // Logos are brand assets with unknown intrinsic size; keep them fluid.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={sponsor.logo}
        alt=""
        className={
          large
            ? "size-16 rounded-xl object-cover ring-1 ring-border sm:size-20"
            : "size-10 rounded-lg object-cover ring-1 ring-border"
        }
      />
    );
  }
  return (
    <span className={large ? "text-2xl font-bold sm:text-3xl" : "text-lg font-bold"}>
      {sponsor.name}
    </span>
  );
}

/** Same shell as ItemCard, so a gold seat sits in the component grid. */
export function SponsorCatalogCard({ sponsor }: { sponsor: Sponsor }) {
  return (
    <div className="group relative flex h-full flex-col rounded-xl border border-border bg-card transition-colors duration-200 hover:border-foreground/25">
      <a
        href={sponsor.href}
        target="_blank"
        rel="noopener noreferrer"
        className="block cursor-pointer rounded-t-xl border-b border-border bg-muted/50 px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
      >
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold">{sponsor.name}</h3>
          <span className="text-[11px] text-muted-foreground" dir="ltr">
            {sponsor.nameEn ?? "sponsor"}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
          {sponsor.blurb ?? "حامی اصلی وایب‌فارسی"}
        </p>
      </a>
      <a
        href={sponsor.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={sponsor.name}
        className="relative flex min-h-[176px] min-w-0 flex-1 cursor-pointer items-center justify-center p-4 outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
      >
        <SponsorMark sponsor={sponsor} large />
      </a>
      <a
        href={sponsor.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`باز کردن ${sponsor.name}`}
        className="absolute end-3 top-3 hidden size-7 cursor-pointer items-center justify-center rounded-md border border-border bg-card text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 sm:flex"
      >
        <ArrowLeft className="size-3.5" />
      </a>
    </div>
  );
}
