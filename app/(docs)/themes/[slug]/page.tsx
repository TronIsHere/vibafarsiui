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
  "هر سیستم طراحی یک زبان کامله. کامپوننت‌ها علاوه بر رنگ، فرم گوشه (--shape-*)، ضخامت خط (--line)، سایه (--depth-*)، حس کلیک (--press)، سرعت حرکت (--motion) و فونت تیتر (--type-display) را هم از توکن‌ها می‌خونن.",
  "هیچ رنگ، گوشه، سایه یا مدت انیمیشن ثابتی داخل کامپوننت نیست. به جاش از کلاس‌هایی مثل rounded-control، border-line، shadow-surface و duration-(--motion) استفاده میشه.",
  "برای تم خودتون همین بلوک را کپی کنید، مقدارها را عوض کنید و روی html با data-theme بگذارید. --spacing تراکم کل صفحه را کم و زیاد می‌کنه.",
  "اگه تم فونت تیتر جدا داره (مثل لاله‌زار یا نوتو نسخ)، CLI خودش لینک Google Fonts را اضافه می‌کنه. دستی هم می‌تونید با next/font یا یک @import بارش کنید.",
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
