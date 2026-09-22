import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpLeft } from "lucide-react";
import { AuthorCredit } from "@/components/community/author";
import { SandboxFrame } from "@/components/community/sandbox-frame";
import { Logo } from "@/components/shared/logo";
import { isAdminSession } from "@/lib/analytics/auth";
import { ADMIN_PATH } from "@/lib/analytics/config";
import { moderate } from "@/lib/community/actions";
import { listSubmissions } from "@/lib/community/store";
import { KIND_LABEL, STATUS_LABEL, hostOf, type Submission, type SubmissionStatus } from "@/lib/community/types";
import { formatJalaliNumeric } from "@/lib/jalali";
import { cn, fa } from "@/lib/utils";
import { LoginForm } from "../login-form";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "صف جامعه · وایب‌فارسی",
  robots: { index: false, follow: false },
};

const STATUSES: SubmissionStatus[] = ["pending", "approved", "rejected"];

function parseStatus(v: string | string[] | undefined): SubmissionStatus {
  const raw = Array.isArray(v) ? v[0] : v;
  return raw === "approved" || raw === "rejected" ? raw : "pending";
}

function Op({ id, op, label, tone = "default" }: { id: string; op: string; label: string; tone?: "default" | "good" | "bad" }) {
  return (
    <form action={moderate}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="op" value={op} />
      <button
        type="submit"
        className={cn(
          "inline-flex h-8 cursor-pointer items-center rounded-md border px-3 text-[13px] transition-colors",
          tone === "good" && "border-success/40 bg-success/10 text-success hover:bg-success/20",
          tone === "bad" && "border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20",
          tone === "default" && "border-border text-muted-foreground hover:text-foreground",
        )}
      >
        {label}
      </button>
    </form>
  );
}

function Entry({ item }: { item: Submission }) {
  return (
    <li className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-3">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold">{item.title}</h2>
            <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">{KIND_LABEL[item.kind]}</span>
            <span className="text-xs text-muted-foreground">{formatJalaliNumeric(new Date(item.createdAt))}</span>
          </div>
          {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
          <AuthorCredit author={item.author} className="text-xs" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {item.status !== "approved" && <Op id={item.id} op="approve" label="انتشار" tone="good" />}
          {item.status === "pending" && <Op id={item.id} op="reject" label="رد" tone="bad" />}
          {item.status === "approved" && <Op id={item.id} op="reject" label="برداشتن از سایت" tone="bad" />}
          {item.status === "rejected" && <Op id={item.id} op="pending" label="برگشت به صف" />}
          {item.status === "rejected" && <Op id={item.id} op="delete" label="حذف کامل" tone="bad" />}
          {item.status === "approved" && item.kind !== "showcase" && (
            <Link href={`/community/${item.id}`} className="inline-flex h-8 items-center gap-1 rounded-md border border-border px-3 text-[13px] text-muted-foreground hover:text-foreground">
              صفحه
              <ArrowUpLeft className="size-3" />
            </Link>
          )}
        </div>
      </div>

      {item.kind === "showcase" ? (
        <div className="grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <a href={item.url} target="_blank" rel="noopener noreferrer nofollow" className="text-sm text-brand underline-offset-4 hover:underline" dir="ltr">
            {hostOf(item.url)}
          </a>
          {item.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`/api/community/media/${item.image}`} alt="" className="aspect-[16/10] w-full rounded-lg border border-border object-cover object-top" />
          ) : (
            <p className="text-sm text-muted-foreground">بدون عکس</p>
          )}
        </div>
      ) : (
        <>
          <SandboxFrame code={item.code} css={item.css} kind={item.kind} minHeight={item.kind === "block" ? 420 : 260} maxHeight={900} lazy />
          <details className="border-t border-border">
            <summary className="cursor-pointer px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
              کد ({fa(item.code.length)} کاراکتر){item.css ? " و CSS" : ""}
            </summary>
            <pre dir="ltr" className="code-well max-h-[480px] overflow-auto p-4 text-[12px] leading-5">{item.code}</pre>
            {item.css && <pre dir="ltr" className="code-well max-h-60 overflow-auto border-t border-border p-4 text-[12px] leading-5">{item.css}</pre>}
          </details>
        </>
      )}
    </li>
  );
}

export default async function CommunityQueuePage({ searchParams }: PageProps<"/vf/community">) {
  if (!(await isAdminSession())) return <LoginForm />;
  const params = await searchParams;
  const status = parseStatus(params.s);
  const all = await listSubmissions();
  const items = all.filter((s) => s.status === status);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="text-sm text-muted-foreground">صف جامعه</span>
        </div>
        <Link href={ADMIN_PATH} className="inline-flex h-8 items-center rounded-md border border-border px-3 text-[13px] text-muted-foreground transition-colors hover:text-foreground">
          آمار سایت
        </Link>
      </header>

      <div className="mt-6 flex w-fit flex-wrap gap-1 rounded-lg border border-border p-1">
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={s === "pending" ? `${ADMIN_PATH}/community` : `${ADMIN_PATH}/community?s=${s}`}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-[13px] transition-colors",
              s === status ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {STATUS_LABEL[s]}
            <span className="text-[11px] text-muted-foreground">{fa(all.filter((x) => x.status === s).length)}</span>
          </Link>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="mt-10 text-center text-sm text-muted-foreground">چیزی اینجا نیست.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {items.map((item) => (
            <Entry key={item.id} item={item} />
          ))}
        </ul>
      )}
    </div>
  );
}
