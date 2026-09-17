import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blocks, buildPrompt } from "@/lib/registry";
import { readSource } from "@/lib/source";
import { ItemTabs } from "@/components/docs/item-tabs";
import { DocHeader, DocSection, InstallSteps, PrevNext, PropsTable, UsageBlock } from "@/components/docs/blocks";

export function generateStaticParams() {
  return blocks.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blocks/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = blocks.find((b) => b.slug === slug);
  return { title: item ? `${item.name} · بلاک‌ها · وایب‌فارسی` : "یافت نشد", description: item?.desc };
}

export default async function BlockPage({ params }: PageProps<"/blocks/[slug]">) {
  const { slug } = await params;
  const i = blocks.findIndex((b) => b.slug === slug);
  if (i < 0) notFound();
  const item = blocks[i];
  const code = readSource(item.file);

  return (
    <article className="space-y-12">
      <DocHeader section="blocks" sectionLabel="بلاک‌ها" item={item} kind="بلاک" />
      <div className="flex flex-wrap gap-1.5">{item.tags.map((t) => <span key={t} className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">{t}</span>)}</div>
      <ItemTabs demo={{ kind: "block", slug: item.slug }} files={[{ name: item.file.split("/").pop()!, code }]} prompt={buildPrompt(item, "block")} previewClass="min-h-0" />
      <DocSection id="install" title="نصب"><InstallSteps item={item} targetDir="components/blocks" code={code} section="blocks" /></DocSection>
      {item.registryDeps && item.registryDeps.length > 0 && (
        <DocSection id="parts" title="ساخته‌شده از">
          <div className="flex flex-wrap gap-1.5">{item.registryDeps.map((d) => <Link key={d} href={`/components/${d}`} className="rounded-md border border-border px-2 py-1 font-mono text-xs transition-colors hover:bg-accent" dir="ltr">{d}</Link>)}</div>
        </DocSection>
      )}
      <DocSection id="usage" title="استفاده"><UsageBlock code={item.usage} /></DocSection>
      {item.props && <DocSection id="props" title="پراپ‌ها"><PropsTable props={item.props} /></DocSection>}
      <PrevNext base="blocks" prev={blocks[i - 1]} next={blocks[i + 1]} />
    </article>
  );
}
