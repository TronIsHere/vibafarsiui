"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

const STAGGER = 45;
const DUR = 420;

/**
 * پاک کردن با محو شدن. A search field whose × does not just empty the box:
 * each word falls down through a blur with a short glow, one after another
 * starting from the first word (the right edge), and the placeholder drops back
 * in from above. Words stay whole, so Persian letters never come apart.
 * Needs the `word-dissolve` and `placeholder-drop` keyframes.
 */
export function ClearInput({
  value,
  onChange,
  placeholder = "جستجو…",
  className,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> & {
  value: string;
  onChange: (value: string) => void;
}) {
  const [ghost, setGhost] = React.useState<{ words: string[]; id: number } | null>(null);
  const input = React.useRef<HTMLInputElement>(null);

  const clear = () => {
    if (!value) return;
    setGhost({ words: value.split(/\s+/).filter(Boolean), id: Date.now() });
    onChange("");
    input.current?.focus();
  };

  React.useEffect(() => {
    if (!ghost) return;
    const id = window.setTimeout(() => setGhost(null), DUR + ghost.words.length * STAGGER + 320);
    return () => window.clearTimeout(id);
  }, [ghost]);

  const textClass = "px-2 text-sm";
  return (
    <div className={cn("relative flex h-10 w-full max-w-sm items-center rounded-lg border border-input bg-background/60 ps-3 pe-1.5 transition-colors focus-within:border-transparent focus-within:ring-2 focus-within:ring-ring/60", className)}>
      <Search className="size-4 shrink-0 text-muted-foreground" />
      <div className="relative min-w-0 flex-1">
        <input
          ref={input}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={ghost ? "" : placeholder}
          onKeyDown={(e) => { if (e.key === "Escape") clear(); }}
          className={cn("h-9 w-full bg-transparent outline-none placeholder:text-muted-foreground/70", textClass)}
          {...props}
        />
        {ghost && (
          <>
            <div aria-hidden className={cn("pointer-events-none absolute inset-0 flex items-center gap-[0.3em] overflow-hidden whitespace-nowrap", textClass)}>
              {ghost.words.map((w, i) => (
                <span key={i} className="inline-block will-change-[transform,opacity,filter]" style={{ animation: `word-dissolve ${DUR}ms cubic-bezier(0.4,0,1,1) ${i * STAGGER}ms both` }}>{w}</span>
              ))}
            </div>
            <div
              aria-hidden
              className={cn("pointer-events-none absolute inset-0 flex items-center whitespace-nowrap text-muted-foreground/70", textClass)}
              style={{ animation: `placeholder-drop 400ms cubic-bezier(0.22,1,0.36,1) ${ghost.words.length * STAGGER + 120}ms both` }}
            >
              {placeholder}
            </div>
          </>
        )}
      </div>
      <button
        type="button"
        aria-label="پاک کردن"
        tabIndex={value ? 0 : -1}
        onMouseDown={(e) => e.preventDefault()}
        onClick={clear}
        className={cn("flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-[opacity,transform,background-color] duration-200 hover:bg-accent hover:text-foreground", value ? "scale-100 opacity-100" : "pointer-events-none scale-75 opacity-0")}
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}
