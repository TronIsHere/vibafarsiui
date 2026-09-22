"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { submitCode, type SubmitState } from "@/lib/community/actions";
import { LIMITS, STARTER_CODE, type CodeKind } from "@/lib/community/types";
import { cn } from "@/lib/utils";
import { Button } from "@/registry/ui/button";
import { Field, Input } from "@/registry/ui/input";
import { SegmentedControl } from "@/registry/ui/segmented-control";
import { SandboxFrame, type SandboxStatus } from "./sandbox-frame";
import { PreviewError, ThemeSelect } from "./viewer";
import { AuthorFields, Honeypot, emptyAuthor, type AuthorDraft } from "./author-fields";
import { CodeEditor } from "./code-editor";

const DRAFT_KEY = "vf.community.draft";

type Draft = { kind: CodeKind; title: string; description: string; code: string; css: string } & AuthorDraft;

const EMPTY: Draft = { kind: "component", title: "", description: "", code: STARTER_CODE, css: "", ...emptyAuthor };

function readDraft(): Draft {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) return { ...EMPTY, ...(JSON.parse(raw) as Partial<Draft>) };
  } catch {
    /* storage blocked */
  }
  return EMPTY;
}

function useDebounced<T>(value: T, ms: number): T {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

export function SubmitCodeForm() {
  const [draft, setDraft] = React.useState<Draft>(EMPTY);
  const [loaded, setLoaded] = React.useState(false);
  const [theme, setTheme] = React.useState("graphite");
  const [status, setStatus] = React.useState<SandboxStatus>({ state: "loading" });
  const [state, formAction, pending] = React.useActionState<SubmitState, FormData>(submitCode, { ok: false });
  const previewCode = useDebounced(draft.code, 600);
  const previewCss = useDebounced(draft.css, 600);

  React.useEffect(() => {
    // Restoring a saved draft has to wait for the client; the server renders the starter.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(readDraft());
    setLoaded(true);
  }, []);

  React.useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      /* storage blocked */
    }
  }, [draft, loaded]);

  React.useEffect(() => {
    if (!state.ok) return;
    try {
      // Keep the author so the next submission is quicker.
      const { name, x, github, site } = draft;
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...EMPTY, name, x, github, site }));
    } catch {
      /* storage blocked */
    }
  }, [state.ok, draft]);

  const set = <K extends keyof Draft>(key: K) => (value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }));
  const previewBroken = status.state === "error";

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    React.startTransition(() => formAction(data));
  }

  if (state.ok) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-success/30 bg-success/5 px-6 py-14 text-center">
        <CheckCircle2 className="size-8 text-success" />
        <p className="text-lg font-semibold">رسید، ممنون!</p>
        <p className="max-w-md text-sm text-muted-foreground">
          کارتون رفت توی صف بررسی. اگه مشکلی نداشته باشه چند روز دیگه با اسم خودتون در صفحه‌ی جامعه منتشر میشه.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            یکی دیگه بفرستید
          </Button>
          <Link href="/community" className="inline-flex h-10 items-center rounded-lg px-4 text-sm text-muted-foreground transition-colors hover:text-foreground">
            برگشت به جامعه
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      <Honeypot />
      <input type="hidden" name="kind" value={draft.kind} />

      <section className="space-y-5">
        <h2 className="text-lg font-bold">چی ساختید؟</h2>
        <Field label="نوع">
          <SegmentedControl
            aria-label="نوع"
            value={draft.kind}
            onChange={(v) => set("kind")(v === "block" ? "block" : "component")}
            options={[
              { value: "component", label: "کامپوننت" },
              { value: "block", label: "بلاک (بخش کامل صفحه)" },
            ]}
            className="self-start"
          />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="عنوان" htmlFor="title">
            <Input id="title" name="title" required minLength={3} maxLength={LIMITS.title} value={draft.title} onChange={(e) => set("title")(e.target.value)} placeholder="مثلاً کارت پرداخت با شبا" />
          </Field>
          <Field label="توضیح کوتاه" htmlFor="description" hint="یکی دو جمله که بگه به چه دردی می‌خوره.">
            <Input id="description" name="description" maxLength={LIMITS.description} value={draft.description} onChange={(e) => set("description")(e.target.value)} />
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold">کد</h2>
          <p className="mt-1 text-sm leading-7 text-muted-foreground">
            یک فایل TSX با یک <code className="font-mono text-[13px]" dir="ltr">export default</code> که همون چیزی را برگردونه که باید در پیش‌نمایش دیده بشه. می‌تونید از react، آیکون‌های lucide-react، کلاس‌های Tailwind و هر کامپوننت وایب‌فارسی استفاده کنید، مثلاً{" "}
            <code className="font-mono text-[13px]" dir="ltr">@/components/ui/button</code>.
          </p>
        </div>
        <CodeEditor
          files={[
            {
              name: draft.kind === "block" ? "block.tsx" : "component.tsx",
              language: "tsx",
              value: draft.code,
              onChange: set("code"),
              maxLength: LIMITS.code,
            },
            {
              name: "globals.css",
              language: "css",
              value: draft.css,
              onChange: set("css"),
              maxLength: LIMITS.css,
              placeholder: "/* Optional: keyframes or theme variables */\n@keyframes wiggle {\n  50% { transform: rotate(3deg); }\n}",
            },
          ]}
        />
        <input type="hidden" name="code" value={draft.code} />
        <input type="hidden" name="css" value={draft.css} />

        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
            <span className="inline-flex items-center gap-2 text-sm font-medium">
              پیش‌نمایش زنده
              <StatusDot status={status} />
            </span>
            <ThemeSelect value={theme} onChange={setTheme} />
          </div>
          <div className="overflow-hidden rounded-b-xl">
            {previewBroken && <PreviewError message={status.message} />}
            <SandboxFrame
              code={previewCode}
              css={previewCss}
              kind={draft.kind}
              theme={theme}
              minHeight={draft.kind === "block" ? 420 : 300}
              maxHeight={1200}
              onStatus={setStatus}
            />
          </div>
        </div>
      </section>

      <AuthorFields value={draft} onChange={(a) => setDraft((d) => ({ ...d, ...a }))} />

      <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-6 text-muted-foreground">
          با فرستادن، اجازه میدید کدتون با اسم خودتون و مجوز MIT در وایب‌فارسی منتشر بشه. قبل از انتشار همه‌چیز دستی بررسی میشه.
        </p>
        <Button type="submit" variant="brand" disabled={pending || previewBroken} className="shrink-0">
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          فرستادن برای بررسی
        </Button>
      </div>
      {previewBroken && <p className="text-sm text-destructive">پیش‌نمایش خطا داره. اول درستش کنید و بعد بفرستید.</p>}
      {state.error && (
        <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}
    </form>
  );
}

function StatusDot({ status }: { status: SandboxStatus }) {
  const label = status.state === "ok" ? "اجرا شد" : status.state === "error" ? "خطا" : "در حال اجرا";
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-normal text-muted-foreground">
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full",
          status.state === "ok" && "bg-success",
          status.state === "error" && "bg-destructive",
          status.state === "loading" && "animate-pulse bg-muted-foreground",
        )}
      />
      {label}
    </span>
  );
}
