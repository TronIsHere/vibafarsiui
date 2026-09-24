"use client";

import * as React from "react";
import { Maximize, Minimize, Pause, Play, RotateCcw, RotateCw, Volume2, VolumeX } from "lucide-react";
import { cn, fa } from "@/lib/utils";

export interface VideoChapter {
  /** Start time in seconds. */
  start: number;
  title: string;
}

export interface VideoCaption {
  src: string;
  label: string;
  srclang: string;
  default?: boolean;
}

export interface VideoPlayerProps {
  src: string;
  poster?: string;
  /** Shown on the paused overlay and used as the accessible name. */
  title?: string;
  chapters?: VideoChapter[];
  /** WebVTT subtitle tracks (زیرنویس). */
  captions?: VideoCaption[];
  /** Render the clickable chapter list under the video. */
  showChapters?: boolean;
  /** Seconds to start from, e.g. where the student left off. */
  startAt?: number;
  rates?: number[];
  onTimeUpdate?: (seconds: number, duration: number) => void;
  onEnded?: () => void;
  className?: string;
}

/** ۶۵ → «۱:۰۵»، ۳۷۲۰ → «۱:۰۲:۰۰». */
export function formatDuration(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds || 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, "0");
  return fa(h ? `${h}:${String(m).padStart(2, "0")}:${ss}` : `${m}:${ss}`);
}

const faRate = (r: number) => `${fa(String(r)).replace(".", "٫")}×`;

/**
 * پخش‌کننده‌ی ویدئوی آموزشی. Native <video> with custom controls, chapters
 * and speed. The timeline and transport buttons stay LTR on purpose: media
 * progress follows the direction of time, not of text (Material bidi rule),
 * so only labels are Persian.
 */
