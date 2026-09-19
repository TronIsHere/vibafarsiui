import "server-only";
import { GITHUB_REPO } from "@/lib/site";

/**
 * Live stargazer count from the GitHub REST API.
 * Cached for an hour. Returns null if GitHub is unreachable (common on
 * some Iranian networks) so the UI can fall back to a plain Star button.
 * Set GITHUB_TOKEN to raise the unauthenticated 60 req/hour cap.
 */
export async function getGithubStars(): Promise<number | null> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "vibefarsi.ir",
      "X-GitHub-Api-Version": "2022-11-28",
    };
    const token = process.env.GITHUB_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}`, {
      headers,
      signal: AbortSignal.timeout(3000),
      cache: "force-cache",
      next: { revalidate: 3600, tags: ["github-stars"] },
    });
    if (!res.ok) return null;
    const data: { stargazers_count?: unknown } = await res.json();
    return typeof data.stargazers_count === "number" ? data.stargazers_count : null;
  } catch {
    return null;
  }
}
