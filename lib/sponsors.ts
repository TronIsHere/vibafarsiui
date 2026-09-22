export type SponsorTier = "gold" | "silver";

export type Sponsor = {
  name: string;
  nameEn?: string;
  href: string;
  blurb?: string;
  /** Path under public, e.g. `/sponsors/acme.svg`. */
  logo?: string;
  /**
   * Wordmark path. When set with `logo`, renders a lockup: type on the left,
   * logo mark on the right (LTR brand order).
   */
  type?: string;
  /** CSS color for the masked logo mark in a type+logo lockup. */
  markColor?: string;
  /** Hosting partner gets a footer credit and a seat badge. */
  role?: "hosting";
  /** Seat badge override. Defaults to میزبانی / حامی اصلی. */
  badge?: string;
  tier: SponsorTier;
};

/**
 * Add a sponsor here and drop the logo in `public/sponsors/`.
 * Gold seats sit in the component catalog and the large row;
 * silver seats fill the logo wall.
 */
export const sponsors: Sponsor[] = [
  {
    name: "هوش مصنوعی بنانا",
    nameEn: "BananaAI",
    href: "https://bananaai.ir",
    logo: "/sponsors/bananaai.png",
    tier: "gold",
  },
  {
    name: "پاستاکلود",
    nameEn: "Paasta",
    href: "https://paasta.cloud",
    logo: "/sponsors/paasta-logo.png",
    type: "/sponsors/paasta-type.svg",
    markColor: "var(--brand-primary, #1769ff)",
    blurb: "میزبانی و استقرار این سایت را پاستا پوشش می‌دهد.",
    role: "hosting",
    tier: "gold",
  },
  {
    name: "پیکسول",
    nameEn: "Pixevel",
    href: "https://pixevel.com/",
    logo: "/sponsors/pixevel.png",
    blurb: "خدمات و محصولات دیجیتال؛ اشتراک، گیفت‌کارت و بازی.",
    badge: "حامی",
    tier: "gold",
  },
];

export const goldSponsors = sponsors.filter((s) => s.tier === "gold");
export const silverSponsors = sponsors.filter((s) => s.tier !== "gold");

/** Hosting partner shown in the site footer. */
export const hostingSponsor =
  sponsors.find((s) => s.role === "hosting") ?? null;

export function sponsorBadge(sponsor: Sponsor): string {
  if (sponsor.badge) return sponsor.badge;
  return sponsor.role === "hosting" ? "میزبانی" : "حامی اصلی";
}
