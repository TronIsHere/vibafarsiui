import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildThemePrompt, themes } from "@/lib/registry";
import { itemMetadata } from "@/lib/site";
import { readSource } from "@/lib/source";
import { DocHeader, DocSection, Notes, PrevNext } from "@/components/docs/blocks";
import { ThemeDetail } from "@/components/docs/theme-detail";
import { CodeBlock } from "@/components/shared/code-block";

export function generateStaticParams() {
  return themes.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/themes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = themes.find((t) => t.slug === slug);
  return itemMetadata(item, "سیستم‌های طراحی", `/themes/${slug}`);
}

const THEME_RULES = [
  "هر رنگ در کامپوننت‌ها از یک توکن معنایی می‌آد، مثل bg-background، text-muted-foreground و border-border. هیچ رنگ ثابتی (hex) داخل کامپوننت نیست.",
  "برای تم خودتون همین بلوک را کپی کنید، مقدارها را عوض کنید و روی html با data-theme بگذارید.",
  "شعاع گوشه با --radius کنترل میشه و اندازه‌های sm، md، lg و xl از همان حساب میشن.",
  "تم روشن باید color-scheme: light داشته باشه تا کنترل‌های بومی مرورگر و اسکرول‌بار هم روشن بمونن.",
];

export default async function ThemePage({ params }: PageProps<"/themes/[slug]">) {
  const { slug } = await params;
  const i = themes.findIndex((t) => t.slug === slug);
  if (i < 0) notFound();
  const item = themes[i];
  const css = readSource(item.file);
  const prompt = buildThemePrompt(item, css);

  return (
    <article className="space-y-12">
      <DocHeader section="themes" sectionLabel="سیستم‌های طراحی" item={{ name: item.name, slug: item.slug, desc: item.desc }} kind="سیستم طراحی" />
      <ThemeDetail theme={item} css={css} codeBlock={<CodeBlock code={css} lang="css" />} prompt={prompt} />
      <DocSection id="notes" title="نکته‌ها"><Notes notes={THEME_RULES} /></DocSection>
      <PrevNext base="themes" prev={themes[i - 1]} next={themes[i + 1]} />
    </article>
  );
}
