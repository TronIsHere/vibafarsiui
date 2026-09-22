import { ArrowUpLeft, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { sponsorBadge, type Sponsor } from "@/lib/sponsors";

function SponsorLockup({
  sponsor,
  large,
}: {
  sponsor: Sponsor;
  large?: boolean;
}) {
  const alt = sponsor.nameEn ? `${sponsor.name} (${sponsor.nameEn})` : sponsor.name;
  return (
    <span
      dir="ltr"
      role="img"
      aria-label={alt}
      className={cn(
        "inline-flex items-center justify-center gap-2.5 rounded-xl bg-neutral-950 ring-1 ring-white/10",
        large ? "h-16 gap-3 px-4 sm:h-20 sm:px-5" : "h-10 px-3",
      )}
    >
      {/* Wordmark is authored black; invert to white on the dark chip. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={sponsor.type}
        alt=""
        aria-hidden
        className={cn(
          "w-auto brightness-0 invert",
          large ? "h-5 sm:h-6" : "h-3.5",
        )}
      />
      <span
        aria-hidden
        className={cn("shrink-0", large ? "size-7 sm:size-8" : "size-5")}
        style={{
          backgroundColor: sponsor.markColor ?? "var(--brand-primary, #1769ff)",
          WebkitMaskImage: `url(${sponsor.logo})`,
          WebkitMaskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskImage: `url(${sponsor.logo})`,
          maskSize: "contain",
          maskRepeat: "no-repeat",
          maskPosition: "center",
        }}
      />
    </span>
  );
}

export function SponsorMark({
  sponsor,
  large,
}: {
  sponsor: Sponsor;
  large?: boolean;
}) {
  if (sponsor.type && sponsor.logo) {
    return <SponsorLockup sponsor={sponsor} large={large} />;
  }
  if (sponsor.logo) {
    return (
      // Logos are brand assets with unknown intrinsic size; keep them fluid.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={sponsor.logo}
        alt={sponsor.nameEn ? `${sponsor.name} (${sponsor.nameEn})` : sponsor.name}
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

/**
 * Same footprint as ItemCard so a gold seat sits in the component grid, but
 * styled as a sponsor seat (brand ring, badge, hatched stage, external link)
 * so it never reads as one more component.
 */
export function SponsorCatalogCard({ sponsor }: { sponsor: Sponsor }) {
  const tierLabel = sponsorBadge(sponsor);
  return (
    <div className="group relative flex h-full flex-col rounded-xl border border-brand/40 bg-card ring-1 ring-brand/10 transition-colors duration-200 hover:border-brand/70 hover:ring-brand/20">
      <a
        href={sponsor.href}
        target="_blank"
        rel="noopener noreferrer"
        className="block cursor-pointer rounded-t-xl border-b border-brand/25 bg-brand/10 px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
      >
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold">{sponsor.name}</h3>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-brand/30 bg-brand/15 px-2 py-0.5 text-[11px] font-medium text-brand">
            <Heart className="size-3 fill-current" />
            {tierLabel}
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
        className="relative flex min-h-[176px] min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-3 rounded-b-xl bg-hatch p-4 outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
      >
        <SponsorMark sponsor={sponsor} large />
        {sponsor.nameEn ? (
          <span className="text-[11px] text-muted-foreground" dir="ltr">
            {sponsor.nameEn}
          </span>
        ) : null}
      </a>
      <a
        href={sponsor.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`باز کردن ${sponsor.name}`}
        className="absolute end-3 top-3 hidden size-7 cursor-pointer items-center justify-center rounded-md border border-brand/30 bg-card text-brand opacity-0 transition-opacity group-hover:opacity-100 sm:flex"
      >
        <ArrowUpLeft className="size-3.5" />
      </a>
    </div>
  );
}
