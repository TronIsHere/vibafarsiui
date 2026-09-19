import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { templates } from "@/lib/registry";
import { pageMetadata } from "@/lib/site";
import { templateLoaders } from "@/components/demos/demo-loaders";

export function generateStaticParams() {
  return templates.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/preview/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = templates.find((c) => c.slug === slug);
  return pageMetadata({
    title: item ? `${item.name} · پیش‌نمایش` : "یافت نشد",
    path: `/preview/${slug}`,
    index: false,
  });
}

/** Full-page template preview, no site chrome (used in the docs iframe and «تمام‌صفحه»). */
export default async function PreviewPage({ params }: PageProps<"/preview/[slug]">) {
  const { slug } = await params;
  const load = templateLoaders[slug];
  if (!load) notFound();
  const { default: Template } = await load();
  return <Template />;
}
