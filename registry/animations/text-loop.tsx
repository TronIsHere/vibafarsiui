"use client";

import * as React from "react";
import {
  forSvgTextPath,
  layoutGlyphsOnPath,
  measureGlyphWidths,
} from "@/lib/svg-text-path-rtl";
import { cn } from "@/lib/utils";

const VIEW_W = 1200;
const SVG_NS = "http://www.w3.org/2000/svg";

export type TextLoopShape = "wave" | "line" | "arch" | "circle" | "infinity";

export type TextLoopProps = {
  text?: string;
  shape?: TextLoopShape;
  /** Custom SVG path `d` in a 1200-wide viewBox. When set, `shape` is ignored. */
  path?: string;
  /** Pixels per second along the path. */
  speed?: number;
  direction?: "forward" | "reverse";
  separator?: string;
  curviness?: number;
  fontSize?: number;
  fontWeight?: number | string;
  ribbon?: boolean;
  ribbonWidth?: number;
  pauseOnHover?: boolean;
  className?: string;
};

function viewHeightFor(shape: TextLoopShape, ribbonWidth: number) {
  const base = shape === "circle" ? 520 : shape === "infinity" ? 380 : 280;
  return Math.max(base, ribbonWidth * 3);
}

function buildPath(shape: TextLoopShape, curviness: number, ribbonWidth: number, viewH: number) {
  const c = Math.max(0, curviness);
  const pad = Math.max(24, ribbonWidth / 2 + 8);
  const cx = VIEW_W / 2;
  const cy = viewH / 2;
  const room = Math.max(20, cy - pad);
  const x0 = pad;
  const x1 = VIEW_W - pad;

  switch (shape) {
    case "circle": {
      const r = Math.min(90 + c * 0.95, room);
      return `M ${cx - r} ${cy} A ${r} ${r} 0 1 1 ${cx + r} ${cy} A ${r} ${r} 0 1 1 ${cx - r} ${cy} Z`;
    }
    case "infinity": {
      const r = Math.min(150 + c * 1.4, (x1 - x0) / 2 - 20);
      const h = Math.min(60 + c * 0.95, room);
      return [
        `M ${cx} ${cy}`,
        `C ${cx + r * 0.55} ${cy - h} ${cx + r} ${cy - h} ${cx + r} ${cy}`,
        `C ${cx + r} ${cy + h} ${cx + r * 0.55} ${cy + h} ${cx} ${cy}`,
        `C ${cx - r * 0.55} ${cy - h} ${cx - r} ${cy - h} ${cx - r} ${cy}`,
        `C ${cx - r} ${cy + h} ${cx - r * 0.55} ${cy + h} ${cx} ${cy}`,
        "Z",
      ].join(" ");
    }
    case "arch": {
      const rise = Math.min(100 + c * 0.9, room * 1.6);
      return `M ${x0} ${cy + rise / 2} Q ${cx} ${cy - rise} ${x1} ${cy + rise / 2}`;
    }
    case "line":
      return `M ${x0} ${cy} L ${x1} ${cy}`;
    case "wave":
    default: {
      const a = Math.min(c * 1.4, room);
      const span = x1 - x0;
      const at = (t: number) => x0 + span * t;
      return [
        `M ${at(0)} ${cy}`,
        `Q ${at(0.125)} ${cy - a} ${at(0.25)} ${cy}`,
        `T ${at(0.5)} ${cy}`,
        `T ${at(0.75)} ${cy}`,
        `T ${at(1)} ${cy}`,
      ].join(" ");
    }
  }
}

function isClosedPath(d: string) {
  return /\bz\s*$/i.test(d.trim());
}

