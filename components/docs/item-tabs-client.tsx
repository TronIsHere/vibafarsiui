"use client";

import * as React from "react";
import { Bot, ChevronDown, Code2, Eye, Maximize2, RotateCcw } from "lucide-react";
import { CopyButton } from "@/components/shared/copy-button";
import { themes } from "@/lib/registry/themes";
import { cn } from "@/lib/utils";
import { loadDemo } from "@/components/demos/demo-loaders";
import { replayable as replayableAnimations } from "@/components/demos/replayable";
import { LazyMount } from "@/components/shared/lazy-mount";

export type DemoRef = {
  kind: "component" | "animation" | "background" | "template" | "block";
  slug: string;
};

function previewHrefFor(slug: string, theme: string) {
  return `/preview/${slug}?theme=${encodeURIComponent(theme)}`;
}

function applyThemeTo(root: HTMLElement | null | undefined, theme: string) {
  if (!root) return;
  if (theme === "graphite") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme);
}

/** Isolated full-page template. Theme lives on the iframe document, not the parent pane. */
function TemplateFrame({ slug, theme }: { slug: string; theme: string }) {
  const ref = React.useRef<HTMLIFrameElement>(null);
  const src = React.useRef(previewHrefFor(slug, theme));

  const apply = React.useCallback(() => {
    applyThemeTo(ref.current?.contentDocument?.documentElement, theme);
  }, [theme]);

  React.useEffect(apply, [apply]);

  return (
    <iframe
      ref={ref}
      title="پیش‌نمایش قالب"
      src={src.current}
      onLoad={apply}
      className="h-[640px] w-full rounded-lg border border-border bg-background"
    />
  );
}

function BlockFrame({ slug, theme }: { slug: string; theme: string }) {
  const ref = React.useRef<HTMLIFrameElement>(null);
  const src = `/preview/block/${slug}?theme=${encodeURIComponent(theme)}`;

  const apply = React.useCallback(() => {
    applyThemeTo(ref.current?.contentDocument?.documentElement, theme);
  }, [theme]);

  React.useEffect(apply, [apply]);

  return (
    <iframe
      ref={ref}
      title="پیش‌نمایش بلاک"
      src={src}
      onLoad={apply}
      className="min-h-[420px] w-full border-0 bg-background"
    />
  );
}

function DemoPreview({ demo, replay, theme }: { demo: DemoRef; replay: number; theme: string }) {
  if (demo.kind === "template") {
    return <TemplateFrame key={replay} slug={demo.slug} theme={theme} />;
  }
  if (demo.kind === "block") {
    return <BlockFrame key={replay} slug={demo.slug} theme={theme} />;
  }
  const loader = loadDemo(demo.kind, demo.slug);
  if (!loader) return null;
  return (
    <LazyMount
      id={`docs:${demo.kind}:${demo.slug}`}
      loader={loader}
      replay={replay}
      gate={false}
    />
  );
}

export interface CodeFileView {
  name: string;
  /** Raw source, for the copy button. */
  code: string;
  /** `<CodeBlock>` rendered by the server wrapper in ./item-tabs.tsx (it can't be imported here). */
  block: React.ReactNode;
}

export interface ItemTabsClientProps {
  demo: DemoRef;
  files: CodeFileView[];
  prompt: string;
  /** Full-page preview URL (templates). */
  previewHref?: string;
  /** Height class for the preview pane. */
  previewClass?: string;
  /** Preview is a background layer: render inside an overflow-hidden box with sample text. */
  layer?: boolean;
}

