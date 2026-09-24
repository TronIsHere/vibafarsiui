"use client";

import * as React from "react";
import { CheckCircle2, ChevronDown, ClipboardCheck, FileText, Lock, PenLine, PlayCircle } from "lucide-react";
import { cn, fa } from "@/lib/utils";

export type LessonKind = "video" | "reading" | "quiz" | "assignment";

export interface OutlineLesson {
  id: string;
  title: string;
  kind?: LessonKind;
  /** Length in minutes. */
  minutes?: number;
  done?: boolean;
  locked?: boolean;
  /** Free preview, open even when the course is not purchased. */
  preview?: boolean;
}

export interface OutlineSection {
  id: string;
  title: string;
  lessons: OutlineLesson[];
}

export interface CourseOutlineProps {
  sections: OutlineSection[];
  /** Id of the lesson being watched now. */
  currentId?: string;
  onSelect?: (lesson: OutlineLesson) => void;
  /** Sections open on first render. Defaults to the one containing currentId. */
  defaultOpen?: string[];
  /** Show the «۴ فصل · ۱۲ درس · ۳ ساعت» summary row. */
  showSummary?: boolean;
  className?: string;
}

const kindMeta: Record<LessonKind, { icon: React.ComponentType<{ className?: string }>; label: string }> = {
  video: { icon: PlayCircle, label: "ویدئو" },
  reading: { icon: FileText, label: "درس‌نامه" },
  quiz: { icon: ClipboardCheck, label: "آزمونک" },
  assignment: { icon: PenLine, label: "تمرین" },
};

/** ۱۹۵ → «۳ ساعت و ۱۵ دقیقه»، ۴۰ → «۴۰ دقیقه». */
export function formatMinutes(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (!h) return `${fa(m)} دقیقه`;
  return m ? `${fa(h)} ساعت و ${fa(m)} دقیقه` : `${fa(h)} ساعت`;
}

/**
 * سرفصل دوره. Collapsible sections with per-section progress, lesson type
 * icons, duration, locked and free-preview states. Height animates with
 * CSS grid rows; the chevron sits at the inline-end.
 */
export function CourseOutline({ sections, currentId, onSelect, defaultOpen, showSummary = true, className }: CourseOutlineProps) {
  const initial = defaultOpen ?? sections.filter((s) => s.lessons.some((l) => l.id === currentId)).map((s) => s.id);
  const [open, setOpen] = React.useState<string[]>(initial.length ? initial : sections.slice(0, 1).map((s) => s.id));
  const toggle = (id: string) => setOpen((o) => (o.includes(id) ? o.filter((x) => x !== id) : [...o, id]));

  const all = sections.flatMap((s) => s.lessons);
  const done = all.filter((l) => l.done).length;
  const minutes = all.reduce((sum, l) => sum + (l.minutes ?? 0), 0);

  return (
    <div className={cn("space-y-3", className)}>
      {showSummary && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span>{fa(sections.length)} فصل</span>
          <span aria-hidden>·</span>
          <span>{fa(all.length)} درس</span>
          {minutes > 0 && (<><span aria-hidden>·</span><span>{formatMinutes(minutes)}</span></>)}
          {done > 0 && <span className="ms-auto text-foreground">{fa(done)} از {fa(all.length)} درس دیده‌شده</span>}
        </div>
      )}

      <div className="divide-y divide-border overflow-hidden rounded-surface border-line border-border bg-card [--tw-border-style:var(--line-style)]">
        {sections.map((s, si) => {
          const isOpen = open.includes(s.id);
          const sDone = s.lessons.filter((l) => l.done).length;
          const sMin = s.lessons.reduce((sum, l) => sum + (l.minutes ?? 0), 0);
          const pct = s.lessons.length ? (sDone / s.lessons.length) * 100 : 0;
          return (
            <section key={s.id}>
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`outline-${s.id}`}
                  onClick={() => toggle(s.id)}
                  className="flex min-h-11 w-full cursor-pointer items-center gap-3 px-4 py-3 text-start transition-colors hover:bg-accent/40"
                >
                  <span className="relative flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums">
                    <svg viewBox="0 0 32 32" className="absolute inset-0 -rotate-90" aria-hidden>
                      <circle cx="16" cy="16" r="14" fill="none" stroke="var(--border)" strokeWidth="2.5" />
                      <circle cx="16" cy="16" r="14" fill="none" stroke={pct === 100 ? "var(--success)" : "var(--brand)"} strokeWidth="2.5" strokeLinecap="round" strokeDasharray={`${(pct / 100) * 87.96} 87.96`} />
                    </svg>
                    {fa(si + 1)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{s.title}</span>
                    <span className="block text-xs text-muted-foreground">
                      {fa(sDone)} از {fa(s.lessons.length)} درس{sMin > 0 && ` · ${formatMinutes(sMin)}`}
                    </span>
                  </span>
                  <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform duration-200 motion-reduce:transition-none", isOpen && "rotate-180")} />
                </button>
              </h3>
              <div id={`outline-${s.id}`} className={cn("grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                <ul className="overflow-hidden" inert={!isOpen}>
                  {s.lessons.map((l) => {
                    const meta = kindMeta[l.kind ?? "video"];
                    const Icon = l.done ? CheckCircle2 : l.locked ? Lock : meta.icon;
                    const current = l.id === currentId;
                    return (
                      <li key={l.id}>
                        <button
                          type="button"
                          disabled={l.locked && !l.preview}
                          aria-current={current ? "step" : undefined}
                          onClick={() => onSelect?.(l)}
                          className={cn(
                            "relative flex min-h-11 w-full cursor-pointer items-center gap-3 py-2.5 pe-4 ps-6 text-start text-sm transition-colors hover:bg-accent/50 disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:bg-transparent",
                            current && "bg-accent/60 font-semibold before:absolute before:inset-y-2 before:start-0 before:w-0.5 before:rounded-full before:bg-brand",
                          )}
                        >
                          <Icon className={cn("size-4 shrink-0", l.done ? "text-success" : current ? "text-brand" : "text-muted-foreground")} />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate">{l.title}</span>
                            <span className="sr-only">{meta.label}{l.done ? "، دیده‌شده" : l.locked ? "، قفل" : ""}</span>
                          </span>
                          {l.preview && !l.done && <span className="shrink-0 rounded-full border border-brand/30 px-2 text-xs leading-5 text-brand">رایگان</span>}
                          {l.minutes != null && <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{fa(l.minutes)} دقیقه</span>}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
