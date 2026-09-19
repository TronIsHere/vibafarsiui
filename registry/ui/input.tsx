import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Content rendered at the inline-start edge (e.g. a country code). */
  startAddon?: React.ReactNode;
  /** Content rendered at the inline-end edge (e.g. a unit or icon). */
  endAddon?: React.ReactNode;
  /** Optional error message; renders below and sets aria-invalid. */
  error?: string;
}

/**
 * ورودی متن. Persian text is RTL by default; pass `dir="ltr"` for phone
 * numbers, emails and codes so digits keep their natural order.
 */
export function Input({ className, type, startAddon, endAddon, error, id, dir, ...props }: InputProps) {
  const grouped = Boolean(startAddon || endAddon);
  const input = (
    <input
      id={id}
      type={type}
      dir={grouped ? undefined : dir}
      aria-invalid={error ? true : undefined}
      className={cn(
        "flex w-full min-w-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70",
        "disabled:cursor-not-allowed disabled:opacity-50",
        grouped
          ? "h-full px-0 outline-none"
          : cn(
              "h-10 rounded-lg border border-input bg-background/60 px-3 transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:border-transparent",
              "aria-invalid:border-destructive/60",
            ),
        className,
      )}
      {...props}
    />
  );

  if (!grouped) return withError(input, error);

  // The whole group takes the direction, so a `dir="ltr"` phone field puts «+98» on the left.
  return withError(
    <div
      dir={dir}
      className={cn(
        "flex h-10 w-full items-center gap-2 rounded-lg border border-input bg-background/60 px-3 text-sm transition-colors",
        "focus-within:border-transparent focus-within:ring-2 focus-within:ring-ring/60",
        error && "border-destructive/60",
      )}
    >
      {startAddon && <span className="shrink-0 text-muted-foreground">{startAddon}</span>}
      {input}
      {endAddon && <span className="shrink-0 text-muted-foreground">{endAddon}</span>}
    </div>,
    error,
  );
}

function withError(node: React.ReactNode, error?: string) {
  if (!error) return node;
  return (
    <div className="space-y-1.5">
      {node}
      <p className="text-xs text-destructive">{error}</p>
    </div>
  );
}

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("text-sm font-medium text-foreground/90", className)} {...props} />;
}

/** Stacks a Label above a control with consistent spacing. */
export function Field({
  label,
  htmlFor,
  hint,
  className,
  children,
}: {
  label: React.ReactNode;
  htmlFor?: string;
  hint?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
