"use client";

import * as React from "react";
import { cn, fa } from "@/lib/utils";

export type RangeValue = [number, number];

export interface RangeSliderProps {
  value?: RangeValue;
  defaultValue?: RangeValue;
  onChange?: (value: RangeValue) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Formats each end label, e.g. formatToman. Defaults to Persian digits. */
  format?: (value: number) => string;
  label?: React.ReactNode;
  showValue?: boolean;
  disabled?: boolean;
  className?: string;
  /** Accessible name for the lower (کف) thumb. */
  minThumbLabel?: string;
  /** Accessible name for the upper (سقف) thumb. */
  maxThumbLabel?: string;
}

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

function snap(n: number, min: number, step: number) {
  const snapped = min + Math.round((n - min) / step) * step;
  // Guard float drift on large toman steps.
  const decimals = String(step).includes(".") ? (String(step).split(".")[1]?.length ?? 0) : 0;
  return Number(snapped.toFixed(decimals));
}

function pctOf(value: number, min: number, max: number) {
  if (max <= min) return 0;
  return ((value - min) / (max - min)) * 100;
}

type Thumb = "min" | "max";

/**
 * اسلایدر بازه. Two thumbs on one track; the active band fills from
 * inline-start (right in RTL) via logical inset, never left/right.
 */
