import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPrompt, components } from "@/lib/registry";
import { readSource } from "@/lib/source";
import { ItemTabs } from "@/components/docs/item-tabs";
import { DocHeader, DocSection, InstallSteps, Notes, PrevNext, PropsTable, UsageBlock } from "@/components/docs/blocks";

export function generateStaticParams() {
  return components.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/components/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = components.find((c) => c.slug === slug);
  return { title: item ? `${item.name} · کامپوننت‌ها · وایب‌فارسی` : "یافت نشد", description: item?.desc };
}

export default async function ComponentPage({ params }: PageProps<"/components/[slug]">) {
  const { slug } = await params;
  const i = components.findIndex((c) => c.slug === slug);
  if (i < 0) notFound();
  const item = components[i];
  const code = readSource(item.file);
  const files = [{ name: item.file.split("/").pop()!, code }, ...(item.css ? [{ name: "globals.css", code: item.css, lang: "css" as const }] : [])];

  return (
    <article className="space-y-12">
      <DocHeader section="components" sectionLabel="کامپوننت‌ها" item={item} kind="کامپوننت" />
      <ItemTabs demo={{ kind: "component", slug: item.slug }} files={files} prompt={buildPrompt(item)} previewClass={item.wide ? "min-h-[280px]" : "min-h-[340px]"} />
      <DocSection id="install" title="نصب"><InstallSteps item={item} targetDir="components/ui" code={code} section="components" /></DocSection>
      <DocSection id="usage" title="استفاده"><UsageBlock code={item.usage} /></DocSection>
      {item.props && <DocSection id="props" title="پراپ‌ها"><PropsTable props={item.props} /></DocSection>}
      {item.notes && <DocSection id="notes" title="نکته‌های راست‌چین"><Notes notes={item.notes} /></DocSection>}
      <PrevNext base="components" prev={components[i - 1]} next={components[i + 1]} />
    </article>
  );
}
