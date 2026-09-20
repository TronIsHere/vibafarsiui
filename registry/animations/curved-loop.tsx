"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type CurvedLoopProps = {
  text?: string;
  /** Pixels per frame at 60fps (time-scaled, so it's really `speed * 60` px/s). */
  speed?: number;
  /** Quadratic curve depth; positive dips down, negative arches up. */
  curveAmount?: number;
  direction?: "left" | "right";
  interactive?: boolean;
  /** Font size in viewBox units (the box is 1440 wide). */
  fontSize?: number;
  className?: string;
};

const VIEW_W = 1440;
// RTL isolate: keeps «·» and Latin tokens in Persian reading order even
// though the SVG itself is LTR (see below).
const RLI = "\u2067";
const PDI = "\u2069";

/**
 * متن خمیده. A single-curve SVG marquee you can drag. Loops with
 * startOffset wrapping; no uppercase so Persian joins stay intact.
 *
 * The SVG is forced to `direction: ltr`: inside an RTL document a
 * `<textPath>` would lay glyphs out *backward* from `startOffset` and drop
 * everything that falls off the path. Bidi still orders the Persian run
 * right-to-left inside the LTR paragraph, so the words read correctly.
 */
export function CurvedLoop({
  text = "وایب‌فارسی · راست‌چین · فارسی",
  speed = 1.2,
  curveAmount = 80,
  direction = "left",
  interactive = true,
  fontSize = 72,
  className,
}: CurvedLoopProps) {
  const unit = React.useMemo(() => `${text.replace(/\s+$/, "")}\u00A0`, [text]);

  const measureRef = React.useRef<SVGTextElement>(null);
  const textPathRef = React.useRef<SVGTextPathElement>(null);
  const [spacing, setSpacing] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);

  const uid = React.useId();
  const pathId = `curve-${uid.replace(/:/g, "")}`;

  // Fit the quadratic curve inside the viewBox (was spilling past y=120).
  const viewH = Math.max(fontSize * 2, Math.abs(curveAmount) * 2 + fontSize * 1.5);
  const midY = viewH / 2;
  const pathD = `M-100,${midY} Q${VIEW_W / 2},${midY + curveAmount} ${VIEW_W + 100},${midY}`;

  const dragRef = React.useRef(false);
  const lastXRef = React.useRef(0);
  const dirRef = React.useRef(direction);
  const velRef = React.useRef(0);
  const offsetRef = React.useRef(0);

  const ready = spacing > 0;
  const reps = ready ? Math.ceil((VIEW_W + 400) / spacing) + 2 : 1;
  const totalText = `${RLI}${unit.repeat(reps)}${PDI}`;

  React.useEffect(() => {
    dirRef.current = direction;
  }, [direction]);

  React.useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;

    let cancelled = false;
    const measure = () => {
      if (cancelled) return;
      const w = el.getComputedTextLength();
      if (w > 0) setSpacing((prev) => (Math.abs(prev - w) < 0.5 ? prev : w));
    };

    measure();
    // Double-rAF so layout + font metrics settle before we trust the width.
    const raf = requestAnimationFrame(() => requestAnimationFrame(measure));
    document.fonts?.ready.then(measure).catch(() => {});
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [unit, className, fontSize]);

  const setOffset = React.useCallback(
    (next: number) => {
      if (!spacing) return;
      // Keep the offset in (-spacing, 0] so the text always covers the path.
      let v = next % spacing;
      if (v > 0) v -= spacing;
      offsetRef.current = v;
      textPathRef.current?.setAttribute("startOffset", `${v}`);
    },
    [spacing],
  );

  React.useEffect(() => {
    if (!ready) return;
    setOffset(-spacing);

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || speed <= 0) return;

    let frame = 0;
    let last = performance.now();
    const step = (now: number) => {
      // `speed` is px per frame at 60fps; scale by elapsed time so 120Hz
      // screens and throttled tabs move at the same rate.
      const dt = Math.min(64, now - last) / 1000;
      last = now;
      if (!dragRef.current) {
        const delta = speed * 60 * dt;
        setOffset(offsetRef.current + (dirRef.current === "right" ? delta : -delta));
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [ready, spacing, speed, setOffset]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    dragRef.current = true;
    setDragging(true);
    lastXRef.current = e.clientX;
    velRef.current = 0;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive || !dragRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    velRef.current = dx;
    // Scale screen pixels into viewBox units so the text tracks the pointer.
    const scale = VIEW_W / (e.currentTarget.clientWidth || VIEW_W);
    setOffset(offsetRef.current + dx * scale);
  };

  const endDrag = () => {
    if (!interactive || !dragRef.current) return;
    dragRef.current = false;
    setDragging(false);
    if (Math.abs(velRef.current) > 0.5) {
      dirRef.current = velRef.current > 0 ? "right" : "left";
    }
  };

  return (
    <div
      className={cn(
        "flex w-full min-w-0 items-center justify-center overflow-hidden select-none",
        interactive && "touch-pan-y",
        interactive && (dragging ? "cursor-grabbing" : "cursor-grab"),
        className,
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <svg
        className="block h-auto w-full max-w-full font-bold text-foreground"
        viewBox={`0 0 ${VIEW_W} ${viewH}`}
        preserveAspectRatio="xMidYMid meet"
        direction="ltr"
        style={{ direction: "ltr", fontSize }}
        role="img"
        aria-label={text}
      >
        <defs>
          <path id={pathId} d={pathD} fill="none" />
        </defs>
        <text
          ref={measureRef}
          xmlSpace="preserve"
          className="pointer-events-none fill-transparent"
          aria-hidden
        >
          {RLI}
          {unit}
          {PDI}
        </text>
        <text
          className="fill-current"
          xmlSpace="preserve"
          dominantBaseline="central"
          style={{ opacity: ready ? 1 : 0 }}
          aria-hidden
        >
          <textPath ref={textPathRef} href={`#${pathId}`} startOffset="0" xmlSpace="preserve">
            {totalText}
          </textPath>
        </text>
      </svg>
    </div>
  );
}
