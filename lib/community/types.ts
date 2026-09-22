/** Community submissions: shared by the server store, the forms and the admin queue. No server imports here. */

export type SubmissionStatus = "pending" | "approved" | "rejected";
export type CodeKind = "component" | "block";

export type Author = {
  name: string;
  /** X handle without @. */
  x?: string;
  /** GitHub username. */
  github?: string;
  /** http(s) URL. */
  url?: string;
};

type Base = {
  id: string;
  status: SubmissionStatus;
  title: string;
  description: string;
  author: Author;
  createdAt: number;
  reviewedAt?: number;
};

export type CodeSubmission = Base & {
  kind: CodeKind;
  code: string;
  /** Optional CSS (keyframes, @theme additions), fed to the sandbox's Tailwind compiler. */
  css?: string;
};

export type ShowcaseSubmission = Base & {
  kind: "showcase";
  url: string;
  /** File name inside the media dir, served at /api/community/media/<image>. */
  image?: string;
};

export type Submission = CodeSubmission | ShowcaseSubmission;

export const LIMITS = {
  title: 80,
  description: 400,
  name: 60,
  code: 60_000,
  css: 20_000,
  url: 300,
  imageBytes: 1_500_000,
  pendingQueue: 300,
} as const;

export const KIND_LABEL: Record<Submission["kind"], string> = {
  component: "کامپوننت",
  block: "بلاک",
  showcase: "سایت",
};

export const STATUS_LABEL: Record<SubmissionStatus, string> = {
  pending: "در انتظار بررسی",
  approved: "منتشرشده",
  rejected: "ردشده",
};

/** Starting code for the submit form. It doubles as the format documentation. */
export const STARTER_CODE = `import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

// خروجی default همون چیزیه که در پیش‌نمایش نشون داده میشه.
export default function Demo() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6">
      <Sparkles className="size-6 text-brand" />
      <p className="text-sm text-muted-foreground">سلام از جامعه‌ی وایب‌فارسی</p>
      <Button>شروع کنید</Button>
    </div>
  )
}
`;

export function xUrl(handle: string): string {
  return `https://x.com/${handle}`;
}

export function githubUrl(handle: string): string {
  return `https://github.com/${handle}`;
}

export function hostOf(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

const SECTION_OF: Record<string, string> = {
  ui: "components",
  animations: "animations",
  backgrounds: "backgrounds",
  blocks: "blocks",
};

/** VibeFarsi items a submission imports, so its page can link them and print the install command. */
export function registryDeps(code: string): { slug: string; href: string }[] {
  const seen = new Map<string, string>();
  for (const m of code.matchAll(/from\s+["']@\/(?:components|registry)\/(ui|animations|backgrounds|blocks)\/([\w-]+)["']/g)) {
    seen.set(m[2], `/${SECTION_OF[m[1]]}/${m[2]}`);
  }
  return [...seen].map(([slug, href]) => ({ slug, href }));
}
