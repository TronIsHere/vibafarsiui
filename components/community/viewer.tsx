"use client";

import * as React from "react";
import { AlertTriangle, ChevronDown, Code2, Eye, Monitor, Smartphone, Tablet } from "lucide-react";
import { CopyButton } from "@/components/shared/copy-button";
import type { CodeKind } from "@/lib/community/types";
import { themes } from "@/lib/registry/themes";
import { cn } from "@/lib/utils";
import { SandboxFrame, type SandboxStatus } from "./sandbox-frame";

type Viewport = "desktop" | "tablet" | "mobile";

const VIEWPORTS: { id: Viewport; label: string; width: number | "100%"; Icon: typeof Monitor }[] = [
  { id: "desktop", label: "دسکتاپ", width: "100%", Icon: Monitor },
  { id: "tablet", label: "تبلت", width: 768, Icon: Tablet },
  { id: "mobile", label: "موبایل", width: 375, Icon: Smartphone },
];

export interface ViewerFile {
  name: string;
  code: string;
  /** Server-highlighted `<CodeBlock>`. */
  block: React.ReactNode;
}

/** Preview + code tabs for a community submission, styled like the registry item tabs. */
export function CommunityViewer({
  code,
  css,
  kind,
  files,
}: {
  code: string;
  css?: string;
  kind: CodeKind;
  files: ViewerFile[];
}) {
  const [tab, setTab] = React.useState<"preview" | "code">("preview");
  const [theme, setTheme] = React.useState("graphite");
  const [viewport, setViewport] = React.useState<Viewport>("desktop");
  const [file, setFile] = React.useState(0);
  const [status, setStatus] = React.useState<SandboxStatus>({ state: "loading" });
  const width = VIEWPORTS.find((v) => v.id === viewport)!.width;

  const tabs = [
    { id: "preview", label: "پیش‌نمایش", I: Eye },
    { id: "code", label: "کد", I: Code2 },
  ] as const;

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-t-xl border-b border-border px-2 py-2">
        <div role="tablist" className="inline-flex rounded-lg bg-background p-0.5 text-sm">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1 transition-colors duration-200",
                tab === t.id ? "bg-secondary font-semibold text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <t.I className="size-3.5" />
              {t.label}
            </button>
          ))}
        </div>

        {tab === "preview" ? (
          <div className="flex items-center gap-1.5">
            <div role="group" aria-label="اندازه پیش‌نمایش" className="inline-flex rounded-md border border-border p-0.5">
              {VIEWPORTS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  aria-label={label}
                  aria-pressed={viewport === id}
                  title={label}
                  onClick={() => setViewport(id)}
                  className={cn(
                    "flex size-7 cursor-pointer items-center justify-center rounded transition-colors",
                    viewport === id ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="size-3.5" />
                </button>
              ))}
            </div>
            <ThemeSelect value={theme} onChange={setTheme} />
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            {files.length > 1 ? (
              <div className="inline-flex rounded-md border border-border p-0.5">
                {files.map((f, i) => (
                  <button
                    key={f.name}
                    type="button"
                    onClick={() => setFile(i)}
                    className={cn(
                      "cursor-pointer rounded px-2 py-0.5 text-[11px]",
                      file === i ? "bg-secondary text-foreground" : "text-muted-foreground",
                    )}
                    dir="ltr"
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            ) : (
              <span className="text-xs text-muted-foreground" dir="ltr">
                {files[0]?.name}
              </span>
            )}
            <CopyButton text={files[file]?.code ?? ""} />
          </div>
        )}
      </div>

      <div hidden={tab !== "preview"} className="overflow-hidden rounded-b-xl">
        {status.state === "error" && <PreviewError message={status.message} />}
        <div className={cn("flex justify-center", viewport !== "desktop" && "overflow-x-auto bg-secondary/40 p-4 sm:p-6")}>
          <SandboxFrame
            code={code}
            css={css}
            kind={kind}
            theme={theme}
            width={width}
            minHeight={kind === "block" ? 420 : 340}
            onStatus={setStatus}
            className={cn(viewport !== "desktop" && "rounded-lg border border-border")}
          />
        </div>
      </div>
      {tab === "code" && <div className="overflow-hidden rounded-b-xl">{files[file]?.block}</div>}
    </div>
  );
}

export function ThemeSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className="hidden sm:inline">سیستم طراحی</span>
      <span className="relative inline-flex">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
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
  );
}

export function PreviewError({ message }: { message?: string }) {
  return (
    <div role="alert" className="flex items-start gap-2 border-b border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
      <AlertTriangle className="mt-0.5 size-4 shrink-0" />
      <p className="min-w-0 break-words font-mono text-[13px] leading-6" dir="auto">
        {message || "اجرای کد با خطا روبه‌رو شد."}
      </p>
    </div>
  );
}
