"use client";

import * as React from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Phase = "idle" | "loading" | "done";

/** دکمه‌ی سه‌حالته. One button for idle → loading → done; the states cross-fade in place and the width never jumps. */
export function MorphButton({ children, loadingText = "در حال انجام…", doneText = "انجام شد", onAction, resetAfter = 2200, className }: { children: React.ReactNode; loadingText?: string; doneText?: string; onAction?: () => Promise<unknown> | void; resetAfter?: number; className?: string }) {
  const [phase, setPhase] = React.useState<Phase>("idle");
  const timer = React.useRef<number | undefined>(undefined);
  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  async function run() {
    if (phase !== "idle") return;
    setPhase("loading");
    try { await (onAction?.() ?? new Promise((r) => setTimeout(r, 1200))); } finally { setPhase("done"); }
    if (resetAfter) timer.current = window.setTimeout(() => setPhase("idle"), resetAfter);
  }
  // All three states share one grid cell, so the button is as wide as the widest state from the start.
  const layer = (on: boolean) => cn("col-start-1 row-start-1 flex items-center justify-center gap-2 transition-[opacity,transform] duration-300", on ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0");
  return (
    <button
      type="button"
      onClick={run}
      aria-live="polite"
      aria-busy={phase === "loading"}
      disabled={phase !== "idle"}
      className={cn("inline-grid h-10 cursor-pointer rounded-lg px-4 text-sm font-semibold text-primary-foreground transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default", phase === "done" ? "bg-success" : "bg-primary", className)}
    >
      <span className={layer(phase === "idle")}>{children}</span>
      <span className={layer(phase === "loading")}><Loader2 className="size-4 animate-spin" />{loadingText}</span>
      <span className={layer(phase === "done")}><Check className="size-4" />{doneText}</span>
    </button>
  );
}
