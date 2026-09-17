import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildThemePrompt, themes } from "@/lib/registry";
import { readSource } from "@/lib/source";
import { DocHeader, DocSection, Notes, PrevNext } from "@/components/docs/blocks";
import { ThemeDetail } from "@/components/docs/theme-detail";

export function generateStaticParams() {
  return themes.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/themes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = themes.find((t) => t.slug === slug);
  return { title: item ? `${item.name} · سیستم‌های طراحی · وایب‌فارسی` : "یافت نشد", description: item?.desc };
}

const THEME_RULES = [
  "هر رنگ در کامپوننت‌ها از یک توکن معنایی می‌آید (bg-background، text-muted-foreground، border-border). رنگ ثابت (hex) داخل کامپوننت نیست.",
  "برای تم خودتان همین بلوک را کپی کنید، مقدارها را عوض کنید و روی html با data-theme بگذارید.",
  "شعاع گوشه با --radius کنترل می‌شود؛ اندازه‌های sm، md، lg و xl از همان حساب می‌شوند.",
  "تم روشن باید color-scheme: light داشته باشد تا کنترل‌های بومی مرورگر و اسکرول‌بار هم روشن بمانند.",
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
      <ThemeDetail theme={item} css={css} prompt={prompt} />
      <DocSection id="notes" title="نکته‌ها"><Notes notes={THEME_RULES} /></DocSection>
      <PrevNext base="themes" prev={themes[i - 1]} next={themes[i + 1]} />
    </article>
  );
}
