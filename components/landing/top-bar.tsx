import { Suspense } from "react";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { XIcon } from "@/components/shared/icons";
import { X_URL } from "@/lib/site";
import { ThemeToggle } from "./theme-toggle";
import { GithubButton, GithubStarsButton } from "./github-stars";
import { SiteSearch } from "./site-search";
import { LandingMobileNav } from "./mobile-nav";
import { navLinks, isGroup } from "./nav-links";
import { NavMenu } from "./nav-menu";

function XButton() {
  return (
    <a
      href={X_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-border px-2.5 text-[13px] text-muted-foreground transition-colors duration-200 hover:border-foreground/20 hover:text-foreground"
      aria-label="ایکس، Erwinamm"
      dir="ltr"
    >
      <XIcon className="size-3.5" />
      <span className="hidden text-xs sm:inline">@Erwinamm</span>
    </a>
  );
}

export function TopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-8">
          <LandingMobileNav />
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
            {navLinks.map((l) =>
              isGroup(l) ? (
                <NavMenu key={l.label} group={l} />
              ) : (
                <Link
                  key={l.href}
                  href={l.href}
                  className="inline-flex h-8 cursor-pointer items-center rounded-md px-2 text-[13px] leading-none text-muted-foreground transition-colors duration-200 hover:text-foreground"
                >
                  {l.label}
                </Link>
              ),
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <SiteSearch />
          <XButton />
          <Suspense fallback={<GithubButton />}>
            <GithubStarsButton />
          </Suspense>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
