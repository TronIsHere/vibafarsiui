"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { cn, fa, faPercent } from "@/lib/utils";
import { Button } from "./button";
import { Progress } from "./progress";

export interface QuizOption {
  id: string;
  label: React.ReactNode;
}

export interface QuizQuestion {
  id: string;
  prompt: React.ReactNode;
  options: QuizOption[];
  /** Correct option id, or several ids for a multiple-answer question. */
  answer: string | string[];
  /** Shown after answering: why the right option is right. */
  explanation?: React.ReactNode;
}

export interface QuizResult {
  correct: number;
  total: number;
  percent: number;
  passed: boolean;
  answers: Record<string, string[]>;
}

export interface QuizProps {
  questions: QuizQuestion[];
  title?: React.ReactNode;
  /** instant = check every question before moving on; end = exam mode, grade at the end. */
  feedback?: "instant" | "end";
  /** Percent needed to pass. */
  passPercent?: number;
  onComplete?: (result: QuizResult) => void;
  className?: string;
}

/** Persian option letters: الف، ب، ج، د … */
export const OPTION_LETTERS = ["الف", "ب", "ج", "د", "ه", "و", "ز", "ح"];

const keyOf = (a: string | string[]) => (Array.isArray(a) ? a : [a]);
const isRight = (q: QuizQuestion, picked: string[] = []) => {
  const want = keyOf(q.answer);
  return picked.length === want.length && want.every((w) => picked.includes(w));
};

/**
 * ارزیابی / آزمونک. Single and multiple-answer questions with Persian option
 * letters, instant feedback with explanations (or exam mode), a progress bar
 * and a result screen with review and retry. «بعدی» uses ArrowLeft in RTL.
 */
