import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthorCredit } from "@/components/community/author";
import { CommunityViewer } from "@/components/community/viewer";
import { DocSection } from "@/components/docs/blocks";
import { CodeBlock } from "@/components/shared/code-block";
import { CopyButton } from "@/components/shared/copy-button";
import { getSubmission } from "@/lib/community/store";
import { KIND_LABEL, registryDeps, type CodeSubmission } from "@/lib/community/types";
import { formatJalaliNumeric } from "@/lib/jalali";
import { pageMetadata } from "@/lib/site";
import { Breadcrumb } from "@/registry/ui/breadcrumb";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function load(id: string): Promise<CodeSubmission | null> {
  const item = await getSubmission(id);
  if (!item || item.kind === "showcase" || item.status !== "approved") return null;
  return item;
}

export async function generateMetadata({ params }: PageProps<"/community/[id]">): Promise<Metadata> {
  const { id } = await params;
  const item = await load(id);
  if (!item) return pageMetadata({ title: "یافت نشد", path: `/community/${id}`, index: false });
  return pageMetadata({
    title: `${item.title} · ساخته‌ی ${item.author.name} · وایب‌فارسی`,
    description: item.description || `${KIND_LABEL[item.kind]} راست‌چین از جامعه‌ی وایب‌فارسی، ساخته‌ی ${item.author.name}.`,
    path: `/community/${id}`,
  });
}

export default async function CommunityItemPage({ params }: PageProps<"/community/[id]">) {
  const { id } = await params;
  const item = await load(id);
  if (!item) notFound();

  const files = [
    { name: item.kind === "block" ? "block.tsx" : "component.tsx", code: item.code, lang: "tsx" as const },
    ...(item.css ? [{ name: "globals.css", code: item.css, lang: "css" as const }] : []),
  ];
  const deps = registryDeps(item.code);
  const install = deps.length ? `npx vibefarsi add ${deps.map((d) => d.slug).join(" ")}` : "";
  const date = formatJalaliNumeric(new Date(item.reviewedAt ?? item.createdAt));

  return (
    <article className="space-y-12">
      <header>
        <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "جامعه", href: "/community" }, { label: item.title }]} />
        <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="text-3xl font-bold">{item.title}</h1>
          <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">{KIND_LABEL[item.kind]}</span>
          <span className="rounded-full border border-brand/30 bg-brand/10 px-2 py-0.5 text-[11px] text-brand">جامعه</span>
        </div>
        {item.description && <p className="mt-2 max-w-2xl text-muted-foreground">{item.description}</p>}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <AuthorCredit author={item.author} />
          <span className="text-xs text-muted-foreground">منتشرشده در {date}</span>
        </div>
      </header>

      <CommunityViewer
        code={item.code}
        css={item.css}
        kind={item.kind}
        files={files.map((f) => ({
          name: f.name,
          code: f.code,
          block: <CodeBlock code={f.code} lang={f.lang} className="max-h-[640px] overflow-auto" />,
        }))}
      />

      <DocSection id="install" title="استفاده">
        <div className="space-y-4 text-[15px] leading-8 text-muted-foreground">
          {deps.length > 0 ? (
            <>
              <p>
                این {KIND_LABEL[item.kind]} از{" "}
                {deps.map((d, i) => (
                  <span key={d.slug}>
                    {i > 0 && "، "}
                    <Link href={d.href} className="font-medium text-foreground underline-offset-4 hover:underline" dir="ltr">
                      {d.slug}
                    </Link>
                  </span>
                ))}{" "}
                استفاده می‌کنه. اول اون‌ها را نصب کنید و بعد کد را در پروژه‌تون کپی کنید.
              </p>
              <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-2.5">
                <code className="min-w-0 truncate font-mono text-[13px] text-foreground" dir="ltr">{install}</code>
                <CopyButton text={install} />
              </div>
            </>
          ) : (
            <p>این {KIND_LABEL[item.kind]} به کامپوننت دیگه‌ای نیاز نداره. کد را کپی کنید و در پروژه‌تون بگذارید.</p>
          )}
          {item.css && <p>بخش CSS را هم به انتهای globals.css اضافه کنید.</p>}
          <p className="text-sm">
            این کار را جامعه ساخته و ما فقط بررسیش کردیم. قبل از استفاده در محصول واقعی کد را یک بار خودتون بخونید.
          </p>
        </div>
      </DocSection>
    </article>
  );
}
