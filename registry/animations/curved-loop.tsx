"use client";

import * as React from "react";
import {
  forSvgTextPath,
  layoutGlyphsOnPath,
  measureGlyphWidths,
} from "@/lib/svg-text-path-rtl";
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
const SVG_NS = "http://www.w3.org/2000/svg";

function paintGlyphs(
  layer: SVGGElement,
  path: SVGPathElement,
  chars: string[],
  widths: number[],
  offset: number,
) {
  const glyphs = layoutGlyphsOnPath(path, chars, widths, offset, false);
  while (layer.childNodes.length > glyphs.length) {
    layer.removeChild(layer.lastChild!);
  }
  for (let i = 0; i < glyphs.length; i++) {
    let el = layer.childNodes[i] as SVGTextElement | undefined;
    if (!el) {
      el = document.createElementNS(SVG_NS, "text");
      el.setAttribute("dominant-baseline", "central");
      el.setAttribute("text-anchor", "middle");
      el.setAttribute("xml:space", "preserve");
      layer.appendChild(el);
    }
    const g = glyphs[i];
    if (el.textContent !== g.ch) el.textContent = g.ch;
    el.setAttribute("x", String(g.x));
    el.setAttribute("y", String(g.y));
    el.setAttribute("transform", `rotate(${g.rotate} ${g.x} ${g.y})`);
  }
  return glyphs.length;
}

/**
 * متن خمیده. A single-curve SVG marquee you can drag.
 *
 * Safari-safe: WebKit skips Arabic shaping/bidi on <textPath> and clamps
 * negative startOffset to 0. Pre-shape to presentation forms, emit LTR
 * visual order, and place each glyph with getPointAtLength.
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
  const unitLogical = React.useMemo(() => `${text.replace(/\s+$/, "")}\u00A0`, [text]);
  const unitVisual = React.useMemo(() => forSvgTextPath(unitLogical), [unitLogical]);
  const unitChars = React.useMemo(() => Array.from(unitVisual), [unitVisual]);

  const pathRef = React.useRef<SVGPathElement>(null);
  const measureRef = React.useRef<SVGTextElement>(null);
  const layerRef = React.useRef<SVGGElement>(null);
  const widthsRef = React.useRef<number[]>([]);
  const spacingRef = React.useRef(0);

  const [ready, setReady] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);

  const viewH = Math.max(fontSize * 2, Math.abs(curveAmount) * 2 + fontSize * 1.5);
  const midY = viewH / 2;
  const pathD = `M-100,${midY} Q${VIEW_W / 2},${midY + curveAmount} ${VIEW_W + 100},${midY}`;

  const dragRef = React.useRef(false);
  const lastXRef = React.useRef(0);
  const dirRef = React.useRef(direction);
  const velRef = React.useRef(0);
  const offsetRef = React.useRef(0);

  React.useEffect(() => {
    dirRef.current = direction;
  }, [direction]);

  const paint = React.useCallback(
    (offset: number) => {
      const pathEl = pathRef.current;
      const layer = layerRef.current;
      const spacing = spacingRef.current;
      const widths = widthsRef.current;
      if (!pathEl || !layer || !spacing || widths.length === 0) return 0;

      const pathLen = pathEl.getTotalLength();
      const tiles = Math.ceil((pathLen + spacing * 2) / spacing) + 1;
      const chars: string[] = [];
      const glyphWidths: number[] = [];
      for (let t = 0; t < tiles; t++) {
        for (let i = 0; i < unitChars.length; i++) {
          chars.push(unitChars[i]);
          glyphWidths.push(widths[i] ?? 0);
        }
      }
      return paintGlyphs(layer, pathEl, chars, glyphWidths, offset + spacing);
    },
    [unitChars],
  );

  const setOffset = React.useCallback(
    (next: number) => {
      const spacing = spacingRef.current;
      if (!spacing) return;
      let v = next % spacing;
      if (v < 0) v += spacing;
      offsetRef.current = v;
      paint(v);
    },
    [paint],
  );

  React.useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;

    let cancelled = false;
    const measure = () => {
      if (cancelled) return;
      el.setAttribute("font-size", String(fontSize));
      const nextWidths = measureGlyphWidths(el, unitVisual);
      const w = nextWidths.reduce((s, n) => s + n, 0);
      if (w <= 0) return;
      widthsRef.current = nextWidths;
      spacingRef.current = w;
      offsetRef.current = 0;
      const count = paint(0);
      setReady(count > 0);
    };

    measure();
    const raf = requestAnimationFrame(() => requestAnimationFrame(measure));
    document.fonts?.ready.then(measure).catch(() => {});
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [unitVisual, className, fontSize, paint]);

  React.useEffect(() => {
    if (!ready) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || speed <= 0) return;

    let frame = 0;
    let last = performance.now();
    const step = (now: number) => {
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
  }, [ready, speed, setOffset]);

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
        <path ref={pathRef} d={pathD} fill="none" />
        <text
          ref={measureRef}
          xmlSpace="preserve"
          className="pointer-events-none fill-transparent"
          aria-hidden
        />
        <g
          ref={layerRef}
          className="fill-current"
          style={{ opacity: ready ? 1 : 0, fontSize }}
          aria-hidden
        />
      </svg>
    </div>
  );
}