export function ItemTabsClient({
  demo,
  files,
  prompt,
  previewHref,
  previewClass,
  layer,
}: ItemTabsClientProps) {
  const replayable =
    demo.kind === "animation"
      ? replayableAnimations.has(demo.slug)
      : demo.kind === "template";
  const [tab, setTab] = React.useState<"preview" | "code" | "prompt">(
    "preview",
  );
  const [k, setK] = React.useState(0);
  const [scope, setScope] = React.useState("graphite");
  const [file, setFile] = React.useState(0);
  const rendered = <DemoPreview demo={demo} replay={k} theme={scope} />;

  const tabs = [
    { id: "preview", label: "پیش‌نمایش", I: Eye },
    { id: "code", label: "کد", I: Code2 },
    { id: "prompt", label: "پرامپت", I: Bot },
  ] as const;

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-t-xl border-b border-border px-2 py-2">
        <div
          role="tablist"
          className="inline-flex rounded-lg bg-background p-0.5 text-sm"
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1 transition-colors duration-200",
                tab === t.id
                  ? "bg-secondary font-semibold text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <t.I className="size-3.5" />
              {t.label}
            </button>
          ))}
        </div>

        {tab === "preview" && (
          <div className="flex items-center gap-1.5">
            <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="hidden sm:inline">سیستم طراحی</span>
              <span className="relative inline-flex">
                <select
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  className="h-7 cursor-pointer appearance-none rounded-md border border-border bg-background ps-2.5 pe-7 text-xs leading-none text-foreground outline-none"
                >
                  {themes.map((t) => (
                    <option key={t.slug} value={t.slug}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute end-2 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
              </span>
            </label>
            {replayable && (
              <button
                type="button"
                onClick={() => setK((x) => x + 1)}
                aria-label="پخش دوباره"
                className="flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <RotateCcw className="size-3.5" />
              </button>
            )}
            {previewHref && (
              <a
                href={`${previewHref}?theme=${encodeURIComponent(scope)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-7 cursor-pointer items-center gap-1 rounded-md border border-border px-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <Maximize2 className="size-3" />
                تمام‌صفحه
              </a>
            )}
          </div>
        )}
        {tab === "code" && (
          <div className="flex items-center gap-1.5">
            {files.length > 1 && (
              <div className="inline-flex rounded-md border border-border p-0.5">
                {files.map((f, i) => (
                  <button
                    key={f.name}
                    type="button"
                    onClick={() => setFile(i)}
                    className={cn(
                      "cursor-pointer rounded px-2 py-0.5   text-[11px]",
                      file === i
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground",
                    )}
                    dir="ltr"
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            )}
            {files.length === 1 && (
              <span className="  text-xs text-muted-foreground" dir="ltr">
                {files[0].name}
              </span>
            )}
            <CopyButton text={files[file]?.code ?? ""} />
          </div>
        )}
        {tab === "prompt" && (
          <div className="flex items-center gap-1.5">
            <span className="  text-xs text-muted-foreground">prompt.md</span>
            <CopyButton text={prompt} />
          </div>
        )}
      </div>

      {tab === "preview" && (
        <div
          data-theme={scope}
          className={cn(
            "relative flex items-center justify-center rounded-b-xl bg-background text-foreground",
            demo.kind === "block" ? "p-0" : "p-6 sm:p-10",
            previewClass ?? "min-h-[320px]",
          )}
        >
          {!layer && demo.kind !== "template" && demo.kind !== "block" && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-b-xl opacity-40"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(-45deg, oklch(from var(--foreground) l c h / 5%) 0 1px, transparent 1px 9px)",
              }}
            />
          )}
          {layer ? (
            <div className="relative h-72 w-full overflow-hidden rounded-xl border border-border bg-card">
              {rendered}
              <div className="relative flex h-full flex-col items-center justify-center gap-2 text-center">
                <p className="text-2xl font-bold">متن روی پس‌زمینه</p>
                <p className="text-sm text-muted-foreground">
                  در همه‌ی تم‌ها باید خوانا بمونه.
                </p>
              </div>
            </div>
          ) : (
            <div className="relative flex w-full items-center justify-center">
              {rendered}
            </div>
          )}
        </div>
      )}
      {tab === "code" && (
        <div className="overflow-hidden rounded-b-xl">{files[file]?.block}</div>
      )}
      {tab === "prompt" && (
        <div className="p-5">
          <p className="mb-3 text-xs text-muted-foreground">
            این متن را در Cursor، Claude Code یا ابزار مشابه پیست کنید:
          </p>
          <pre
            className="whitespace-pre-wrap font-sans text-[15px] leading-7 text-foreground/90"
            dir="ltr"
          >
            {prompt}
          </pre>
        </div>
      )}
    </div>
  );
}