function paintGlyphs(
  layer: SVGGElement,
  path: SVGPathElement,
  chars: string[],
  widths: number[],
  offset: number,
  closed: boolean,
) {
  const glyphs = layoutGlyphsOnPath(path, chars, widths, offset, closed);
  while (layer.childNodes.length > glyphs.length) {
    layer.removeChild(layer.lastChild!);
  }
  for (let i = 0; i < glyphs.length; i++) {
    let el = layer.childNodes[i] as SVGTextElement | undefined;
    if (!el) {
      el = document.createElementNS(SVG_NS, "text");
      el.setAttribute("dominant-baseline", "central");
      el.setAttribute("text-anchor", "middle");
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
 * حلقه‌ی متن. Text rides an SVG path (wave, arch, circle, …) with a
 * seamless loop. No GSAP; requestAnimationFrame shifts glyph distance.
 *
 * Safari-safe Persian: WebKit does not shape/bidi Arabic on <textPath> and
 * clamps negative startOffset to 0. We pre-shape to presentation forms,
 * emit LTR visual order, and place each glyph with getPointAtLength.
 */
export function TextLoop({
  text = "وایب‌فارسی",
  shape = "wave",
  path,
  speed = 90,
  direction = "forward",
  separator = "·",
  curviness = 70,
  fontSize = 36,
  fontWeight = 700,
  ribbon = true,
  ribbonWidth = 64,
  pauseOnHover = true,
  className,
}: TextLoopProps) {
  const pathRef = React.useRef<SVGPathElement>(null);
  const measureRef = React.useRef<SVGTextElement>(null);
  const layerRef = React.useRef<SVGGElement>(null);
  const paused = React.useRef(false);
  const offsetRef = React.useRef(0);
  const metricsRef = React.useRef({
    length: 0,
    reps: 1,
    scale: 1,
    unitWidth: 0,
    widths: [] as number[],
  });

  const [ready, setReady] = React.useState(false);
  const [scale, setScale] = React.useState(1);

  const viewH = viewHeightFor(shape, ribbon ? ribbonWidth : 0);
  const d = React.useMemo(
    () => path || buildPath(shape, curviness, ribbon ? ribbonWidth : 0, viewH),
    [path, shape, curviness, ribbon, ribbonWidth, viewH],
  );
  const closed = isClosedPath(d);

  const unitLogical = React.useMemo(() => {
    const gap = separator ? `\u00A0${separator}\u00A0` : "\u00A0\u00A0\u00A0";
    return `${text}${gap}`;
  }, [text, separator]);
  const unitVisual = React.useMemo(() => forSvgTextPath(unitLogical), [unitLogical]);
  const unitChars = React.useMemo(() => Array.from(unitVisual), [unitVisual]);

  const paint = React.useCallback(
    (offset: number) => {
      const pathEl = pathRef.current;
      const layer = layerRef.current;
      const { reps, widths, unitWidth, length } = metricsRef.current;
      if (!pathEl || !layer || !unitWidth || !length || widths.length === 0) return 0;

      const tiles = closed ? reps : reps + 2;
      const chars: string[] = [];
      const glyphWidths: number[] = [];
      for (let t = 0; t < tiles; t++) {
        for (let i = 0; i < unitChars.length; i++) {
          chars.push(unitChars[i]);
          glyphWidths.push(widths[i] ?? 0);
        }
      }
      const lead = closed ? 0 : unitWidth;
      return paintGlyphs(layer, pathEl, chars, glyphWidths, offset + lead, closed);
    },
    [unitChars, closed],
  );

  React.useLayoutEffect(() => {
    const pathEl = pathRef.current;
    const measureEl = measureRef.current;
    if (!pathEl || !measureEl) return;

    let cancelled = false;
    const measure = () => {
      if (cancelled) return;
      let length = 0;
      try {
        length = pathEl.getTotalLength();
      } catch {
        return;
      }
      if (!length) return;

      measureEl.setAttribute("font-size", String(fontSize));
      measureEl.setAttribute("font-weight", String(fontWeight));
      const baseWidths = measureGlyphWidths(measureEl, unitVisual);
      const unitWidth = baseWidths.reduce((s, w) => s + w, 0);
      if (!unitWidth) return;

      const reps = Math.max(1, Math.round(length / unitWidth));
      const nextScale = length / (reps * unitWidth);
      const widths = baseWidths.map((w) => w * nextScale);
      metricsRef.current = {
        length,
        reps,
        scale: nextScale,
        unitWidth: unitWidth * nextScale,
        widths,
      };
      setScale(nextScale);
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
  }, [d, unitVisual, fontSize, fontWeight, paint]);

  React.useEffect(() => {
    if (!ready) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || speed <= 0) return;

    let frame = 0;
    let last = performance.now();
    const sign = direction === "reverse" ? -1 : 1;

    const step = (now: number) => {
      const dt = Math.min(64, now - last) / 1000;
      last = now;
      if (!paused.current) {
        const wrap = metricsRef.current.unitWidth || 1;
        let next = offsetRef.current + sign * speed * dt;
        next %= wrap;
        if (next < 0) next += wrap;
        offsetRef.current = next;
        paint(next);
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [ready, speed, direction, paint]);

  const textClass = cn(
    ribbon ? "fill-brand-foreground" : "fill-foreground",
    "transition-opacity duration-300",
    ready ? "opacity-100" : "opacity-0",
  );

  return (
    <div
      className={cn("w-full min-w-0 select-none", className)}
      onPointerEnter={() => {
        if (pauseOnHover) paused.current = true;
      }}
      onPointerLeave={() => {
        paused.current = false;
      }}
    >
      <svg
        className="block h-auto w-full max-w-full overflow-visible"
        viewBox={`0 0 ${VIEW_W} ${viewH}`}
        preserveAspectRatio="xMidYMid meet"
        direction="ltr"
        style={{ direction: "ltr" }}
        role="img"
        aria-label={text}
      >
        <path
          ref={pathRef}
          d={d}
          fill="none"
          className={ribbon ? "stroke-brand" : undefined}
          stroke={ribbon ? undefined : "none"}
          strokeWidth={ribbon ? ribbonWidth : 0}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <text
          ref={measureRef}
          aria-hidden
          className="pointer-events-none fill-transparent"
          style={{ fontSize, fontWeight, letterSpacing: 0 }}
        />

        <g
          ref={layerRef}
          className={textClass}
          style={{ fontSize: fontSize * scale, fontWeight, letterSpacing: 0 }}
          aria-hidden
        />
      </svg>
    </div>
  );
}