export function VideoPlayer({
  src,
  poster,
  title,
  chapters = [],
  captions = [],
  showChapters = true,
  startAt = 0,
  rates = [0.75, 1, 1.25, 1.5, 2],
  onTimeUpdate,
  onEnded,
  className,
}: VideoPlayerProps) {
  const wrap = React.useRef<HTMLDivElement>(null);
  const video = React.useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = React.useState(false);
  const [started, setStarted] = React.useState(false);
  const [time, setTime] = React.useState(startAt);
  const [duration, setDuration] = React.useState(0);
  const [buffered, setBuffered] = React.useState(0);
  const [muted, setMuted] = React.useState(false);
  const [rate, setRate] = React.useState(1);
  const [rateOpen, setRateOpen] = React.useState(false);
  const [full, setFull] = React.useState(false);
  const seekId = React.useId();

  const sorted = React.useMemo(() => [...chapters].sort((a, b) => a.start - b.start), [chapters]);
  const chapterIndex = sorted.reduce((acc, c, i) => (time >= c.start ? i : acc), -1);
  const chapter = chapterIndex >= 0 ? sorted[chapterIndex] : undefined;

  // Metadata can arrive before hydration attaches React handlers, so subscribe natively
  // and catch up once if the browser already knows the duration.
  React.useEffect(() => {
    const v = video.current;
    if (!v) return;
    const onMeta = () => {
      setDuration(v.duration);
      if (startAt && v.currentTime < 0.1) v.currentTime = startAt;
    };
    v.addEventListener("loadedmetadata", onMeta);
    const raf = v.readyState >= 1 ? requestAnimationFrame(onMeta) : 0;
    return () => {
      v.removeEventListener("loadedmetadata", onMeta);
      cancelAnimationFrame(raf);
    };
  }, [src, startAt]);

  React.useEffect(() => {
    const onFs = () => setFull(document.fullscreenElement === wrap.current);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  React.useEffect(() => {
    if (!rateOpen) return;
    const close = (e: PointerEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !(e.target as Element).closest("[data-rate-menu]")) setRateOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [rateOpen]);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  };
  const seek = (t: number) => {
    const v = video.current;
    if (!v) return;
    v.currentTime = Math.min(Math.max(0, t), duration || v.duration || 0);
    setTime(v.currentTime);
  };
  const skip = (d: number) => seek((video.current?.currentTime ?? 0) + d);
  const toggleFull = () => {
    const el = wrap.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else if (el.requestFullscreen) void el.requestFullscreen();
    else (video.current as HTMLVideoElement & { webkitEnterFullscreen?: () => void })?.webkitEnterFullscreen?.();
  };
  const pickRate = (r: number) => {
    if (video.current) video.current.playbackRate = r;
    setRate(r);
    setRateOpen(false);
  };

  const onKey = (e: React.KeyboardEvent) => {
    const tag = (e.target as HTMLElement).tagName;
    // The seek range owns its arrows and buttons own Space; everything else is ours.
    if (tag === "INPUT" && e.key !== "k" && e.key !== "m" && e.key !== "f") return;
    if (tag === "BUTTON" && (e.key === " " || e.key === "Enter")) return;
    if (e.key === " " || e.key === "k") toggle();
    else if (e.key === "ArrowRight") skip(5);
    else if (e.key === "ArrowLeft") skip(-5);
    else if (e.key === "m") setMuted((m) => !m);
    else if (e.key === "f") toggleFull();
    else return;
    e.preventDefault();
  };

  const pct = duration ? (time / duration) * 100 : 0;
  const bufPct = duration ? (buffered / duration) * 100 : 0;
  const btn = "flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 [&_svg]:size-5";

  return (
    <div className={cn("space-y-3", className)}>
      <div
        ref={wrap}
        role="region"
        aria-label={title ? `ویدئو: ${title}` : "ویدئو"}
        tabIndex={-1}
        onKeyDown={onKey}
        className="group/vp @container relative aspect-video overflow-hidden rounded-surface border-line border-border bg-black text-white [--tw-border-style:var(--line-style)] data-[full=true]:rounded-none data-[full=true]:border-0"
        data-full={full}
      >
        <video
          ref={video}
          src={src}
          poster={poster}
          muted={muted}
          playsInline
          preload="metadata"
          onClick={toggle}
          onPlay={() => { setPlaying(true); setStarted(true); }}
          onPause={() => setPlaying(false)}
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            setTime(v.currentTime);
            onTimeUpdate?.(v.currentTime, v.duration);
          }}
          onProgress={(e) => {
            const b = e.currentTarget.buffered;
            if (b.length) setBuffered(b.end(b.length - 1));
          }}
          onEnded={() => { setPlaying(false); onEnded?.(); }}
          className="size-full object-contain"
        >
          {captions.map((c) => (
            <track key={c.srclang} kind="subtitles" src={c.src} srcLang={c.srclang} label={c.label} default={c.default} />
          ))}
        </video>

        {!playing && (
          <button
            type="button"
            onClick={toggle}
            aria-label="پخش"
            className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-3 bg-black/35 transition-opacity focus-visible:outline-none"
          >
            <span className="flex size-16 items-center justify-center rounded-full bg-white text-black shadow-xl transition-transform duration-200 group-hover/vp:scale-105 motion-reduce:transition-none">
              <Play className="ms-1 size-6 fill-current" />
            </span>
            {!started && title && <span className="max-w-[80%] text-center text-sm font-medium @max-sm:hidden">{title}</span>}
          </button>
        )}

        <div
          className={cn(
            "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-2 pb-1 pt-10 transition-opacity duration-200 motion-reduce:transition-none",
            playing ? "opacity-0 group-hover/vp:opacity-100 group-focus-within/vp:opacity-100" : "opacity-100",
          )}
        >
          {chapter && <p className="truncate px-2 pb-1 text-xs text-white/85">{chapter.title}</p>}
          <div dir="ltr" className="relative mx-2 flex h-4 items-center">
            <div className="pointer-events-none absolute inset-x-0 h-1 overflow-hidden rounded-full bg-white/25">
              <div className="absolute inset-y-0 left-0 bg-white/35" style={{ width: `${bufPct}%` }} />
              <div className="absolute inset-y-0 left-0 bg-brand" style={{ width: `${pct}%` }} />
            </div>
            {duration > 0 && sorted.filter((c) => c.start > 0).map((c) => (
              <span key={c.start} aria-hidden className="pointer-events-none absolute h-1 w-0.5 bg-black/70" style={{ left: `${(c.start / duration) * 100}%` }} />
            ))}
            <label htmlFor={seekId} className="sr-only">زمان پخش</label>
            <input
              id={seekId}
              type="range"
              dir="ltr"
              min={0}
              max={duration || 0}
              step={0.1}
              value={time}
              aria-valuetext={`${formatDuration(time)} از ${formatDuration(duration)}`}
              onChange={(e) => seek(Number(e.target.value))}
              className={cn(
                "relative h-4 w-full cursor-pointer appearance-none bg-transparent outline-none",
                "[&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow",
                "[&::-moz-range-thumb]:size-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white",
                "focus-visible:[&::-webkit-slider-thumb]:ring-2 focus-visible:[&::-webkit-slider-thumb]:ring-white/70",
              )}
            />
          </div>
          <div dir="ltr" className="flex items-center gap-0.5">
            <button type="button" className={btn} onClick={toggle} aria-label={playing ? "توقف" : "پخش"}>
              {playing ? <Pause className="fill-current" /> : <Play className="fill-current" />}
            </button>
            <button type="button" className={cn(btn, "@max-sm:hidden")} onClick={() => skip(-10)} aria-label="۱۰ ثانیه عقب">
              <RotateCcw />
            </button>
            <button type="button" className={cn(btn, "@max-sm:hidden")} onClick={() => skip(10)} aria-label="۱۰ ثانیه جلو">
              <RotateCw />
            </button>
            <button type="button" className={btn} onClick={() => setMuted((m) => !m)} aria-label={muted ? "صدادار" : "بی‌صدا"}>
              {muted ? <VolumeX /> : <Volume2 />}
            </button>
            <span className="px-1.5 text-xs tabular-nums text-white/85 @max-xs:hidden">
              {formatDuration(time)} / {formatDuration(duration)}
            </span>
            <span className="flex-1" />
            <div className="relative" data-rate-menu>
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={rateOpen}
                aria-label="سرعت پخش"
                onClick={() => setRateOpen((o) => !o)}
                className="h-11 min-w-11 cursor-pointer rounded-full px-2 text-xs font-medium tabular-nums text-white/90 transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                {faRate(rate)}
              </button>
              {rateOpen && (
                <div role="menu" dir="rtl" className="absolute bottom-full right-0 mb-2 min-w-28 overflow-hidden rounded-overlay bg-black/90 py-1 text-sm shadow-xl">
                  {rates.map((r) => (
                    <button
                      key={r}
                      type="button"
                      role="menuitemradio"
                      aria-checked={r === rate}
                      onClick={() => pickRate(r)}
                      className={cn("flex w-full cursor-pointer items-center justify-between gap-3 px-3 py-2 text-start hover:bg-white/10", r === rate && "text-brand")}
                    >
                      <span dir={r === 1 ? undefined : "ltr"}>{r === 1 ? "عادی" : faRate(r)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button type="button" className={btn} onClick={toggleFull} aria-label={full ? "خروج از تمام‌صفحه" : "تمام‌صفحه"}>
              {full ? <Minimize /> : <Maximize />}
            </button>
          </div>
        </div>
      </div>

      {showChapters && sorted.length > 0 && (
        <ol className="divide-y divide-border overflow-hidden rounded-surface border-line border-border bg-card [--tw-border-style:var(--line-style)]" aria-label="فصل‌های ویدئو">
          {sorted.map((c, i) => (
            <li key={c.start}>
              <button
                type="button"
                onClick={() => { seek(c.start); if (!playing) void video.current?.play(); }}
                aria-current={i === chapterIndex ? "true" : undefined}
                className={cn(
                  "flex min-h-11 w-full cursor-pointer items-center gap-3 px-4 py-2 text-start text-sm transition-colors hover:bg-accent/50",
                  i === chapterIndex && "bg-accent/40 font-medium",
                )}
              >
                <span className={cn("w-5 shrink-0 text-xs tabular-nums text-muted-foreground", i === chapterIndex && "text-brand")}>{fa(i + 1)}</span>
                <span className="min-w-0 flex-1 truncate">{c.title}</span>
                <span dir="ltr" className="shrink-0 text-xs tabular-nums text-muted-foreground">{formatDuration(c.start)}</span>
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
