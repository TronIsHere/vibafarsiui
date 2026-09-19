import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPrompt, backgrounds } from "@/lib/registry";
import { itemMetadata } from "@/lib/site";
import { readSource } from "@/lib/source";
import { ItemTabs } from "@/components/docs/item-tabs";
import { DocHeader, DocSection, InstallSteps, Notes, PrevNext, PropsTable, UsageBlock } from "@/components/docs/blocks";

export function generateStaticParams() {
  return backgrounds.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/backgrounds/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = backgrounds.find((c) => c.slug === slug);
  return itemMetadata(item, "پس‌زمینه‌ها", `/backgrounds/${slug}`);
}

export default async function Page({ params }: PageProps<"/backgrounds/[slug]">) {
  const { slug } = await params;
  const i = backgrounds.findIndex((c) => c.slug === slug);
  if (i < 0) notFound();
  const item = backgrounds[i];
  const code = readSource(item.file);
  const files = [
    { name: item.file.split("/").pop()!, code },
    ...(item.css ? [{ name: "globals.css", code: item.css, lang: "css" as const }] : []),
    // Shader items ship with the primitive they import.
    ...(item.registryDeps?.includes("shader") ? [{ name: "shader.tsx", code: readSource("registry/backgrounds/shader.tsx") }] : []),
  ];

  return (
    <article className="space-y-12">
      <DocHeader section="backgrounds" sectionLabel="پس‌زمینه‌ها" item={item} kind="پس‌زمینه" />
      <ItemTabs demo={{ kind: "background", slug: item.slug }} files={files} prompt={buildPrompt(item, "background")} previewClass="min-h-[360px]" layer />
      <DocSection id="install" title="نصب"><InstallSteps item={item} targetDir="components/backgrounds" code={code} section="backgrounds" /></DocSection>
      <DocSection id="usage" title="استفاده"><UsageBlock code={item.usage} /></DocSection>
      {item.props && <DocSection id="props" title="پراپ‌ها"><PropsTable props={item.props} /></DocSection>}
      {item.notes && <DocSection id="notes" title="نکته‌ها"><Notes notes={item.notes} /></DocSection>}
      <PrevNext base="backgrounds" prev={backgrounds[i - 1]} next={backgrounds[i + 1]} />
    </article>
  );
}