export function RangeSlider({
  value,
  defaultValue = [0, 100],
  onChange,
  min = 0,
  max = 100,
  step = 1,
  format = (v) => fa(v),
  label,
  showValue = true,
  disabled,
  className,
  minThumbLabel = "کف",
  maxThumbLabel = "سقف",
}: RangeSliderProps) {
  const [internal, setInternal] = React.useState<RangeValue>(defaultValue);
  const controlled = value !== undefined;
  const [lo, hi] = controlled ? value : internal;
  const loRef = React.useRef(lo);
  const hiRef = React.useRef(hi);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const activeThumb = React.useRef<Thumb | null>(null);
  const [dragging, setDragging] = React.useState<Thumb | null>(null);
  const labelId = React.useId();

  React.useLayoutEffect(() => {
    loRef.current = lo;
    hiRef.current = hi;
  }, [lo, hi]);

  const loPct = pctOf(lo, min, max);
  const hiPct = pctOf(hi, min, max);

  function commit(next: RangeValue) {
    const ordered: RangeValue = next[0] <= next[1] ? next : [next[1], next[0]];
    loRef.current = ordered[0];
    hiRef.current = ordered[1];
    if (!controlled) setInternal(ordered);
    onChange?.(ordered);
  }

  function setThumb(thumb: Thumb, raw: number) {
    const curLo = loRef.current;
    const curHi = hiRef.current;
    const snapped = snap(raw, min, step);
    if (thumb === "min") {
      commit([clamp(snapped, min, curHi), curHi]);
    } else {
      commit([curLo, clamp(snapped, curLo, max)]);
    }
  }

  function clientXToValue(clientX: number) {
    const el = trackRef.current;
    if (!el) return min;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return min;
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
    // Value grows toward inline-end: left in RTL, right in LTR.
    const rtl = getComputedStyle(el).direction === "rtl";
    const t = rtl ? 1 - ratio : ratio;
    return snap(min + t * (max - min), min, step);
  }

  function nearestThumb(v: number): Thumb {
    const curLo = loRef.current;
    const curHi = hiRef.current;
    const dMin = Math.abs(v - curLo);
    const dMax = Math.abs(v - curHi);
    if (dMin !== dMax) return dMin < dMax ? "min" : "max";
    return v < (curLo + curHi) / 2 ? "min" : "max";
  }

  function onPointerDownTrack(e: React.PointerEvent<HTMLDivElement>) {
    if (disabled) return;
    e.preventDefault();
    const v = clientXToValue(e.clientX);
    const thumb = nearestThumb(v);
    activeThumb.current = thumb;
    setDragging(thumb);
    setThumb(thumb, v);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMoveTrack(e: React.PointerEvent<HTMLDivElement>) {
    if (disabled || activeThumb.current === null) return;
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    setThumb(activeThumb.current, clientXToValue(e.clientX));
  }

  function onPointerUpTrack(e: React.PointerEvent<HTMLDivElement>) {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    activeThumb.current = null;
    setDragging(null);
  }

  function handleKey(thumb: Thumb, e: React.KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;
    const el = trackRef.current;
    const rtl = el ? getComputedStyle(el).direction === "rtl" : true;
    const current = thumb === "min" ? loRef.current : hiRef.current;
    let next: number | null = null;
    const big = step * 10;

    switch (e.key) {
      case "ArrowRight":
        next = current + (rtl ? -step : step);
        break;
      case "ArrowLeft":
        next = current + (rtl ? step : -step);
        break;
      case "ArrowUp":
        next = current + step;
        break;
      case "ArrowDown":
        next = current - step;
        break;
      case "PageUp":
        next = current + big;
        break;
      case "PageDown":
        next = current - big;
        break;
      case "Home":
        next = thumb === "min" ? min : loRef.current;
        break;
      case "End":
        next = thumb === "max" ? max : hiRef.current;
        break;
      default:
        return;
    }
    e.preventDefault();
    setThumb(thumb, next);
  }

  function startThumbDrag(thumb: Thumb, e: React.PointerEvent<HTMLButtonElement>) {
    if (disabled) return;
    e.stopPropagation();
    activeThumb.current = thumb;
    setDragging(thumb);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function moveThumbDrag(thumb: Thumb, e: React.PointerEvent<HTMLButtonElement>) {
    if (activeThumb.current !== thumb) return;
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    setThumb(thumb, clientXToValue(e.clientX));
  }

  function endThumbDrag(e: React.PointerEvent<HTMLButtonElement>) {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    activeThumb.current = null;
    setDragging(null);
  }

  const thumbClass = cn(
    "absolute top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center",
    "cursor-grab touch-none outline-none active:cursor-grabbing",
    "disabled:cursor-not-allowed",
    "focus-visible:[&>span]:ring-2 focus-visible:[&>span]:ring-ring/60",
  );

  const knobClass = cn(
    "block size-4 rounded-full border-2 border-primary bg-background shadow",
    "transition-[box-shadow,transform] duration-150 motion-reduce:transition-none",
  );

  return (
    <div className={cn("space-y-2", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between gap-3 text-xs">
          {label ? (
            <span id={labelId} className="text-muted-foreground">
              {label}
            </span>
          ) : (
            <span />
          )}
          {showValue && (
            <span className="shrink-0 font-medium tabular-nums" aria-live="polite">
              {format(lo)}
              <span className="mx-1 text-muted-foreground" aria-hidden>
                تا
              </span>
              {format(hi)}
            </span>
          )}
        </div>
      )}

      <div
        ref={trackRef}
        role="group"
        aria-labelledby={label ? labelId : undefined}
        aria-label={label ? undefined : "محدوده"}
        onPointerDown={onPointerDownTrack}
        onPointerMove={onPointerMoveTrack}
        onPointerUp={onPointerUpTrack}
        onPointerCancel={onPointerUpTrack}
        className={cn(
          "relative flex h-11 w-full items-center select-none",
          disabled && "pointer-events-none opacity-50",
        )}
      >
        <div
          aria-hidden
          className="h-1.5 w-full rounded-full"
          style={{
            background: `linear-gradient(to left, var(--input) 0%, var(--input) ${loPct}%, var(--primary) ${loPct}%, var(--primary) ${hiPct}%, var(--input) ${hiPct}%, var(--input) 100%)`,
          }}
        />

        <button
          type="button"
          role="slider"
          aria-valuemin={min}
          aria-valuemax={hi}
          aria-valuenow={lo}
          aria-valuetext={format(lo)}
          aria-label={minThumbLabel}
          disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          className={cn(thumbClass, dragging === "min" && "z-30")}
          style={{ insetInlineStart: `calc(${loPct}% - 1.375rem)` }}
          onKeyDown={(e) => handleKey("min", e)}
          onPointerDown={(e) => startThumbDrag("min", e)}
          onPointerMove={(e) => moveThumbDrag("min", e)}
          onPointerUp={endThumbDrag}
          onPointerCancel={endThumbDrag}
        >
          <span className={knobClass} />
        </button>

        <button
          type="button"
          role="slider"
          aria-valuemin={lo}
          aria-valuemax={max}
          aria-valuenow={hi}
          aria-valuetext={format(hi)}
          aria-label={maxThumbLabel}
          disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          className={cn(thumbClass, "z-20", dragging === "max" && "z-30")}
          style={{ insetInlineStart: `calc(${hiPct}% - 1.375rem)` }}
          onKeyDown={(e) => handleKey("max", e)}
          onPointerDown={(e) => startThumbDrag("max", e)}
          onPointerMove={(e) => moveThumbDrag("max", e)}
          onPointerUp={endThumbDrag}
          onPointerCancel={endThumbDrag}
        >
          <span className={knobClass} />
        </button>
      </div>
    </div>
  );
}
