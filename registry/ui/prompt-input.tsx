"use client";

import * as React from "react";
import { ArrowUp, ChevronDown, Paperclip, Square } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PromptInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onStop?: () => void;
  loading?: boolean;
  placeholder?: string;
  /** Rendered in the toolbar, e.g. a model picker. */
  tools?: React.ReactNode;
  className?: string;
}

/**
 * جعبه‌ی پرامپت. Auto-growing textarea; Enter sends, Shift+Enter breaks a line.
 * The send button sits at the inline-end (left in RTL) like every Persian chat app.
 */
export function PromptInput({ value, onChange, onSubmit, onStop, loading, placeholder = "از هوش مصنوعی بپرسید…", tools, className }: PromptInputProps) {
  const [internal, setInternal] = React.useState("");
  const v = value ?? internal;
  const ref = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [v]);

  function submit() {
    if (!v.trim() || loading) return;
    onSubmit?.(v.trim());
    if (value === undefined) setInternal("");
  }

  return (
    <div className={cn("rounded-2xl border border-border bg-card p-3 transition-colors focus-within:border-foreground/30", className)}>
      <textarea
        ref={ref}
        rows={1}
        value={v}
        placeholder={placeholder}
        onChange={(e) => { if (value === undefined) setInternal(e.target.value); onChange?.(e.target.value); }}
        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); submit(); } }}
        className="block w-full resize-none bg-transparent text-sm leading-7 outline-none placeholder:text-muted-foreground/70"
      />
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button type="button" aria-label="پیوست" className="flex size-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
            <Paperclip className="size-4" />
          </button>
          {tools ?? (
            <button type="button" className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-md px-2 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              مدل پیش‌فرض
              <ChevronDown className="size-3" />
            </button>
          )}
        </div>
        {loading ? (
          <button type="button" aria-label="توقف" onClick={onStop} className="flex size-8 cursor-pointer items-center justify-center rounded-md bg-foreground text-background">
            <Square className="size-3 fill-current" />
          </button>
        ) : (
          <button type="button" aria-label="ارسال" disabled={!v.trim()} onClick={submit} className="flex size-8 cursor-pointer items-center justify-center rounded-md bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40">
            <ArrowUp className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
