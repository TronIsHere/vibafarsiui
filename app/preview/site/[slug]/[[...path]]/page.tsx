import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sitePreviewHref, sites } from "@/lib/registry";
import { pageMetadata } from "@/lib/site";
import { siteDemos } from "@/components/demos/sites";

export function generateStaticParams() {
  return sites.flatMap((s) => s.pages.map((p) => ({ slug: s.slug, path: p.path ? p.path.split("/") : [] })));
}

type Props = { params: Promise<{ slug: string; path?: string[] }> };

function find(slug: string, path?: string[]) {
  const site = sites.find((s) => s.slug === slug);
  const route = (path ?? []).join("/");
  const page = site?.pages.find((p) => p.path === route);
  return { site, page, route };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, path } = await params;
  const { page, route } = find(slug, path);
  return pageMetadata({
    title: page ? `${page.title} · پیش‌نمایش` : "یافت نشد",
    path: sitePreviewHref(slug, route),
    index: false,
  });
}

/** One page of a multi-page site, mounted under /preview/site/<slug> so its links stay in the preview. */
export default async function SitePreviewPage({ params }: Props) {
  const { slug, path } = await params;
  const { site, page, route } = find(slug, path);
  const demo = siteDemos[slug];
  const Page = demo?.pages[route];
  if (!site || !page || !demo || !Page) notFound();
  return (
    <demo.Base base={sitePreviewHref(slug)}>
      <Page />
    </demo.Base>
  );
}
