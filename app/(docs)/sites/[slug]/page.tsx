import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import {
  buildSitePrompt,
  sitePreviewHref,
  siteRouteSource,
  siteRouteTarget,
  sites,
  siteSourceFiles,
} from "@/lib/registry";
import { itemMetadata } from "@/lib/site";
import { readSource } from "@/lib/source";
import { fa } from "@/lib/utils";
import { ItemTabs } from "@/components/docs/item-tabs";
import { DocHeader, DocSection, PrevNext, depHref } from "@/components/docs/blocks";
import { CopyButton } from "@/components/shared/copy-button";
import { siteAssets } from "@/lib/site-registry";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return sites.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = sites.find((s) => s.slug === slug);
  return itemMetadata(item, "سایت‌های کامل", `/sites/${slug}`);
}

export default async function SitePage({ params }: Props) {
  const { slug } = await params;
  const i = sites.findIndex((s) => s.slug === slug);
  if (i < 0) notFound();
  const item = sites[i];

  const sources = siteSourceFiles(item).map((f) => ({ name: f.target, code: readSource(f.src) }));
  const routes = item.pages.map((p) => ({ name: siteRouteTarget(p), code: siteRouteSource(item, p) }));
  const assets = siteAssets(item.slug);
  const cmd = `npx vibefarsi add ${item.slug}`;

  return (
    <article className="space-y-12">
      <DocHeader section="sites" sectionLabel="سایت‌های کامل" item={item} kind="سایت کامل" />
      <div className="flex flex-wrap gap-1.5">
        {item.features.map((t) => (
          <span key={t} className="rounded-full border border-brand/40 bg-brand/10 px-2.5 py-0.5 text-[11px] text-foreground">
            {t}
          </span>
        ))}
        {item.tags.map((t) => (
          <span key={t} className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
            {t}
          </span>
        ))}
      </div>

      <ItemTabs
        demo={{ kind: "site", slug: item.slug }}
        files={[...sources, ...routes]}
        prompt={buildSitePrompt(item)}
        previewHref={sitePreviewHref(item.slug)}
        previewClass="min-h-0 !p-3"
        pages={item.pages.map((p) => ({ label: p.label, href: sitePreviewHref(item.slug, p.path) }))}
      />

      <DocSection id="pages" title="صفحه‌ها">
        <p className="mb-4 max-w-2xl text-sm leading-7 text-muted-foreground">
          این سایت {fa(item.pages.length)} صفحه داره که همه از یک پوسته‌ی مشترک استفاده می‌کنن، پس هدر، منوی موبایل و فوتر فقط یک جا نوشته شدن. روی هر صفحه بزنید تا تمام‌صفحه باز بشه.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {item.pages.map((p) => (
            <li key={p.path}>
              <a
                href={sitePreviewHref(item.slug, p.path)}
                target="_blank"
                rel="noreferrer"
                className="group flex h-full flex-col rounded-xl border border-border bg-card p-4 transition-colors hover:border-foreground/25"
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-semibold">{p.label}</span>
                  <ExternalLink className="size-3.5 text-muted-foreground transition-colors group-hover:text-foreground" />
                </span>
                <span className="mt-2 font-mono text-xs text-muted-foreground" dir="ltr">
                  /{p.path}
                </span>
                <span className="mt-1 font-mono text-[11px] text-muted-foreground/70" dir="ltr">
                  {p.export} · {p.file}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection id="install" title="نصب">
        <ol className="space-y-4">
          <li className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm font-medium">با CLI</p>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              این دستور همه‌ی فایل‌های سایت را در{" "}
              <code className="rounded bg-secondary px-1 text-[11px]" dir="ltr">
                components/sites/{item.slug}
              </code>{" "}
              می‌نویسه، برای هر صفحه یک route در{" "}
              <code className="rounded bg-secondary px-1 text-[11px]" dir="ltr">
                app/
              </code>{" "}
              می‌سازه، {fa(assets.length)} عکسش را در{" "}
              <code className="rounded bg-secondary px-1 text-[11px]" dir="ltr">
                public/sites/{item.slug}
              </code>{" "}
              دانلود می‌کنه و کامپوننت‌هایی که لازم داره را هم نصب می‌کنه. اگر از قبل{" "}
              <code className="rounded bg-secondary px-1 text-[11px]" dir="ltr">
                app/page.tsx
              </code>{" "}
              دارید، CLI روش نمی‌نویسه مگر اینکه{" "}
              <code className="rounded bg-secondary px-1 text-[11px]" dir="ltr">
                --overwrite
              </code>{" "}
              بدید.
            </p>
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-xs" dir="ltr">
              <span className="text-muted-foreground">$</span> {cmd}
              <CopyButton text={cmd} className="ms-auto" />
            </div>
          </li>
          <li className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm font-medium">نصب دستی</p>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              هر فایل تب «کد» را در همون مسیری بگذارید که اسمش نشون میده. کامپوننت‌های پایین‌تر در «ساخته‌شده از» را هم جداگانه اضافه کنید.
            </p>
            <ul className="mt-3 divide-y divide-border overflow-hidden rounded-lg border border-border bg-background font-mono text-[11px]" dir="ltr">
              {[...sources, ...routes].map((f) => (
                <li key={f.name} className="flex items-center justify-between gap-3 px-3 py-1.5">
                  <span className="truncate">{f.name}</span>
                  <CopyButton text={f.code} className="shrink-0" />
                </li>
              ))}
            </ul>
            {assets.length > 0 && (
              <>
                <p className="mt-4 text-xs leading-6 text-muted-foreground">
                  عکس‌ها با هوش مصنوعی ساخته شدن و استفاده ازشون آزاده. هر کدوم را دانلود کنید و در همون مسیر بگذارید، یا عکس‌های خودتون را با همین اسم‌ها جایگزین کنید.
                </p>
                <ul className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {assets.map((a) => (
                    <li key={a.url}>
                      <a href={a.url} download title={a.path} className="block aspect-square overflow-hidden rounded-lg border border-border transition-opacity hover:opacity-80">
                        {/* eslint-disable-next-line @next/next/no-img-element -- tiny local thumbnails */}
                        <img src={a.url} alt={a.path.split("/").pop()} loading="lazy" className="size-full object-cover" />
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <div className="mt-3 flex items-center gap-2">
              <a
                href={`/r/sites/${item.slug}.json`}
                className="ms-auto text-[11px] text-muted-foreground underline underline-offset-4 hover:text-foreground"
                dir="ltr"
              >
                registry json
              </a>
            </div>
          </li>
        </ol>
      </DocSection>

      <DocSection id="parts" title="ساخته‌شده از">
        <div className="flex flex-wrap gap-1.5">
          {item.registryDeps?.map((d) => (
            <Link
              key={d}
              href={depHref(d)}
              className="rounded-md border border-border px-2 py-1 text-xs transition-colors hover:bg-accent"
              dir="ltr"
            >
              {d}
            </Link>
          ))}
        </div>
      </DocSection>

      <PrevNext base="sites" prev={sites[i - 1]} next={sites[i + 1]} />
    </article>
  );
}
