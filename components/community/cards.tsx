import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import { KIND_LABEL, hostOf, type CodeSubmission, type ShowcaseSubmission } from "@/lib/community/types";
import { AuthorCredit } from "./author";
import { SandboxFrame } from "./sandbox-frame";

const CARD =
  "group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors duration-200 hover:border-foreground/25 focus-within:ring-2 focus-within:ring-ring/60";

export function CodeCard({ item }: { item: CodeSubmission }) {
  const href = `/community/${item.id}`;
  return (
    <div className={CARD}>
      <div className="relative h-56 overflow-hidden bg-background">
        {item.kind === "block" ? (
          // Blocks are page-wide, so the card shows them at half scale.
          <div className="absolute top-0 right-0 h-[448px] w-[200%] origin-top-right scale-50">
            <SandboxFrame code={item.code} css={item.css} kind="block" minHeight={448} maxHeight={448} lazy interactive={false} title={item.title} />
          </div>
        ) : (
          <SandboxFrame code={item.code} css={item.css} kind="component" minHeight={224} maxHeight={224} lazy interactive={false} title={item.title} />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-card to-transparent" />
        <Link href={href} aria-label={`باز کردن ${item.title}`} className="absolute inset-0" />
      </div>
      <div className="flex flex-1 flex-col gap-2 border-t border-border px-4 py-3">
        <Link href={href} className="outline-none">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">{item.title}</h3>
            <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">{KIND_LABEL[item.kind]}</span>
          </div>
          {item.description && <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{item.description}</p>}
        </Link>
        <AuthorCredit author={item.author} compact className="mt-auto text-xs" />
      </div>
    </div>
  );
}

export function ShowcaseCard({ item }: { item: ShowcaseSubmission }) {
  const rel = "ugc nofollow noopener noreferrer";
  const host = hostOf(item.url);
  return (
    <div className={CARD}>
      <a href={item.url} target="_blank" rel={rel} className="relative block aspect-[16/10] overflow-hidden bg-background">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/api/community/media/${item.image}`}
            alt={`عکس سایت ${item.title}`}
            loading="lazy"
            className="size-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-grid">
            <span className="text-lg font-semibold text-muted-foreground" dir="ltr">{host}</span>
          </div>
        )}
      </a>
      <div className="flex flex-1 flex-col gap-2 border-t border-border px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold">{item.title}</h3>
          <a href={item.url} target="_blank" rel={rel} className="inline-flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground" dir="ltr">
            {host}
            <ArrowUpLeft className="size-3" />
          </a>
        </div>
        {item.description && <p className="line-clamp-3 text-xs leading-5 text-muted-foreground">{item.description}</p>}
        <AuthorCredit author={item.author} compact className="mt-auto text-xs" />
      </div>
    </div>
  );
}
