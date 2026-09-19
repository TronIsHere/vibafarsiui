import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildPrompt, templates } from "@/lib/registry";
import { itemMetadata } from "@/lib/site";
import { readSource } from "@/lib/source";
import { ItemTabs } from "@/components/docs/item-tabs";
import {
  DocHeader,
  DocSection,
  InstallSteps,
  PrevNext,
  UsageBlock,
} from "@/components/docs/blocks";

export function generateStaticParams() {
  return templates.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/templates/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = templates.find((c) => c.slug === slug);
  return itemMetadata(item, "قالب‌ها", `/templates/${slug}`);
}

export default async function TemplatePage({
  params,
}: PageProps<"/templates/[slug]">) {
  const { slug } = await params;
  const i = templates.findIndex((c) => c.slug === slug);
  if (i < 0) notFound();
  const item = templates[i];
  const code = readSource(item.file);

  return (
    <article className="space-y-12">
      <DocHeader
        section="templates"
        sectionLabel="قالب‌ها"
        item={item}
        kind="قالب"
      />
      <div className="flex flex-wrap gap-1.5">
        {item.tags.map((t) => (
          <span
            key={t}
            className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
          >
            {t}
          </span>
        ))}
      </div>
      <ItemTabs
        demo={{ kind: "template", slug: item.slug }}
        files={[{ name: item.file.split("/").pop()!, code }]}
        prompt={buildPrompt(item, "template")}
        previewHref={`/preview/${item.slug}`}
        previewClass="min-h-0 !p-3"
      />
      <DocSection id="install" title="نصب">
        <InstallSteps
          item={item}
          targetDir="components/templates"
          code={code}
          section="templates"
        />
      </DocSection>
      <DocSection id="parts" title="ساخته‌شده از">
        <div className="flex flex-wrap gap-1.5">
          {item.registryDeps?.map((d) => (
            <Link
              key={d}
              href={`/components/${d}`}
              className="rounded-md border border-border px-2 py-1   text-xs transition-colors hover:bg-accent"
              dir="ltr"
            >
              {d}
            </Link>
          ))}
        </div>
      </DocSection>
      <DocSection id="usage" title="استفاده">
        <UsageBlock code={item.usage} />
      </DocSection>
      <PrevNext
        base="templates"
        prev={templates[i - 1]}
        next={templates[i + 1]}
      />
    </article>
  );
}
