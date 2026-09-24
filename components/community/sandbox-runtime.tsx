"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { createRoot, type Root } from "react-dom/client";
import type { CodeKind } from "@/lib/community/types";
import { libModules } from "@/lib/sandbox-libs";
import { registryModules } from "@/registry/sandbox-modules";

/**
 * Runs inside /sandbox, which is served with `Content-Security-Policy: sandbox allow-scripts`
 * (opaque origin: no cookies, storage or same-origin fetch). The parent page posts TSX here,
 * we compile it with sucrase and render it; Tailwind's browser build generates any classes
 * the site's own CSS doesn't already have.
 */

type Loader = () => Promise<unknown>;


const NextLink = React.forwardRef<HTMLAnchorElement, Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string | { pathname?: string } }>(
  function NextLink({ href, ...rest }, ref) {
    return <a ref={ref} href={typeof href === "string" ? href : (href.pathname ?? "#")} {...rest} />;
  },
);

function NextImage({ fill, priority, quality, placeholder, blurDataURL, loader, unoptimized, ...rest }: Record<string, unknown>) {
  void priority; void quality; void placeholder; void blurDataURL; void loader; void unoptimized;
  const style = fill ? { position: "absolute", inset: 0, width: "100%", height: "100%", ...(rest.style as object) } : rest.style;
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img {...(rest as React.ImgHTMLAttributes<HTMLImageElement>)} style={style as React.CSSProperties} />;
}

const builtins: Record<string, unknown> = {
  react: React,
  "react-dom": ReactDOM,
  "next/link": { __esModule: true, default: NextLink },
  "next/image": { __esModule: true, default: NextImage },
};

function loaderFor(spec: string): Loader | null {
  if (spec === "lucide-react") return () => import("lucide-react");
  if (spec === "react/jsx-runtime") return () => import("react/jsx-runtime");
  const reg = /^@\/(?:components|registry)\/(ui|animations|backgrounds|blocks)\/([\w-]+)$/.exec(spec);
  if (reg) return registryModules[`./${reg[1]}/${reg[2]}.tsx`] ?? null;
  const lib = /^@\/lib\/([\w-]+)$/.exec(spec);
  if (lib) return libModules[`./${lib[1]}.ts`] ?? libModules[`./${lib[1]}.tsx`] ?? null;
  return null;
}

let sucrase: typeof import("sucrase") | null = null;

async function compile(code: string): Promise<React.ComponentType> {
  sucrase ??= await import("sucrase");
  const out = sucrase.transform(code, {
    transforms: ["typescript", "jsx", "imports"],
    jsxRuntime: "classic",
    production: true,
    filePath: "demo.tsx",
  }).code;

  const specs = new Set<string>();
  for (const m of out.matchAll(/require\((['"])([^'"]+)\1\)/g)) specs.add(m[2]);

  const modules: Record<string, unknown> = {};
  await Promise.all(
    [...specs].map(async (spec) => {
      if (spec in builtins) {
        modules[spec] = builtins[spec];
        return;
      }
      const load = loaderFor(spec);
      if (!load) throw new Error(`«${spec}» در پیش‌نمایش در دسترس نیست. فقط react، lucide-react و کامپوننت‌های خود وایب‌فارسی قابل import هستن.`);
      modules[spec] = await load();
    }),
  );

  const mod = { exports: {} as Record<string, unknown> };
  const run = new Function("require", "module", "exports", "React", out);
  run((spec: string) => modules[spec], mod, mod.exports, React);

  const picked =
    mod.exports.default ??
    Object.entries(mod.exports)
      .filter(([name, v]) => typeof v === "function" && /^[A-Z]/.test(name))
      .map(([, v]) => v)
      .pop();
  if (typeof picked !== "function" && !(picked && typeof picked === "object" && "$$typeof" in picked)) {
    throw new Error("کامپوننتی برای نمایش پیدا نشد. یک export default بگذارید.");
  }
  return picked as React.ComponentType;
}

class Boundary extends React.Component<{ onError: (e: Error) => void; children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error) {
    this.props.onError(error);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

type RenderMessage = { type: "vf:render"; code: string; css?: string; theme?: string; kind?: CodeKind };

function post(msg: Record<string, unknown>) {
  window.parent.postMessage({ source: "vf-sandbox", ...msg }, "*");
}

export function SandboxRuntime({ tailwind }: { tailwind: string }) {
  const mount = React.useRef<HTMLDivElement>(null);
  const userCss = React.useRef<HTMLStyleElement>(null);
  const [kind, setKind] = React.useState<CodeKind>("component");

  React.useEffect(() => {
    if (window.parent === window) return;
    let root: Root | null = null;
    let seq = 0;

    let ready = false;
    const onMessage = async (e: MessageEvent) => {
      if (e.source !== window.parent) return;
      if ((e.data as { type?: string })?.type === "vf:ping") {
        if (ready) post({ type: "vf:ready" });
        return;
      }
      const data = e.data as RenderMessage;
      if (!data || data.type !== "vf:render" || typeof data.code !== "string") return;
      const mine = ++seq;

      const html = document.documentElement;
      if (!data.theme || data.theme === "graphite") html.removeAttribute("data-theme");
      else html.setAttribute("data-theme", data.theme);
      setKind(data.kind === "block" ? "block" : "component");
      if (userCss.current) userCss.current.textContent = data.css ?? "";

      try {
        const Comp = await compile(data.code);
        if (mine !== seq || !mount.current) return;
        root ??= createRoot(mount.current);
        root.render(
          <Boundary key={mine} onError={(err) => post({ type: "vf:error", message: err.message })}>
            <Comp />
          </Boundary>,
        );
        post({ type: "vf:ok" });
      } catch (err) {
        if (mine !== seq) return;
        root?.render(null);
        post({ type: "vf:error", message: err instanceof Error ? err.message : String(err) });
      }
    };

    window.addEventListener("message", onMessage);
    // Injected here rather than server-rendered: Chrome's preload scanner would otherwise
    // request the @import URLs inside it as real stylesheets.
    const base = document.createElement("style");
    base.type = "text/tailwindcss";
    base.textContent = tailwind;
    document.head.prepend(base);
    // The parent may attach its listener after this fires, so it also pings (answered above).
    void import("@tailwindcss/browser").then(() => {
      ready = true;
      post({ type: "vf:ready" });
    });
    return () => {
      window.removeEventListener("message", onMessage);
      base.remove();
    };
  }, [tailwind]);

  React.useEffect(() => {
    const el = mount.current;
    if (!el) return;
    const report = () => {
      const pad = kind === "block" ? 0 : 80;
      post({ type: "vf:height", h: Math.ceil(el.getBoundingClientRect().height) + pad });
    };
    const ro = new ResizeObserver(report);
    ro.observe(el);
    return () => ro.disconnect();
  }, [kind]);

  return (
    <>
      <style ref={userCss} type="text/tailwindcss" />
      <div
        className={
          kind === "block"
            ? "min-h-dvh w-full"
            : "flex min-h-dvh w-full items-center justify-center p-10"
        }
      >
        <div ref={mount} className={kind === "block" ? "w-full" : "flex w-full max-w-full items-center justify-center"} />
      </div>
    </>
  );
}
