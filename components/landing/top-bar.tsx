import { Suspense } from "react";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "./theme-toggle";
import { GithubButton, GithubStarsButton } from "./github-stars";
import { SiteSearch } from "./site-search";

const links = [
  { href: "/docs", label: "مستندات" },
  { href: "/components", label: "کامپوننت‌ها" },
  { href: "/blocks", label: "بلاک‌ها" },
  { href: "/animations", label: "انیمیشن‌ها" },
  { href: "/backgrounds", label: "پس‌زمینه‌ها" },
  { href: "/templates", label: "قالب‌ها" },
  { href: "/themes", label: "سیستم‌های طراحی" },
  { href: "/skills", label: "مهارت‌ها" },
];

export function TopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            aria-label="وایب‌فارسی"
            className="inline-flex h-8 cursor-pointer items-center"
          >
            <Logo />
          </Link>
          <nav
            className="hidden items-center gap-0.5 lg:flex"
            aria-label="ناوبری اصلی"
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="inline-flex h-8 cursor-pointer items-center rounded-md px-2 text-[13px] leading-none text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <SiteSearch />
          <Suspense fallback={<GithubButton />}>
            <GithubStarsButton />
          </Suspense>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
