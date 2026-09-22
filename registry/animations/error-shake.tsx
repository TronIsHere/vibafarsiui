"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * لرزش خطا. Wrap any field. When `error` becomes a string the box shakes with a
 * decaying swing, a red ring fades in and the message appears below; after
 * `revertAfter` everything quietly returns to neutral on its own. Children are
 * never remounted, so the input keeps focus and its value. Needs the `error-shake` keyframes.
 */
export function ErrorShake({
  error,
  revertAfter = 3000,
  onRevert,
  children,
  className,
}: {
  /** Each new string replays the shake; null or "" clears the state. */
  error?: string | null;
  /** Milliseconds before the error state clears itself; 0 keeps it. */
  revertAfter?: number;
  onRevert?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const [prev, setPrev] = React.useState(error);
  const [on, setOn] = React.useState(Boolean(error));
  // The last message stays rendered while it fades out.
  const [msg, setMsg] = React.useState(error ?? "");
  if (error !== prev) {
    setPrev(error);
    setOn(Boolean(error));
    if (error) setMsg(error);
  }
  const box = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!error) return;
    const el = box.current;
    if (el) {
      // Replay from a clean baseline even if the previous shake is still running.
      el.style.animation = "none";
      void el.offsetWidth;
      el.style.animation = "error-shake 0.4s linear";
    }
    if (!revertAfter) return;
    const id = window.setTimeout(() => {
      setOn(false);
      onRevert?.();
    }, revertAfter);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, revertAfter]);

  return (
    <div className={cn("grid gap-1.5", className)}>
      <div
        ref={box}
        data-error={on || undefined}
        className="rounded-lg will-change-transform"
        style={{
          boxShadow: on ? "0 0 0 1px var(--destructive), 0 0 0 4px color-mix(in oklab, var(--destructive) 18%, transparent)" : "0 0 0 0 transparent, 0 0 0 0 transparent",
          transition: `box-shadow ${on ? 150 : 280}ms ease-out`,
        }}
      >
        {children}
      </div>
      <p
        role="alert"
        className="min-h-4 text-xs text-destructive"
        style={{ opacity: on ? 1 : 0, visibility: on ? "visible" : "hidden", transition: `opacity 280ms ease-out, visibility 0s linear ${on ? 0 : 280}ms` }}
      >
        {msg}
      </p>
    </div>
  );
}
