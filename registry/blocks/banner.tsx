"use client";

import * as React from "react";
import { ArrowLeft, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BannerProps {
  message: React.ReactNode;
  action?: { label: string; href: string };
  /** Remembers the dismissal in localStorage under this key. */
  storageKey?: string;
  tone?: "brand" | "neutral";
  className?: string;
}

const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb); }; };
function readDismissed(key?: string) {
  if (!key) return false;
  try { return localStorage.getItem(key) === "1"; } catch { return false; }
}

/** نوار اعلان. A one-line announcement above the header with a link and a dismiss button. */
export function AnnouncementBanner({ message, action, storageKey, tone = "brand", className }: BannerProps) {
  const [closed, setClosed] = React.useState(false);
  // Server renders the banner; the stored dismissal is only known on the client, so read it through a store to keep hydration in sync.
  const remembered = React.useSyncExternalStore(subscribe, () => readDismissed(storageKey), () => false);
  function dismiss() {
    setClosed(true);
    if (storageKey) {
      try { localStorage.setItem(storageKey, "1"); } catch { /* private mode */ }
      listeners.forEach((cb) => cb());
    }
  }
  if (closed || remembered) return null;
  return (
    <div role="region" aria-label="اعلان" className={cn("flex items-center justify-center gap-3 px-4 py-2 text-sm", tone === "brand" ? "bg-brand text-brand-foreground" : "bg-foreground text-background", className)}>
      <p className="truncate">{message}</p>
      {action && <a href={action.href} className="inline-flex shrink-0 items-center gap-1 font-semibold underline underline-offset-4">{action.label}<ArrowLeft className="size-3.5" /></a>}
      <button type="button" onClick={dismiss} aria-label="بستن اعلان" className="ms-auto -me-1 flex size-7 shrink-0 items-center justify-center rounded-md opacity-80 transition-opacity hover:opacity-100"><X className="size-4" /></button>
    </div>
  );
}
