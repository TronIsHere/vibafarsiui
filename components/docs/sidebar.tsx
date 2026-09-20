"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn, fa } from "@/lib/utils";
import {
  animations,
  backgrounds,
  blocks,
  components,
  sections,
  skills,
  templates,
  themes,
} from "@/lib/registry";

const lists = { components, blocks, animations, backgrounds, templates, themes, skills } as const;

const DOCS_SECTION_IDS = ["cli", "manual", "prompts", "mcp", "faq"] as const;

export function DocsSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const sync = () => setHash(window.location.hash.replace(/^#/, ""));
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/docs") return;

    const elements = DOCS_SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => !!el,
    );
    if (!elements.length) return;

    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
          else visible.delete(entry.target.id);
        }
        if (visible.size === 0) {
          if (window.scrollY < 120) setHash("");
          return;
        }
        const top = [...visible.entries()].sort((a, b) => b[1] - a[1])[0];
        if (top) setHash(top[0]);
      },
      { rootMargin: "-15% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [pathname]);

  const docsSection = pathname === "/docs" ? hash : "";
  const isDocsTop = pathname === "/docs" && !DOCS_SECTION_IDS.includes(docsSection as (typeof DOCS_SECTION_IDS)[number]);

  const link = (
    href: string,
    label: React.ReactNode,
    active: boolean,
    extra?: React.ReactNode,
  ) => (
    <Link
      href={href}
      onClick={() => {
        const nextHash = href.includes("#") ? href.split("#")[1] ?? "" : "";
        if (href === "/docs" || href.startsWith("/docs#")) setHash(nextHash);
        onNavigate?.();
      }}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center justify-between rounded-md px-2.5 py-1.5 text-[13px] transition-colors",
        active
          ? "bg-accent font-medium text-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
      {extra}
    </Link>
  );

  return (
    <nav aria-label="مستندات" className="space-y-6 text-sm">
      <div className="space-y-0.5">
        {link("/docs", "شروع سریع", isDocsTop)}
        {link("/about", "درباره", pathname === "/about")}
        {link("/docs#faq", "پرسش‌های متداول", docsSection === "faq")}
        {link("/docs#cli", "نصب خودکار (CLI)", docsSection === "cli")}
        {link("/docs#manual", "نصب دستی", docsSection === "manual")}
        {link("/docs#prompts", "کار با هوش مصنوعی", docsSection === "prompts")}
        {link("/docs#mcp", "سرور MCP", docsSection === "mcp")}
      </div>
      {sections.map((s) => (
        <div key={s.key}>
          {link(
            `/${s.key}`,
            <span className="font-semibold text-foreground">{s.label}</span>,
            pathname === `/${s.key}`,
            <span className="  text-[10px] text-muted-foreground">
              {fa(s.count)}
            </span>,
          )}
          <ul className="mt-1 space-y-0.5 border-s border-border ps-2">
            {lists[s.key].map((it) => {
              const href = `/${s.key}/${it.slug}`;
              return (
                <li key={it.slug}>
                  {link(
                    href,
                    it.name,
                    pathname === href,
                    <span
                      className="  text-[10px] text-muted-foreground/70"
                      dir="ltr"
                    >
                      {it.slug}
                    </span>,
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
