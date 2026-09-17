"use client";

import * as React from "react";
import { cn, faNumber } from "@/lib/utils";
import { JALALI_WEEKDAYS_SHORT, formatJalali, jalaliWeekday } from "@/lib/jalali";

export type Point = { label: string; value: number };

/** Labels for the last `n` days as Jalali day+month («۲۰ شهریور»). */
export function jalaliDayLabels(n: number, end = new Date()): string[] {
  return Array.from({ length: n }, (_, i) => formatJalali(new Date(end.getTime() - (n - 1 - i) * 864e5), { year: false }));
}

/** Saturday-first weekday labels («ش» … «ج») for the last 7 days ending today. */
export function jalaliWeekLabels(end = new Date()): string[] {
  return Array.from({ length: 7 }, (_, i) => JALALI_WEEKDAYS_SHORT[jalaliWeekday(new Date(end.getTime() - (6 - i) * 864e5))]);
}

/** Compact Persian tick: ۱۲٫۵ م / ۸۰۰ هزار / ۹۵۰ */
export function compactFa(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1e9) return `${faNumber(+(n / 1e9).toFixed(1))} میلیارد`;
  if (abs >= 1e6) return `${faNumber(+(n / 1e6).toFixed(1))} میلیون`;
  if (abs >= 1e3) return `${faNumber(Math.round(n / 1e3))} هزار`;
  return faNumber(n);
}

function ticks(max: number, count = 4) {
  const step = Math.pow(10, Math.floor(Math.log10(max || 1)));
  const nice = [1, 2, 2.5, 5, 10].map((m) => m * step).find((s) => max / s <= count) ?? step;
  const top = Math.ceil(max / nice) * nice;
  return { top, values: Array.from({ length: Math.round(top / nice) + 1 }, (_, i) => i * nice) };
}

interface ChartProps {
  data: Point[];
  height?: number;
  format?: (n: number) => string;
  className?: string;
  /** Index to emphasise (e.g. today). */
  highlight?: number;
}

/**
 * نمودار میله‌ای. Pure SVG, RTL by construction: the first point is on the right,
 * the value axis sits on the right edge, ticks are Persian and compact.
 */
export function BarChart({ data, height = 180, format = compactFa, className, highlight }: ChartProps) {
  const [hover, setHover] = React.useState<number | null>(null);
  const W = 600, H = height, padR = 56, padL = 8, padT = 12, padB = 26;
  const { top, values } = ticks(Math.max(...data.map((d) => d.value), 1));
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const slot = plotW / data.length;
  const y = (v: number) => padT + plotH - (v / top) * plotH;
  const x = (i: number) => W - padR - (i + 1) * slot; // right-to-left
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={cn("w-full", className)} role="img" aria-label="نمودار میله‌ای">
      {values.map((v) => (
        <g key={v}>
          <line x1={padL} x2={W - padR} y1={y(v)} y2={y(v)} stroke="var(--border)" />
          <text x={W - padR + 6} y={y(v) + 3} fontSize="10" fill="var(--muted-foreground)" textAnchor="start">{format(v)}</text>
        </g>
      ))}
      {data.map((d, i) => {
        const bw = slot * 0.6, bx = x(i) + (slot - bw) / 2, by = y(d.value);
        const active = hover === i || highlight === i;
        return (
          <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            <rect x={x(i)} y={padT} width={slot} height={plotH} fill="transparent" />
            <rect x={bx} y={by} width={bw} height={padT + plotH - by} rx="4" fill={active ? "var(--primary)" : "var(--foreground)"} opacity={active ? 1 : 0.22} className="transition-opacity" />
            <text x={bx + bw / 2} y={H - 8} fontSize="11" fill="var(--muted-foreground)" textAnchor="middle">{d.label}</text>
            {hover === i && (
              <g>
                <rect x={bx + bw / 2 - 40} y={Math.max(0, by - 26)} width="80" height="20" rx="6" fill="var(--popover)" stroke="var(--border)" />
                <text x={bx + bw / 2} y={Math.max(0, by - 26) + 13} fontSize="10" fill="var(--foreground)" textAnchor="middle">{faNumber(d.value)}</text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/** نمودار خطی با ناحیه. Same RTL geometry; smooth path with a soft fill. */
export function LineChart({ data, height = 180, format = compactFa, className }: ChartProps) {
  const [hover, setHover] = React.useState<number | null>(null);
  const W = 600, H = height, padR = 56, padL = 8, padT = 12, padB = 26;
  const { top, values } = ticks(Math.max(...data.map((d) => d.value), 1));
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const slot = plotW / Math.max(1, data.length - 1);
  const y = (v: number) => padT + plotH - (v / top) * plotH;
  const x = (i: number) => W - padR - i * slot;
  const pts = data.map((d, i) => [x(i), y(d.value)] as const);
  const path = pts.map(([px, py], i) => {
    if (i === 0) return `M ${px} ${py}`;
    const [qx, qy] = pts[i - 1];
    const cx = (qx + px) / 2;
    return `C ${cx} ${qy}, ${cx} ${py}, ${px} ${py}`;
  }).join(" ");
  const area = `${path} L ${x(data.length - 1)} ${padT + plotH} L ${x(0)} ${padT + plotH} Z`;
  const gid = React.useId();
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={cn("w-full", className)} role="img" aria-label="نمودار خطی">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--brand)" stopOpacity="0.35" />
          <stop offset="1" stopColor="var(--brand)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {values.map((v) => (
        <g key={v}>
          <line x1={padL} x2={W - padR} y1={y(v)} y2={y(v)} stroke="var(--border)" />
          <text x={W - padR + 6} y={y(v) + 3} fontSize="10" fill="var(--muted-foreground)" textAnchor="start">{format(v)}</text>
        </g>
      ))}
      <path d={area} fill={`url(#${gid})`} />
      <path d={path} fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" />
      {pts.map(([px, py], i) => (
        <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
          <rect x={px - slot / 2} y={padT} width={slot} height={plotH} fill="transparent" />
          <circle cx={px} cy={py} r={hover === i ? 5 : 3} fill="var(--background)" stroke="var(--brand)" strokeWidth="2" />
          <text x={px} y={H - 8} fontSize="11" fill="var(--muted-foreground)" textAnchor="middle">{data[i].label}</text>
          {hover === i && (
            <g>
              <rect x={px - 44} y={Math.max(0, py - 30)} width="88" height="20" rx="6" fill="var(--popover)" stroke="var(--border)" />
              <text x={px} y={Math.max(0, py - 30) + 13} fontSize="10" fill="var(--foreground)" textAnchor="middle">{faNumber(data[i].value)}</text>
            </g>
          )}
        </g>
      ))}
    </svg>
  );
}

/** اسپارک‌لاین. Tiny trend line for stat cards; no axes. */
export function Sparkline({ data, className, positive }: { data: number[]; className?: string; positive?: boolean }) {
  const W = 120, H = 32, max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => `${W - (i / (data.length - 1)) * W},${H - ((v - min) / (max - min || 1)) * (H - 4) - 2}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={cn("h-8 w-28", className)} aria-hidden>
      <polyline points={pts} fill="none" stroke={positive === false ? "var(--destructive)" : "var(--success)"} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
