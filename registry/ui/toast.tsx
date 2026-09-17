"use client";

import * as React from "react";
import { AlertCircle, Check, Info, X } from "lucide-react";
import { cn, fa } from "@/lib/utils";

export type Toast = {
  id: number;
  title: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "success" | "error";
  action?: { label: string; onClick: () => void };
  duration?: number;
};

type Ctx = { toast: (t: Omit<Toast, "id">) => number; dismiss: (id: number) => void; dismissAll: () => void };
const ToastCtx = React.createContext<Ctx | null>(null);

export interface ToastProviderProps {
  children: React.ReactNode;
  /** Visible at once; older ones are dropped. */
  max?: number;
  position?: "bottom-start" | "bottom-end" | "top-start" | "top-end";
}

/** Wrap your app once; then call `useToast().toast({...})` anywhere. Newest toast is nearest the edge; older ones stack behind. */
export function ToastProvider({ children, max = 3, position = "bottom-start" }: ToastProviderProps) {
  const [items, setItems] = React.useState<Toast[]>([]);
  const timers = React.useRef(new Map<number, number>());

  const dismiss = React.useCallback((id: number) => {
    setItems((l) => l.filter((t) => t.id !== id));
    window.clearTimeout(timers.current.get(id));
    timers.current.delete(id);
  }, []);
  const dismissAll = React.useCallback(() => { setItems([]); timers.current.forEach((t) => window.clearTimeout(t)); timers.current.clear(); }, []);
  const toast = React.useCallback((t: Omit<Toast, "id">) => {
    const id = Date.now() + Math.random();
    setItems((l) => [...l, { id, ...t }].slice(-max));
    timers.current.set(id, window.setTimeout(() => dismiss(id), t.duration ?? 4000));
    return id;
  }, [dismiss, max]);

  const pos = { "bottom-start": "bottom-4 start-4", "bottom-end": "bottom-4 end-4", "top-start": "top-4 start-4", "top-end": "top-4 end-4" }[position];
  const fromTop = position.startsWith("top");

  return (
    <ToastCtx.Provider value={{ toast, dismiss, dismissAll }}>
      {children}
      <div aria-live="polite" className={cn("pointer-events-none fixed z-[60] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2", pos, fromTop ? "" : "flex-col-reverse")}>
        {items.map((t) => <ToastCard key={t.id} toast={t} onClose={() => dismiss(t.id)} />)}
        {items.length > 1 && (
          <button type="button" onClick={dismissAll} className="pointer-events-auto self-end rounded-md px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground">
            بستن همه ({fa(items.length)})
          </button>
        )}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastCtx);
  if (!ctx) throw new Error("useToast باید داخل <ToastProvider> استفاده شود.");
  return ctx;
}

const icons = { default: Info, success: Check, error: AlertCircle };

/** اعلان. The card itself; rendered by the provider, exported for previews. */
export function ToastCard({ toast, onClose, className }: { toast: Omit<Toast, "id">; onClose?: () => void; className?: string }) {
  const Icon = icons[toast.variant ?? "default"];
  return (
    <div
      role="status"
      className={cn(
        "pointer-events-auto flex items-start gap-3 rounded-xl border border-border bg-popover px-3.5 py-3 text-popover-foreground shadow-[0_12px_40px_-16px_oklch(0_0_0/70%)]",
        "animate-slide-in",
        className,
      )}
    >
      <span className={cn("mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full", toast.variant === "error" ? "bg-destructive text-white" : "bg-foreground text-background")}>
        <Icon className="size-3" />
      </span>
      <div className="min-w-0 flex-1 text-sm">
        <p className="font-medium leading-5">{toast.title}</p>
        {toast.description && <p className="text-xs text-muted-foreground">{toast.description}</p>}
      </div>
      {toast.action && (
        <button type="button" onClick={() => { toast.action?.onClick(); onClose?.(); }} className="cursor-pointer rounded-md border border-border px-2 py-1 text-xs transition-colors hover:bg-accent">
          {toast.action.label}
        </button>
      )}
      {onClose && (
        <button type="button" aria-label="بستن" onClick={onClose} className="-me-1 cursor-pointer rounded p-1 text-muted-foreground hover:text-foreground">
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
