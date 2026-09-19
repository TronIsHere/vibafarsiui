"use client";

import * as React from "react";
import { Check, ChevronsLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const HANDLE = 56; // handle (3rem) + track padding (0.5rem), in px

/** کشیدن برای تأیید. Drag the handle from the right edge to the left to confirm; it snaps back if released early. Enter or Space confirms for keyboard users. */
export function SwipeToConfirm({ label = "برای پرداخت بکشید", doneLabel = "پرداخت انجام شد", onConfirm, className }: { label?: string; doneLabel?: string; onConfirm?: () => void; className?: string }) {
  const track = React.useRef<HTMLDivElement>(null);
  const startX = React.useRef(0);
  const pRef = React.useRef(0);
  const dragRef = React.useRef(false); // refs, not state: pointer events can arrive before a re-render
  const [p, setPState] = React.useState(0); // 0..1 along the track
  const [drag, setDragState] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const setP = (v: number) => { pRef.current = v; setPState(v); };
  const setDrag = (v: boolean) => { dragRef.current = v; setDragState(v); };

  const confirm = () => { setP(1); setDone(true); onConfirm?.(); };
  const onDown = (e: React.PointerEvent<HTMLButtonElement>) => { if (done) return; e.currentTarget.setPointerCapture(e.pointerId); startX.current = e.clientX; setDrag(true); };
  const onMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragRef.current || done || !track.current) return;
    const dir = getComputedStyle(track.current).direction === "rtl" ? -1 : 1;
    const travel = track.current.getBoundingClientRect().width - HANDLE;
    setP(Math.min(1, Math.max(0, ((e.clientX - startX.current) * dir) / travel)));
  };
  const onUp = () => { if (!dragRef.current) return; setDrag(false); if (pRef.current >= 0.9) confirm(); else setP(0); };

  return (
    <div ref={track} className={cn("relative h-14 w-full max-w-sm select-none overflow-hidden rounded-full border border-border bg-secondary p-1", className)}>
      <span aria-hidden className={cn("absolute inset-y-0 start-0 rounded-full", done ? "bg-success/25" : "bg-brand/15", !drag && "transition-[width] duration-300")} style={{ width: `calc(${p} * (100% - ${HANDLE}px) + ${HANDLE}px)` }} />
      <span aria-hidden className="absolute inset-0 flex items-center justify-center gap-1 text-sm font-medium text-muted-foreground transition-opacity duration-150" style={{ opacity: done ? 0 : Math.max(0, 1 - p * 1.6) }}>
        {label}
        <ChevronsLeft className="size-4 animate-pulse-soft" />
      </span>
      <span aria-hidden className="absolute inset-0 flex items-center justify-center gap-1.5 text-sm font-semibold text-success transition-opacity duration-300" style={{ opacity: done ? 1 : 0 }}>
        <Check className="size-4" />
        {doneLabel}
      </span>
      <button
        type="button"
        aria-label={done ? doneLabel : label}
        disabled={done}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (!done) confirm(); } }}
        className={cn(
          "absolute top-1 flex size-12 cursor-grab touch-none items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md outline-none focus-visible:ring-2 focus-visible:ring-ring",
          drag ? "cursor-grabbing" : "transition-[inset-inline-start] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          done && "bg-success cursor-default",
        )}
        style={{ insetInlineStart: `calc(0.25rem + ${p} * (100% - ${HANDLE}px))` }}
      >
        {done ? <Check className="size-5" /> : <ChevronsLeft className="size-5" />}
      </button>
    </div>
  );
}
