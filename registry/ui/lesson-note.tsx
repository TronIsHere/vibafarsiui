import * as React from "react";
import { AlertTriangle, BookOpen, CheckCircle2, Clock, FlaskConical, Lightbulb, ListChecks, Quote, Target } from "lucide-react";
import { cn, fa } from "@/lib/utils";

export interface LessonNoteProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title: React.ReactNode;
  /** Small label above the title, e.g. «فصل ۲ · درس ۳». */
  eyebrow?: React.ReactNode;
  /** Reading time in minutes. */
  minutes?: number;
  /** «در این درس یاد می‌گیرید» bullets. */
  objectives?: React.ReactNode[];
}

/**
 * درس‌نامه. An article shell for written lessons: eyebrow, title, reading
 * time and learning objectives, then long-form body with a reading
 * line-height. Pair with Callout, Formula and KeyTerms inside.
 */
export function LessonNote({ title, eyebrow, minutes, objectives, className, children, ...props }: LessonNoteProps) {
  return (
    <article className={cn("space-y-5 text-foreground", className)} {...props}>
      <header className="space-y-2">
        {eyebrow && <p className="text-xs font-medium text-brand">{eyebrow}</p>}
        <h2 className="text-xl font-bold leading-tight sm:text-2xl">{title}</h2>
        {minutes != null && (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="size-3.5" />
            زمان مطالعه: {fa(minutes)} دقیقه
          </p>
        )}
      </header>
      {objectives && objectives.length > 0 && (
        <section aria-label="اهداف درس" className="rounded-surface border-line border-border bg-card p-4 [--tw-border-style:var(--line-style)]">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Target className="size-4 text-brand" />
            در این درس یاد می‌گیرید
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-7">
            {objectives.map((o, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="mt-1.5 size-4 shrink-0 text-success" />
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
      <div className="space-y-4 text-base leading-[1.9] [&_strong]:font-semibold">{children}</div>
    </article>
  );
}

type CalloutKind = "tip" | "definition" | "example" | "warning" | "summary" | "quote";

const kinds: Record<CalloutKind, { label: string; icon: React.ComponentType<{ className?: string }>; box: string; tone: string }> = {
  tip: { label: "نکته", icon: Lightbulb, box: "border-brand/30 bg-brand/8", tone: "text-brand" },
  definition: { label: "تعریف", icon: BookOpen, box: "border-border bg-card", tone: "text-foreground" },
  example: { label: "مثال", icon: FlaskConical, box: "border-success/25 bg-success/8", tone: "text-success" },
  warning: { label: "اشتباه رایج", icon: AlertTriangle, box: "border-warning/30 bg-warning/8", tone: "text-warning" },
  summary: { label: "جمع‌بندی", icon: ListChecks, box: "border-border bg-muted", tone: "text-foreground" },
  quote: { label: "نقل‌قول", icon: Quote, box: "border-border bg-transparent", tone: "text-muted-foreground" },
};

export interface CalloutProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  kind?: CalloutKind;
  /** Overrides the default label («نکته»، «تعریف»، …). */
  title?: React.ReactNode;
}

/** کادر درس‌نامه: نکته، تعریف، مثال، اشتباه رایج، جمع‌بندی. The accent bar sits on the inline-start. */
export function Callout({ kind = "tip", title, className, children, ...props }: CalloutProps) {
  const k = kinds[kind];
  const Icon = k.icon;
  return (
    <aside
      className={cn("rounded-overlay border-line border-s-4 p-4 text-sm leading-7 [--tw-border-style:var(--line-style)]", k.box, className)}
      {...props}
    >
      <p className={cn("mb-1 flex items-center gap-2 font-semibold", k.tone)}>
        <Icon className="size-4 shrink-0" />
        {title ?? k.label}
      </p>
      <div className="text-foreground/90 [&>*+*]:mt-2">{children}</div>
    </aside>
  );
}

export interface FormulaProps extends React.HTMLAttributes<HTMLElement> {
  /** Persian caption under the formula, e.g. «رابطه‌ی ۲-۱». */
  caption?: React.ReactNode;
  /** Inline inside a sentence instead of a centred block. */
  inline?: boolean;
}

/**
 * فرمول. Math reads left-to-right even in a Persian page, so the content is
 * isolated in an LTR box (bdi) and cannot scramble the surrounding sentence.
 */
export function Formula({ caption, inline, className, children, ...props }: FormulaProps) {
  if (inline) {
    return (
      <bdi dir="ltr" className={cn("whitespace-nowrap rounded-control bg-muted px-1.5 py-0.5 tabular-nums", className)} {...props}>
        {children}
      </bdi>
    );
  }
  return (
    <figure className={cn("my-2 space-y-1.5 text-center", className)} {...props}>
      <div dir="ltr" className="overflow-x-auto rounded-overlay bg-muted px-4 py-3 text-lg tabular-nums">{children}</div>
      {caption && <figcaption className="text-xs text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}

export interface KeyTermsProps {
  terms: { term: React.ReactNode; en?: string; desc: React.ReactNode }[];
  title?: React.ReactNode;
  className?: string;
}

/** واژه‌نامه‌ی درس. Persian term, optional English equivalent in LTR, then the definition. */
export function KeyTerms({ terms, title = "واژه‌های کلیدی", className }: KeyTermsProps) {
  return (
    <section className={cn("space-y-2", className)}>
      <p className="text-sm font-semibold">{title}</p>
      <dl className="divide-y divide-border rounded-surface border-line border-border bg-card [--tw-border-style:var(--line-style)]">
        {terms.map((t, i) => (
          <div key={i} className="grid gap-1 px-4 py-3 text-sm sm:grid-cols-[10rem_1fr] sm:gap-4">
            <dt className="font-medium">
              {t.term}
              {t.en && <bdi dir="ltr" className="ms-1.5 text-xs font-normal text-muted-foreground">{t.en}</bdi>}
            </dt>
            <dd className="leading-7 text-foreground/85">{t.desc}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
