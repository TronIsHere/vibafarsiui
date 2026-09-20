"use client";

import * as React from "react";
import { Loader2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange" | "size" | "type"> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Called after typing pauses for `debounce` ms, on Enter, and when the field is cleared. */
  onSearch?: (value: string) => void;
  debounce?: number;
  /** Swaps the magnifier for a spinner while results load. */
  loading?: boolean;
  size?: "sm" | "md";
  /** Shortcut hint at the inline-end, e.g. "⌘K". Hidden once there is a value. */
  shortcut?: string;
}

/**
 * جست‌وجو. Magnifier at the inline-start (right in RTL), a clear button
 * at the end once there is text; Escape clears, Enter searches at once.
 */
export function SearchInput({
  value,
  defaultValue = "",
  onChange,
  onSearch,
  debounce = 300,
  loading,
  size = "md",
  shortcut,
  placeholder = "جست‌وجو…",
  className,
  disabled,
  onKeyDown,
  ...props
}: SearchInputProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const v = value ?? internal;
  const ref = React.useRef<HTMLInputElement>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const set = React.useCallback(
    (next: string, immediate = false) => {
      if (value === undefined) setInternal(next);
      onChange?.(next);
      if (!onSearch) return;
      if (timer.current) clearTimeout(timer.current);
      if (immediate || !next) onSearch(next);
      else timer.current = setTimeout(() => onSearch(next), debounce);
    },
    [value, onChange, onSearch, debounce],
  );

  React.useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const sm = size === "sm";

  return (
    <div
      className={cn(
        "flex w-full items-center gap-2 rounded-lg border border-input bg-background/60 text-sm transition-colors",
        "focus-within:border-transparent focus-within:ring-2 focus-within:ring-ring/60",
        sm ? "h-8 px-2.5" : "h-10 px-3",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      {loading ? (
        <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" aria-hidden />
      ) : (
        <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      )}
      <input
        ref={ref}
        type="search"
        inputMode="search"
        enterKeyHint="search"
        autoComplete="off"
        value={v}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => set(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") set(v, true);
          if (e.key === "Escape" && v) { e.preventDefault(); set("", true); }
          onKeyDown?.(e);
        }}
        // The native decoration is replaced by our own clear button.
        className="h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground/70 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
        {...props}
      />
      {v ? (
        <button
          type="button"
          aria-label="پاک کردن"
          tabIndex={-1}
          disabled={disabled}
          onClick={() => { set("", true); ref.current?.focus(); }}
          className="flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      ) : shortcut ? (
        <kbd dir="ltr" className="hidden shrink-0 rounded border border-border bg-muted px-1.5 font-mono text-[11px] leading-5 text-muted-foreground sm:inline-block">
          {shortcut}
        </kbd>
      ) : null}
    </div>
  );
}
