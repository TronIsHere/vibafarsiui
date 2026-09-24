"use client";

import * as React from "react";
import { RotateCcw } from "lucide-react";
import { cn, fa } from "@/lib/utils";
import { Slider } from "./slider";

export interface PlotParam {
  key: string;
  /** Persian label, e.g. «دامنه (a)». */
  label: string;
  min: number;
  max: number;
  step?: number;
  default: number;
}

export interface FunctionPlotProps {
  /** y = fn(x, params). Return NaN to leave a gap (e.g. outside the domain). */
  fn: (x: number, p: Record<string, number>) => number;
  params?: PlotParam[];
  /** Live formula shown in an LTR box, e.g. (p) => `y = ${p.a}·sin(${p.b}x)`. */
  formula?: (p: Record<string, number>) => string;
  xDomain?: [number, number];
  yDomain?: [number, number];
  /** Keep the curve of the default params as a dashed ghost to compare against. */
  showBaseline?: boolean;
  /** Accessible description of what the figure shows. */
  label?: string;
  className?: string;
}

/** ۱٫۵ / -۲ with at most two decimals and the Persian decimal separator. */
export function faDecimal(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return "—";
  return fa(String(+n.toFixed(digits))).replace(".", "٫");
}

function niceStep(span: number, target = 8) {
  const raw = span / target;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  return ([1, 2, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? mag * 10);
}

function ticks([a, b]: [number, number]) {
  const step = niceStep(b - a);
  const out: number[] = [];
  for (let v = Math.ceil(a / step) * step; v <= b + 1e-9; v += step) out.push(+v.toFixed(10));
  return out;
}

const W = 600;
const H = 360;
const PAD = 28;

/**
 * نمودار تعاملی. Plots y = f(x) in SVG with sliders for each parameter and a
 * hover tracer. Cartesian axes keep the maths convention (x grows to the
 * right) even in RTL; only tick numbers become Persian and the controls stay RTL.
 */
export function FunctionPlot({
  fn,
  params = [],
  formula,
  xDomain = [-10, 10],
  yDomain = [-6, 6],
  showBaseline = true,
  label = "نمودار تابع",
  className,
}: FunctionPlotProps) {
  const defaults = React.useMemo(() => Object.fromEntries(params.map((p) => [p.key, p.default])), [params]);
  const [values, setValues] = React.useState<Record<string, number>>(defaults);
  const [hoverX, setHoverX] = React.useState<number | null>(null);
  const svg = React.useRef<SVGSVGElement>(null);
  const clip = React.useId().replace(/:/g, "");

  const [x0, x1] = xDomain;
  const [y0, y1] = yDomain;
  const sx = (x: number) => PAD + ((x - x0) / (x1 - x0)) * (W - 2 * PAD);
  const sy = (y: number) => H - PAD - ((y - y0) / (y1 - y0)) * (H - 2 * PAD);

  const path = (p: Record<string, number>) => {
    const n = 400;
    let d = "";
    let pen = false;
    let prev = NaN;
    for (let i = 0; i <= n; i++) {
      const x = x0 + ((x1 - x0) * i) / n;
      const y = fn(x, p);
      // Lift the pen on gaps and across vertical asymptotes (off-screen on one side, then the other).
      const jump = (prev > y1 && y < y0) || (prev < y0 && y > y1);
      const ok = Number.isFinite(y) && !jump;
      if (ok) {
        const cy = Math.max(-H, Math.min(2 * H, sy(y)));
        d += `${pen ? "L" : "M"}${sx(x).toFixed(1)} ${cy.toFixed(1)}`;
      }
      pen = ok;
      prev = y;
    }
    return d;
  };

  const changed = params.some((p) => values[p.key] !== p.default);
  const hy = hoverX == null ? NaN : fn(hoverX, values);
  const xs = ticks(xDomain);
  const ys = ticks(yDomain);
  const axisY = sy(Math.min(Math.max(0, y0), y1));
  const axisX = sx(Math.min(Math.max(0, x0), x1));

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = svg.current!.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    const x = x0 + ((px - PAD) / (W - 2 * PAD)) * (x1 - x0);
    setHoverX(x < x0 || x > x1 ? null : x);
  };

  return (
    <figure className={cn("space-y-4 rounded-surface border-line border-border bg-card p-4 [--tw-border-style:var(--line-style)]", className)}>
      {formula && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <bdi dir="ltr" className="rounded-control bg-muted px-3 py-1.5 text-sm tabular-nums" aria-live="polite">
            {formula(values)}
          </bdi>
          {params.length > 0 && (
            <button
              type="button"
              onClick={() => setValues(defaults)}
              disabled={!changed}
              className="flex h-11 cursor-pointer items-center gap-1.5 rounded-control px-3 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
            >
              <RotateCcw className="size-3.5" />
              حالت اول
            </button>
          )}
        </div>
      )}

      <div dir="ltr" className="relative">
        <svg
          ref={svg}
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={label}
          className="w-full touch-none select-none"
          onPointerMove={onMove}
          onPointerDown={onMove}
          onPointerLeave={() => setHoverX(null)}
        >
          <defs>
            <clipPath id={clip}><rect x={PAD} y={PAD} width={W - 2 * PAD} height={H - 2 * PAD} /></clipPath>
          </defs>
          {xs.map((v) => <line key={`gx${v}`} x1={sx(v)} x2={sx(v)} y1={PAD} y2={H - PAD} stroke="var(--border)" />)}
          {ys.map((v) => <line key={`gy${v}`} x1={PAD} x2={W - PAD} y1={sy(v)} y2={sy(v)} stroke="var(--border)" />)}
          <line x1={PAD} x2={W - PAD} y1={axisY} y2={axisY} stroke="var(--muted-foreground)" strokeWidth={1.25} />
          <line x1={axisX} x2={axisX} y1={PAD} y2={H - PAD} stroke="var(--muted-foreground)" strokeWidth={1.25} />
          {xs.filter((v) => v !== 0).map((v) => (
            <text key={`tx${v}`} x={sx(v)} y={Math.min(axisY + 16, H - 6)} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">{faDecimal(v)}</text>
          ))}
          {ys.filter((v) => v !== 0).map((v) => (
            <text key={`ty${v}`} x={axisX - 6} y={sy(v) + 4} textAnchor="end" fontSize={11} fill="var(--muted-foreground)">{faDecimal(v)}</text>
          ))}
          <g clipPath={`url(#${clip})`}>
            {showBaseline && changed && <path d={path(defaults)} fill="none" stroke="var(--muted-foreground)" strokeOpacity={0.6} strokeWidth={1.5} strokeDasharray="5 5" />}
            <path d={path(values)} fill="none" stroke="var(--brand)" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
            {hoverX != null && (
              <>
                <line x1={sx(hoverX)} x2={sx(hoverX)} y1={PAD} y2={H - PAD} stroke="var(--foreground)" strokeOpacity={0.25} strokeDasharray="3 3" />
                {Number.isFinite(hy) && <circle cx={sx(hoverX)} cy={sy(hy)} r={5} fill="var(--background)" stroke="var(--brand)" strokeWidth={2.5} />}
              </>
            )}
          </g>
        </svg>
        {hoverX != null && (
          <div className="pointer-events-none absolute left-2 top-2 rounded-control bg-popover px-2 py-1 text-xs tabular-nums text-popover-foreground shadow">
            x = {faDecimal(hoverX)}<span className="px-1.5 opacity-50">|</span>y = {faDecimal(hy)}
          </div>
        )}
      </div>

      {params.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {params.map((p) => (
            <Slider
              key={p.key}
              label={p.label}
              min={p.min}
              max={p.max}
              step={p.step ?? 0.1}
              value={values[p.key]}
              format={(v) => faDecimal(v)}
              onChange={(v) => setValues((s) => ({ ...s, [p.key]: v }))}
            />
          ))}
        </div>
      )}
      {showBaseline && changed && (
        <figcaption className="flex items-center gap-2 text-xs text-muted-foreground">
          <span aria-hidden className="inline-block w-5 border-t-2 border-dashed border-muted-foreground/60" />
          منحنی خط‌چین، حالت اول تابع است.
        </figcaption>
      )}
    </figure>
  );
}
