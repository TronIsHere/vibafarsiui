import type { Catalog, CatalogItem, RegistryType } from "./types.js";

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/\u200c/g, "")
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/آ/g, "ا")
    .replace(/[‌\s-_]+/g, " ")
    .trim();
}

function haystack(item: CatalogItem): string {
  return [item.slug, item.name, item.nameEn, item.desc, item.category, ...item.tags, ...item.aliases].filter(Boolean).join("\n");
}

export function scoreItem(item: CatalogItem, query: string): number {
  const q = normalize(query);
  if (!q) return 0;
  const slug = normalize(item.slug);
  const name = normalize(item.name);
  const aliases = item.aliases.map(normalize);
  if (slug === q || name === q || aliases.includes(q)) return 100;
  if (slug.startsWith(q) || name.startsWith(q) || aliases.some((a) => a.startsWith(q))) return 88;
  const hay = normalize(haystack(item));
  if (hay.includes(q)) return 70;
  const tokens = q.split(" ").filter(Boolean);
  if (tokens.length > 1 && tokens.every((t) => hay.includes(t))) return 58;
  if (tokens.some((t) => t.length > 1 && hay.includes(t))) return 36;
  return 0;
}

export function searchCatalog(
  catalog: Catalog,
  query: string,
  opts: { type?: RegistryType; limit?: number } = {},
): { item: CatalogItem; score: number }[] {
  const limit = opts.limit ?? 8;
  return catalog.items
    .filter((i) => (opts.type ? i.type === opts.type : true))
    .map((item) => ({ item, score: scoreItem(item, query) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.item.slug.localeCompare(b.item.slug))
    .slice(0, limit);
}

export function resolveName(catalog: Catalog, name: string, type?: RegistryType): CatalogItem | undefined {
  const q = normalize(name);
  const typed = q.match(/^(component|animation|background|template|block|theme|lib|skill)s?\/(.+)$/);
  if (typed) {
    const kind = typed[1].replace(/s$/, "") as RegistryType;
    return catalog.items.find((i) => i.type === kind && normalize(i.slug) === normalize(typed[2]));
  }
  const pool = type ? catalog.items.filter((i) => i.type === type) : catalog.items;
  const exact = pool.find((i) => normalize(i.slug) === q || normalize(i.name) === q || i.aliases.some((a) => normalize(a) === q));
  if (exact) return exact;
  const ranked = searchCatalog({ ...catalog, items: pool }, name, { limit: 1 });
  return ranked[0] && ranked[0].score >= 70 ? ranked[0].item : undefined;
}
