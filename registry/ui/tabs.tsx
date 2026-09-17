"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Ctx = { value: string; setValue: (v: string) => void; variant: "segmented" | "underline"; id: string };
const TabsCtx = React.createContext<Ctx | null>(null);

export interface TabsProps {
  value?: string;
  defaultValue: string;
  onValueChange?: (value: string) => void;
  variant?: "segmented" | "underline";
  className?: string;
  children: React.ReactNode;
}

/** تب‌ها. In RTL the first tab is on the right; ArrowLeft moves to the next tab. */
export function Tabs({ value, defaultValue, onValueChange, variant = "segmented", className, children }: TabsProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const id = React.useId();
  const v = value ?? internal;
  const setValue = (next: string) => { if (value === undefined) setInternal(next); onValueChange?.(next); };
  return (
    <TabsCtx.Provider value={{ value: v, setValue, variant, id }}>
      <div className={className}>{children}</div>
    </TabsCtx.Provider>
  );
}

export function TabsList({ className, children, "aria-label": label }: { className?: string; children: React.ReactNode; "aria-label"?: string }) {
  const ctx = React.useContext(TabsCtx)!;
  return (
    <div
      role="tablist"
      aria-label={label}
      onKeyDown={(e) => {
        const tabs = Array.from(e.currentTarget.querySelectorAll<HTMLElement>("[role=tab]"));
        const i = tabs.indexOf(document.activeElement as HTMLElement);
        const dir = e.key === "ArrowLeft" ? 1 : e.key === "ArrowRight" ? -1 : 0;
        if (!dir || i < 0) return;
        e.preventDefault();
        const next = tabs[(i + dir + tabs.length) % tabs.length];
        next.focus();
        next.click();
      }}
      className={cn(
        ctx.variant === "segmented" ? "inline-flex rounded-lg border border-border bg-background p-0.5" : "flex gap-1 border-b border-border",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({ value, className, children }: { value: string; className?: string; children: React.ReactNode }) {
  const ctx = React.useContext(TabsCtx)!;
  const active = ctx.value === value;
  return (
    <button
      type="button"
      role="tab"
      id={`${ctx.id}-tab-${value}`}
      aria-selected={active}
      aria-controls={`${ctx.id}-panel-${value}`}
      tabIndex={active ? 0 : -1}
      onClick={() => ctx.setValue(value)}
      className={cn(
        "cursor-pointer text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
        ctx.variant === "segmented"
          ? cn("rounded-md px-3 py-1.5", active ? "bg-secondary font-semibold text-foreground" : "text-muted-foreground hover:text-foreground")
          : cn("-mb-px border-b-2 px-3 py-2", active ? "border-foreground font-semibold text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"),
        className,
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, className, children }: { value: string; className?: string; children: React.ReactNode }) {
  const ctx = React.useContext(TabsCtx)!;
  if (ctx.value !== value) return null;
  return (
    <div role="tabpanel" id={`${ctx.id}-panel-${value}`} aria-labelledby={`${ctx.id}-tab-${value}`} className={cn("mt-3", className)}>
      {children}
    </div>
  );
}
