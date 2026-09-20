import { CodeBlock } from "@/components/shared/code-block";
import type { Lang } from "@/lib/highlight";
import { inlineText, parseMarkdown, type Block, type Inline } from "@/lib/markdown";
import { cn } from "@/lib/utils";

/** Maps a fence language to a grammar the highlighter has; anything else renders as plain text. */
function toLang(lang: string): Lang {
  const l = lang.toLowerCase();
  if (["tsx", "ts", "jsx", "js", "typescript", "javascript"].includes(l)) return "tsx";
  if (l === "css") return "css";
  if (l === "json") return "json";
  if (["md", "markdown"].includes(l)) return "markdown";
  if (["bash", "sh", "shell", "zsh"].includes(l)) return "bash";
  return "text";
}

function Inlines({ nodes }: { nodes: Inline[] }) {
  return (
    <>
      {nodes.map((n, i) => {
        switch (n.t) {
          case "text":
            return n.v;
          case "code":
            return (
              <code key={i} dir="auto" className="rounded bg-secondary px-1 py-0.5 text-[0.85em] text-foreground">
                {n.v}
              </code>
            );
          case "strong":
            return (
              <strong key={i} className="font-semibold text-foreground">
                <Inlines nodes={n.c} />
              </strong>
            );
          case "em":
            return (
              <em key={i}>
                <Inlines nodes={n.c} />
              </em>
            );
          case "link":
            return (
              <a
                key={i}
                href={n.href}
                className="underline underline-offset-4 hover:text-foreground"
                {...(/^https?:/.test(n.href) ? { target: "_blank", rel: "noreferrer" } : {})}
              >
                <Inlines nodes={n.c} />
              </a>
            );
        }
      })}
    </>
  );
}

const HEADING = {
  1: "mt-10 text-2xl font-bold",
  2: "mt-10 text-xl font-bold",
  3: "mt-8 text-lg font-semibold",
  4: "mt-6 text-base font-semibold",
  5: "mt-4 text-sm font-semibold",
  6: "mt-4 text-sm font-semibold",
} as const;

function Blocks({ blocks, tight }: { blocks: Block[]; tight?: boolean }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.t) {
          case "heading": {
            const level = Math.min(6, Math.max(1, b.level)) as keyof typeof HEADING;
            // Page already has an h1; shift every markdown heading one level down.
            const Tag = `h${Math.min(6, level + 1)}` as "h2" | "h3" | "h4" | "h5" | "h6";
            return (
              <Tag key={i} id={b.id} dir="auto" className={cn("scroll-mt-24 first:mt-0", HEADING[level])}>
                <Inlines nodes={b.c} />
              </Tag>
            );
          }
          case "para":
            return (
              <p key={i} dir="auto" className={cn("leading-8 text-foreground/85", tight ? "my-1" : "my-3")}>
                <Inlines nodes={b.c} />
              </p>
            );
          case "list": {
            const Tag = b.ordered ? "ol" : "ul";
            return (
              <Tag
                key={i}
                dir="auto"
                className={cn("my-3 space-y-1.5 ps-6 leading-8 text-foreground/85", b.ordered ? "list-decimal" : "list-disc", "marker:text-muted-foreground")}
              >
                {b.items.map((item, j) => (
                  <li key={j} dir="auto">
                    <Blocks blocks={item} tight />
                  </li>
                ))}
              </Tag>
            );
          }
          case "quote":
            return (
              <blockquote key={i} dir="auto" className="my-4 border-s-2 border-brand/60 ps-4 text-foreground/80">
                <Blocks blocks={b.c} />
              </blockquote>
            );
          case "code":
            return (
              <div key={i} className="my-4 overflow-hidden rounded-xl border border-border bg-card">
                <CodeBlock code={b.v} lang={toLang(b.lang)} className="p-4 text-[12.5px]" />
              </div>
            );
          case "table":
            return (
              <div key={i} className="my-4 overflow-x-auto rounded-xl border border-border">
                <table dir="auto" className="w-full text-sm">
                  <thead className="bg-muted/60 text-xs text-muted-foreground">
                    <tr>
                      {b.head.map((cell, j) => (
                        <th key={j} dir="auto" className="px-3 py-2 text-start font-medium">
                          <Inlines nodes={cell} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((row, r) => (
                      <tr key={r} className="border-t border-border align-top">
                        {row.map((cell, j) => (
                          <td key={j} dir="auto" className="px-3 py-2 leading-7 text-foreground/85">
                            <Inlines nodes={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "hr":
            return <hr key={i} className="my-8 border-border" />;
        }
      })}
    </>
  );
}

/** Server-rendered markdown for skill files; each block picks its own direction from its text. */
export function Markdown({ source, className }: { source: string; className?: string }) {
  return (
    // The skill files are English prose with Persian examples; blocks pick their own direction.
    <div dir="ltr" lang="en" className={cn("text-start", className)}>
      <Blocks blocks={parseMarkdown(source)} />
    </div>
  );
}

/** Table of contents entries for a markdown source: level-2 headings only. */
export function markdownToc(source: string): { id: string; text: string }[] {
  return parseMarkdown(source)
    .filter((b): b is Extract<Block, { t: "heading" }> => b.t === "heading" && b.level === 2)
    .map((b) => ({ id: b.id, text: inlineText(b.c) }));
}
