"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type TerminalLine = { type: "cmd" | "out" | "ok" | "err"; text: string };

/** ترمینال. Types each command letter by letter, then prints its output; commands are LTR mono, Persian output stays RTL. Starts when scrolled into view. */
export function Terminal({ lines, speed = 45, title = "ترمینال", className }: { lines: TerminalLine[]; speed?: number; title?: string; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [go, setGo] = React.useState(false);
  const [n, setN] = React.useState(0); // lines fully shown
  const [typed, setTyped] = React.useState(0); // characters of the current command

  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { setGo(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setGo(true); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  React.useEffect(() => {
    if (!go || n >= lines.length) return;
    const line = lines[n];
    const typing = line.type === "cmd" && typed < line.text.length;
    const id = window.setTimeout(() => {
      if (typing) setTyped((t) => t + 1);
      else { setN((x) => x + 1); setTyped(0); }
    }, typing ? speed : line.type === "cmd" ? 400 : 180);
    return () => window.clearTimeout(id);
  }, [go, n, typed, lines, speed]);

  const shown = lines.slice(0, n);
  const current = n < lines.length && lines[n].type === "cmd" ? { ...lines[n], text: lines[n].text.slice(0, typed) } : null;
  const row = (l: TerminalLine, i: number, cursor = false) =>
    l.type === "cmd" ? (
      <div key={i} className="flex gap-2 text-foreground" dir="ltr">
        <span className="select-none text-muted-foreground">$</span>
        <span>{l.text}{cursor && <span aria-hidden className="ms-0.5 inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-foreground animate-pulse-soft" />}</span>
      </div>
    ) : (
      <div key={i} className={cn("flex gap-2 ps-4", l.type === "ok" && "text-success", l.type === "err" && "text-destructive", l.type === "out" && "text-muted-foreground")}>
        {l.type === "ok" && <span aria-hidden>✓</span>}
        {l.type === "err" && <span aria-hidden>✗</span>}
        <span>{l.text}</span>
      </div>
    );

  return (
    <div ref={ref} role="log" aria-live="polite" className={cn("w-full max-w-md overflow-hidden rounded-xl border border-border bg-card text-[13px] leading-6", className)}>
      <div className="flex items-center gap-1.5 border-b border-border px-3 py-2">
        {["bg-destructive", "bg-warning", "bg-success"].map((c) => <span key={c} aria-hidden className={cn("size-2.5 rounded-full opacity-70", c)} />)}
        <span className="ms-2 text-xs text-muted-foreground">{title}</span>
      </div>
      <div className="min-h-32 space-y-0.5 p-3">
        {shown.map((l, i) => row(l, i))}
        {current && row(current, n, true)}
        {!current && n >= lines.length && <div className="flex gap-2 text-foreground" dir="ltr"><span className="text-muted-foreground">$</span><span aria-hidden className="inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-foreground animate-pulse-soft" /></div>}
      </div>
    </div>
  );
}
