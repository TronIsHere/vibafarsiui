"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { cn, fa } from "@/lib/utils";

export interface RatingProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  max?: number;
  readOnly?: boolean;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/** امتیاز. Stars fill from the right (inline-start); hover previews the value. */
export function Rating({ value, defaultValue = 0, onChange, max = 5, readOnly, showValue, size = "md", className }: RatingProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const [hover, setHover] = React.useState<number | null>(null);
  const v = value ?? internal;
  const shown = hover ?? v;
  const sz = { sm: "size-4", md: "size-5", lg: "size-7" }[size];

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <div role={readOnly ? "img" : "radiogroup"} aria-label={`${fa(v)} از ${fa(max)}`} className="flex" onMouseLeave={() => setHover(null)}>
        {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            role={readOnly ? undefined : "radio"}
            aria-checked={readOnly ? undefined : n === v}
            aria-label={`${fa(n)} ستاره`}
            disabled={readOnly}
            onMouseEnter={() => !readOnly && setHover(n)}
            onClick={() => {
              if (value === undefined) setInternal(n);
              onChange?.(n);
            }}
            className={cn("p-0.5 transition-transform", !readOnly && "cursor-pointer hover:scale-110", "disabled:cursor-default")}
          >
            <Star className={cn(sz, "transition-colors", n <= shown ? "fill-foreground text-foreground" : "text-muted-foreground/40")} />
          </button>
        ))}
      </div>
      {showValue && <span className="text-xs text-muted-foreground">{fa(v)} از {fa(max)}</span>}
    </div>
  );
}
