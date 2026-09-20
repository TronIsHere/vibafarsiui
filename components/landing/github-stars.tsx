import { GithubIcon } from "@/components/shared/icons";
import { getGithubStars } from "@/lib/github";
import { GITHUB_URL } from "@/lib/site";
import { faNumber } from "@/lib/utils";

export async function GithubStarsButton() {
  return <GithubButton stars={await getGithubStars()} />;
}

export function GithubButton({ stars }: { stars?: number | null }) {
  const count = stars != null && stars > 0 ? faNumber(stars) : null;
  return (
    <a
      href={GITHUB_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-border px-2.5 text-[13px] text-muted-foreground transition-colors duration-200 hover:border-foreground/20 hover:text-foreground"
      aria-label={count ? `گیت‌هاب، ${count} ستاره` : "گیت‌هاب"}
    >
      <GithubIcon className="size-3.5" />
      <span className={count ? "text-xs tabular-nums" : "hidden text-xs sm:inline"}>
        {count ?? "استار"}
      </span>
    </a>
  );
}
