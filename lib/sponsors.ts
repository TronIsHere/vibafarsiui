export type SponsorTier = "gold" | "silver";

export type Sponsor = {
  name: string;
  nameEn?: string;
  href: string;
  blurb?: string;
  /** Path under public, e.g. `/sponsors/acme.svg`. */
  logo?: string;
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
];

export const goldSponsors = sponsors.filter((s) => s.tier === "gold");
export const silverSponsors = sponsors.filter((s) => s.tier !== "gold");
