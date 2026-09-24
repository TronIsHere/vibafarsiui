"use client";

import * as React from "react";
import type { CodeKind } from "@/lib/community/types";
import { cn } from "@/lib/utils";

export type SandboxStatus = { state: "loading" | "ok" | "error"; message?: string };

/**
 * Renders untrusted TSX in /sandbox. In production the iframe is sandboxed twice, by this
 * attribute and by the CSP `sandbox` header on the route, so the code never runs with
 * vibefarsi.ir's origin. `next dev` refuses chunk requests from an opaque origin, so dev
 * keeps same-origin (see next.config.ts).
 */
const SANDBOX = process.env.NODE_ENV === "production" ? "allow-scripts" : "allow-scripts allow-same-origin";

export function SandboxFrame({
  code,
  css,
  kind,
  theme = "graphite",
  width = "100%",
  minHeight = 320,
  maxHeight,
  lazy,
  interactive = true,
  onStatus,
  className,
  title = "پیش‌نمایش زنده",
}: {
  code: string;
  css?: string;
  kind: CodeKind;
  theme?: string;
  width?: number | "100%";
  minHeight?: number;
  maxHeight?: number;
  lazy?: boolean;
  interactive?: boolean;
  onStatus?: (s: SandboxStatus) => void;
  className?: string;
  title?: string;
}) {
  const ref = React.useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = React.useState(false);
  const [height, setHeight] = React.useState(minHeight);
  const statusRef = React.useRef(onStatus);
  React.useEffect(() => {
    statusRef.current = onStatus;
  });

  React.useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (!ref.current || e.source !== ref.current.contentWindow) return;
      const d = e.data as { source?: string; type?: string; h?: number; message?: string };
      if (d?.source !== "vf-sandbox") return;
      if (d.type === "vf:ready") setReady(true);
      else if (d.type === "vf:height" && typeof d.h === "number") setHeight(d.h);
      else if (d.type === "vf:ok") statusRef.current?.({ state: "ok" });
      else if (d.type === "vf:error") statusRef.current?.({ state: "error", message: String(d.message ?? "") });
    };
    window.addEventListener("message", onMessage);
    // The sandbox announces itself once; if that happened before this listener existed, ask again.
    ref.current?.contentWindow?.postMessage({ type: "vf:ping" }, "*");
    return () => window.removeEventListener("message", onMessage);
  }, []);

  React.useEffect(() => {
    if (!ready) return;
    statusRef.current?.({ state: "loading" });
    ref.current?.contentWindow?.postMessage({ type: "vf:render", code, css, theme, kind }, "*");
  }, [ready, code, css, theme, kind]);

  const h = Math.max(minHeight, maxHeight ? Math.min(height, maxHeight) : height);

  return (
    <iframe
      ref={ref}
      src="/sandbox"
      title={title}
      sandbox={SANDBOX}
      loading={lazy ? "lazy" : undefined}
      onLoad={() => ref.current?.contentWindow?.postMessage({ type: "vf:ping" }, "*")}
      tabIndex={interactive ? undefined : -1}
      style={{ height: h, width: width === "100%" ? "100%" : width }}
      className={cn(
        "block max-w-full shrink-0 border-0 bg-background transition-[width] duration-300",
        !interactive && "pointer-events-none",
        className,
      )}
    />
  );
}
