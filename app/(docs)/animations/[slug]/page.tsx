import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPrompt, animations } from "@/lib/registry";
import { itemMetadata } from "@/lib/site";
import { readSource } from "@/lib/source";
import { ItemTabs } from "@/components/docs/item-tabs";
import { DocHeader, DocSection, InstallSteps, Notes, PrevNext, PropsTable, UsageBlock } from "@/components/docs/blocks";

export function generateStaticParams() {
  return animations.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/animations/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = animations.find((c) => c.slug === slug);
  return itemMetadata(item, "انیمیشن‌ها", `/animations/${slug}`);
}

export default async function Page({ params }: PageProps<"/animations/[slug]">) {
  const { slug } = await params;
  const i = animations.findIndex((c) => c.slug === slug);
  if (i < 0) notFound();
  const item = animations[i];
  const code = readSource(item.file);
  const files = [{ name: item.file.split("/").pop()!, code }, ...(item.css ? [{ name: "globals.css", code: item.css, lang: "css" as const }] : [])];

  return (
    <article className="space-y-12">
      <DocHeader section="animations" sectionLabel="انیمیشن‌ها" item={item} kind="انیمیشن" />
      <ItemTabs demo={{ kind: "animation", slug: item.slug }} files={files} prompt={buildPrompt(item, "animation")} previewClass="min-h-[300px]" />
      <DocSection id="install" title="نصب"><InstallSteps item={item} targetDir="components/animations" code={code} section="animations" /></DocSection>
      <DocSection id="usage" title="استفاده"><UsageBlock code={item.usage} /></DocSection>
      {item.props && <DocSection id="props" title="پراپ‌ها"><PropsTable props={item.props} /></DocSection>}
      {item.notes && <DocSection id="notes" title="نکته‌ها"><Notes notes={item.notes} /></DocSection>}
      <PrevNext base="animations" prev={animations[i - 1]} next={animations[i + 1]} />
    </article>
  );
}
