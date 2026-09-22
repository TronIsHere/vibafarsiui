import { Globe } from "lucide-react";
import { GithubIcon } from "@/components/shared/icons";
import { githubUrl, hostOf, xUrl, type Author } from "@/lib/community/types";
import { cn } from "@/lib/utils";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const linkClass =
  "inline-flex items-center gap-1 rounded-md text-muted-foreground transition-colors hover:text-foreground";

/** Credit line for a community submission. Links are user-supplied, so they carry ugc/nofollow. */
export function AuthorCredit({ author, className, compact }: { author: Author; className?: string; compact?: boolean }) {
  const rel = "ugc nofollow noopener noreferrer";
  return (
    <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-1 text-sm", className)}>
      <span className="inline-flex items-center gap-2">
        <span
          aria-hidden
          className="flex size-6 items-center justify-center rounded-full bg-secondary text-[11px] font-semibold text-foreground"
        >
          {author.name.trim().charAt(0)}
        </span>
        <span className="font-medium text-foreground">{author.name}</span>
      </span>
      {author.x && (
        <a href={xUrl(author.x)} target="_blank" rel={rel} className={linkClass} dir="ltr">
          <XIcon className="size-3" />
          {!compact && <span className="text-xs">@{author.x}</span>}
          {compact && <span className="sr-only">ایکس</span>}
        </a>
      )}
      {author.github && (
        <a href={githubUrl(author.github)} target="_blank" rel={rel} className={linkClass} dir="ltr">
          <GithubIcon className="size-3.5" />
          {!compact && <span className="text-xs">{author.github}</span>}
          {compact && <span className="sr-only">گیت‌هاب</span>}
        </a>
      )}
      {author.url && (
        <a href={author.url} target="_blank" rel={rel} className={linkClass} dir="ltr">
          <Globe className="size-3.5" />
          {!compact && <span className="text-xs">{hostOf(author.url)}</span>}
          {compact && <span className="sr-only">سایت</span>}
        </a>
      )}
    </div>
  );
}
