"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, fa } from "@/lib/utils";
import {
  animations,
  backgrounds,
  blocks,
  components,
  sections,
  templates,
  themes,
} from "@/lib/registry";

const lists = { components, blocks, animations, backgrounds, templates, themes } as const;

export function DocsSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const link = (
    href: string,
    label: React.ReactNode,
    active: boolean,
    extra?: React.ReactNode,
  ) => (
    <Link
      href={href}
      onClick={onNavigate}
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
        {link("/docs", "شروع سریع", pathname === "/docs")}
        {link("/about", "درباره", pathname === "/about")}
        {link("/docs#faq", "پرسش‌های متداول", false)}
        {link("/docs#cli", "نصب خودکار (CLI)", false)}
        {link("/docs#manual", "نصب دستی", false)}
        {link("/docs#prompts", "کار با هوش مصنوعی", false)}
        {link("/docs#mcp", "سرور MCP", false)}
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
