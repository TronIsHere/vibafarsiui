import type { CSSProperties } from "react";
import { highlight, type Lang } from "@/lib/highlight";
import { cn } from "@/lib/utils";

/**
 * Server-only: tokenizes with Shiki at build time and ships plain spans, so
 * client components receive it as a rendered node (`codeBlock` prop) rather
 * than importing it.
 */
export async function CodeBlock({
  code,
  lang = "tsx",
  className,
}: {
  code: string;
  lang?: Lang;
  className?: string;
}) {
  const lines = await highlight(code.replace(/^\n+|\n+$/g, ""), lang);
  const gutter = `${String(lines.length).length}ch`;
  return (
    <pre
      dir="ltr"
      style={{ "--gutter": gutter } as CSSProperties}
      className={cn(
        "code-well overflow-x-auto p-5 text-[13px] leading-[1.7] [scrollbar-width:thin]",
        className,
      )}
    >
      <code>
        {lines.map((tokens, i) => (
          <span key={i} className="grid grid-cols-[var(--gutter)_1fr] gap-4">
            <span className="select-none text-end opacity-35">{i + 1}</span>
            <span>
              {tokens.map((t, j) => {
                // FontStyle.Italic / Bold — const enums in vscode-textmate, so the bits are tested directly.
                const italic = ((t.fontStyle ?? 0) & 1) !== 0;
                const bold = ((t.fontStyle ?? 0) & 2) !== 0;
                if (!t.color && !italic && !bold) return t.content;
                return (
                  <span
                    key={j}
                    style={{ color: t.color, fontStyle: italic ? "italic" : undefined, fontWeight: bold ? 600 : undefined }}
                  >
                    {t.content}
                  </span>
                );
              })}
            </span>
          </span>
        ))}
      </code>
    </pre>
  );
}
