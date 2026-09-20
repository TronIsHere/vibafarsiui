"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn, fa } from "@/lib/utils";

export interface TagsInputProps {
  value?: string[];
  defaultValue?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  /** Upper limit; a «۳ / ۵» counter appears when set. */
  max?: number;
  /** Characters that commit a tag while typing. Enter always does. */
  separators?: string[];
  /** Normalize or reject a tag before it is added; return null to drop it. */
  validate?: (tag: string) => string | null;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

/**
 * برچسب‌ها. Type and press Enter (or «،») to make a chip; Backspace on an
 * empty field removes the last chip; pasted lists split into chips.
 */
export function TagsInput({
  value,
  defaultValue = [],
  onChange,
  placeholder = "برچسب را بنویسید و Enter بزنید",
  max,
  separators = ["،", ","],
  validate = (t) => t.trim() || null,
  disabled,
  className,
  ...aria
}: TagsInputProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const tags = value ?? internal;
  const [draft, setDraft] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  function commit(next: string[]) {
    if (value === undefined) setInternal(next);
    onChange?.(next);
  }

  function add(raw: string | string[]) {
    const incoming = (Array.isArray(raw) ? raw : [raw]).map(validate).filter((t): t is string => Boolean(t));
    const merged = [...tags];
    for (const t of incoming) {
      if (max !== undefined && merged.length >= max) break;
      if (!merged.includes(t)) merged.push(t);
    }
    if (merged.length !== tags.length) commit(merged);
    setDraft("");
  }

  function remove(i: number) {
    commit(tags.filter((_, j) => j !== i));
    inputRef.current?.focus();
  }

  const full = max !== undefined && tags.length >= max;
  const splitter = new RegExp(`[${separators.map((s) => s.replace(/[-.*+?^${}()|[\]\\]/g, "\\$&")).join("")}\\n]`);

  return (
    <div className={cn("space-y-1", className)}>
      <div
        role="group"
        aria-label={aria["aria-label"] ?? "برچسب‌ها"}
        onClick={() => inputRef.current?.focus()}
        className={cn(
          "flex min-h-10 w-full cursor-text flex-wrap items-center gap-1.5 rounded-lg border border-input bg-background/60 px-2 py-1.5 text-sm transition-colors",
          "focus-within:border-transparent focus-within:ring-2 focus-within:ring-ring/60",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        {tags.map((t, i) => (
          <span
            key={t}
            dir="auto"
            className="inline-flex h-6 items-center gap-1 rounded-md bg-secondary ps-2 pe-1 text-xs font-medium text-secondary-foreground"
          >
            {t}
            <button
              type="button"
              aria-label={`حذف ${t}`}
              disabled={disabled}
              onClick={(e) => { e.stopPropagation(); remove(i); }}
              className="flex size-4 cursor-pointer items-center justify-center rounded text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={draft}
          disabled={disabled || full}
          placeholder={tags.length === 0 ? placeholder : full ? "" : undefined}
          onChange={(e) => {
            const s = e.target.value;
            if (splitter.test(s)) add(s.split(splitter));
            else setDraft(s);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); if (draft) add(draft); }
            else if (e.key === "Backspace" && !draft && tags.length) { e.preventDefault(); remove(tags.length - 1); }
            else if (e.key === "Escape") setDraft("");
          }}
          onBlur={() => { if (draft) add(draft); }}
          onPaste={(e) => {
            const text = e.clipboardData.getData("text");
            if (!splitter.test(text)) return;
            e.preventDefault();
            add(text.split(splitter));
          }}
          className="h-6 min-w-24 flex-1 bg-transparent px-1 outline-none placeholder:text-muted-foreground/70 disabled:cursor-not-allowed"
        />
      </div>
      {max !== undefined && (
        <p className="text-end text-[11px] text-muted-foreground" aria-live="polite">
          {fa(tags.length)} / {fa(max)}
        </p>
      )}
    </div>
  );
}
