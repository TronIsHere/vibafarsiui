import * as React from "react";
import { cn } from "@/lib/utils";

const sizes = { xs: "size-3 border-[1.5px]", sm: "size-4 border-2", md: "size-6 border-2", lg: "size-9 border-[3px]" } as const;

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: keyof typeof sizes;
  /** Visible text next to the ring; without it the ring still announces «در حال بارگذاری». */
  label?: React.ReactNode;
}

/**
 * بارگذاری. A ring that inherits `currentColor`, so `text-muted-foreground`
 * or `text-brand` recolors it. Sits inline in buttons or centered in a card.
 */
export function Spinner({ size = "md", label, className, ...props }: SpinnerProps) {
  return (
    <div role="status" className={cn("inline-flex items-center gap-2 text-sm text-muted-foreground", className)} {...props}>
      <span
        aria-hidden
        className={cn("inline-block shrink-0 animate-spin rounded-full border-current border-e-transparent", sizes[size])}
      />
      {label ? <span>{label}</span> : <span className="sr-only">در حال بارگذاری</span>}
    </div>
  );
}

/** Covers its parent (which needs `relative`) with a dimmed layer and a centered spinner. */
export function LoadingOverlay({ loading, label, className }: { loading: boolean; label?: React.ReactNode; className?: string }) {
  if (!loading) return null;
  return (
    <div className={cn("absolute inset-0 z-10 flex items-center justify-center rounded-[inherit] bg-background/60 backdrop-blur-[1px]", className)}>
      <Spinner label={label} />
    </div>
  );
}
