import "server-only";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { buildSitePrompt, siteRouteSource, siteRouteTarget, siteSourceFiles, type SiteDoc } from "@/lib/registry";
import { readSource } from "@/lib/source";

/** Photos a site ships with, from public/sites/<slug>/. Paths are the same in the user's project. */
export function siteAssets(slug: string) {
  const dir = path.join(/* turbopackIgnore: true */ process.cwd(), "public", "sites", slug);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => /\.(webp|png|jpe?g|avif)$/.test(f))
    .sort()
    .map((f) => ({ path: `public/sites/${slug}/${f}`, url: `/sites/${slug}/${f}` }));
}

/** Registry JSON for a whole site: every file under components/sites/<slug>/, one App Router page per route, and its photos. */
export function siteRegistryItem(item: SiteDoc) {
  return {
    $schema: "https://vibefarsi.dev/schema/registry-item.json",
    name: item.slug,
    type: "registry:site",
    title: item.name,
    description: item.desc,
    dependencies: item.deps ?? [],
    registryDependencies: item.registryDeps ?? [],
    files: [
      ...siteSourceFiles(item).map((f) => ({ path: f.target, content: readSource(f.src), type: "registry:component" })),
      ...item.pages.map((p) => ({ path: siteRouteTarget(p), content: siteRouteSource(item, p), type: "registry:page" })),
      ...siteAssets(item.slug).map((a) => ({ ...a, type: "registry:asset" })),
    ],
    prompt: buildSitePrompt(item),
  };
}
