"use client";

import * as React from "react";
import { BookOpenText, FileCode2 } from "lucide-react";
import { CopyButton } from "@/components/shared/copy-button";
import { cn } from "@/lib/utils";

/**
 * Rendered guide / raw markdown switcher for a skill page. Both views are
 * rendered by the server parent (markdown + shiki are server-only) and passed
 * in as nodes; this component only owns the active tab.
 */
export function SkillDetail({
  fileName,
  source,
  rendered,
  raw,
}: {
  fileName: string;
  /** Raw markdown, for the copy button. */
  source: string;
  rendered: React.ReactNode;
  raw: React.ReactNode;
}) {
  const [tab, setTab] = React.useState<"guide" | "source">("guide");
  const tabs = [
    { id: "guide", label: "راهنما", I: BookOpenText },
    { id: "source", label: fileName, I: FileCode2 },
  ] as const;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between gap-2 border-b border-border px-2 py-2">
        <div role="tablist" className="inline-flex rounded-lg bg-background p-0.5 text-sm">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1 transition-colors",
                tab === t.id ? "bg-secondary font-semibold text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <t.I className="size-3.5" />
              <span dir={t.id === "source" ? "ltr" : undefined}>{t.label}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="hidden text-xs text-muted-foreground sm:inline" dir="ltr">
            {fileName}
          </span>
          <CopyButton text={source} />
        </div>
      </div>
      {tab === "guide" ? <div className="px-5 py-4 sm:px-8 sm:py-6">{rendered}</div> : raw}
    </div>
  );
}
