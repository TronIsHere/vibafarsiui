"use client";

import * as React from "react";
import { cn, fa } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Grow with content instead of scrolling. */
  autoResize?: boolean;
  /** Show a «۲۴ / ۱۲۰» counter (requires maxLength). */
  showCount?: boolean;
}

/** متن چندخطی با شمارنده‌ی فارسی و ارتفاع خودکار. */
export function Textarea({ className, autoResize, showCount, maxLength, onChange, value, defaultValue, ...props }: TextareaProps) {
  const ref = React.useRef<HTMLTextAreaElement>(null);
  const [len, setLen] = React.useState(String(value ?? defaultValue ?? "").length);

  const resize = React.useCallback(() => {
    const el = ref.current;
    if (!el || !autoResize) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [autoResize]);

  React.useEffect(resize, [resize, value]);

  return (
    <div className="space-y-1">
      <textarea
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        maxLength={maxLength}
        onChange={(e) => {
          setLen(e.target.value.length);
          resize();
          onChange?.(e);
        }}
        className={cn(
          "flex min-h-20 w-full rounded-lg border border-input bg-background/60 px-3 py-2 text-sm leading-7 text-foreground",
          "placeholder:text-muted-foreground/70 transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:border-transparent",
          "disabled:cursor-not-allowed disabled:opacity-50",
          autoResize ? "resize-none overflow-hidden" : "resize-y",
          className,
        )}
        {...props}
      />
      {showCount && maxLength && (
        <p className="text-end text-[11px] text-muted-foreground" aria-live="polite">
          {fa(len)} / {fa(maxLength)}
        </p>
      )}
    </div>
  );
}
