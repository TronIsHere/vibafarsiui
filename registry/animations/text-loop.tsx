"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const VIEW_W = 1200;
// RTL isolate: keeps the separator and any Latin tokens in Persian reading
// order even though the SVG itself is LTR (see the component doc).
const RLI = "\u2067";
const PDI = "\u2069";

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
  // Round caps extend half the ribbon past the path, so pad by that much.
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

/**
 * حلقه‌ی متن. Text rides an SVG path (wave, arch, circle, …) with a
 * seamless head/tail loop. No GSAP; requestAnimationFrame + startOffset.
 *
 * Persian-safe: no uppercase, no `textLength`/`lengthAdjust` (both insert
 * gaps between joined letters). Instead the font size is nudged so a whole
 * number of repeats tiles the path exactly, which is what makes the seam
 * invisible on closed shapes. The SVG is forced to `direction: ltr` because
 * inside an RTL document a `<textPath>` lays glyphs out backward from
 * `startOffset` and drops everything that falls off the path.
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
  const headRef = React.useRef<SVGTextPathElement>(null);
  const tailRef = React.useRef<SVGTextPathElement>(null);
  const paused = React.useRef(false);

  const [metrics, setMetrics] = React.useState({ length: 0, reps: 1, scale: 1 });

  const rawId = React.useId();
  const pathId = `text-loop-${rawId.replace(/:/g, "")}`;

  const viewH = viewHeightFor(shape, ribbon ? ribbonWidth : 0);
  const d = React.useMemo(
    () => path || buildPath(shape, curviness, ribbon ? ribbonWidth : 0, viewH),
    [path, shape, curviness, ribbon, ribbonWidth, viewH],
  );

  const unit = React.useMemo(() => {
    const gap = separator ? `\u00A0${separator}\u00A0` : "\u00A0\u00A0\u00A0";
    return `${text}${gap}`;
  }, [text, separator]);

  React.useLayoutEffect(() => {
    const pathEl = pathRef.current;
    const measureEl = measureRef.current;
    if (!pathEl || !measureEl) return;

    let cancelled = false;
    const measure = () => {
      if (cancelled) return;
      let length = 0;
      let unitWidth = 0;
      try {
        length = pathEl.getTotalLength();
        unitWidth = measureEl.getComputedTextLength();
      } catch {
        return;
      }
      if (!length || !unitWidth) return;
      // Whole repeats, then scale the font so they fill the path exactly.
      const reps = Math.max(1, Math.round(length / unitWidth));
      const scale = length / (reps * unitWidth);
      setMetrics((prev) =>
        prev.length === length && prev.reps === reps && Math.abs(prev.scale - scale) < 1e-3
          ? prev
          : { length, reps, scale },
      );
    };

    measure();
    const raf = requestAnimationFrame(() => requestAnimationFrame(measure));
    document.fonts?.ready.then(measure).catch(() => {});
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [d, unit, fontSize, fontWeight]);

  React.useEffect(() => {
    const { length } = metrics;
    const head = headRef.current;
    const tail = tailRef.current;
    if (!head || !tail || !length) return;

    const apply = (offset: number) => {
      const partner = offset >= 0 ? offset - length : offset + length;
      head.setAttribute("startOffset", String(offset));
      tail.setAttribute("startOffset", String(partner));
    };

    apply(0);

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || speed <= 0) return;

    let offset = 0;
    let frame = 0;
    let last = performance.now();
    const sign = direction === "reverse" ? -1 : 1;

    const step = (now: number) => {
      const dt = Math.min(64, now - last) / 1000;
      last = now;
      if (!paused.current) {
        offset += sign * speed * dt;
        if (offset >= length) offset -= length;
        if (offset <= -length) offset += length;
        apply(offset);
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frame);
  }, [metrics, speed, direction]);

  const loopText = `${RLI}${unit.repeat(metrics.reps)}${PDI}`;
  const ready = metrics.length > 0;
  const textStyle: React.CSSProperties = {
    fontSize: fontSize * metrics.scale,
    fontWeight,
    letterSpacing: 0,
  };
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
          id={pathId}
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
        >
          {RLI}
          {unit}
          {PDI}
        </text>

        <text className={textClass} style={textStyle} dominantBaseline="central" aria-hidden>
          <textPath ref={headRef} href={`#${pathId}`} startOffset={0}>
            {loopText}
          </textPath>
        </text>

        <text className={textClass} style={textStyle} dominantBaseline="central" aria-hidden>
          <textPath ref={tailRef} href={`#${pathId}`} startOffset={0}>
            {loopText}
          </textPath>
        </text>
      </svg>
    </div>
  );
}
