import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blocks } from "@/lib/registry";
import { pageMetadata } from "@/lib/site";
import { BlockDemo } from "@/components/demos/blocks";

export function generateStaticParams() {
  return blocks.map((b) => ({ slug: b.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = blocks.find((b) => b.slug === slug);
  return pageMetadata({
    title: item ? `${item.name} · پیش‌نمایش` : "یافت نشد",
    path: `/preview/block/${slug}`,
    index: false,
  });
}

export default async function BlockPreviewPage({ params }: Props) {
  const { slug } = await params;
  if (!blocks.some((b) => b.slug === slug)) notFound();
  return (
    <div data-preview-root className="min-h-dvh bg-background text-foreground">
      <BlockDemo slug={slug} />
    </div>
  );
}
