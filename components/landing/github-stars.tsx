import { GithubIcon } from "@/components/shared/icons";
import { GITHUB_URL } from "@/lib/site";

/** Label-only GitHub button. Restore live count via getGithubStars() when the repo has enough stars. */
export function GithubButton() {
  return (
    <a
      href={GITHUB_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-border px-2.5 text-[13px] text-muted-foreground transition-colors duration-200 hover:border-foreground/20 hover:text-foreground"
      aria-label="گیت‌هاب"
    >
      <GithubIcon className="size-3.5" />
      <span className="hidden text-xs sm:inline">استار</span>
    </a>
  );
}