export function Quiz({ questions, title, feedback = "instant", passPercent = 70, onComplete, className }: QuizProps) {
  const [index, setIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, string[]>>({});
  const [checked, setChecked] = React.useState<Record<string, boolean>>({});
  const [done, setDone] = React.useState(false);
  const groupId = React.useId();

  const q = questions[index];
  const multi = Array.isArray(q?.answer) && q.answer.length > 1;
  const picked = answers[q?.id] ?? [];
  const revealed = feedback === "instant" && checked[q?.id];
  const last = index === questions.length - 1;

  const pick = (optId: string) => {
    if (revealed) return;
    setAnswers((a) => {
      const cur = a[q.id] ?? [];
      const next = multi ? (cur.includes(optId) ? cur.filter((x) => x !== optId) : [...cur, optId]) : [optId];
      return { ...a, [q.id]: next };
    });
  };

  const finish = () => {
    const correct = questions.filter((qq) => isRight(qq, answers[qq.id])).length;
    const percent = questions.length ? (correct / questions.length) * 100 : 0;
    setDone(true);
    onComplete?.({ correct, total: questions.length, percent, passed: percent >= passPercent, answers });
  };

  const restart = () => {
    setAnswers({});
    setChecked({});
    setIndex(0);
    setDone(false);
  };

  const shell = "rounded-surface border-line border-border bg-card p-5 [--tw-border-style:var(--line-style)]";

  if (done) {
    const correct = questions.filter((qq) => isRight(qq, answers[qq.id])).length;
    const percent = questions.length ? (correct / questions.length) * 100 : 0;
    const passed = percent >= passPercent;
    return (
      <section className={cn(shell, "space-y-5", className)} aria-live="polite">
        <div className="flex items-center gap-4">
          <div className="relative flex size-20 shrink-0 items-center justify-center">
            <svg viewBox="0 0 80 80" className="absolute inset-0 -rotate-90" aria-hidden>
              <circle cx="40" cy="40" r="34" fill="none" stroke="var(--border)" strokeWidth="6" />
              <circle cx="40" cy="40" r="34" fill="none" stroke={passed ? "var(--success)" : "var(--warning)"} strokeWidth="6" strokeLinecap="round" strokeDasharray={`${(percent / 100) * 213.6} 213.6`} className="transition-[stroke-dasharray] duration-700 motion-reduce:transition-none" />
            </svg>
            <span className="text-lg font-bold tabular-nums">{faPercent(percent)}</span>
          </div>
          <div>
            <p className={cn("text-lg font-bold", passed ? "text-success" : "text-warning")}>{passed ? "قبول شدید" : "نیاز به مرور دارید"}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {fa(correct)} پاسخ درست از {fa(questions.length)} سؤال · حد قبولی {faPercent(passPercent)}
            </p>
          </div>
        </div>
        <ol className="divide-y divide-border rounded-overlay border border-border">
          {questions.map((qq, i) => {
            const ok = isRight(qq, answers[qq.id]);
            const right = keyOf(qq.answer).map((id) => qq.options.findIndex((o) => o.id === id));
            return (
              <li key={qq.id} className="flex items-start gap-3 px-4 py-3 text-sm">
                {ok ? <CheckCircle2 className="mt-1 size-4 shrink-0 text-success" /> : <XCircle className="mt-1 size-4 shrink-0 text-destructive" />}
                <div className="min-w-0 flex-1 leading-7">
                  <span className="text-muted-foreground">{fa(i + 1)}. </span>
                  {qq.prompt}
                  {!ok && <p className="text-xs text-muted-foreground">پاسخ درست: {right.length > 1 ? "گزینه‌های" : "گزینه‌ی"} {right.map((r) => `«${OPTION_LETTERS[r]}»`).join(" و ")}</p>}
                </div>
              </li>
            );
          })}
        </ol>
        <Button variant="outline" onClick={restart}><RotateCcw />دوباره امتحان کنید</Button>
      </section>
    );
  }

  if (!q) return null;
  const ok = isRight(q, picked);

  return (
    <section className={cn(shell, "space-y-5", className)} aria-labelledby={`${groupId}-q`}>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{title}</span>
          <span className="tabular-nums">سؤال {fa(index + 1)} از {fa(questions.length)}</span>
        </div>
        <Progress value={index + (revealed || (feedback === "end" && picked.length > 0) ? 1 : 0)} max={questions.length} size="sm" />
      </div>

      <div>
        <p id={`${groupId}-q`} className="text-base font-semibold leading-8">{q.prompt}</p>
        {multi && <p className="mt-1 text-xs text-muted-foreground">چند گزینه درست است؛ همه را انتخاب کنید.</p>}
      </div>

      <div role={multi ? "group" : "radiogroup"} aria-labelledby={`${groupId}-q`} className="space-y-2">
        {q.options.map((o, i) => {
          const sel = picked.includes(o.id);
          const correct = keyOf(q.answer).includes(o.id);
          const state = revealed ? (correct ? "right" : sel ? "wrong" : "idle") : sel ? "selected" : "idle";
          return (
            <label
              key={o.id}
              className={cn(
                "flex min-h-12 cursor-pointer items-center gap-3 rounded-overlay border px-3 py-2.5 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
                state === "idle" && "border-border hover:border-foreground/25 hover:bg-accent/40",
                state === "selected" && "border-brand bg-brand/10",
                state === "right" && "border-success/50 bg-success/10",
                state === "wrong" && "border-destructive/50 bg-destructive/10",
                revealed && "cursor-default",
              )}
            >
              <input
                type={multi ? "checkbox" : "radio"}
                name={`${groupId}-${q.id}`}
                checked={sel}
                disabled={revealed}
                onChange={() => pick(o.id)}
                className="sr-only"
              />
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                  multi && "rounded-control",
                  state === "idle" && "border-border text-muted-foreground",
                  state === "selected" && "border-brand bg-brand text-brand-foreground",
                  state === "right" && "border-success bg-success text-background",
                  state === "wrong" && "border-destructive bg-destructive text-white",
                )}
              >
                {OPTION_LETTERS[i]}
              </span>
              <span className="flex-1 leading-7">{o.label}</span>
              {state === "right" && <CheckCircle2 className="size-4 shrink-0 text-success" aria-label="پاسخ درست" />}
              {state === "wrong" && <XCircle className="size-4 shrink-0 text-destructive" aria-label="پاسخ نادرست" />}
            </label>
          );
        })}
      </div>

      <div aria-live="polite">
        {revealed && (
          <div className={cn("rounded-overlay border-s-4 p-4 text-sm leading-7", ok ? "border-success bg-success/8" : "border-destructive bg-destructive/8")}>
            <p className={cn("font-semibold", ok ? "text-success" : "text-destructive")}>{ok ? "درست است!" : "پاسخ درست نبود."}</p>
            {q.explanation && <div className="mt-1 text-foreground/85">{q.explanation}</div>}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        {feedback === "end" ? (
          <Button variant="ghost" onClick={() => setIndex((i) => i - 1)} disabled={index === 0}><ArrowRight />قبلی</Button>
        ) : <span />}
        {feedback === "instant" && !revealed ? (
          <Button onClick={() => setChecked((c) => ({ ...c, [q.id]: true }))} disabled={!picked.length}>بررسی پاسخ</Button>
        ) : last ? (
          <Button variant="brand" onClick={finish} disabled={!picked.length}>پایان و دیدن نتیجه</Button>
        ) : (
          <Button onClick={() => setIndex((i) => i + 1)} disabled={feedback === "end" && !picked.length}>سؤال بعدی<ArrowLeft /></Button>
        )}
      </div>
    </section>
  );
}
